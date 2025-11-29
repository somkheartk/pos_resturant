'use client';

import { useState } from 'react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

const initialMenus: MenuItem[] = [
  { id: '1', name: 'ผัดไทย', description: 'ผัดไทยกุ้งสด', price: 120, category: 'อาหารจานหลัก' },
  { id: '2', name: 'ต้มยำกุ้ง', description: 'ต้มยำกุ้งน้ำข้น', price: 180, category: 'อาหารจานหลัก' },
  { id: '3', name: 'ข้าวผัด', description: 'ข้าวผัดกะเทียม', price: 80, category: 'อาหารจานหลัก' },
];

export default function MasterMenuPage() {
  const [menus, setMenus] = useState<MenuItem[]>(initialMenus);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '' });

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => { setModalOpen(false); setForm({ name: '', description: '', price: '', category: '' }); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddMenu = (e: React.FormEvent) => {
    e.preventDefault();
    setMenus([...menus, {
      id: (menus.length + 1).toString(),
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
    }]);
    handleCloseModal();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-blue-900">จัดการเมนูอาหาร</h1>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">เพิ่ม/แก้ไข/ลบเมนูอาหารสำหรับร้านอาหารของคุณ</p>
        <button onClick={handleOpenModal} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium shadow">+ เพิ่มเมนู</button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">ชื่อเมนู</th>
              <th className="text-left py-3 px-4">รายละเอียด</th>
              <th className="text-right py-3 px-4">ราคา</th>
              <th className="text-left py-3 px-4">หมวดหมู่</th>
            </tr>
          </thead>
          <tbody>
            {menus.map(menu => (
              <tr key={menu.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{menu.name}</td>
                <td className="py-3 px-4 text-gray-600">{menu.description}</td>
                <td className="py-3 px-4 text-right text-orange-600 font-bold">฿{menu.price}</td>
                <td className="py-3 px-4">{menu.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal เพิ่มเมนู */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-blue-900">เพิ่มเมนูอาหารใหม่</h2>
            <form onSubmit={handleAddMenu} className="space-y-4">
              <input name="name" value={form.name} onChange={handleChange} required placeholder="ชื่อเมนู" className="w-full px-4 py-2 border rounded" />
              <input name="description" value={form.description} onChange={handleChange} required placeholder="รายละเอียด" className="w-full px-4 py-2 border rounded" />
              <input name="price" value={form.price} onChange={handleChange} required type="number" min="0" placeholder="ราคา" className="w-full px-4 py-2 border rounded" />
              <select name="category" value={form.category} onChange={handleChange} required className="w-full px-4 py-2 border rounded">
                <option value="">เลือกหมวดหมู่</option>
                <option value="อาหารจานหลัก">อาหารจานหลัก</option>
                <option value="ของทานเล่น">ของทานเล่น</option>
                <option value="เครื่องดื่ม">เครื่องดื่ม</option>
                <option value="ของหวาน">ของหวาน</option>
              </select>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">ยกเลิก</button>
                <button type="submit" className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white font-semibold">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
