import { create } from 'zustand';
import { User, Order, Payment, FamilyMember, Address } from '../types';
import { mockUsers, mockOrders, mockPayments } from '../data/mockData';

interface AppState {
  users: User[];
  orders: Order[];
  payments: Payment[];

  // User actions
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  upgradeUserToPrime: (id: string) => void;

  // Family member actions
  addFamilyMember: (userId: string, member: FamilyMember) => void;
  updateFamilyMember: (userId: string, memberId: string, updates: Partial<FamilyMember>) => void;
  deleteFamilyMember: (userId: string, memberId: string) => void;

  // Address actions
  addAddress: (userId: string, address: Address) => void;
  updateAddress: (userId: string, addressId: string, updates: Partial<Address>) => void;
  setDefaultAddress: (userId: string, addressId: string) => void;

  // Getters
  getUserById: (id: string) => User | undefined;
  getOrdersByUserId: (userId: string) => Order[];
  getPaymentsByUserId: (userId: string) => Payment[];
  getOrderById: (id: string) => Order | undefined;
}

export const useStore = create<AppState>((set, get) => ({
  users: mockUsers,
  orders: mockOrders,
  payments: mockPayments,

  addUser: (user) => set((state) => ({ users: [...state.users, user] })),

  updateUser: (id, updates) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    })),

  deleteUser: (id) =>
    set((state) => ({ users: state.users.filter((u) => u.id !== id) })),

  toggleUserStatus: (id) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
      ),
    })),

  upgradeUserToPrime: (id) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, isPrime: true } : u)),
    })),

  addFamilyMember: (userId, member) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, familyMembers: [...u.familyMembers, member] } : u
      ),
    })),

  updateFamilyMember: (userId, memberId, updates) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId
          ? {
              ...u,
              familyMembers: u.familyMembers.map((fm) =>
                fm.id === memberId ? { ...fm, ...updates } : fm
              ),
            }
          : u
      ),
    })),

  deleteFamilyMember: (userId, memberId) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId
          ? { ...u, familyMembers: u.familyMembers.filter((fm) => fm.id !== memberId) }
          : u
      ),
    })),

  addAddress: (userId, address) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, addresses: [...u.addresses, address] } : u
      ),
    })),

  updateAddress: (userId, addressId, updates) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId
          ? {
              ...u,
              addresses: u.addresses.map((a) =>
                a.id === addressId ? { ...a, ...updates } : a
              ),
            }
          : u
      ),
    })),

  setDefaultAddress: (userId, addressId) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId
          ? {
              ...u,
              addresses: u.addresses.map((a) => ({
                ...a,
                isDefault: a.id === addressId,
              })),
            }
          : u
      ),
    })),

  getUserById: (id) => get().users.find((u) => u.id === id),
  getOrdersByUserId: (userId) => get().orders.filter((o) => o.userId === userId),
  getPaymentsByUserId: (userId) => get().payments.filter((p) => p.userId === userId),
  getOrderById: (id) => get().orders.find((o) => o.id === id),
}));
