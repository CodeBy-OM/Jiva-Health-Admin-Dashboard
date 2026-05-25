import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ShoppingBag, CreditCard, TrendingUp, Crown, Activity, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { StatCard, Badge, Avatar, Button } from '../components/shared';
import { format } from 'date-fns';

export default function Dashboard() {
  const navigate = useNavigate();
  const { users, orders, payments } = useStore();

  const activeUsers = users.filter(u => u.status === 'Active').length;
  const primeUsers = users.filter(u => u.isPrime).length;
  const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((a, p) => a + p.amount, 0);
  const recentUsers = [...users].sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()).slice(0, 5);
  const recentOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.3s ease' }}>
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,212,180,0.15) 0%, rgba(14,165,233,0.08) 100%)',
        border: '1px solid rgba(0,212,180,0.25)',
        borderRadius: 'var(--radius-xl)', padding: '20px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Welcome back, Admin 👋</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {format(new Date(), 'EEEE, dd MMMM yyyy')} · Jiva Health Dashboard
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Platform Health</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <StatCard label="Total Users" value={users.length} icon={<Users size={18} />} color="var(--teal)" sub={`${activeUsers} active`} />
        <StatCard label="Prime Members" value={primeUsers} icon={<Crown size={18} />} color="var(--amber)" />
        <StatCard label="Total Orders" value={orders.length} icon={<ShoppingBag size={18} />} color="var(--blue)" />
        <StatCard label="Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={<TrendingUp size={18} />} color="var(--green)" />
      </div>

      {/* Two column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent Users */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 20px', borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Recent Users</span>
            <button
              onClick={() => navigate('/users')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--teal)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div style={{ padding: '4px 0' }}>
            {recentUsers.map(user => (
              <div
                key={user.id}
                onClick={() => navigate(`/users/${user.id}`)}
                style={{
                  padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12,
                  cursor: 'pointer', transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <Avatar name={user.name} size={32} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
                    {user.name}
                    {user.isPrime && <Crown size={10} color="var(--amber)" />}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.role} · {user.email}</div>
                </div>
                <Badge variant={user.status === 'Active' ? 'green' : 'red'}>{user.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 20px', borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Recent Orders</span>
            <button
              onClick={() => navigate('/orders')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--teal)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div style={{ padding: '4px 0' }}>
            {recentOrders.map(order => {
              const user = users.find(u => u.id === order.userId);
              const variant = order.status === 'Delivered' ? 'green' : order.status === 'Cancelled' ? 'red' : order.status === 'Pending' ? 'amber' : 'blue';
              return (
                <div
                  key={order.id}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  style={{
                    padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12,
                    cursor: 'pointer', transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, background: 'var(--bg-elevated)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <ShoppingBag size={14} color="var(--teal)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--teal)' }}>{order.id}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.name} · {format(new Date(order.date), 'dd MMM')}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                    <span style={{ fontWeight: 600, fontSize: 12 }}>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                    <Badge variant={variant as any}>{order.status}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
