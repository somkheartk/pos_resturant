'use client';

import Image from 'next/image';
import { CartItem as CartItemType } from '@/types/menu';
import { useCart } from '@/contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100">
      <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0 relative overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm mb-1">{item.name}</h4>
        <p className="text-orange-500 font-semibold text-sm mb-2">
          ฿{item.price}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center text-sm"
          >
            −
          </button>
          <span className="w-8 text-center text-sm">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-6 h-6 bg-orange-500 hover:bg-orange-600 text-white rounded flex items-center justify-center text-sm"
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={() => removeFromCart(item.id)}
        className="text-red-500 hover:text-red-600 text-sm ml-2"
      >
        ✕
      </button>
    </div>
  );
}
