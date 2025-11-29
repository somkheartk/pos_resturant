'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchParams } from 'next/navigation';

export default function SettingsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'general');

  useEffect(() => {
    if (tabParam) setActiveTab(tabParam);
  }, [tabParam]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">ตั้งค่า</h1>
        <p className="text-gray-600">จัดการการตั้งค่าระบบ POS</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'general'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {t('ทั่วไป', 'General')}
        </button>
        <button
          onClick={() => setActiveTab('receipt')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'receipt'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {t('ใบเสร็จ', 'Receipt')}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'users'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {t('ผู้ใช้งาน', 'Users')}
        </button>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">ตั้งค่าทั่วไป</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อร้าน
              </label>
              <input
                type="text"
                defaultValue="ร้านอาหารไทย"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เบอร์โทรศัพท์
              </label>
              <input
                type="tel"
                defaultValue="02-123-4567"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ที่อยู่
              </label>
              <textarea
                rows={3}
                defaultValue="123 ถนนสุขุมวิท กรุงเทพมหานคร 10110"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                อัตราภาษี (%)
              </label>
              <input
                type="number"
                defaultValue="7"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors">
              บันทึกการตั้งค่า
            </button>
          </div>
        </div>
      )}

      {/* Receipt Settings */}
      {activeTab === 'receipt' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">ตั้งค่าใบเสร็จ</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หัวข้อใบเสร็จ
              </label>
              <input
                type="text"
                defaultValue="ใบเสร็จรับเงิน"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ข้อความท้ายใบเสร็จ
              </label>
              <textarea
                rows={2}
                defaultValue="ขอบคุณที่ใช้บริการ"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showLogo"
                defaultChecked
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
              />
              <label htmlFor="showLogo" className="text-sm text-gray-700">
                แสดงโลโก้บนใบเสร็จ
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showTax"
                defaultChecked
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
              />
              <label htmlFor="showTax" className="text-sm text-gray-700">
                แสดงรายละเอียดภาษี
              </label>
            </div>

            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors">
              บันทึกการตั้งค่า
            </button>
          </div>
        </div>
      )}

      {/* Users Settings */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">จัดการผู้ใช้งาน</h2>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
              + เพิ่มผู้ใช้งาน
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">ชื่อ</th>
                  <th className="text-left py-3 px-4">อีเมล</th>
                  <th className="text-left py-3 px-4">บทบาท</th>
                  <th className="text-right py-3 px-4">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">ผู้ดูแลระบบ</td>
                  <td className="py-3 px-4 text-gray-600">admin@pos.com</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      Admin
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-blue-500 hover:text-blue-700 mr-3">
                      แก้ไข
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      ลบ
                    </button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">พนักงาน</td>
                  <td className="py-3 px-4 text-gray-600">staff@pos.com</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Staff
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-blue-500 hover:text-blue-700 mr-3">
                      แก้ไข
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      ลบ
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
