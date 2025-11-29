'use client';

import { useState } from 'react';
import { useShift } from '@/contexts/ShiftContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePermissions } from '@/contexts/PermissionContext';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShiftModal({ isOpen, onClose }: ShiftModalProps) {
  const { currentShift, isShiftOpen, openShift, closeShift } = useShift();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { canCurrentAccess } = usePermissions();
  const [startingCash, setStartingCash] = useState('');
  const [endingCash, setEndingCash] = useState('');

  if (!isOpen) return null;

  const handleOpenShift = () => {
    if (!canCurrentAccess('shift.open')) {
      alert(t('คุณไม่มีสิทธิ์เปิดกะ', 'You are not authorized to open shift'));
      return;
    }
    if (!startingCash || parseFloat(startingCash) < 0) {
      alert(t('กรุณาระบุเงินทอนเริ่มต้น', 'Please enter starting cash'));
      return;
    }
    openShift(parseFloat(startingCash), user?.name || 'Unknown', user?.id || 'anonymous');
    setStartingCash('');
    onClose();
  };

  const handleCloseShift = () => {
    if (!canCurrentAccess('shift.close')) {
      alert(t('คุณไม่มีสิทธิ์ปิดกะ', 'You are not authorized to close shift'));
      return;
    }
    if (!endingCash || parseFloat(endingCash) < 0) {
      alert(t('กรุณานับเงินปลายกะ', 'Please count ending cash'));
      return;
    }
    const result = closeShift(parseFloat(endingCash));
    const msg = `${t('ปิดกะสำเร็จ', 'Shift closed successfully')}\n\n` +
      `${t('เงินที่ควรมี', 'Expected')}: ฿${result.expected.toFixed(2)}\n` +
      `${t('เงินจริง', 'Actual')}: ฿${result.actual.toFixed(2)}\n` +
      `${t('ผลต่าง', 'Difference')}: ฿${result.difference.toFixed(2)}`;
    alert(msg);
    setEndingCash('');
    onClose();
  };

  const formatDateTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('th-TH');
    } catch {
      return iso;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[60]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-blue-50">
            <h2 className="text-xl font-bold text-blue-900">
              {isShiftOpen ? t('ปิดกะ', 'Close Shift') : t('เปิดกะ', 'Open Shift')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {!isShiftOpen ? (
              // Open Shift Form
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('พนักงาน', 'Staff')}
                  </label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('เวลา', 'Time')}
                  </label>
                  <input
                    type="text"
                    value={new Date().toLocaleString('th-TH')}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('เงินทอนเริ่มต้น (฿)', 'Starting Cash (฿)')} *
                  </label>
                  <input
                    type="number"
                    value={startingCash}
                    onChange={(e) => setStartingCash(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleOpenShift}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-lg transition-colors font-bold text-lg shadow-md"
                >
                  {t('เปิดกะ', 'Open Shift')}
                </button>
              </div>
            ) : (
              // Close Shift Form
              <div className="space-y-4">
                {/* Shift Summary */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">{t('พนักงาน', 'Staff')}</div>
                    <div className="font-bold text-gray-900 text-sm">{currentShift?.userName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">{t('เวลาเปิด', 'Opened')}</div>
                    <div className="font-bold text-gray-900 text-sm">{formatDateTime(currentShift?.openedAt || '')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">{t('เงินทอนเริ่มต้น', 'Starting Cash')}</div>
                    <div className="font-bold text-green-600 text-lg">฿{currentShift?.startingCash?.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">{t('ยอดขาย', 'Sales')}</div>
                    <div className="font-bold text-blue-600 text-lg">฿{currentShift?.sales?.toFixed(2)}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-gray-600 mb-1">{t('เงินที่ควรมี', 'Expected Cash')}</div>
                    <div className="font-bold text-orange-600 text-2xl">
                      ฿{((currentShift?.startingCash || 0) + (currentShift?.sales || 0)).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('นับเงินปลายกะ (฿)', 'Ending Cash Count (฿)')} *
                  </label>
                  <input
                    type="number"
                    value={endingCash}
                    onChange={(e) => setEndingCash(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleCloseShift}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-lg transition-colors font-bold text-lg shadow-md"
                >
                  {t('ปิดกะ', 'Close Shift')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
