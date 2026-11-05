import React from 'react';
import { useLocation } from 'react-router-dom';
import * as authApi from '../api/authApi';
import { clearSession, getPortalForPath, getRefreshToken, readSession, writeSession } from '../utils/tokenUtils';

const AuthContext = React.createContext(null);

function isAdminUser(user) {
  return Array.isArray(user?.roles) && user.roles.includes('ROLE_ADMIN');
}

function belongsToPortal(user, portal) {
  const roles = Array.isArray(user?.roles) ? user.roles : [];
  return portal === 'admin' ? roles.includes('ROLE_ADMIN') : roles.includes('ROLE_USER') && !roles.includes('ROLE_ADMIN');
}

export function AuthProvider({ children }) {
  const location = useLocation();
  const portal = getPortalForPath(location.pathname);
  const [authState, setAuthState] = React.useState({ portal: null, user: null, loading: true, authError: null });

  React.useEffect(() => {
    let active = true;
    const onExpired = (event) => {
      if (event.detail?.portal !== portal) return;
      if (active) setAuthState({ portal, user: null, loading: false, authError: null });
    };
    window.addEventListener('roombooking:session-expired', onExpired);
    async function restore() {
      if (!readSession(portal)?.accessToken) {
        if (active) setAuthState({ portal, user: null, loading: false, authError: null });
        return;
      }
      try {
        const response = await authApi.getMe();
        if (!belongsToPortal(response.data, portal)) {
          clearSession(portal);
          if (active) setAuthState({ portal, user: null, loading: false, authError: null });
          return;
        }
        if (active) setAuthState({ portal, user: response.data, loading: false, authError: null });
      } catch (_) {
        clearSession(portal);
        if (active) setAuthState({ portal, user: null, loading: false, authError: null });
      }
    }
    restore();
    return () => { active = false; window.removeEventListener('roombooking:session-expired', onExpired); };
  }, [portal]);

  const acceptTokenResponse = React.useCallback(async (response, targetPortal) => {
    writeSession(response.data, targetPortal);
    setAuthState({ portal: targetPortal, user: null, loading: true, authError: null });
    try {
      const current = await authApi.getMe();
      if (!belongsToPortal(current.data, targetPortal)) {
        const refreshToken = getRefreshToken(targetPortal);
        if (refreshToken) {
          try { await authApi.logout(refreshToken, targetPortal === 'admin'); } catch (_) { /* The local session is cleared below. */ }
        }
        throw new Error(targetPortal === 'admin'
          ? 'Tài khoản này không có quyền quản trị.'
          : 'Tài khoản quản trị chỉ được đăng nhập ở cổng Admin.');
      }
      setAuthState({ portal: targetPortal, user: current.data, loading: false, authError: null });
      return current.data;
    } catch (error) {
      clearSession(targetPortal);
      setAuthState({ portal: targetPortal, user: null, loading: false, authError: error });
      throw error;
    }
  }, []);

  const signIn = React.useCallback(async (payload, admin = false) => {
    const targetPortal = admin ? 'admin' : 'client';
    if (targetPortal !== portal) throw new Error('Vui lòng đăng nhập tại đúng cổng tài khoản.');
    setAuthState({ portal, user: null, loading: true, authError: null });
    try {
      const response = await authApi.login(payload, admin);
      return await acceptTokenResponse(response, targetPortal);
    } catch (error) {
      setAuthState({ portal, user: null, loading: false, authError: error });
      throw error;
    }
  }, [acceptTokenResponse, portal]);

  const signUp = React.useCallback(async (payload, admin = false) => {
    const targetPortal = admin ? 'admin' : 'client';
    if (targetPortal !== portal) throw new Error('Vui lòng đăng ký tại đúng cổng tài khoản.');
    setAuthState({ portal, user: null, loading: true, authError: null });
    try {
      const response = await authApi.register(payload, admin);
      return await acceptTokenResponse(response, targetPortal);
    } catch (error) {
      setAuthState({ portal, user: null, loading: false, authError: error });
      throw error;
    }
  }, [acceptTokenResponse, portal]);

  const signOut = React.useCallback(async (allDevices = false) => {
    const refreshToken = getRefreshToken(portal);
    try {
      if (allDevices) await authApi.logoutAll();
      else if (refreshToken) await authApi.logout(refreshToken, portal === 'admin');
    } finally {
      clearSession(portal);
      setAuthState({ portal, user: null, loading: false, authError: null });
    }
  }, [portal]);

  const refreshUser = React.useCallback(async () => {
    const response = await authApi.getMe();
    if (!belongsToPortal(response.data, portal)) {
      clearSession(portal);
      setAuthState({ portal, user: null, loading: false, authError: null });
      throw new Error('Phiên đăng nhập không thuộc cổng hiện tại.');
    }
    setAuthState({ portal, user: response.data, loading: false, authError: null });
    return response.data;
  }, [portal]);

  const setAuthError = React.useCallback((authError) => {
    setAuthState((current) => ({
      portal,
      user: current.portal === portal ? current.user : null,
      loading: current.portal === portal ? current.loading : false,
      authError,
    }));
  }, [portal]);

  const currentState = authState.portal === portal ? authState : null;
  const user = currentState?.user || null;
  const loading = !currentState || currentState.loading;
  const authError = currentState?.authError || null;
  const value = React.useMemo(() => ({
    user, loading, authError, portal, isAdmin: isAdminUser(user), signIn, signUp, signOut, refreshUser, setAuthError,
  }), [user, loading, authError, portal, signIn, signUp, signOut, refreshUser, setAuthError]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
