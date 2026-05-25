import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { User, Gender, BloodGroup } from '../../types';
import { Modal, Input, Select, Button } from '../shared';

export default function EditUserModal({ user, onClose }: { user: User; onClose: () => void }) {
  const { updateUser } = useStore();
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    dob: user.dob,
    gender: user.gender as Gender,
    bloodGroup: user.bloodGroup as BloodGroup,
  });

  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    updateUser(user.id, form);
    onClose();
  };

  return (
    <Modal title="Edit Profile" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input label="Full Name" value={form.name} onChange={set('name')} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="Email" value={form.email} onChange={set('email')} type="email" />
          <Input label="Phone" value={form.phone} onChange={set('phone')} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="Date of Birth" value={form.dob} onChange={set('dob')} type="date" />
          <Select label="Gender" value={form.gender} onChange={set('gender')} options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' },
          ]} />
        </div>
        <Select label="Blood Group" value={form.bloodGroup} onChange={set('bloodGroup')} options={
          ['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => ({ value: b, label: b }))
        } />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
}
