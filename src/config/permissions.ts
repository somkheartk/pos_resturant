export interface RoleDef {
  key: string;
  labelTh: string;
  labelEn: string;
}

export const roles: RoleDef[] = [
  { key: 'admin', labelTh: 'ผู้ดูแลระบบ', labelEn: 'Admin' },
  { key: 'staff', labelTh: 'พนักงาน', labelEn: 'Staff' },
];

export type Role = (typeof roles)[number]['key'];

export interface PermissionItem {
  key: string; // e.g., 'orders.view'
  labelTh: string;
  labelEn: string;
  defaults?: Partial<Record<Role, boolean>>; // default enabled per role
}

export interface PermissionGroup {
  key: string; // e.g., 'orders'
  labelTh: string;
  labelEn: string;
  items: PermissionItem[];
}

export const permissionGroups: PermissionGroup[] = [
  {
    key: 'orders',
    labelTh: 'ออเดอร์',
    labelEn: 'Orders',
    items: [
      { key: 'orders', labelTh: 'เมนูออเดอร์ (พื้นฐาน)', labelEn: 'Orders (menu)', defaults: { admin: true, staff: true } },
      { key: 'orders.view', labelTh: 'ดูรายการ', labelEn: 'View orders', defaults: { admin: true, staff: true } },
      { key: 'orders.updateStatus', labelTh: 'อัปเดตสถานะ', labelEn: 'Update status', defaults: { admin: true, staff: true } },
      { key: 'orders.viewDetails', labelTh: 'ดูรายละเอียด', labelEn: 'View details', defaults: { admin: true, staff: true } },
    ],
  },
  {
    key: 'menu',
    labelTh: 'เมนูอาหาร / แคชเชียร์',
    labelEn: 'Menu / Cashier',
    items: [
      { key: 'menu', labelTh: 'เมนูอาหาร / แคชเชียร์ (พื้นฐาน)', labelEn: 'Menu / Cashier (menu)', defaults: { admin: true, staff: true } },
      { key: 'menu.create', labelTh: 'สร้างเมนู', labelEn: 'Create menu', defaults: { admin: true } },
      { key: 'menu.edit', labelTh: 'แก้ไขเมนู', labelEn: 'Edit menu', defaults: { admin: true } },
      { key: 'menu.delete', labelTh: 'ลบเมนู', labelEn: 'Delete menu', defaults: { admin: true } },
    ],
  },
  {
    key: 'shift',
    labelTh: 'การเปิด/ปิดกะ',
    labelEn: 'Shift Control',
    items: [
      { key: 'shift.open', labelTh: 'อนุญาตเปิดกะ', labelEn: 'Open shift', defaults: { admin: true } },
      { key: 'shift.close', labelTh: 'อนุญาตปิดกะ', labelEn: 'Close shift', defaults: { admin: true } },
    ],
  },
  {
    key: 'master',
    labelTh: 'จัดการเมนูอาหาร',
    labelEn: 'Master Menu',
    items: [
      { key: 'master', labelTh: 'หน้าจัดการเมนู (พื้นฐาน)', labelEn: 'Master (menu)', defaults: { admin: true } },
    ],
  },
  {
    key: 'reports',
    labelTh: 'รายงาน',
    labelEn: 'Reports',
    items: [
      { key: 'reports', labelTh: 'เมนูรายงาน (พื้นฐาน)', labelEn: 'Reports (menu)', defaults: { admin: true } },
      { key: 'reports.viewDaily', labelTh: 'รายงานรายวัน', labelEn: 'Daily report', defaults: { admin: true } },
      { key: 'reports.viewMonthly', labelTh: 'รายงานรายเดือน', labelEn: 'Monthly report', defaults: { admin: true } },
    ],
  },
  {
    key: 'settings',
    labelTh: 'ตั้งค่า',
    labelEn: 'Settings',
    items: [
      { key: 'settings', labelTh: 'เมนูตั้งค่า (พื้นฐาน)', labelEn: 'Settings (menu)', defaults: { admin: true } },
      { key: 'settings.company', labelTh: 'ข้อมูลร้าน', labelEn: 'Company info', defaults: { admin: true } },
      { key: 'settings.printers', labelTh: 'เครื่องพิมพ์', labelEn: 'Printers', defaults: { admin: true } },
    ],
  },
  {
    key: 'users',
    labelTh: 'ผู้ใช้งาน',
    labelEn: 'Users',
    items: [
      { key: 'users', labelTh: 'เมนูผู้ใช้งาน (พื้นฐาน)', labelEn: 'Users (menu)', defaults: { admin: true } },
      { key: 'users.invite', labelTh: 'เชิญผู้ใช้', labelEn: 'Invite user', defaults: { admin: true } },
      { key: 'users.delete', labelTh: 'ลบผู้ใช้', labelEn: 'Delete user', defaults: { admin: true } },
    ],
  },
];
