import React from 'react';
import { displayValue, titleCase } from '../../utils/formatUtils';
import StatCard from './StatCard';
export default function BookingStatistics({ data }) {
  if (data && !Array.isArray(data) && typeof data === 'object' && 'total' in data) {
    const totals = ['total', 'pending', 'approved', 'rejected', 'cancelled'].filter((key) => key in data);
    const months = Object.entries(data.byMonth || {}).map(([month, count]) => ({ month, count }));
    return <><div className="stat-grid">{totals.map((key) => <StatCard key={key} label={titleCase(key)} value={data[key]} />)}</div>{months.length > 0 && <div className="table-wrap" style={{ marginTop: 16 }}><table><thead><tr><th>Tháng</th><th>Số lượt đặt</th></tr></thead><tbody>{months.map((item) => <tr key={item.month}><td>{item.month}</td><td>{displayValue(item.count)}</td></tr>)}</tbody></table></div>}</>;
  }
  const rows = Array.isArray(data) ? data : Object.entries(data || {}).map(([key, value]) => ({ period: key, value }));
  if (!rows.length) return <p className="muted">API chưa trả về chuỗi thống kê.</p>;
  return <div className="table-wrap"><table><thead><tr>{Object.keys(rows[0]).map((key) => <th key={key}>{titleCase(key)}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row.id || index}>{Object.entries(row).map(([key, value]) => <td key={key}>{displayValue(value)}</td>)}</tr>)}</tbody></table></div>;
}
