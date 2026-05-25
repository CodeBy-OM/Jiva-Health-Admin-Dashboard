import React, { useState } from 'react';
import { Search, CreditCard, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Badge, StatCard, Input, Select } from '../shared';
import { format } from 'date-fns';

function statusVariant(s: string) {
  if (s === 'Paid') return 'green';
  if (s === 'Failed') return 'red';
  if (s === 'Pending') return 'amber';
  if (s === 'Refunded') return 'blue';
  return 'gray';
}

export default function PaymentsPage() {
  const { payments, users } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = payments.filter(p => {
    const user = users.find(u => u.id === p.userId);
    const matchSearch = p.id.toLowerCase().includes(search.toLowerCase()) ||
      (user?.name.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPaid = payments.filter(p => p.status === 'Paid').reduce((a, p) => a + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'Pending').reduce((a, p) => a + p.amount, 0);
  const totalRefunded = payments.filter(p => p.status === 'Refunded').reduce((a, p) => a + p.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <StatCard label="Total Payments" value={payments.length} icon={<CreditCard size={18} />} color="var(--teal)" />
        <StatCard label="Revenue Collected" value={`₹${totalPaid.toLocaleString('en-IN')}`} icon={<TrendingUp size={18} />} color="var(--green)" />
        <StatCard label="Pending Amount" value={`₹${totalPending.toLocaleString('en-IN')}`} icon={<AlertTriangle size={18} />} color="var(--amber)" />
        <StatCard label="Refunded" value={`₹${totalRefunded.toLocaleString('en-IN')}`} icon={<RefreshCw size={18} />} color="var(--blue)" />
      </div>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Input value={search} onChange={setSearch} placeholder="Search payments…" icon={<Search size={14} />} style={{ flex: '1 1 220px' }} />
          <Select value={statusFilter} onChange={setStatusFilter} options={[
            { value: 'All', label: 'All Status' },
            { value: 'Paid', label: 'Paid' },
            { value: 'Pending', label: 'Pending' },
            { value: 'Refunded', label: 'Refunded' },
            { value: 'Failed', label: 'Failed' },
          ]} style={{ minWidth: 130 }} />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-elevated)' }}>
                {['Payment ID', 'Customer', 'Order ID', 'Date', 'Amount', 'Method', 'Status'].map(h => (
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
                <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No payments found</td></tr>
              ) : filtered.map(p => {
                const user = users.find(u => u.id === p.userId);
                return (
                  <tr
                    key={p.id}
                    style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--teal)' }}>{p.id}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{user?.name ?? '—'}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{p.orderId}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{format(new Date(p.date), 'dd MMM yyyy')}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 13 }}>₹{p.amount.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{p.method}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge variant={statusVariant(p.status) as any}>{p.status}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Showing {filtered.length} of {payments.length} records</span>
        </div>
      </div>
    </div>
  );
}
