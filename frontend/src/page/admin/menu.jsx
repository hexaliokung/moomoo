import React, { useState } from 'react';

function MenuManagement() {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'หมูสไลด์', price: 0, type: 'normal' },
    { id: 2, name: 'เนื้อวากิว A5', price: 590, type: 'special' },
    { id: 3, name: 'เนื้อสไลด์', price: 0, type: 'normal' },
    { id: 4, name: 'ข้าว', price: 0, type: 'normal' },
  ]);

  const [newItem, setNewItem] = useState({ name: '', price: '', type: 'normal' });

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.name && (newItem.type === 'normal' || (newItem.type === 'special' && newItem.price))) {
      setMenuItems([
        ...menuItems,
        {
          id: Date.now(),
          name: newItem.name,
          price: newItem.type === 'normal' ? 0 : parseFloat(newItem.price),
          type: newItem.type
        }
      ]);
      setNewItem({ name: '', price: '', type: 'normal' });
    }
  };

  const handleDeleteItem = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">จัดการเมนูอาหาร</h1>

      {/* Add Menu Form */}
      <form onSubmit={handleAddItem} className="mb-8 p-4 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ประเภท</label>
            <select
              value={newItem.type}
              onChange={(e) => setNewItem({...newItem, type: e.target.value, price: e.target.value === 'normal' ? 0 : ''})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            >
              <option value="normal">เมนูปกติ (ฟรี)</option>
              <option value="special">เมนูพิเศษ (คิดเงินเพิ่ม)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ชื่อเมนู</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>
          {newItem.type === 'special' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">ราคา</label>
              <input
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                required
                min="1"
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          เพิ่มเมนู
        </button>
      </form>

      {/* Menu List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ชื่อเมนู
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ราคา
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ประเภท
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.type === 'special' ? (
                    <span className="text-red-600">{item.price} บาท</span>
                  ) : (
                    <span className="text-green-600">ฟรี</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.type === 'special' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.type === 'special' ? 'เมนูพิเศษ (คิดเงินเพิ่ม)' : 'เมนูปกติ (ฟรี)'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MenuManagement;