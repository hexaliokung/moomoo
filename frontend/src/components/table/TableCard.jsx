import React from 'react';
import { Clock, Users, DollarSign } from 'lucide-react';
import { useTableTimer } from '../../hook/useTableTimer';
import { useBilingual } from '../../hook/useBilingual';

/**
 * TableCard Component - Display table status with timer
 * @param {Object} props
 * @param {Object} props.table - Table data
 * @param {Function} props.onOpenTable - Handler for opening table
 * @param {Function} props.onViewBill - Handler for viewing bill
 * @param {Function} props.onCloseTable - Handler for closing table
 */
export const TableCard = ({
  table,
  onOpenTable,
  onViewBill,
  onCloseTable
}) => {
  const { formattedTime, timerColorClass, isOvertime, isExpiringSoon } = useTableTimer(table);
  const { isThai } = useBilingual();

  /**
   * Get status style based on table status
   */
  const getStatusStyle = () => {
    if (isOvertime) return 'border-red-500 bg-red-900/20';
    if (isExpiringSoon) return 'border-yellow-500 bg-yellow-900/10';
    
    const statusMap = {
      Available: 'border-green-600/50 bg-gray-800/40',
      Open: 'border-blue-600/50 bg-gray-800/40',
      Closed: 'border-gray-600/50 bg-gray-800/40'
    };
    return statusMap[table.status] || statusMap.Available;
  };

  /**
   * Get status badge style based on table status
   */
  const getStatusBadge = () => {
    const statusMap = {
      Available: {
        bg: 'bg-green-600',
        text: 'text-white',
        label: isThai ? 'ว่าง' : 'Available'
      },
      Open: {
        bg: 'bg-blue-600',
        text: 'text-white',
        label: isThai ? 'เปิด' : 'Open'
      },
      Closed: {
        bg: 'bg-gray-600',
        text: 'text-white',
        label: isThai ? 'ปิด' : 'Closed'
      }
    };

    const status = statusMap[table.status] || statusMap.Available;

    return (
      <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${status.bg} ${status.text}`}>
        {status.label}
      </span>
    );
  };

  /**
   * Get buffet tier display
   */
  const getBuffetTierDisplay = () => {
    if (table.buffetTier === 'None') return null;

    const tierMap = {
      Starter: { label: isThai ? 'ธรรมดา' : 'Starter', price: '259฿', color: 'text-gray-300' },
      Premium: { label: isThai ? 'พรีเมียม' : 'Premium', price: '299฿', color: 'text-yellow-400' }
    };

    const tier = tierMap[table.buffetTier];
    if (!tier) return null;

    return (
      <span className={`text-sm ${tier.color}`}>
        {tier.label} ({tier.price})
      </span>
    );
  };

  return (
    <div className={`
      rounded-xl p-4 md:p-5 border-2 transition-all duration-300 hover:shadow-xl
      ${getStatusStyle()}
    `}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3 md:mb-4">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-white">
            {isThai ? 'โต๊ะ' : 'Table'} {table.tableNumber}
          </h3>
          <div className="mt-1.5">
            {getStatusBadge()}
          </div>
        </div>
        
        {/* Timer Display */}
        {table.status === 'Open' && (
          <div className="flex items-center gap-1.5 bg-gray-900/50 px-3 py-1.5 rounded-lg">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className={`text-base md:text-lg font-mono font-bold ${timerColorClass}`}>
              {formattedTime}
            </span>
          </div>
        )}
      </div>

      {/* Table Info */}
      {table.status === 'Open' && (
        <div className="space-y-2 mb-4 bg-gray-900/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-300">
              <Users className="w-4 h-4" />
              <span className="text-sm md:text-base">
                {table.customerCount} {isThai ? 'ท่าน' : 'guests'}
              </span>
            </div>
            {getBuffetTierDisplay()}
          </div>

          {table.currentBill && (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <DollarSign className="w-4 h-4" />
              <span>{isThai ? 'มีบิลค้าง' : 'Has pending bill'}</span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {table.status === 'Available' && (
          <button
            onClick={() => onOpenTable(table.tableNumber)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 md:py-2 rounded-lg font-medium transition-colors text-sm md:text-base"
          >
            {isThai ? 'เปิดโต๊ะ' : 'Open Table'}
          </button>
        )}

        {table.status === 'Open' && (
          <>
            <button
              onClick={() => onViewBill(table.tableNumber)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 md:py-2 rounded-lg font-medium transition-colors text-sm md:text-base"
            >
              {isThai ? 'ดูบิล' : 'Bill'}
            </button>
            <button
              onClick={() => onCloseTable(table.tableNumber)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2.5 md:py-2 rounded-lg font-medium transition-colors text-sm md:text-base"
            >
              {isThai ? 'ชำระเงิน' : 'Checkout'}
            </button>
          </>
        )}
      </div>

      {/* Overtime Warning */}
      {isOvertime && (
        <div className="mt-3 bg-red-900/40 border border-red-500/50 rounded-lg p-2.5">
          <p className="text-xs md:text-sm text-red-400 font-medium text-center">
            ⚠️ {isThai ? 'เกินเวลา! กรุณาตรวจสอบ' : 'Overtime! Please check'}
          </p>
        </div>
      )}

      {/* Expiring Soon Warning */}
      {isExpiringSoon && !isOvertime && (
        <div className="mt-3 bg-yellow-900/40 border border-yellow-500/50 rounded-lg p-2.5">
          <p className="text-xs md:text-sm text-yellow-400 font-medium text-center">
            ⏰ {isThai ? 'ใกล้หมดเวลา' : 'Time expiring soon'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TableCard;
