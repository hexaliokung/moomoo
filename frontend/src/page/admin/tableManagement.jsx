import React, { useState } from 'react';

function TableManagement() {
  const BUFFET_PRICES = {
    normal: 259,
    premium: 299
  };

  const VAT_RATE = 0.07; // 7% VAT

  const calculateVAT = (subtotal) => {
    return Math.round(subtotal * VAT_RATE);
  };

  const [tables, setTables] = useState([
    { 
      id: 1, 
      timeLeft: '01:30:00', 
      status: 'active',
      people: 4,
      buffetType: 'normal',
      buffetTotal: 259 * 4,
      specialOrderTotal: 590,
      orders: {
        special: ['เนื้อวากิว A5 x1 (590฿)'],
        buffet: ['หมูสไลด์ x2 (ฟรี)', 'เนื้อสไลด์ x1 (ฟรี)', 'ข้าว x4 (ฟรี)']
      }
    },
    { 
      id: 2, 
      timeLeft: '00:45:30', 
      status: 'requesting_bill',
      people: 2,
      buffetType: 'premium',
      buffetTotal: 299 * 2,
      specialOrderTotal: 0,
      orders: {
        special: [],
        buffet: ['หมูสไลด์ x1 (ฟรี)', 'เนื้อสไลด์ x1 (ฟรี)', 'ข้าว x2 (ฟรี)']
      }
    },
    { 
      id: 3, 
      timeLeft: '02:00:00', 
      status: 'active',
      people: 6,
      buffetType: 'premium',
      buffetTotal: 299 * 6,
      specialOrderTotal: 1180,
      orders: {
        special: ['เนื้อวากิว A5 x2 (1,180฿)'],
        buffet: ['หมูสไลด์ x3 (ฟรี)', 'เนื้อสไลด์ x2 (ฟรี)', 'ข้าว x6 (ฟรี)']
      }
    },
  ]);

  const [newTable, setNewTable] = useState({
    tableNumber: '',
    people: '',
    buffetType: 'normal',
    showForm: false
  });

  const handleRequestBill = (tableId) => {
    setTables(tables.map(table => 
      table.id === tableId 
        ? { ...table, status: 'requesting_bill' }
        : table
    ));
  };

  const handleRemoveTable = (tableId) => {
    setTables(tables.filter(table => table.id !== tableId));
  };

  const handleAddTable = (e) => {
    e.preventDefault();
    if (newTable.tableNumber && newTable.people) {
      const tableId = parseInt(newTable.tableNumber);
      // Check if table number already exists
      if (tables.some(t => t.id === tableId)) {
        alert('หมายเลขโต๊ะนี้ถูกใช้งานแล้ว');
        return;
      }
      
      const buffetPrice = BUFFET_PRICES[newTable.buffetType];
      const people = parseInt(newTable.people);
      
      setTables([...tables, {
        id: tableId,
        timeLeft: '02:00:00',
        status: 'active',
        people: people,
        buffetType: newTable.buffetType,
        buffetTotal: buffetPrice * people,
        specialOrderTotal: 0,
        orders: {
          special: [],
          buffet: []
        }
      }]);
      setNewTable({ tableNumber: '', people: '', buffetType: 'normal', showForm: false });
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'requesting_bill':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'requesting_bill':
        return 'รอเช็คบิล';
      case 'active':
        return 'กำลังใช้งาน';
      default:
        return status;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(price);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">จัดการโต๊ะ</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className="bg-white rounded-lg shadow p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">โต๊ะที่ {table.id}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(table.status)}`}>
                {getStatusText(table.status)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>จำนวน {table.people} คน</span>
                <span>{table.buffetType === 'premium' ? 'บุฟเฟ่ต์พรีเมียม' : 'บุฟเฟ่ต์ธรรมดา'}</span>
              </div>
              
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>ค่าบุฟเฟ่ต์ ({formatPrice(BUFFET_PRICES[table.buffetType])} × {table.people})</span>
                  <span>{formatPrice(table.buffetTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>เมนูพิเศษ</span>
                  <span>{formatPrice(table.specialOrderTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 border-t mt-1 pt-1">
                  <span>ราคาก่อน VAT</span>
                  <span>{formatPrice(table.buffetTotal + table.specialOrderTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>VAT 7%</span>
                  <span>{formatPrice(calculateVAT(table.buffetTotal + table.specialOrderTotal))}</span>
                </div>
                <div className="flex justify-between font-semibold text-base border-t mt-1 pt-1">
                  <span>รวมทั้งหมด (รวม VAT)</span>
                  <span className="text-red-600">
                    {formatPrice(table.buffetTotal + table.specialOrderTotal + calculateVAT(table.buffetTotal + table.specialOrderTotal))}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded p-2 text-sm">
              <div>
                <div className="font-semibold mb-1">รายการบุฟเฟ่ต์ (ไม่คิดเงินเพิ่ม):</div>
                {table.orders.buffet.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-600">
                    {table.orders.buffet.map((order, index) => (
                      <li key={index}>
                        {order}
                        <span className="text-xs text-green-600 ml-1">(ฟรี)</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">ยังไม่มีรายการอาหาร</p>
                )}
              </div>
              
              {table.orders.special.length > 0 && (
                <div className="mt-2">
                  <div className="font-semibold mb-1">รายการพิเศษ (คิดเงินเพิ่ม):</div>
                  <ul className="list-disc list-inside text-gray-600">
                    {table.orders.special.map((order, index) => (
                      <li key={index}>
                        <span className="text-red-600">{order}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="text-xl font-mono text-center py-2">
              {table.timeLeft}
            </div>

            <div className="flex space-x-2">
              {table.status === 'active' && (
                <button
                  onClick={() => handleRequestBill(table.id)}
                  className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                >
                  เรียกเช็คบิล
                </button>
              )}
              {table.status === 'requesting_bill' && (
                <button
                  onClick={() => handleRemoveTable(table.id)}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  ปิดโต๊ะ
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add New Table Button/Form */}
        {newTable.showForm ? (
          <form
            onSubmit={handleAddTable}
            className="bg-white rounded-lg shadow p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold">เพิ่มโต๊ะใหม่</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  หมายเลขโต๊ะ
                </label>
                <input
                  type="number"
                  value={newTable.tableNumber}
                  onChange={(e) => setNewTable({...newTable, tableNumber: e.target.value})}
                  min="1"
                  required
                  className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  จำนวนลูกค้า
                </label>
                <input
                  type="number"
                  value={newTable.people}
                  onChange={(e) => setNewTable({...newTable, people: e.target.value})}
                  min="1"
                  required
                  className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ประเภทบุฟเฟ่ต์
                </label>
                <select
                  value={newTable.buffetType}
                  onChange={(e) => setNewTable({...newTable, buffetType: e.target.value})}
                  className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                >
                  <option value="normal">ธรรมดา (฿259)</option>
                  <option value="premium">พรีเมียม (฿299)</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                เพิ่มโต๊ะ
              </button>
              <button
                type="button"
                onClick={() => setNewTable({tableNumber: '', people: '', buffetType: 'normal', showForm: false})}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setNewTable({...newTable, showForm: true})}
            className="bg-white rounded-lg shadow p-6 border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-colors"
          >
            <span className="text-lg">+ เพิ่มโต๊ะใหม่</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default TableManagement;