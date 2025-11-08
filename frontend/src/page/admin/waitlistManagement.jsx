import React, { useState } from 'react';

function WaitlistManagement() {
  const [waitlist, setWaitlist] = useState([
    { id: 1, name: 'คุณสมชาย', size: 4, phone: '081-234-5678', timestamp: new Date() },
    { id: 2, name: 'คุณสมหญิง', size: 2, phone: '089-876-5432', timestamp: new Date() }
  ]);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    size: '',
    phone: ''
  });

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (newCustomer.name && newCustomer.size) {
      setWaitlist([
        ...waitlist,
        {
          id: Date.now(),
          ...newCustomer,
          timestamp: new Date()
        }
      ]);
      setNewCustomer({ name: '', size: '', phone: '' });
    }
  };

  const removeFromWaitlist = (id) => {
    setWaitlist(waitlist.filter(customer => customer.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">จัดการคิวรอ</h1>

      {/* Add Customer Form */}
      <form onSubmit={handleAddCustomer} className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ชื่อลูกค้า</label>
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">จำนวนคน</label>
            <input
              type="number"
              value={newCustomer.size}
              onChange={(e) => setNewCustomer({...newCustomer, size: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">เบอร์โทร</label>
            <input
              type="tel"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              placeholder="Optional"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          เพิ่มคิว
        </button>
      </form>

      {/* Waitlist */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ลำดับ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ชื่อ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                จำนวนคน
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                เบอร์โทร
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                เวลา
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {waitlist.map((customer, index) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {customer.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {customer.size} คน
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {customer.phone || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {customer.timestamp.toLocaleTimeString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => removeFromWaitlist(customer.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    ลบคิว
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

export default WaitlistManagement;