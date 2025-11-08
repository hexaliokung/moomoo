import React, { useState } from 'react';

function BillingManagement() {
  const [bills, setBills] = useState([
    {
      id: 1,
      tableId: 2,
      items: [
        { name: 'หมูสไลด์', quantity: 2, price: 59 },
        { name: 'เนื้อสไลด์', quantity: 1, price: 79 }
      ],
      status: 'pending', // pending, completed
      timestamp: new Date(),
      total: 197
    }
  ]);

  const completeBill = (billId) => {
    setBills(bills.map(bill => 
      bill.id === billId 
        ? { ...bill, status: 'completed' }
        : bill
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">จัดการบิล</h1>

      <div className="space-y-6">
        {bills.map((bill) => (
          <div
            key={bill.id}
            className={`bg-white rounded-lg shadow-lg p-6 ${
              bill.status === 'pending' ? 'border-l-4 border-red-500' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">โต๊ะที่ {bill.tableId}</h2>
                <p className="text-sm text-gray-500">
                  {bill.timestamp.toLocaleString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                bill.status === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {bill.status === 'pending' ? 'รอชำระเงิน' : 'ชำระเงินแล้ว'}
              </span>
            </div>

            {/* Bill Items */}
            <div className="border rounded-lg mb-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      รายการ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      จำนวน
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      ราคา
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      รวม
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bill.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {item.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right font-semibold">
                      รวมทั้งหมด
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">
                      {bill.total}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {bill.status === 'pending' && (
              <div className="flex justify-end">
                <button
                  onClick={() => completeBill(bill.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  ชำระเงินเรียบร้อย
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BillingManagement;