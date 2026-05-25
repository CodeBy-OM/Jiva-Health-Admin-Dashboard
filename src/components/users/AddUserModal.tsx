import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { User, Gender, BloodGroup, UserRole } from '../../types';
import { Modal, Input, Select, Button } from '../shared';

export default function AddUserModal({ onClose }: { onClose: () => void }) {
  const { addUser } = useStore();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', role: 'Patient' as UserRole,
    dob: '', gender: 'Male' as Gender, bloodGroup: 'O+' as BloodGroup,
  });

  const set = (k: string) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone) return;
    const now = new Date().toISOString().split('T')[0];
    const newUser: User = {
      id: 'USR' + Date.now(),
      ...form,
      status: 'Active',
      isPrime: false,
      joinedDate: now,
      lastActive: now,
      appointmentsCount: 0,
      totalSpent: 0,
      addresses: [],
      familyMembers: [],
    };
    addUser(newUser);
    onClose();
  };

  return (
    <Modal title="Add New User" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input label="Full Name *" value={form.name} onChange={set('name')} placeholder="e.g. Priya Sharma" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="Email *" value={form.email} onChange={set('email')} placeholder="email@example.com" type="email" />
          <Input label="Phone *" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Select label="Role" value={form.role} onChange={set('role')} options={[
            { value: 'Patient', label: 'Patient' },
            { value: 'Nurse', label: 'Nurse' },
          ]} />
          <Select label="Gender" value={form.gender} onChange={set('gender')} options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' },
          ]} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="Date of Birth" value={form.dob} onChange={set('dob')} type="date" />
          <Select label="Blood Group" value={form.bloodGroup} onChange={set('bloodGroup')} options={
            ['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => ({ value: b, label: b }))
          } />
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Add User</Button>
        </div>
      </div>
    </Modal>
  );
}
