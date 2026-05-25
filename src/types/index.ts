export type UserRole = 'Patient' | 'Nurse' | 'Admin';
export type UserStatus = 'Active' | 'Inactive';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type Gender = 'Male' | 'Female' | 'Other';
export type AddressType = 'Home' | 'Work' | 'Other';
export type OrderStatus = 'Delivered' | 'Pending' | 'Cancelled' | 'Processing';
export type PaymentMethod = 'Card' | 'UPI' | 'Cash' | 'Net Banking';
export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded' | 'Failed';
export type Relationship = 'Spouse' | 'Parent' | 'Child' | 'Sibling' | 'Other';

export interface Address {
  id: string;
  type: AddressType;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: Relationship;
  dob: string;
  phone: string;
  gender: Gender;
  bloodGroup?: BloodGroup;
}

export interface OrderItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentId: string;
  deliveredDate?: string;
}

export interface Payment {
  id: string;
  userId: string;
  orderId: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  isPrime: boolean;
  avatar?: string;
  joinedDate: string;
  lastActive: string;
  appointmentsCount: number;
  dob: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  addresses: Address[];
  familyMembers: FamilyMember[];
  totalSpent: number;
}
