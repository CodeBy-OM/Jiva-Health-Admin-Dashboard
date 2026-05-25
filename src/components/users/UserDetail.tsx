import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Crown, Edit2, MapPin, Phone, Mail, Calendar, Droplets,
  ShoppingBag, Clock, Users, IndianRupee, Plus, Trash2, Pencil,
  Package, CreditCard, CheckCircle, XCircle, AlertCircle, Loader2
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Avatar, Badge, Button, Card, StatCard } from '../shared';
import FamilyMemberModal from '../family/FamilyMemberModal';
import AddressModal from './AddressModal';
import EditUserModal from './EditUserModal';
import { format } from 'date-fns';
import { FamilyMember, Order } from '../../types';

type Tab = 'orders' | 'payments' | 'family';

function orderStatusVariant(s: string) {
  if (s === 'Delivered') return 'green';
  if (s === 'Cancelled') return 'red';
  if (s === 'Pending') return 'amber';
  return 'blue';
}
function orderStatusIcon(s: string) {
  if (s === 'Delivered') return <CheckCircle size={13} />;
  if (s === 'Cancelled') return <XCircle size={13} />;
  if (s === 'Pending') return <AlertCircle size={13} />;
  return <Loader2 size={13} />;
}
function paymentStatusVariant(s: string) {
  if (s === 'Paid') return 'green';
  if (s === 'Failed') return 'red';
  if (s === 'Pending') return 'amber';
  if (s === 'Refunded') return 'blue';
  return 'gray';
}

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getUserById, getOrdersByUserId, getPaymentsByUserId, toggleUserStatus, upgradeUserToPrime, deleteFamilyMember } = useStore();

  const user = getUserById(id!);
  const orders = getOrdersByUserId(id!);
  const payments = getPaymentsByUserId(id!);

  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [editFamilyMember, setEditFamilyMember] = useState<FamilyMember | undefined>();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  if (!user) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>User not found.</p>
        <Button variant="secondary" onClick={() => navigate('/users')} style={{ marginTop: 16 }}>
          Back to Users
        </Button>
      </div>
    );
  }

  const defaultAddress = user.addresses.find((a) => a.isDefault) ?? user.addresses[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.3s ease' }}>
      {/* Back */}
      <button
        onClick={() => navigate('/users')}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: 13, padding: 0,
        }}
      >
        <ArrowLeft size={15} /> Back to Users
      </button>

      {/* Profile header */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 24,
        display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap',
      }}>
        <Avatar name={user.name} size={64} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>{user.name}</h2>
            {user.isPrime && (
              <Badge variant="amber"><Crown size={10} /> Prime</Badge>
            )}
            <Badge variant={user.status === 'Active' ? 'green' : 'red'}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
              {user.status}
            </Badge>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            {user.role} &nbsp;·&nbsp; ID: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--teal)' }}>{user.id}</span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>
            Joined {format(new Date(user.joinedDate), 'dd MMM yyyy')}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {!user.isPrime && (
            <Button variant="outline" size="sm" icon={<Crown size={13} />} onClick={() => upgradeUserToPrime(user.id)}>
              Upgrade to Prime
            </Button>
          )}
          <Button
            variant={user.status === 'Active' ? 'danger' : 'primary'}
            size="sm"
            onClick={() => toggleUserStatus(user.id)}
          >
            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
          </Button>
          <Button variant="secondary" size="sm" icon={<Edit2 size={13} />} onClick={() => setShowEditModal(true)}>
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <StatCard label="Total Orders" value={orders.length} icon={<ShoppingBag size={18} />} color="var(--teal)" />
        <StatCard label="Appointments" value={user.appointmentsCount} icon={<Clock size={18} />} color="var(--blue)" />
        <StatCard label="Family Members" value={user.familyMembers.length} icon={<Users size={18} />} color="var(--purple)" />
        <StatCard label="Total Spent" value={`₹${user.totalSpent.toLocaleString('en-IN')}`} icon={<IndianRupee size={18} />} color="var(--green)" />
      </div>

      {/* Two column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
        {/* Left: tabs */}
        <div>
          {/* Tab bar */}
          <div style={{
            display: 'flex', gap: 0, borderBottom: '1px solid var(--border)',
            marginBottom: 16,
          }}>
            {(['orders', 'payments', 'family'] as Tab[]).map((t) => {
              const labels = { orders: `Orders (${orders.length})`, payments: `Payments (${payments.length})`, family: `Family (${user.familyMembers.length})` };
              const active = activeTab === t;
              return (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  style={{
                    padding: '10px 16px', background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 400,
                    color: active ? 'var(--teal)' : 'var(--text-secondary)',
                    borderBottom: active ? '2px solid var(--teal)' : '2px solid transparent',
                    marginBottom: -1, transition: 'all 0.15s',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {labels[t]}
                </button>
              );
            })}
          </div>

          {/* Orders tab */}
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {orders.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No orders yet</div>
              ) : orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)', padding: '14px 16px',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--teal)';
                    (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--teal)', marginBottom: 4 }}>
                        {order.id}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
                        {order.items.map(i => `${i.name} (${i.description})`).join(', ')}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        {format(new Date(order.date), 'dd MMM yyyy')} · {order.paymentMethod}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                      <Badge variant={orderStatusVariant(order.status) as any}>
                        {orderStatusIcon(order.status)} {order.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Payments tab */}
          {activeTab === 'payments' && (
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-elevated)' }}>
                    {['Payment ID', 'Date', 'Amount', 'Method', 'Status'].map(h => (
                      <th key={h} style={{
                        padding: '10px 16px', textAlign: 'left', fontSize: 11,
                        fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px',
                        textTransform: 'uppercase', borderBottom: '1px solid var(--border)',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No payment records</td></tr>
                  ) : payments.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--teal)' }}>{p.id}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{format(new Date(p.date), 'dd MMM yyyy')}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 13 }}>₹{p.amount.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{p.method}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge variant={paymentStatusVariant(p.status) as any}>{p.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Family tab */}
          {activeTab === 'family' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => { setEditFamilyMember(undefined); setShowFamilyModal(true); }}>
                  Add Member
                </Button>
              </div>
              {user.familyMembers.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No family members added</div>
              ) : user.familyMembers.map(fm => (
                <div key={fm.id} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <Avatar name={fm.name} size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{fm.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {fm.relationship} · {fm.gender} · DOB: {fm.dob ? format(new Date(fm.dob), 'dd MMM yyyy') : '—'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{fm.phone}</div>
                  </div>
                  {fm.bloodGroup && <Badge variant="red">{fm.bloodGroup}</Badge>}
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Button size="sm" variant="ghost" icon={<Pencil size={12} />} onClick={() => { setEditFamilyMember(fm); setShowFamilyModal(true); }} />
                    <Button size="sm" variant="danger" icon={<Trash2 size={12} />} onClick={() => deleteFamilyMember(user.id, fm.id)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: info panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Personal Info */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 18,
          }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Personal Info
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: <Mail size={13} />, label: 'Email', value: user.email },
                { icon: <Phone size={13} />, label: 'Phone', value: user.phone },
                { icon: <Calendar size={13} />, label: 'DOB', value: user.dob ? format(new Date(user.dob), 'dd MMM yyyy') : '—' },
                { icon: <Users size={13} />, label: 'Gender', value: user.gender },
                { icon: <Droplets size={13} />, label: 'Blood', value: user.bloodGroup },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--teal)', flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 44, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-primary)', wordBreak: 'break-all' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Addresses */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 18,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Addresses
              </h3>
              <Button size="sm" variant="ghost" icon={<Plus size={12} />} onClick={() => setShowAddressModal(true)}>Add</Button>
            </div>
            {user.addresses.length === 0 ? (
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No addresses added</p>
            ) : user.addresses.map(addr => (
              <div key={addr.id} style={{
                padding: '10px 12px', borderRadius: 'var(--radius-md)',
                background: addr.isDefault ? 'var(--teal-dim)' : 'var(--bg-elevated)',
                border: `1px solid ${addr.isDefault ? 'var(--teal)' : 'var(--border)'}`,
                marginBottom: 8,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Badge variant={addr.type === 'Home' ? 'teal' : 'blue'}>{addr.type}</Badge>
                  {addr.isDefault && <span style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 600 }}>DEFAULT</span>}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                  {addr.city}, {addr.state} – {addr.pincode}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showFamilyModal && (
        <FamilyMemberModal
          userId={user.id}
          member={editFamilyMember}
          onClose={() => { setShowFamilyModal(false); setEditFamilyMember(undefined); }}
        />
      )}
      {showAddressModal && (
        <AddressModal userId={user.id} onClose={() => setShowAddressModal(false)} />
      )}
      {showEditModal && (
        <EditUserModal user={user} onClose={() => setShowEditModal(false)} />
      )}
    </div>
  );
}
