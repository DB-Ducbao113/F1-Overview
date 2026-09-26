import React, { useState } from 'react';
import { CALENDAR_2026 } from '../../data/championship';
import { GrandPrixRound } from '../../types';
import { t } from '../../i18n/translations';
import { useNavigationStore } from '../../store/useNavigationStore';
import { Calendar, Clock, MapPin, Flag, ChevronDown, ChevronUp, Zap } from 'lucide-react';

export const RaceCalendar: React.FC = () => {
  const { lang } = useNavigationStore();
  const strings = t[lang].championship;
  const [expandedRound, setExpandedRound] = useState<number | null>(15); // Default expand Round 15 (Azerbaijan GP)

  const toggleExpand = (round: number) => {
    setExpandedRound(expandedRound === round ? null : round);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-studio-200">
        <div>
          <h3 className="font-display text-base font-bold uppercase tracking-wider text-studio-900">
            2026 FIA Formula 1 World Championship Calendar
          </h3>
          <p className="text-xs text-studio-500 font-medium">
            22 Global Grands Prix · 6 Sprint Weekends
          </p>
        </div>
        <span className="text-xs font-bold text-f1red">Round 15 Active</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {CALENDAR_2026.map((gp) => {
          const isExpanded = expandedRound === gp.round;
          const isCurrent = gp.status === 'current';

          return (
            <div
              key={gp.round}
              className={`rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-white border-f1red shadow-md ring-1 ring-f1red/20'
                  : 'bg-white border-studio-200 hover:border-studio-300 shadow-xs'
              }`}
            >
              {/* Collapsed Bar */}
              <div
                onClick={() => toggleExpand(gp.round)}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Round number badge */}
                  <div
                    className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center shrink-0 font-bold ${
                      isCurrent
                        ? 'bg-f1red text-white'
                        : gp.status === 'completed'
                        ? 'bg-studio-100 text-studio-600'
                        : 'bg-studio-900 text-white'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-wider">RND</span>
                    <span className="text-sm font-black leading-none">{gp.round}</span>
                  </div>

                  {/* Flag & Name */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base" title={gp.country}>{gp.flag}</span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-studio-500">
                        {gp.country}
                      </span>
                      {gp.hasSprint && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800">
                          Sprint
                        </span>
                      )}
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-f1red/10 text-f1red animate-pulse">
                          Active Weekend
                        </span>
                      )}
                    </div>
                    <h4 className="font-display text-base sm:text-lg font-bold text-studio-950">
                      {gp.name}
                    </h4>
                  </div>
                </div>

                {/* Circuit & Date */}
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <span className="font-bold text-xs text-studio-900 block">{gp.dates}</span>
                    <span className="text-[11px] text-studio-500 truncate max-w-[200px] block">
                      {gp.circuit}
                    </span>
                  </div>

                  <button
                    className="p-1 rounded-full text-studio-400 hover:text-studio-900 transition-colors"
                    aria-label="Expand schedule"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Session Breakdown */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-studio-100 bg-studio-50/50 rounded-b-xl space-y-4 animate-fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-studio-600 pt-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-f1red" /> {gp.circuit}, {gp.location}
                    </span>
                    <span className="font-medium">
                      {gp.laps} Laps · {gp.circuitLengthKm} km · Race: {gp.raceDistanceKm} km
                    </span>
                  </div>

                  {/* Sessions grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {Object.entries(gp.sessions).map(([key, session]) => {
                      if (!session) return null;
                      return (
                        <div
                          key={key}
                          className="p-2.5 rounded-lg bg-white border border-studio-200 shadow-xs space-y-1"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider text-studio-400 block truncate">
                            {session.name}
                          </span>
                          <span className="text-xs font-bold text-studio-900 block">
                            {session.dateStr}
                          </span>
                          <div className="flex items-center justify-between text-[11px] text-studio-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-studio-400" />
                              {session.timeStr}
                            </span>
                            <span
                              className={`text-[9px] font-bold uppercase ${
                                session.status === 'finished'
                                  ? 'text-studio-400'
                                  : session.status === 'live'
                                  ? 'text-f1red animate-pulse'
                                  : 'text-emerald-600'
                              }`}
                            >
                              {session.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
