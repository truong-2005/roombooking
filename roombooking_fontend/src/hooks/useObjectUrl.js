import React from 'react';

export default function useObjectUrl(file) {
  const [url, setUrl] = React.useState('');

  React.useEffect(() => {
    if (!file || typeof URL.createObjectURL !== 'function') {
      setUrl('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => {
      if (typeof URL.revokeObjectURL === 'function') URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return url;
}
