import React from 'react';
import { Clock, Users, DollarSign, CreditCard, Eye, Play, Key } from 'lucide-react';
import { useTableTimer } from '../../hook/useTableTimer';

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
  onCloseTable,
  onViewPIN
}) => {
  const { formattedTime, timerColorClass, isOvertime, isExpiringSoon } = useTableTimer(table);

  /**
   * Get status style based on table status
   */
  const getStatusStyle = () => {
    if (isOvertime) return 'border-red-500/70 bg-gradient-to-br from-red-900/30 to-red-950/30 shadow-red-900/20';
    if (isExpiringSoon) return 'border-yellow-500/70 bg-gradient-to-br from-yellow-900/20 to-yellow-950/20 shadow-yellow-900/20';
    
    const statusMap = {
      Available: 'border-green-600/40 bg-gradient-to-br from-gray-800/60 to-gray-900/60 hover:border-green-500/60 hover:shadow-green-900/20',
      Open: 'border-blue-600/40 bg-gradient-to-br from-blue-900/20 to-blue-950/20 hover:border-blue-500/60 hover:shadow-blue-900/20',
      Closed: 'border-gray-600/40 bg-gradient-to-br from-gray-800/60 to-gray-900/60'
    };
    return statusMap[table.status] || statusMap.Available;
  };

  /**
   * Get buffet tier display
   */
  const getBuffetTierDisplay = () => {
    if (table.buffetTier === 'None') return null;

    const tierMap = {
      Starter: { 
        label: 'ธรรมดา', 
        price: '259฿', 
        color: 'text-gray-300',
        bg: 'bg-gray-700/50',
        border: 'border-gray-600/50'
      },
      Premium: { 
        label: 'พรีเมียม', 
        price: '299฿', 
        color: 'text-yellow-400',
        bg: 'bg-yellow-900/30',
        border: 'border-yellow-600/30'
      }
    };

    const tier = tierMap[table.buffetTier];
    if (!tier) return null;

    return (
      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${tier.bg} ${tier.color} border ${tier.border}`}>
        {table.buffetTier === 'Premium' && <span>⭐</span>}
        {tier.label}
      </span>
    );
  };

  return (
    <div className={`
      group relative rounded-xl p-3 md:p-4 border-2 transition-all duration-300 
      hover:shadow-lg backdrop-blur-sm h-full flex flex-col min-h-[180px] md:min-h-[200px]
      ${getStatusStyle()}
    `}>
      {/* Header */}
      <div className="relative flex justify-between items-start gap-2 mb-2 md:mb-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <h3 className="text-xl md:text-2xl font-bold text-white leading-none">
            โต๊ะ {table.tableNumber}
          </h3>
        </div>
        
        {/* Timer Display */}
        {table.status === 'Open' && (
          <div className={`
            shrink-0 flex items-center bg-gray-900/80 px-1.5 md:px-2 py-1 md:py-1.5 rounded-lg border
            ${isOvertime ? 'border-red-500/50' : isExpiringSoon ? 'border-yellow-500/50' : 'border-gray-700/50'}
          `}>
            <Clock className={`w-3 h-3 shrink-0 ${isOvertime ? 'text-red-400' : isExpiringSoon ? 'text-yellow-400' : 'text-gray-400'}`} />
            <span className={`text-[10px] md:text-sm font-mono font-bold ml-1 whitespace-nowrap ${timerColorClass}`}>
              {formattedTime}
            </span>
          </div>
        )}
      </div>

      {/* Content Area - Flex grow to push buttons to bottom */}
      <div className="flex-1">
        {/* Table Info for Open Tables */}
        {table.status === 'Open' && (
          <div className="mb-2 md:mb-3">
            {/* Customer & Tier Info */}
            <div className="flex items-center justify-between bg-gray-900/50 rounded-lg p-2 md:p-2.5 border border-gray-700/30">
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-6 h-6 md:w-7 md:h-7 bg-blue-600/20 rounded flex items-center justify-center">
                  <Users className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-400" />
                </div>
                <div>
                  <span className="text-white font-semibold text-xs md:text-sm">{table.customerCount}</span>
                  <span className="text-gray-400 text-[10px] md:text-xs ml-0.5 md:ml-1">ท่าน</span>
                </div>
              </div>
              {getBuffetTierDisplay()}
            </div>
          </div>
        )}

        {/* Empty state for Available tables */}
        {table.status === 'Available' && (
          <div className="py-2 md:py-4 flex flex-col items-center justify-center text-gray-500">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-800/50 rounded-full flex items-center justify-center mb-1 md:mb-1.5 border border-dashed border-gray-600">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </div>
            <span className="text-[10px] md:text-xs">พร้อมรับลูกค้า</span>
          </div>
        )}
      </div>

      {/* Action Buttons - Always at bottom */}
      <div className="grid grid-cols-3 gap-1.5 md:gap-2 mt-auto">
        {table.status === 'Available' && (
          <button
            onClick={() => onOpenTable(table.tableNumber)}
            className="col-span-3 bg-green-600 hover:bg-green-500 text-white px-2 md:px-3 py-2 md:py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1 md:gap-1.5 text-xs md:text-sm"
          >
            <Play className="w-3.5 h-3.5 md:w-4 md:h-4" />
            เปิดโต๊ะ
          </button>
        )}

        {table.status === 'Open' && (
          <>
            <button
              onClick={() => onViewPIN && onViewPIN(table.tableNumber)}
              className="bg-gray-700 hover:bg-gray-600 text-amber-400 py-2 md:py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-0.5 md:gap-1 text-xs md:text-sm border border-gray-600"
              title="ดูรหัส PIN"
            >
              <Key className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden md:inline">รหัส</span>
            </button>
            <button
              onClick={() => onViewBill(table.tableNumber)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white py-2 md:py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-0.5 md:gap-1 text-xs md:text-sm"
            >
              <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">บิล</span>
            </button>
            <button
              onClick={() => onCloseTable(table.tableNumber)}
              className="bg-red-600 hover:bg-red-500 text-white py-2 md:py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-0.5 md:gap-1 text-xs md:text-sm"
            >
              <CreditCard className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">จ่าย</span>
            </button>
          </>
        )}
      </div>

      {/* Warnings */}
      {isOvertime && (
        <div className="mt-3 bg-red-900/50 border border-red-500/50 rounded-lg p-2">
          <p className="text-xs text-red-300 font-medium text-center">
            ⚠️ เกินเวลา!
          </p>
        </div>
      )}

      {isExpiringSoon && !isOvertime && (
        <div className="mt-3 bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-2">
          <p className="text-xs text-yellow-300 font-medium text-center">
            ⏰ ใกล้หมดเวลา
          </p>
        </div>
      )}
    </div>
  );
};

export default TableCard;
