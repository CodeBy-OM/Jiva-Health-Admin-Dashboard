# Jiva Health – Admin Dashboard

A full-featured User Management Dashboard for the **Jiva Health** digital health platform. Built with React, TypeScript, Vite, and Zustand.

---

## Screenshots

| Screen | Description |
|---|---|
| Dashboard | Overview with stats, recent users & orders |
| User Management | Searchable, filterable user table |
| User Detail | Profile, metrics, orders, payments, family |
| Order Detail | Itemized breakdown with shipping & payment |
| Payments | Transaction history with status tracking |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| State Management | Zustand |
| Routing | React Router v6 |
| Icons | Lucide React |
| Date Formatting | date-fns |
| Styling | CSS-in-JS (inline styles + CSS variables) |

---

## Getting Started

### Prerequisites

- Node.js **18+**
- npm 9+

### Installation

```bash
# 1. Unzip and enter the project
unzip jiva-health-dashboard.zip
cd jiva-health

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build       # outputs to /dist
npm run preview     # preview the production build locally
```

---

## Project Structure

```
jiva-health/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── family/
│   │   │   └── FamilyMemberModal.tsx   # Add / edit family members
│   │   ├── layout/
│   │   │   ├── Layout.tsx              # App shell (sidebar + topbar + outlet)
│   │   │   ├── Sidebar.tsx             # Collapsible nav sidebar
│   │   │   └── TopBar.tsx              # Page title + notification bar
│   │   ├── orders/
│   │   │   ├── OrderDetail.tsx         # Single order breakdown
│   │   │   ├── OrdersList.tsx          # All orders table
│   │   │   └── PaymentsPage.tsx        # All payments table
│   │   ├── shared/
│   │   │   └── index.tsx               # Badge, Button, Card, Input, Select,
│   │   │                               # Avatar, Modal, StatCard, EmptyState
│   │   └── users/
│   │       ├── AddressModal.tsx        # Add / edit address
│   │       ├── AddUserModal.tsx        # Create new user
│   │       ├── EditUserModal.tsx       # Edit personal info
│   │       ├── UserDetail.tsx          # Full user profile page
│   │       └── UserList.tsx            # Users table with search & filter
│   ├── data/
│   │   └── mockData.ts                 # Seeded users, orders, payments
│   ├── pages/
│   │   └── Dashboard.tsx               # Overview / home page
│   ├── store/
│   │   └── useStore.ts                 # Zustand global store
│   ├── types/
│   │   └── index.ts                    # All TypeScript interfaces & enums
│   ├── App.tsx                         # Route definitions
│   ├── index.css                       # CSS variables + global resets
│   └── main.tsx                        # React entry point
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Features

### Dashboard
- Summary stat cards — total users, prime members, orders, revenue
- Recent users list with quick navigation
- Recent orders list with status badges
- Platform health indicator

### User Management (List View)
- Stat cards: Total Users, Prime Users, Non-Prime Users, Family Members
- Table with: Name, Role, Status, Joined, Last Active, Appointments, Actions
- Search by name, email, or phone
- Filter by status (All / Active / Inactive)
- Add User modal
- Upgrade individual users to Prime inline

### User Detail Page
- Avatar, name, status badge, role, user ID
- Metrics: Total Orders, Appointments, Family Members, Total Spent
- Upgrade to Prime / Activate / Deactivate toggle
- Edit profile modal (name, email, phone, DOB, gender, blood group)
- Address management — add, edit, set default
- Tabbed sections:
  - **Orders** — clickable cards linking to order detail
  - **Payments** — transaction table
  - **Family Members** — add, edit, delete with live count

### Order History & Order Detail
- Order table: ID, customer, items, date, amount, status
- Click any order to open a full detail view
- Detail view shows: itemized list with quantities & prices, shipping address, payment info

### Payment History
- Table: Payment ID, customer, order ID, date, amount, method, status
- Stat cards for collected revenue, pending, and refunded amounts

### Family Member Management
- Add / edit / delete family members per user
- Fields: name, relationship, DOB, phone, gender, blood group
- Family member count updates dynamically in the user detail header

---

## Future Enhancements

- [ ] Backend API integration (REST or GraphQL)
- [ ] Persistent storage (database / localStorage)
- [ ] Pagination for large datasets
- [ ] Role-based access control
- [ ] Export users / orders to CSV
- [ ] Appointment scheduling module
- [ ] Notification centre
- [ ] Dark / light theme toggle
- [ ] Unit & integration tests (Vitest + Testing Library)

---

## License

This project was built as an assignment for **Jiva Health**. All rights reserved.
