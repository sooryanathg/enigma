import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { swapQuestions } from '../lib/firestoreService';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const SwapQuestions: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [dayA, setDayA] = useState<number | ''>('' as any);
  const [dayB, setDayB] = useState<number | ''>('' as any);
  const [loading, setLoading] = useState(false);

  const handleSwap = async () => {
    if (dayA === '' || dayB === '') {
      toast.error('Please enter both day numbers');
      return;
    }
    const a = Number(dayA);
    const b = Number(dayB);
    if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < 1 || a > 30 || b > 30) {
      toast.error('Days must be integers between 1 and 30');
      return;
    }
    if (a === b) {
      toast.error('Please choose two different days to swap');
      return;
    }

    setLoading(true);
    try {
        await swapQuestions(a, b);
toast.success(`Swapped day ${a} and day ${b}`);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to swap questions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-white mb-4">Swap Questions (Image & Answer)</h3>

        <p className="text-slate-400 text-sm mb-4">Enter two day numbers to swap their question image and answer. Day and unlock date will remain unchanged.</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-sm text-slate-300">Day A</label>
            <input
              type="number"
              min={1}
              max={30}
              value={dayA as any}
              onChange={(e) => setDayA(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Day B</label>
            <input
              type="number"
              min={1}
              max={30}
              value={dayB as any}
              onChange={(e) => setDayB(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSwap}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            disabled={loading}
          >
            {loading ? 'Swapping...' : 'Swap'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapQuestions;
