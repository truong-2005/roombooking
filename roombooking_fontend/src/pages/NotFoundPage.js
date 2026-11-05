import React from 'react';
import { Link } from 'react-router-dom';
export default function NotFoundPage() {
  return <main className="not-found"><span className="eyebrow">404</span><h1>Không tìm thấy trang</h1><p>Đường dẫn này không tồn tại hoặc đã được thay đổi.</p><Link className="button button-primary" to="/">Về trang chủ</Link></main>;
}
