'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

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
  ]);

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
        return 'รอดำเนินการ';
      case 'preparing':
        return 'กำลังทำ';
      case 'ready':
        return 'พร้อมเสิร์ฟ';
      case 'completed':
        return 'เสร็จสิ้น';
      default:
        return status;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">รายการสั่งซื้อ</h1>
        <p className="text-gray-600">จัดการออเดอร์ของลูกค้า</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{order.orderNumber}</h3>
                <p className="text-gray-600">{order.table}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusText(order.status)}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span className="font-medium">
                    ฿{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg">ยอดรวม</span>
                <span className="font-bold text-lg text-orange-500">
                  ฿{order.total.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors text-sm">
                  อัปเดตสถานะ
                </button>
                <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition-colors text-sm">
                  ดูรายละเอียด
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">ไม่มีรายการสั่งซื้อ</p>
        </div>
      )}
    </div>
  );
}
