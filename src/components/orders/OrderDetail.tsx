import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Package, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Badge, Button } from '../shared';
import { format } from 'date-fns';

function statusVariant(s: string) {
  if (s === 'Delivered') return 'green';
  if (s === 'Cancelled') return 'red';
  if (s === 'Pending') return 'amber';
  return 'blue';
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, getUserById } = useStore();
  const order = getOrderById(id!);

  if (!order) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Order not found.</p>
        <Button variant="secondary" onClick={() => navigate(-1)} style={{ marginTop: 16 }}>Go Back</Button>
      </div>
    );
  }

  const user = getUserById(order.userId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800, animation: 'fadeIn 0.3s ease' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: 13, padding: 0,
        }}
      >
        <ArrowLeft size={15} /> Back
      </button>

      {/* Header */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Order</div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--teal)' }}>{order.id}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              Placed on {format(new Date(order.date), 'dd MMM yyyy, HH:mm')}
              {order.deliveredDate && ` · Delivered on ${format(new Date(order.deliveredDate), 'dd MMM yyyy')}`}
            </div>
          </div>
          <Badge variant={statusVariant(order.status) as any} >
            {order.status}
          </Badge>
        </div>
        {user && (
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
            Customer: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{user.name}</span>
            &nbsp;·&nbsp;
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--teal)' }}>{user.id}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }}>
        {/* Items */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Package size={15} color="var(--teal)" />
            <span style={{ fontWeight: 600, fontSize: 13 }}>Order Items</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-elevated)' }}>
                {['Item', 'Qty', 'Unit Price', 'Total'].map(h => (
                  <th key={h} style={{
                    padding: '10px 16px', textAlign: h === 'Item' ? 'left' : 'right',
                    fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
                    letterSpacing: '0.5px', textTransform: 'uppercase',
                    borderBottom: '1px solid var(--border)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.description}</div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 13, fontFamily: 'var(--font-mono)' }}>{item.quantity}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 13 }}>₹{item.unitPrice}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 13, fontWeight: 600 }}>
                    ₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--bg-elevated)' }}>
                <td colSpan={3} style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: 13 }}>
                  Grand Total
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, fontSize: 16, color: 'var(--teal)' }}>
                  ₹{order.totalAmount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Side panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Shipping address */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 18,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <MapPin size={14} color="var(--teal)" />
              <span style={{ fontWeight: 600, fontSize: 13 }}>Delivery Address</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <Badge variant={order.shippingAddress.type === 'Home' ? 'teal' : 'blue'} >{order.shippingAddress.type}</Badge>
              <br />
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 && <><br />{order.shippingAddress.line2}</>}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}
              <br />
              {order.shippingAddress.pincode}
            </div>
          </div>

          {/* Payment info */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 18,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <CreditCard size={14} color="var(--teal)" />
              <span style={{ fontWeight: 600, fontSize: 13 }}>Payment Info</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>Method</span>
                <span style={{ fontWeight: 500 }}>{order.paymentMethod}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment ID</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--teal)' }}>{order.paymentId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>Amount</span>
                <span style={{ fontWeight: 700 }}>₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
