'use client';

import Image from 'next/image';
import { MenuItem } from '@/types/menu';
import { useCart } from '@/contexts/CartContext';

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-200 relative">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-orange-500 font-semibold text-lg">
            ฿{item.price}
          </span>
          <button
            onClick={() => addToCart(item)}
            className="bg-orange-500 hover:bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
