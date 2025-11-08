import React, { useState } from 'react';

function OrderQueue() {
  const [orders, setOrders] = useState({
    normal: [
      { id: 1, table: 1, items: ['หมูสไลด์ x2', 'ผักบุ้ง x1'], timestamp: new Date() },
      { id: 2, table: 3, items: ['หมูสไลด์ x1'], timestamp: new Date() }
    ],
    special: [
      { id: 3, table: 2, items: ['เนื้อสไลด์ x2'], timestamp: new Date() }
    ]
  });

  const completeOrder = (queueType, orderId) => {
    setOrders(prev => ({
      ...prev,
      [queueType]: prev[queueType].filter(order => order.id !== orderId)
    }));
  };

  const QueueSection = ({ title, orders, type }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">ไม่มีออเดอร์ในคิว</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">โต๊ะที่ {order.table}</div>
                <div className="text-sm text-gray-600 space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index}>{item}</div>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {order.timestamp.toLocaleTimeString()}
                </div>
              </div>
              <button
                onClick={() => completeOrder(type, order.id)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                เสร็จสิ้น
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">จัดการออเดอร์</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <QueueSection 
          title="คิวเมนูปกติ" 
          orders={orders.normal}
          type="normal"
        />
        <QueueSection 
          title="คิวเมนูพิเศษ" 
          orders={orders.special}
          type="special"
        />
      </div>
    </div>
  );
}

export default OrderQueue;