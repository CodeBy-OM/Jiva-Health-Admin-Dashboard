import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Badge, StatCard, Input, Select } from '../shared';
import { format } from 'date-fns';

function statusVariant(s: string) {
  if (s === 'Delivered') return 'green';
  if (s === 'Cancelled') return 'red';
  if (s === 'Pending') return 'amber';
  return 'blue';
}

export default function OrdersList() {
  const navigate = useNavigate();
  const { orders, users } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = orders.filter(o => {
    const user = users.find(u => u.id === o.userId);
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      (user?.name.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      o.items.some(i => i.name.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const delivered = orders.filter(o => o.status === 'Delivered').length;
  const pending = orders.filter(o => o.status === 'Pending').length;
  const cancelled = orders.filter(o => o.status === 'Cancelled').length;
  const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((a, o) => a + o.totalAmount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <StatCard label="Total Orders" value={orders.length} icon={<ShoppingBag size={18} />} color="var(--teal)" />
        <StatCard label="Delivered" value={delivered} icon={<CheckCircle size={18} />} color="var(--green)" />
        <StatCard label="Pending" value={pending} icon={<Clock size={18} />} color="var(--amber)" />
        <StatCard label="Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={<ShoppingBag size={18} />} color="var(--purple)" />
      </div>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Input value={search} onChange={setSearch} placeholder="Search orders…" icon={<Search size={14} />} style={{ flex: '1 1 220px' }} />
          <Select value={statusFilter} onChange={setStatusFilter} options={[
            { value: 'All', label: 'All Status' },
            { value: 'Delivered', label: 'Delivered' },
            { value: 'Pending', label: 'Pending' },
            { value: 'Processing', label: 'Processing' },
            { value: 'Cancelled', label: 'Cancelled' },
          ]} style={{ minWidth: 140 }} />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-elevated)' }}>
                {['Order ID', 'Customer', 'Items', 'Date', 'Amount', 'Status', ''].map(h => (
                  <th key={h} style={{
                    padding: '10px 16px', textAlign: 'left', fontSize: 11,
                    fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px',
                    textTransform: 'uppercase', borderBottom: '1px solid var(--border)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No orders found</td></tr>
              ) : filtered.map(order => {
                const user = users.find(u => u.id === order.userId);
                return (
                  <tr
                    key={order.id}
                    style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.1s' }}
                    onClick={() => navigate(`/orders/${order.id}`)}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--teal)' }}>{order.id}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{user?.name ?? '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)', maxWidth: 200 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.items.map(i => `${i.name} (${i.description})`).join(', ')}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>
                      {format(new Date(order.date), 'dd MMM yyyy')}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 13 }}>
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge variant={statusVariant(order.status) as any}>{order.status}</Badge>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--teal)' }}>View →</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Showing {filtered.length} of {orders.length} orders</span>
        </div>
      </div>
    </div>
  );
}
