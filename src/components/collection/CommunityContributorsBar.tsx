import React from 'react';
import { useCollectionStore } from '../../store/useCollectionStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Users, Award, Camera, Sparkles, Filter, X, Lock, ShieldCheck, LogOut } from 'lucide-react';

interface CommunityContributorsBarProps {
  onOpenUpload: () => void;
  onOpenAdmin: () => void;
  onOpenLogin: () => void;
  activeContributor: string | null;
  onSelectContributor: (contributor: string | null) => void;
}

export const CommunityContributorsBar: React.FC<CommunityContributorsBarProps> = ({
  onOpenUpload,
  onOpenAdmin,
  onOpenLogin,
  activeContributor,
  onSelectContributor,
}) => {
  const { getContributors, pendingItems, items } = useCollectionStore();
  const { isAdmin, user, logout } = useAuthStore();
  const contributors = getContributors();

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
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                F1 Community Archive
              </h4>
              <span className="text-[10px] font-mono bg-white/10 text-studio-300 px-2 py-0.5 rounded-full border border-white/10">
                {items.length} tác phẩm
              </span>
            </div>
            <p className="text-[11px] text-studio-400">
              Kho ảnh mở do người hâm mộ và nhiếp ảnh gia đóng góp
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap sm:flex-nowrap">
          {/* Admin Identity or Login Button */}
          {isAdmin && user ? (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl px-3 py-1.5 text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin: @{user.username}</span>
              <button
                onClick={logout}
                className="text-studio-400 hover:text-rose-400 p-0.5 transition-colors ml-1"
                title="Đăng xuất tài khoản Admin"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-studio-300 hover:text-white transition-all flex items-center gap-1.5"
              title="Đăng nhập Admin để duyệt ảnh"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Đăng Nhập Admin</span>
            </button>
          )}

          {/* Admin Review Button */}
          <button
            onClick={onOpenAdmin}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              isAdmin
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-white/5 text-studio-400 border-white/10 hover:text-white hover:bg-white/10'
            }`}
            title={isAdmin ? 'Mở hàng chờ kiểm duyệt ảnh' : 'Yêu cầu quyền Admin để duyệt ảnh'}
          >
            {!isAdmin && <Lock className="w-3 h-3 text-studio-400" />}
            <span>Duyệt Ảnh</span>
            {pendingItems.length > 0 && (
              <span className="bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                {pendingItems.length}
              </span>
            )}
          </button>

          {/* Upload Button */}
          <button
            onClick={onOpenUpload}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-f1red hover:bg-f1red/90 text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-f1red/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Đóng Góp Ảnh</span>
          </button>
        </div>
      </div>

      {/* Contributor Badges Leaderboard */}
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
    </div>
  );
};
