import React from 'react';
import { displayValue } from '../../utils/formatUtils';
export default function DataTable({ rows = [], columns = [], actions }) {
  if (!rows.length) return null;
  return <div className="table-wrap"><table><thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}{actions && <th>Thao tác</th>}</tr></thead>
    <tbody>{rows.map((row, index) => <tr key={row.id ?? row.code ?? index}>{columns.map((column) => <td key={column.key}>{column.render ? column.render(row[column.key], row) : displayValue(row[column.key])}</td>)}{actions && <td className="table-actions">{actions(row)}</td>}</tr>)}</tbody>
  </table></div>;
}
