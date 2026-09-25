import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCollectionStore } from '../../store/useCollectionStore';
import { useAuthStore } from '../../store/useAuthStore';
import { AdminLoginModal } from '../auth/AdminLoginModal';
import { CollectionItem } from '../../types';
import {
  X,
  CheckCircle,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Clock,
  User,
  ExternalLink,
  Info,
  LogOut,
  KeyRound,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';

const REJECTION_REASONS = [
  'Chất lượng ảnh không đạt yêu cầu (mờ, vỡ pixel, quá tối/sáng)',
  'Nội dung không liên quan đến Formula 1',
  'Vi phạm bản quyền hoặc thông tin tác giả không rõ ràng',
  'Ảnh đã tồn tại trong bộ sưu tập (trùng lặp)',
  'Ảnh chứa watermark thương mại hoặc logo không phù hợp',
  'Thông tin đội đua / phân loại không chính xác',
  'Ảnh không phù hợp với tiêu chuẩn cộng đồng F1 Archive',
  'Khác (Xem ghi chú bên dưới)',
];

interface AdminModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModerationModal: React.FC<AdminModerationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { pendingItems, approveSubmission, rejectSubmission } = useCollectionStore();
  const { user, isAdmin, logout } = useAuthStore();

  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Rejection ticket state
  const [rejectTarget, setRejectTarget] = useState<CollectionItem | null>(null);
  const [selectedReason, setSelectedReason] = useState(REJECTION_REASONS[0]);
  const [customReason, setCustomReason] = useState('');

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApprove = (item: CollectionItem) => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    approveSubmission(item.id);
    setActionNotice(`Đã duyệt thành công ảnh: "${item.titleVi}"`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const openRejectDialog = (item: CollectionItem) => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setSelectedReason(REJECTION_REASONS[0]);
    setCustomReason('');
    setRejectTarget(item);
  };

  const confirmReject = () => {
    if (!rejectTarget) return;
    const isCustom = selectedReason === REJECTION_REASONS[REJECTION_REASONS.length - 1];
    const finalReason = isCustom
      ? (customReason.trim() || 'Không phù hợp với tiêu chuẩn')
      : selectedReason;
    rejectSubmission(rejectTarget.id, finalReason);
    setActionNotice(`Đã từ chối ảnh: "${rejectTarget.titleVi}" - Lý do: ${finalReason.substring(0, 50)}...`);
    setRejectTarget(null);
    setTimeout(() => setActionNotice(null), 5000);
  };

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[9998] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-4xl bg-studio-950 border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-display text-lg sm:text-xl font-black uppercase text-white tracking-wide">
                    Ban Kiểm Duyệt Ảnh F1
                  </h3>
                  <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {pendingItems.length} Chờ Duyệt
                  </span>
                </div>
                <p className="text-xs text-studio-400">
                  Kiểm duyệt chất lượng ảnh, bản quyền tác giả và nguồn gốc trước khi công khai vào Bộ Sưu Tập F1.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && user ? (
                <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-studio-300">
                    Admin: <span className="font-bold text-white">@{user.username}</span>
                  </span>
                  <button
                    onClick={logout}
                    className="ml-2 text-studio-400 hover:text-rose-400 transition-colors p-1"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : null}

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-studio-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action Notice Toast */}
          {actionNotice && (
            <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-6 py-2.5 text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionNotice}</span>
            </div>
          )}

          {/* Content Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
            {!isAdmin ? (
              /* Security Guard: Non-Admin Access Screen */
              <div className="text-center py-16 px-4 space-y-4 max-w-md mx-auto animate-scale-up">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-xl font-black uppercase text-white">
                    Yêu Cầu Quyền Quản Trị Viên (Admin)
                  </h4>
                  <p className="text-xs text-studio-400 leading-relaxed">
                    Quyền kiểm duyệt và phê duyệt ảnh công khai lên trang chủ thuộc về Admin. Vui lòng xác thực tài khoản để mở khóa bảng duyệt.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-6 py-3 rounded-xl bg-f1red hover:bg-f1red/90 text-white text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-f1red/30 transition-all flex items-center justify-center gap-2 mx-auto"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Đăng Nhập Tài Khoản Admin</span>
                  </button>
                </div>
              </div>
            ) : pendingItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-display text-lg font-bold text-white uppercase">
                  Hàng Chờ Kiểm Duyệt Trống
                </h4>
                <p className="text-xs text-studio-400 max-w-sm mx-auto">
                  Tất cả hình ảnh đóng góp từ cộng đồng đã được xem xét và phê duyệt vào bộ sưu tập.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/[0.02] border border-white/10 hover:border-white/20 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row gap-5 transition-all"
                  >
                    {/* Thumbnail Preview */}
                    <div className="relative w-full md:w-56 h-44 rounded-xl overflow-hidden bg-black/60 shrink-0 group border border-white/10">
                      <img
                        src={item.imageUrl}
                        alt={item.titleVi}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => setSelectedPreview(item.imageUrl)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold text-white gap-1"
                      >
                        <ExternalLink className="w-4 h-4" /> Xem ảnh lớn
                      </button>
                      <div
                        className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow"
                        style={{ backgroundColor: item.accentColor || '#e80020' }}
                      >
                        {item.teamId}
                      </div>
                      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono text-studio-300">
                        {item.season}
                      </div>
                    </div>

                    {/* Submission Details */}
                    <div className="flex-1 space-y-3 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-display text-base font-bold text-white tracking-wide truncate">
                          {item.titleVi}
                        </h4>
                        <span className="text-[11px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full">
                          Status: Pending
                        </span>
                      </div>

                      <p className="text-xs text-studio-300 line-clamp-2">
                        {item.captionVi || item.titleVi}
                      </p>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px] bg-black/30 p-3 rounded-xl border border-white/5">
                        <div className="space-y-0.5">
                          <span className="text-studio-500 block text-[10px]">Người gửi:</span>
                          <span className="font-mono font-bold text-f1red truncate block">
                            {item.uploadedBy || '@community'}
                          </span>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-studio-500 block text-[10px]">Nhiếp ảnh gia:</span>
                          <span className="text-studio-200 truncate block">
                            {item.photographer || 'Không rõ'}
                          </span>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-studio-500 block text-[10px]">Giấy phép:</span>
                          <span className="text-emerald-400 font-medium truncate block">
                            {item.licenseType || item.license || 'CC BY 4.0'}
                          </span>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-studio-500 block text-[10px]">Thời gian gửi:</span>
                          <span className="text-studio-400 font-mono block">
                            {item.createdAt || 'Hôm nay'}
                          </span>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-studio-500 block text-[10px]">Phân loại:</span>
                          <span className="text-studio-300 uppercase tracking-wider block">
                            {item.category}
                          </span>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-studio-500 block text-[10px]">Cam kết bản quyền:</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Đã xác nhận
                          </span>
                        </div>
                      </div>

                      {item.contributorNotes && (
                        <p className="text-[11px] text-studio-400 italic bg-white/[0.02] px-2.5 py-1 rounded border border-white/5">
                          Ghi chú từ contributor: "{item.contributorNotes}"
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-2.5 pt-1">
                        <button
                          onClick={() => openRejectDialog(item)}
                          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-studio-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Từ Chối</span>
                        </button>

                        <button
                          onClick={() => handleApprove(item)}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Duyệt Ảnh (Approve)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-studio-400">
            <div className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-studio-500" />
              <span>Ảnh được duyệt sẽ tự động thêm vào Collection mà không cần deploy lại web.</span>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-xs transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>

        {/* Image Full Preview Modal */}
        {selectedPreview && (
          <div
            className="fixed inset-0 z-[10010] bg-black/95 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedPreview(null)}
          >
            <div className="relative max-w-5xl max-h-[90vh]">
              <img
                src={selectedPreview}
                alt="Enlarged Preview"
                className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
              />
              <button
                onClick={() => setSelectedPreview(null)}
                className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-f1red text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Admin Login Modal Nested if needed */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setIsLoginModalOpen(false);
          setActionNotice('Đã xác thực thành công quyền Quản Trị Viên (Admin)!');
          setTimeout(() => setActionNotice(null), 3500);
        }}
      />

      {/* Rejection Reason Dialog */}
      {rejectTarget && (
        <div
          className="fixed inset-0 z-[10020] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setRejectTarget(null)}
        >
          <div
            className="relative w-full max-w-md bg-studio-950 border border-rose-500/30 rounded-3xl shadow-2xl overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 bg-rose-500/5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase text-white tracking-wide">Từ Chối Ảnh</h4>
                <p className="text-[11px] text-studio-400 truncate max-w-xs">"{rejectTarget.titleVi}"</p>
              </div>
              <button
                onClick={() => setRejectTarget(null)}
                className="ml-auto p-1.5 rounded-lg text-studio-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-studio-300">
                  Chọn Lý Do Từ Chối *
                </label>
                <div className="space-y-1.5">
                  {REJECTION_REASONS.map((reason) => (
                    <label
                      key={reason}
                      className={`flex items-start gap-2.5 cursor-pointer p-2.5 rounded-xl border transition-all ${
                        selectedReason === reason
                          ? 'bg-rose-500/10 border-rose-500/40 text-white'
                          : 'border-white/5 hover:border-white/15 text-studio-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="rejectReason"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={() => setSelectedReason(reason)}
                        className="mt-0.5 text-rose-500 focus:ring-0"
                      />
                      <span className="text-xs leading-relaxed">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom reason input (when "Khác" selected) */}
              {selectedReason === REJECTION_REASONS[REJECTION_REASONS.length - 1] && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-studio-300">
                    Ghi Chú Lý Do Cụ Thể *
                  </label>
                  <textarea
                    rows={3}
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Mô tả chi tiết lý do từ chối để thông báo cho người gửi..."
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white placeholder-studio-500 focus:outline-none focus:border-rose-500 resize-none"
                  />
                </div>
              )}

              <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-[11px] text-amber-300">
                Lý do này sẽ được ghi lại và hiển thị trong mục <strong>Thông Báo</strong> của người đóng góp.
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setRejectTarget(null)}
                className="px-4 py-2 rounded-xl border border-white/15 text-studio-300 hover:text-white hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={confirmReject}
                disabled={selectedReason === REJECTION_REASONS[REJECTION_REASONS.length - 1] && !customReason.trim()}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                Xác Nhận Từ Chối
              </button>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
};
