'use client';

import { useCart } from '@/contexts/CartContext';

export default function ReportsPage() {
  const { cart } = useCart();

  const salesData = {
    today: 15240,
    yesterday: 12500,
    thisWeek: 89450,
    thisMonth: 356200,
  };

  const topProducts = [
    { name: 'ผัดไทย', sold: 45, revenue: 5400 },
    { name: 'ต้มยำกุ้ง', sold: 32, revenue: 5760 },
    { name: 'แกงเขียวหวาน', sold: 28, revenue: 4200 },
    { name: 'ข้าวผัดกุ้ง', sold: 38, revenue: 3800 },
    { name: 'ส้มตำ', sold: 52, revenue: 3120 },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">รายงาน</h1>
        <p className="text-gray-600">สรุปยอดขายและสถิติการดำเนินงาน</p>
      </div>

      {/* Sales Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">ยอดขายวันนี้</span>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-3xl font-bold">
            ฿{salesData.today.toLocaleString()}
          </p>
          <p className="text-sm opacity-75 mt-2">+12% จากเมื่อวาน</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">ยอดขายเมื่อวาน</span>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-3xl font-bold">
            ฿{salesData.yesterday.toLocaleString()}
          </p>
          <p className="text-sm opacity-75 mt-2">+8% จากสัปดาห์ที่แล้ว</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">ยอดขายสัปดาห์นี้</span>
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-3xl font-bold">
            ฿{salesData.thisWeek.toLocaleString()}
          </p>
          <p className="text-sm opacity-75 mt-2">+15% จากสัปดาห์ที่แล้ว</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">ยอดขายเดือนนี้</span>
            <span className="text-2xl">🎯</span>
          </div>
          <p className="text-3xl font-bold">
            ฿{salesData.thisMonth.toLocaleString()}
          </p>
          <p className="text-sm opacity-75 mt-2">เป้าหมาย: ฿400,000</p>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">เมนูขายดี</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">อันดับ</th>
                <th className="text-left py-3 px-4">เมนู</th>
                <th className="text-right py-3 px-4">จำนวนที่ขาย</th>
                <th className="text-right py-3 px-4">ยอดขาย</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-bold text-lg text-orange-500">
                      #{index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4 text-right">{product.sold} จาน</td>
                  <td className="py-3 px-4 text-right font-bold text-green-600">
                    ฿{product.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
              👥
            </div>
            <div>
              <p className="text-gray-600 text-sm">ลูกค้าวันนี้</p>
              <p className="text-2xl font-bold">87 คน</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              🍽️
            </div>
            <div>
              <p className="text-gray-600 text-sm">ออเดอร์วันนี้</p>
              <p className="text-2xl font-bold">63 ออเดอร์</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
              💵
            </div>
            <div>
              <p className="text-gray-600 text-sm">ค่าเฉลี่ยต่อบิล</p>
              <p className="text-2xl font-bold">฿242</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
