"use client";

import React, { useMemo, useState } from 'react';
import { CartItem } from '@/types/menu';
import { useLanguage } from '@/contexts/LanguageContext';

export interface ReceiptData {
  orderNumber: string;
  table: string;
  cashier: string;
  createdAt: string; // ISO
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export default function ReceiptModal({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: ReceiptData | null;
}) {
  const { t } = useLanguage();
  if (!isOpen || !data) return null;

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'qr'>('cash');
  const [received, setReceived] = useState<string>('');

  const change = useMemo(() => {
    const rec = parseFloat(received || '0');
    if (isNaN(rec)) return 0;
    return Math.max(0, rec - data.total);
  }, [received, data.total]);

  const fmt = (n: number) => `฿${n.toFixed(2)}`;

  const handlePrint = () => {
    const printWin = window.open('', 'PRINT', 'height=600,width=400');
    if (!printWin) return;
    const style = `
      <style>
        body { width: 280px; margin: 0 auto; padding: 8px 10px; font-family: "Courier New", ui-monospace, Menlo, monospace; color: #111; }
        h1 { font-size: 14px; margin: 0 0 4px; text-align: center; }
        .center { text-align: center; }
        .row { display: flex; justify-content: space-between; font-size: 12px; line-height: 1.35; }
        .muted { color: #555; }
        .total { font-weight: 700; font-size: 14px; }
        hr { border: none; border-top: 1px dashed #000; margin: 8px 0; }
        table { width: 100%; font-size: 12px; border-collapse: collapse; }
        th, td { text-align: left; padding: 2px 0; }
        td.num, th.num { text-align: right; }
        .foot { text-align: center; font-size: 12px; margin-top: 8px; }
      </style>
    `;
    const itemsHtml = data.items
      .map(
        (it) => `
        <tr>
          <td>${it.name} x${it.quantity}</td>
          <td class="num">฿${(it.price * it.quantity).toFixed(2)}</td>
        </tr>`
      )
      .join('');

    printWin.document.write(`
      <html>
        <head>
          <title>Receipt ${data.orderNumber}</title>
          ${style}
        </head>
        <body>
          <h1>POS RESTAURANT</h1>
          <div class="center" style="font-size:12px">${t('สาขาหลัก', 'Main Branch')}</div>
          <div class="center muted" style="font-size:12px">VAT: 0105551234567</div>
          <div class="center" style="font-size:12px; margin-top:4px;">${t('ใบกำกับภาษีอย่างย่อ', 'ABB TAX INVOICE')}</div>
          <hr/>
          <div class="row"><span>${t('เลขที่บิล', 'Order No.')}</span><span>${data.orderNumber}</span></div>
          <div class="row"><span>${t('เวลา', 'Time')}</span><span>${new Date(data.createdAt).toLocaleString('th-TH')}</span></div>
          <div class="row"><span>${t('พนักงาน', 'Cashier')}</span><span>${data.cashier}</span></div>
          <div class="row"><span>${t('โต๊ะ', 'Table')}</span><span>${data.table}</span></div>
          <hr/>
          <table>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <hr/>
          <div class="row"><span class="muted">${t('มูลค่าสินค้าก่อนภาษี', 'Taxable Amount')}</span><span>${fmt(data.subtotal)}</span></div>
          <div class="row"><span class="muted">${t('ภาษีมูลค่าเพิ่ม 7%', 'VAT 7%')}</span><span>${fmt(data.tax)}</span></div>
          <div class="row total"><span>${t('รวมทั้งสิ้น (VAT รวมแล้ว)', 'Grand Total (VAT Incl.)')}</span><span>${fmt(data.total)}</span></div>
          <hr/>
          <div class="row"><span>${t('วิธีชำระ', 'Payment')}</span><span>${paymentMethod === 'cash' ? t('เงินสด', 'Cash') : paymentMethod === 'qr' ? 'QR' : t('บัตร', 'Card')}</span></div>
          ${paymentMethod === 'cash' ? `<div class="row"><span>${t('รับเงิน', 'Received')}</span><span>${fmt(parseFloat(received||'0'))}</span></div>
          <div class="row"><span>${t('เงินทอน', 'Change')}</span><span>${fmt(change)}</span></div>` : ''}
          <hr/>
          <div class="foot">${t('ขอบคุณที่อุดหนุน', 'Thank you!')}</div>
          <script>window.focus(); window.print(); setTimeout(() => window.close(), 300);</script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between px-5 py-3 border-b bg-blue-50 rounded-t-2xl">
            <div className="font-bold text-blue-900">{t('ตัวอย่างใบเสร็จ (สไตล์ Lotus)', 'Receipt Preview (Lotus style)')}</div>
            <button className="text-2xl text-gray-500 hover:text-gray-700" onClick={onClose}>×</button>
          </div>
          <div className="p-5 space-y-4">
            {/* Brand header */}
            <div className="bg-gradient-to-r from-orange-50 to-blue-50 border border-orange-100 rounded-xl p-4 text-center shadow-sm">
              <div className="text-xl font-extrabold text-blue-900 tracking-wide">POS RESTAURANT</div>
              <div className="text-xs text-gray-600">{t('สาขาหลัก', 'Main Branch')} · VAT: 0105551234567</div>
              <div className="inline-flex items-center gap-2 text-[11px] text-orange-700 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full mt-2">
                <span>🧾</span>
                <span>{t('ใบกำกับภาษีอย่างย่อ', 'ABB TAX INVOICE')}</span>
              </div>
            </div>

            {/* Info chips */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-sm">
                <span className="text-xs text-gray-500">{t('เลขที่บิล', 'Order No.')}</span>
                <span className="text-sm font-semibold text-gray-900">{data.orderNumber}</span>
              </div>
              <div className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-sm">
                <span className="text-xs text-gray-500">{t('เวลา', 'Time')}</span>
                <span className="text-sm font-semibold text-gray-900">{new Date(data.createdAt).toLocaleString('th-TH')}</span>
              </div>
              <div className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-sm">
                <span className="text-xs text-gray-500">{t('พนักงาน', 'Cashier')}</span>
                <span className="text-sm font-semibold text-gray-900">{data.cashier}</span>
              </div>
              <div className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-sm">
                <span className="text-xs text-gray-500">{t('โต๊ะ', 'Table')}</span>
                <span className="text-sm font-semibold text-gray-900">{data.table}</span>
              </div>
            </div>

            {/* Items table */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-2 bg-blue-50/70 text-blue-900 text-sm font-semibold">{t('รายการสินค้า', 'Items')}</div>
              <div className="divide-y divide-gray-100">
                {data.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-2">
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">{it.name}</div>
                      <div className="text-xs text-gray-500">{t('จำนวน', 'Qty')}: <span className="inline-flex items-center bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">x{it.quantity}</span></div>
                    </div>
                    <div className="font-semibold text-gray-900">฿{(it.price * it.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1"><span>{t('มูลค่าสินค้าก่อนภาษี', 'Taxable Amount')}</span><span>฿{data.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-gray-600"><span>{t('ภาษีมูลค่าเพิ่ม 7%', 'VAT 7%')}</span><span>฿{data.tax.toFixed(2)}</span></div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <span className="text-base font-bold text-gray-800">{t('รวมทั้งสิ้น (VAT รวมแล้ว)', 'Grand Total (VAT Incl.)')}</span>
                <span className="text-xl font-extrabold text-orange-600">฿{data.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment section */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 space-y-3">
              <div className="text-sm font-semibold text-gray-800">{t('วิธีชำระเงิน', 'Payment Method')}</div>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { key: 'cash', label: t('เงินสด', 'Cash'), icon: '💵' },
                  { key: 'qr', label: 'QR', icon: '📱' },
                  { key: 'card', label: t('บัตร', 'Card'), icon: '💳' },
                ] as const).map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setPaymentMethod(opt.key)}
                    className={`px-3 py-2 rounded-lg text-sm border transition shadow-sm ${
                      paymentMethod === opt.key
                        ? 'bg-orange-500 text-white border-orange-600'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-1">{opt.icon}</span>{opt.label}
                  </button>
                ))}
              </div>

              {paymentMethod === 'cash' && (
                <div className="grid grid-cols-2 gap-3 items-end">
                  <div className="col-span-1">
                    <label className="block text-xs text-gray-600 mb-1">{t('รับเงิน', 'Received')}</label>
                    <input
                      type="number"
                      value={received}
                      onChange={(e) => setReceived(e.target.value)}
                      placeholder="0.00"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-1">
                    <div className="text-xs text-gray-600 mb-1">{t('เงินทอน', 'Change')}</div>
                    <div className="text-2xl font-extrabold text-green-600">฿{change.toFixed(2)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 justify-end px-5 py-3 border-t bg-gray-50 rounded-b-2xl">
            <button onClick={handlePrint} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium">{t('พิมพ์ใบเสร็จ', 'Print Receipt')}</button>
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium">{t('ปิด', 'Close')}</button>
          </div>
        </div>
      </div>
    </>
  );
}
