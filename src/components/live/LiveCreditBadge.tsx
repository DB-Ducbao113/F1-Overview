import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useNavigationStore } from '../../store/useNavigationStore';

interface LiveCreditBadgeProps {
  isReplay?: boolean;
  sampledAt?: string;
  isCalibrating?: boolean;
}

export const LiveCreditBadge: React.FC<LiveCreditBadgeProps> = ({
  isReplay = false,
  sampledAt,
  isCalibrating = false,
}) => {
  const { lang } = useNavigationStore();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-studio-400 bg-studio-950/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 select-none">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isCalibrating
                ? 'bg-amber-400'
                : isReplay
                ? 'bg-cyan-400'
                : 'bg-emerald-400'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isCalibrating
                ? 'bg-amber-500'
                : isReplay
                ? 'bg-cyan-500'
                : 'bg-emerald-500'
            }`}
          />
        </span>
        <span className="font-semibold text-studio-300">
          {isCalibrating
            ? lang === 'vi'
              ? 'Đang hiệu chuẩn đường đua'
              : 'Calibrating circuit bounds'
            : isReplay
            ? lang === 'vi'
              ? 'Chế độ Replay (Lưu trữ thực tế)'
              : 'Replay Mode (Historical Archive)'
            : lang === 'vi'
              ? 'Live Telemetry Stream'
              : 'Live Telemetry Stream'}
        </span>
        <span className="text-studio-600">·</span>
        <span className="text-studio-400">
          {lang === 'vi' ? 'Độ trễ ~3s' : 'Latency ~3s'}
        </span>
        {sampledAt && (
          <span className="hidden sm:inline text-studio-500">
            ({new Date(sampledAt).toLocaleTimeString()})
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <a
          href="https://openf1.org"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-studio-300 hover:text-white font-medium transition-colors hover:underline"
        >
          <span>Data by OpenF1</span>
          <ExternalLink className="w-3 h-3 text-studio-500" />
        </a>
      </div>
    </div>
  );
};
