import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Users, Crown, UserCheck, UserX, Edit2, Eye, Star } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { User } from '../../types';
import { Badge, Button, StatCard, Avatar, Input, Select, Modal } from '../shared';
import AddUserModal from './AddUserModal';
import { format } from 'date-fns';

function statusVariant(s: string) {
  return s === 'Active' ? 'green' : 'red';
}
function roleVariant(r: string) {
  return r === 'Nurse' ? 'blue' : 'teal';
}

export default function UserList() {
  const navigate = useNavigate();
  const { users, upgradeUserToPrime } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search);
    const matchStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalFamilyMembers = users.reduce((acc, u) => acc + u.familyMembers.length, 0);
  const primeUsers = users.filter((u) => u.isPrime).length;
  const nonPrimeUsers = users.filter((u) => !u.isPrime).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.3s ease' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <StatCard label="Total Users" value={users.length} icon={<Users size={18} />} color="var(--teal)" />
        <StatCard label="Prime Users" value={primeUsers} icon={<Crown size={18} />} color="var(--amber)" />
        <StatCard label="Non-Prime Users" value={nonPrimeUsers} icon={<UserCheck size={18} />} color="var(--blue)" />
        <StatCard label="Family Members" value={totalFamilyMembers} icon={<Users size={18} />} color="var(--purple)" />
      </div>

      {/* Table card */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      }}>
        {/* Toolbar */}
        <div style={{
          padding: '16px 20px', display: 'flex', alignItems: 'center',
          gap: 12, borderBottom: '1px solid var(--border)', flexWrap: 'wrap',
        }}>
          <Input
            value={search}
            onChange={setSearch}
            placeholder="Search by name, email or phone…"
            icon={<Search size={14} />}
            style={{ flex: '1 1 240px', minWidth: 200 }}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'All', label: 'All Status' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ]}
            style={{ minWidth: 130 }}
          />
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <Button
              variant="outline"
              size="sm"
              icon={<Crown size={13} />}
              onClick={() => {}}
            >
              Upgrade to Prime
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={13} />}
              onClick={() => setShowAddModal(true)}
            >
              Add User
            </Button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-elevated)' }}>
                {['User', 'Role', 'Status', 'Joined', 'Last Active', 'Appointments', 'Actions'].map((h) => (
                  <th key={h} style={{
                    padding: '10px 16px', textAlign: 'left',
                    fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
                    letterSpacing: '0.5px', textTransform: 'uppercase',
                    borderBottom: '1px solid var(--border)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                    No users found
                  </td>
                </tr>
              ) : filtered.map((user, i) => (
                <tr
                  key={user.id}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.1s',
                    animationDelay: `${i * 30}ms`,
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={user.name} size={32} />
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                          {user.name}
                          {user.isPrime && <Crown size={11} color="var(--amber)" />}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge variant={roleVariant(user.role) as any}>{user.role}</Badge>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge variant={statusVariant(user.status) as any}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                      {user.status}
                    </Badge>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: 12 }}>
                    {format(new Date(user.joinedDate), 'dd MMM yyyy')}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: 12 }}>
                    {format(new Date(user.lastActive), 'dd MMM yyyy')}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                    {user.appointmentsCount}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Button size="sm" variant="ghost" icon={<Eye size={13} />} onClick={() => navigate(`/users/${user.id}`)}>
                        View
                      </Button>
                      <Button size="sm" variant="ghost" icon={<Edit2 size={13} />} onClick={() => navigate(`/users/${user.id}`)}>
                        Edit
                      </Button>
                      {!user.isPrime && (
                        <Button size="sm" variant="ghost" icon={<Star size={13} />} onClick={() => upgradeUserToPrime(user.id)}>
                          Prime
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px', borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Showing {filtered.length} of {users.length} users
          </span>
        </div>
      </div>

      {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
