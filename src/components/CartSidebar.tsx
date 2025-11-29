'use client';

import { useCart } from '@/contexts/CartContext';
import CartItem from './CartItem';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useShift } from '@/contexts/ShiftContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ReceiptModal, { type ReceiptData } from './ReceiptModal';

export default function CartSidebar() {
  const { cart, getSubtotal, getTax, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { isShiftOpen, addSale } = useShift();
  const { t } = useLanguage();
  const [table, setTable] = useState('โต๊ะ 1');
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  const generateOrderNumber = () => {
    const d = new Date();
    const pad = (n: number, l = 2) => n.toString().padStart(l, '0');
    return `#${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (!isShiftOpen) {
      alert(t('กรุณาเปิดกะก่อนทำรายการชำระเงิน', 'Please open a shift before checkout'));
      return;
    }
    const subtotal = getSubtotal();
    const tax = getTax();
    const total = getTotal();
    addSale(total);
    const data: ReceiptData = {
      orderNumber: generateOrderNumber(),
      table,
      cashier: user?.name || 'Unknown',
      createdAt: new Date().toISOString(),
      items: cart,
      subtotal,
      tax,
      total,
    };
    setReceiptData(data);
    setReceiptOpen(true);
    clearCart();
  };

  return (
    <>
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-screen fixed right-0 top-0 z-30 pt-[73px]">
      {/* Cart Header */}
      <div className="p-6 pb-4 border-b border-gray-200 bg-white">  
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">รายการสั่ง</h2>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded">
              <span className="text-xl">🔍</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <span className="text-xl">⋮</span>
            </button>
          </div>
        </div>
        <div className="relative">
          <select
            value={table}
            onChange={(e) => setTable(e.target.value)}
            className="w-full p-3 pr-10 border border-gray-200 rounded-lg appearance-none bg-white"
          >
            <option>โต๊ะ 1</option>
            <option>โต๊ะ 2</option>
            <option>โต๊ะ 3</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
            ▼
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-6">
        {cart.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            ไม่มีรายการในตะกร้า
          </div>
        ) : (
          <div className="py-2">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {cart.length > 0 && (
        <div className="border-t border-gray-200 p-6">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">ยอดรวม</span>
              <span className="font-medium">฿{getSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">ภาษี (7%)</span>
              <span className="font-medium">฿{getTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
              <span>ยอดรวมทั้งหมด</span>
              <span className="text-orange-500">฿{getTotal().toFixed(2)}</span>
            </div>
          </div>
          <button onClick={handleCheckout} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
            <span>✓</span> {t('ชำระเงิน', 'Checkout')}
          </button>
          <div className="flex gap-2 mt-2">
            <button className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              บันทึก
            </button>
            <button className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              ยกเลิก
            </button>
          </div>
        </div>
      )}
    </div>
    <ReceiptModal isOpen={receiptOpen} onClose={() => setReceiptOpen(false)} data={receiptData} />
    </>
  );
}
