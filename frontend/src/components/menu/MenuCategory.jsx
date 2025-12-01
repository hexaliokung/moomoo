import React from 'react';
import MenuItemCard from './MenuItemCard';

/**
 * MenuCategory - Display menu items grouped by category
 * @param {String} category - Category name
 * @param {Array} items - Menu items in this category
 * @param {Object} cart - Cart state {itemId: quantity}
 * @param {Function} onAddToCart - Add item to cart callback
 * @param {Function} onRemoveFromCart - Remove item from cart callback
 */
const MenuCategory = ({ category, items, cart = {}, onAddToCart, onRemoveFromCart }) => {
  if (!items || items.length === 0) {
    return null;
  }

  // Get category display name
  const getCategoryName = () => {
    switch (category) {
      case 'Starter Buffet':
        return 'บุฟเฟ่ต์ปกติ';
      case 'Premium Buffet':
        return 'บุฟเฟ่ต์พรีเมียม';
      case 'Special Menu':
        return 'เมนูพิเศษ';
      default:
        return category;
    }
  };

  // Get category description
  const getCategoryDescription = () => {
    switch (category) {
      case 'Starter Buffet':
        return 'รายการอาหารในบุฟเฟ่ต์ปกติ (259 บาท/ท่าน)';
      case 'Premium Buffet':
        return 'รายการอาหารในบุฟเฟ่ต์พรีเมียม (299 บาท/ท่าน)';
      case 'Special Menu':
        return 'เมนูพิเศษ - คิดค่าอาหารแยกจากบุฟเฟ่ต์';
      default:
        return '';
    }
  };

  return (
    <div className="mb-8">
      {/* Category Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          {getCategoryName()}
        </h2>
        <p className="text-sm text-gray-600">{getCategoryDescription()}</p>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <MenuItemCard
            key={item._id}
            item={item}
            quantity={cart[item._id] || 0}
            onAdd={() => onAddToCart(item)}
            onRemove={() => onRemoveFromCart(item._id)}
          />
        ))}
      </div>

      {/* Category Summary */}
      <div className="mt-4 text-sm text-gray-500 text-right">
        {items.length} รายการ
      </div>
    </div>
  );
};

export default MenuCategory;
