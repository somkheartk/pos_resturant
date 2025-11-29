import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface Order {
  id: string;
  orderNumber: string;
  table: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  createdAt: Date;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: '#001',
      table: 'โต๊ะ 1',
      items: [
        { name: 'ผัดไทย', quantity: 2, price: 120 },
        { name: 'น้ำส้ม', quantity: 2, price: 45 },
      ],
      total: 330,
      status: 'preparing',
      createdAt: new Date(),
    },
    {
      id: '2',
      orderNumber: '#002',
      table: 'โต๊ะ 3',
      items: [
        { name: 'ต้มยำกุ้ง', quantity: 1, price: 180 },
        { name: 'ข้าวผัด', quantity: 1, price: 80 },
      ],
      total: 260,
      status: 'ready',
      createdAt: new Date(),
    },
    {
      id: '3',
      orderNumber: '#003',
      table: 'โต๊ะ 2',
      items: [
        { name: 'แกงเขียวหวาน', quantity: 1, price: 150 },
        { name: 'ข้าวขาหมู', quantity: 2, price: 90 },
      ],
      total: 330,
      status: 'pending',
      createdAt: new Date(),
    },
    {
      id: '4',
      orderNumber: '#004',
      table: 'โต๊ะ 5',
      items: [
        { name: 'ข้าวผัดกุ้ง', quantity: 1, price: 100 },
        { name: 'น้ำแตงโม', quantity: 1, price: 50 },
      ],
      total: 150,
      status: 'completed',
      createdAt: new Date(),
    },
    {
      id: '5',
      orderNumber: '#005',
      table: 'โต๊ะ 4',
      items: [
        { name: 'ส้มตำ', quantity: 3, price: 60 },
        { name: 'ปอเปี๊ยะทอด', quantity: 2, price: 70 },
      ],
      total: 320,
      status: 'preparing',
      createdAt: new Date(),
    },
    {
      id: '6',
      orderNumber: '#006',
      table: 'โต๊ะ 2',
      items: [
        { name: 'ทอดมันปลา', quantity: 2, price: 65 },
        { name: 'น้ำมะพร้าว', quantity: 1, price: 40 },
      ],
      total: 170,
      status: 'ready',
      createdAt: new Date(),
    },
    {
      id: '7',
      orderNumber: '#007',
      table: 'โต๊ะ 1',
      items: [
        { name: 'ข้าวเหนียวมะม่วง', quantity: 1, price: 90 },
        { name: 'น้ำมะนาว', quantity: 2, price: 30 },
      ],
      total: 150,
      status: 'pending',
      createdAt: new Date(),
    },
    {
      id: '8',
      orderNumber: '#008',
      table: 'โต๊ะ 6',
      items: [
        { name: 'ขนมครก', quantity: 2, price: 35 },
        { name: 'ไก่ทอด', quantity: 1, price: 80 },
      ],
      total: 150,
      status: 'completed',
      createdAt: new Date(),
    },
  ]);
  const [search, setSearch] = useState('');
  const [tableFilter, setTableFilter] = useState('ทั้งหมด');

  // สร้างรายการโต๊ะทั้งหมดจาก orders
  const tableList = Array.from(new Set(orders.map(o => o.table)));

  // ฟิลเตอร์รายการตาม search และโต๊ะ
  const filteredOrders = orders.filter(order => {
    const orderText = `${order.orderNumber} ${order.table} ${order.items.map(i => i.name).join(' ')}`.toLowerCase();
    const matchSearch = orderText.includes(search.toLowerCase());
    const matchTable = tableFilter === 'ทั้งหมด' || order.table === tableFilter;
    return matchSearch && matchTable;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return t('รอดำเนินการ', 'Pending');
      case 'preparing':
        return t('กำลังทำ', 'Preparing');
      case 'ready':
        return t('พร้อมเสิร์ฟ', 'Ready');
      case 'completed':
        return t('เสร็จสิ้น', 'Completed');
      default:
        return status;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold mb-2 text-blue-900 drop-shadow-sm">
              {t('รายการสั่งซื้อ', 'Orders')}
            </h1>
            <p className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
              <span>🛒</span> {t('จัดการออเดอร์ของลูกค้า', 'Manage customer orders')}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 w-full md:w-96 shadow-md focus-within:ring-2 focus-within:ring-orange-400 transition-all">
            <span className="text-gray-400 mr-2 text-xl">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('ค้นหาเลขออเดอร์ โต๊ะ หรือเมนู...', 'Search order number, table, or menu...')}
              className="bg-transparent outline-none w-full text-base text-gray-700"
            />
          </div>
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-md">
            <span className="text-gray-400 mr-2 text-xl">🍽️</span>
            <select
              value={tableFilter}
              onChange={e => setTableFilter(e.target.value)}
              className="bg-transparent outline-none text-base text-gray-700 w-full"
            >
              <option value="ทั้งหมด">{t('โต๊ะทั้งหมด', 'All tables')}</option>
              {tableList.map(table => (
                <option key={table} value={table}>{table}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100 relative"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-blue-900">
                  {order.orderNumber}
                </h3>
                <p className="text-gray-500 font-medium">{order.table}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusText(order.status)}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    {item.name}{' '}
                    <span className="text-xs text-gray-400">
                      x{item.quantity}
                    </span>
                  </span>
                  <span className="font-bold text-orange-500">
                    ฿{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg text-gray-700">{t('ยอดรวม', 'Total')}</span>
                <span className="font-bold text-lg text-orange-500">
                  ฿{order.total.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors text-sm shadow">
                  {t('อัปเดตสถานะ', 'Update status')}
                </button>
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg transition-colors text-sm shadow">
                  {t('ดูรายละเอียด', 'View details')}
                </button>
              </div>
            </div>
            <div className="absolute top-4 right-4 text-gray-300 text-xs">
              {order.createdAt.toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">{t('ไม่พบรายการสั่งซื้อ', 'No orders found')}</p>
        </div>
      )}
    </div>
  );
}
