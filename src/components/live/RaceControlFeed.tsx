import React from 'react';
import { FlagColor, LiveRaceControlMessage } from '../../lib/live/openf1-types';
import { useNavigationStore } from '../../store/useNavigationStore';
import { Flag, Bell } from 'lucide-react';

interface RaceControlFeedProps {
  activeFlag: FlagColor;
  messages: LiveRaceControlMessage[];
}

const FLAG_CONFIG: Record<FlagColor, { label: string; bg: string; text: string; border: string }> =
  {
    GREEN: {
      label: 'GREEN FLAG · TRACK CLEAR',
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
    },
    YELLOW: {
      label: 'YELLOW FLAG · CAUTION',
      bg: 'bg-yellow-500/15',
      text: 'text-yellow-400',
      border: 'border-yellow-500/40',
    },
    DOUBLE_YELLOW: {
      label: 'DOUBLE YELLOW FLAG · SLOW DOWN',
      bg: 'bg-yellow-500/25',
      text: 'text-yellow-300',
      border: 'border-yellow-500/60',
    },
    RED: {
      label: 'RED FLAG · SESSION SUSPENDED',
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      border: 'border-red-500/50',
    },
    SAFETY_CAR: {
      label: 'SAFETY CAR DEPLOYED',
      bg: 'bg-amber-500/20',
      text: 'text-amber-400',
      border: 'border-amber-500/50',
    },
    VSC: {
      label: 'VIRTUAL SAFETY CAR (VSC)',
      bg: 'bg-amber-500/20',
      text: 'text-amber-400',
      border: 'border-amber-500/50',
    },
    CLEAR: {
      label: 'TRACK STATUS: NORMAL',
      bg: 'bg-white/5',
      text: 'text-studio-300',
      border: 'border-white/10',
    },
  };

export const RaceControlFeed: React.FC<RaceControlFeedProps> = ({ activeFlag, messages }) => {
  const { lang } = useNavigationStore();
  const flagInfo = FLAG_CONFIG[activeFlag] || FLAG_CONFIG.CLEAR;

  return (
    <div className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col select-none">
      {/* Active Flag Status Bar */}
      <div
        className={`px-4 py-2.5 border-b flex items-center justify-between transition-colors ${flagInfo.bg} ${flagInfo.border}`}
      >
        <div className="flex items-center gap-2">
          <Flag className={`w-4 h-4 ${flagInfo.text}`} />
          <span
            className={`font-mono font-black text-xs uppercase tracking-wider ${flagInfo.text}`}
          >
            {flagInfo.label}
          </span>
        </div>
        <span className="text-[10px] text-studio-400 font-mono">FIA RACE DIRECTION</span>
      </div>

      {/* Messages List */}
      <div className="p-3 max-h-[180px] overflow-y-auto space-y-2">
        {messages.length === 0 ? (
          <div className="text-center py-6 text-xs text-studio-500">
            {lang === 'vi' ? 'Chưa có thông điệp điều hành mới' : 'No recent race control messages'}
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-2 rounded-lg bg-white/5 border border-white/5 text-xs text-studio-200"
            >
              <Bell className="w-3.5 h-3.5 text-f1red shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between text-[10px] text-studio-400 mb-0.5 font-mono">
                  <span>{msg.category}</span>
                  {msg.sector && <span>Sector {msg.sector}</span>}
                </div>
                <p className="text-white text-xs leading-relaxed">{msg.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
