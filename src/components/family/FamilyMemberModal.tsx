import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { FamilyMember, Gender, BloodGroup, Relationship } from '../../types';
import { Modal, Input, Select, Button } from '../shared';

interface Props {
  userId: string;
  member?: FamilyMember;
  onClose: () => void;
}

export default function FamilyMemberModal({ userId, member, onClose }: Props) {
  const { addFamilyMember, updateFamilyMember } = useStore();
  const isEdit = !!member;

  const [form, setForm] = useState({
    name: member?.name ?? '',
    relationship: member?.relationship ?? 'Spouse' as Relationship,
    dob: member?.dob ?? '',
    phone: member?.phone ?? '',
    gender: member?.gender ?? 'Male' as Gender,
    bloodGroup: member?.bloodGroup ?? 'O+' as BloodGroup,
  });

  const set = (k: string) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name || !form.phone) return;
    if (isEdit && member) {
      updateFamilyMember(userId, member.id, form);
    } else {
      const newMember: FamilyMember = { id: 'FM' + Date.now(), ...form };
      addFamilyMember(userId, newMember);
    }
    onClose();
  };

  return (
    <Modal title={isEdit ? 'Edit Family Member' : 'Add Family Member'} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input label="Full Name *" value={form.name} onChange={set('name')} placeholder="Member name" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Select label="Relationship" value={form.relationship} onChange={set('relationship')} options={
            ['Spouse','Parent','Child','Sibling','Other'].map(r => ({ value: r, label: r }))
          } />
          <Select label="Gender" value={form.gender} onChange={set('gender')} options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' },
          ]} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="Date of Birth" value={form.dob} onChange={set('dob')} type="date" />
          <Input label="Phone *" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
        </div>
        <Select label="Blood Group" value={form.bloodGroup} onChange={set('bloodGroup')} options={
          ['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => ({ value: b, label: b }))
        } />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>{isEdit ? 'Save Changes' : 'Add Member'}</Button>
        </div>
      </div>
    </Modal>
  );
}
