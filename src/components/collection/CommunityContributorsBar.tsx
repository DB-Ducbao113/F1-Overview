import React from 'react';
import { useCollectionStore } from '../../store/useCollectionStore';
import { Users, Award, Camera, X } from 'lucide-react';

interface CommunityContributorsBarProps {
  onOpenUpload: () => void;
  activeContributor: string | null;
  onSelectContributor: (contributor: string | null) => void;
}

export const CommunityContributorsBar: React.FC<CommunityContributorsBarProps> = ({
  onOpenUpload,
  activeContributor,
  onSelectContributor,
}) => {
  const { getContributors, items } = useCollectionStore();
  const contributors = getContributors();
  const communityEnabled = import.meta.env.VITE_ENABLE_COMMUNITY === 'true';

  return (
    <div className="bg-gradient-to-r from-studio-950 via-studio-900 to-studio-950 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3.5 mb-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-f1red/20 border border-f1red/40 flex items-center justify-center text-f1red">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-white">F1 Gallery</h4>
              <span className="text-[10px] font-mono bg-white/10 text-studio-300 px-2 py-0.5 rounded-full border border-white/10">
                {items.length} hình ảnh
              </span>
            </div>
            <p className="text-[11px] text-studio-400">
              Bộ sưu tập đang được rà soát nguồn và quyền sử dụng
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap sm:flex-nowrap">
          {/* Upload Button */}
          {communityEnabled && (
            <button
              onClick={onOpenUpload}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-f1red hover:bg-f1red/90 text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-f1red/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Đóng Góp Ảnh</span>
            </button>
          )}
        </div>
      </div>

      {contributors.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-studio-400 shrink-0 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Top Contributors:
          </span>

          {/* All Filter Reset */}
          <button
            onClick={() => onSelectContributor(null)}
            className={`shrink-0 text-xs px-3 py-1 rounded-xl font-bold transition-all border ${
              activeContributor === null
                ? 'bg-white text-black border-white shadow-sm'
                : 'bg-white/5 text-studio-400 border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            Tất Cả
          </button>

          {contributors.map((contrib) => {
            const isSelected = activeContributor === contrib.username;
            return (
              <button
                key={contrib.username}
                onClick={() => onSelectContributor(isSelected ? null : contrib.username)}
                className={`shrink-0 flex items-center gap-2 text-xs px-3 py-1 rounded-xl transition-all border ${
                  isSelected
                    ? 'bg-f1red/20 text-white border-f1red shadow-sm'
                    : 'bg-black/40 text-studio-300 border-white/10 hover:border-white/20 hover:text-white'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: contrib.avatarColor }}
                />
                <span className="font-mono font-bold">{contrib.username}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/10 text-studio-300">
                  {contrib.count}
                </span>
                {isSelected && <X className="w-3 h-3 text-f1red ml-0.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
