import { MenuItem } from '@/types/menu';

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'ผัดไทย',
    description: 'ผัดไทยกุ้งสด',
    price: 120,
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=400&fit=crop',
    category: 'ทั้งหมด',
  },
  {
    id: '2',
    name: 'แกงเขียวหวาน',
    description: 'แกงเขียวหวานไก่',
    price: 150,
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=400&fit=crop',
    category: 'ทั้งหมด',
  },
  {
    id: '3',
    name: 'ต้มยำกุ้ง',
    description: 'ต้มยำกุ้งน้ำข้น',
    price: 180,
    image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&h=400&fit=crop',
    category: 'ทั้งหมด',
  },
  {
    id: '4',
    name: 'ข้าวผัด',
    description: 'ข้าวผัดกะเทียม',
    price: 80,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop',
    category: 'ทั้งหมด',
  },
  {
    id: '5',
    name: 'ส้มตำ',
    description: 'ส้มตำปูปลรา',
    price: 60,
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=400&fit=crop',
    category: 'ทั้งหมด',
  },
  {
    id: '6',
    name: 'ปอเปี๊ยะทอด',
    description: 'ปอเปี๊ยะทอดกรอบ',
    price: 70,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=400&fit=crop',
    category: 'ทั้งหมด',
  },
  {
    id: '7',
    name: 'ผาเนิน',
    description: 'ผาเนินหมู',
    price: 40,
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=400&fit=crop&sat=-50',
    category: 'ทั้งหมด',
  },
  {
    id: '8',
    name: 'ข้าวเหนียวมะม่วง',
    description: 'ข้าวเหนียวมะม่วงน้ำดอกไม้',
    price: 90,
    image: 'https://images.unsplash.com/photo-1553452118-621a4f359332?w=400&h=400&fit=crop',
    category: 'ทั้งหมด',
  },
];

export const categories = [
  'ทั้งหมด',
  'อาหารจานหลัก',
  'ของทานเล่น',
  'เครื่องดื่ม',
  'ของหวาน',
];
