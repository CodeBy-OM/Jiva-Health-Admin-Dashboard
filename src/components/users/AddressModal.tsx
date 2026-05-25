import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Address, AddressType } from '../../types';
import { Modal, Input, Select, Button } from '../shared';

interface Props {
  userId: string;
  address?: Address;
  onClose: () => void;
}

export default function AddressModal({ userId, address, onClose }: Props) {
  const { addAddress, updateAddress } = useStore();
  const isEdit = !!address;

  const [form, setForm] = useState({
    type: address?.type ?? 'Home' as AddressType,
    line1: address?.line1 ?? '',
    line2: address?.line2 ?? '',
    city: address?.city ?? '',
    state: address?.state ?? '',
    pincode: address?.pincode ?? '',
    isDefault: address?.isDefault ?? false,
  });

  const set = (k: string) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.line1 || !form.city || !form.pincode) return;
    if (isEdit && address) {
      updateAddress(userId, address.id, form);
    } else {
      const newAddr: Address = { id: 'ADDR' + Date.now(), ...form };
      addAddress(userId, newAddr);
    }
    onClose();
  };

  return (
    <Modal title={isEdit ? 'Edit Address' : 'Add Address'} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Select label="Address Type" value={form.type} onChange={set('type')} options={[
          { value: 'Home', label: 'Home' },
          { value: 'Work', label: 'Work' },
          { value: 'Other', label: 'Other' },
        ]} />
        <Input label="Address Line 1 *" value={form.line1} onChange={set('line1')} placeholder="Street / Colony" />
        <Input label="Address Line 2" value={form.line2} onChange={set('line2')} placeholder="Landmark (optional)" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="City *" value={form.city} onChange={set('city')} placeholder="City" />
          <Input label="State *" value={form.state} onChange={set('state')} placeholder="State" />
        </div>
        <Input label="Pincode *" value={form.pincode} onChange={set('pincode')} placeholder="6-digit pincode" />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setForm(f => ({ ...f, isDefault: e.target.checked }))}
            style={{ accentColor: 'var(--teal)' }}
          />
          Set as default address
        </label>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>{isEdit ? 'Save Changes' : 'Add Address'}</Button>
        </div>
      </div>
    </Modal>
  );
}
