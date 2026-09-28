import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCollectionStore } from '../../store/useCollectionStore';
import { TeamId, CollectionCategory } from '../../types';
import {
  X,
  Upload,
  Image as ImageIcon,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Link as LinkIcon,
  Bell,
  XCircle,
} from 'lucide-react';

interface CommunityUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTeamId?: TeamId | null;
}

const TEAMS_LIST: { id: TeamId; name: string; color: string }[] = [
  { id: 'ferrari', name: 'Scuderia Ferrari HP', color: '#e80020' },
  { id: 'mclaren', name: 'McLaren Formula 1 Team', color: '#ff8000' },
  { id: 'redbull', name: 'Oracle Red Bull Racing', color: '#0600ef' },
  { id: 'mercedes', name: 'Mercedes-AMG Petronas F1', color: '#00a19c' },
  { id: 'astonmartin', name: 'Aston Martin Aramco F1', color: '#229971' },
  { id: 'alpine', name: 'BWT Alpine Formula 1 Team', color: '#0090ff' },
  { id: 'racingbulls', name: 'Visa Cash App RB F1', color: '#6692ff' },
  { id: 'haas', name: 'MoneyGram Haas F1 Team', color: '#b6babd' },
  { id: 'williams', name: 'Williams Racing', color: '#00a0de' },
  { id: 'audi', name: 'Audi Formula 1 Team (Kick Sauber)', color: '#f50537' },
  { id: 'cadillac', name: 'Cadillac Formula 1 Team', color: '#d4af37' },
];

type UploadCategory = 'car' | 'driver' | 'race' | 'team';

const CATEGORIES: { id: UploadCategory; label: string; icon: string }[] = [
  { id: 'car', label: 'Xe đua (Car & Livery)', icon: '🏎️' },
  { id: 'driver', label: 'Tay đua (Driver Portrait)', icon: '👤' },
  { id: 'race', label: 'Khoảnh khắc GP (Race Action)', icon: '🏁' },
  { id: 'team', label: 'Garage & Đội ngũ (Team & Paddock)', icon: '🛠️' },
];

// Helper to compress local images on client side to prevent localStorage QuotaExceededError
const compressImageFile = (
  file: File,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.82
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('FileReader failed'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Image decode failed'));
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(reader.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        } catch {
          resolve(reader.result as string);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const CommunityUploadModal: React.FC<CommunityUploadModalProps> = ({
  isOpen,
  onClose,
  defaultTeamId,
}) => {
  const { submitCommunityImage, rejectedItems } = useCollectionStore();

  // Tab state
  const [activeTab, setActiveTab] = useState<'upload' | 'notifications'>('upload');

  // Form states
  const [imageUrl, setImageUrl] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<TeamId>(defaultTeamId || 'ferrari');
  const [category, setCategory] = useState<UploadCategory>('car');
  const [titleVi, setTitleVi] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [captionVi, setCaptionVi] = useState('');
  const [photographer, setPhotographer] = useState('');
  const [contributorHandle, setContributorHandle] = useState(() => {
    return localStorage.getItem('f1_contributor_handle') || '@baobungbu';
  });
  const [licenseType, setLicenseType] = useState('Personal photograph');
  const [notes, setNotes] = useState('');

  // Copyright confirmation checkboxes
  const [confirmOwnership, setConfirmOwnership] = useState(false);
  const [confirmGuidelines, setConfirmGuidelines] = useState(false);

  // Status message
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (defaultTeamId) {
        setSelectedTeam(defaultTeamId);
      }
      setSubmittedId(null);
      setErrorMessage('');
      setIsCompressing(false);
    }
  }, [isOpen, defaultTeamId]);

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

  // Handle local file upload with compression
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Vui lòng chọn file hình ảnh (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('Kích thước ảnh tối đa là 15MB.');
      return;
    }

    setIsCompressing(true);
    setErrorMessage('');

    try {
      const compressedDataUrl = await compressImageFile(file);
      setImageUrl(compressedDataUrl);
    } catch {
      setErrorMessage('Không thể xử lý file ảnh này. Vui lòng thử lại.');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!imageUrl.trim()) {
      setErrorMessage('Vui lòng nhập đường dẫn ảnh hoặc tải ảnh lên từ máy tính.');
      return;
    }

    if (!titleVi.trim()) {
      setErrorMessage('Vui lòng nhập tiêu đề cho bức ảnh.');
      return;
    }

    if (!confirmOwnership || !confirmGuidelines) {
      setErrorMessage('Vui lòng tích xác nhận quyền sử dụng và cam kết bản quyền.');
      return;
    }

    // Save contributor handle for next time
    localStorage.setItem('f1_contributor_handle', contributorHandle.trim());

    const teamMeta = TEAMS_LIST.find((t) => t.id === selectedTeam) || TEAMS_LIST[0];

    const newId = submitCommunityImage({
      teamId: selectedTeam,
      season: 2026,
      category: category,
      imageUrl: imageUrl.trim(),
      titleVi: titleVi.trim(),
      titleEn: titleEn.trim() || titleVi.trim(),
      captionVi: captionVi.trim() || titleVi.trim(),
      captionEn: titleEn.trim() || titleVi.trim(),
      photographer: photographer.trim() || contributorHandle.trim(),
      source: `Community Contributor (${contributorHandle.trim()})`,
      license: licenseType,
      licenseType: licenseType,
      creditRequired: true,
      accentColor: teamMeta.color,
      uploadedBy: contributorHandle.trim().startsWith('@')
        ? contributorHandle.trim()
        : `@${contributorHandle.trim()}`,
      copyrightConfirmed: true,
      contributorNotes: notes.trim(),
      likes: 1,
    });

    setSubmittedId(newId);
  };

  const handleReset = () => {
    setImageUrl('');
    setTitleVi('');
    setTitleEn('');
    setCaptionVi('');
    setPhotographer('');
    setNotes('');
    setConfirmOwnership(false);
    setConfirmGuidelines(false);
    setSubmittedId(null);
    setErrorMessage('');
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-studio-950 border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-f1red/20 border border-f1red/40 flex items-center justify-center text-f1red">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg sm:text-xl font-black uppercase text-white tracking-wide">
                  Đóng Góp Ảnh F1 Cộng Đồng
                </h3>
                <span className="text-[10px] font-bold bg-f1red/20 text-f1red px-2 py-0.5 rounded-full border border-f1red/30">
                  Community Archive
                </span>
              </div>
              <p className="text-xs text-studio-400">
                Chia sẻ những góc ảnh F1 đẹp nhất từ paddock, trường đua hoặc bộ sưu tập của bạn.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-studio-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-white/[0.01]">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'upload'
                ? 'text-f1red border-b-2 border-f1red'
                : 'text-studio-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Đóng Góp Ảnh
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'notifications'
                ? 'text-rose-400 border-b-2 border-rose-500'
                : 'text-studio-400 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Thông Báo
            {rejectedItems.length > 0 && (
              <span className="absolute top-2 right-4 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                {rejectedItems.length > 9 ? '9+' : rejectedItems.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-white">
          {activeTab === 'notifications' ? (
            /* Notifications Panel */
            <div className="space-y-4">
              {rejectedItems.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-studio-500 mx-auto">
                    <Bell className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-bold text-white">Không có thông báo</p>
                  <p className="text-xs text-studio-400">Chưa có ảnh nào bị từ chối bởi Ban Kiểm Duyệt.</p>
                </div>
              ) : (
                rejectedItems.map((item) => (
                  <div key={item.id} className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4 space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-black/60 border border-white/10">
                        <img src={item.imageUrl} alt={item.titleVi} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">Ảnh Bị Từ Chối</span>
                        </div>
                        <p className="text-sm font-bold text-white truncate mt-0.5">{item.titleVi}</p>
                        <p className="text-[11px] text-studio-400 font-mono">{item.uploadedBy} · {item.createdAt}</p>
                      </div>
                    </div>
                    {item.rejectionReason && (
                      <div className="bg-black/40 rounded-xl p-3 border border-rose-500/20">
                        <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1">Lý Do Từ Chối:</p>
                        <p className="text-xs text-studio-200 leading-relaxed">{item.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : submittedId ? (
            /* Success State */
            <div className="text-center py-8 space-y-4 animate-scale-up">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h4 className="font-display text-2xl font-black uppercase text-white">
                Gửi Ảnh Thành Công!
              </h4>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2">
                <p className="text-xs text-studio-300">
                  Ảnh của bạn <span className="font-bold text-white">"{titleVi}"</span> đã được đưa vào hàng chờ kiểm duyệt:
                </p>
                <div className="text-[11px] font-mono text-studio-400 space-y-1 bg-black/40 p-3 rounded-lg border border-white/5">
                  <div>• Mã Submission: <span className="text-amber-400">{submittedId}</span></div>
                  <div>• Trạng thái: <span className="text-amber-400 font-bold uppercase">Pending Review (Chờ Duyệt)</span></div>
                  <div>• Người đóng góp: <span className="text-white">{contributorHandle}</span></div>
                  <div>• Bản quyền: <span className="text-emerald-400">{licenseType}</span></div>
                </div>
                <p className="text-[11px] text-studio-400 italic">
                  * Sau khi Ban Quản Trị bấm Duyệt (Approve), ảnh sẽ ngay lập tức xuất hiện trong mục Bộ Sưu Tập của đội đua tương ứng.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Tải lên ảnh khác
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-f1red text-white text-xs font-bold uppercase tracking-wider hover:bg-f1red/90 transition-colors shadow-md"
                >
                  Đóng hộp thoại
                </button>
              </div>
            </div>
          ) : (
            /* Upload Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Image Upload / Source */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-studio-300 flex items-center justify-between">
                  <span>1. Chọn hoặc Tải Ảnh F1 *</span>
                  <span className="text-[10px] text-studio-400 font-normal">Hỗ trợ JPG, PNG, WebP (Tối đa 8MB)</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* File Upload Box */}
                  <div
                    onClick={() => !isCompressing && fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 min-h-[120px] ${
                      isCompressing
                        ? 'border-amber-500/40 bg-amber-500/5 cursor-wait'
                        : 'border-white/20 hover:border-f1red/60 bg-white/[0.02] hover:bg-white/[0.05]'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isCompressing}
                    />
                    {isCompressing ? (
                      <>
                        <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-bold text-amber-300">Đang nén & tối ưu hóa ảnh...</span>
                        <span className="text-[10px] text-studio-400">Giảm dung lượng tự động</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-6 h-6 text-studio-400" />
                        <span className="text-xs font-bold text-white">Tải ảnh từ máy tính</span>
                        <span className="text-[10px] text-studio-400">Nhấp để chọn file ảnh (Tự động nén tối ưu)</span>
                      </>
                    )}
                  </div>

                  {/* URL Input Box */}
                  <div className="border border-white/10 rounded-2xl p-4 bg-white/[0.02] flex flex-col justify-between gap-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-f1red" /> Hoặc dán đường dẫn (Image URL)
                    </span>
                    <input
                      type="url"
                      placeholder="https://example.com/ferrari-f1.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-studio-500 focus:outline-none focus:border-f1red"
                    />
                    <span className="text-[10px] text-studio-400">Hỗ trợ link ảnh trực tiếp từ Pinterest, Unsplash, v.v.</span>
                  </div>
                </div>

                {/* Live Image Preview */}
                {imageUrl && (
                  <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-black/60 max-h-48 flex items-center justify-center mt-2 group">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="max-h-48 w-full object-contain"
                      onError={() => setErrorMessage('Không thể tải trước ảnh từ URL này. Vui lòng kiểm tra lại link.')}
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-white hover:bg-f1red transition-colors"
                      title="Xóa ảnh"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Metadata: Team, Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-studio-300">
                    Đội Đua *
                  </label>
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value as TeamId)}
                    className="w-full bg-studio-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-f1red"
                  >
                    {TEAMS_LIST.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-studio-300">
                    Phân Loại *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as UploadCategory)}
                    className="w-full bg-studio-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-f1red"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Title & Description */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-studio-300">
                    Tiêu Đề Ảnh (Tiếng Việt) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Ferrari SF-24 Khoảnh Khắc Chiến Thắng Monza"
                    value={titleVi}
                    onChange={(e) => setTitleVi(e.target.value)}
                    className="w-full bg-studio-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white placeholder-studio-500 focus:outline-none focus:border-f1red"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-studio-300">
                      Tên Nhiếp Ảnh Gia / Tác Giả
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Tên bạn hoặc tên nhiếp ảnh gia"
                      value={photographer}
                      onChange={(e) => setPhotographer(e.target.value)}
                      className="w-full bg-studio-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-studio-500 focus:outline-none focus:border-f1red"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-studio-300">
                      Tên Bạn (Contributor Handle) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="@baobungbu"
                      value={contributorHandle}
                      onChange={(e) => setContributorHandle(e.target.value)}
                      className="w-full bg-studio-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-studio-500 focus:outline-none focus:border-f1red font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Copyright & Licensing Checklist */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Xác Nhận Bản Quyền & Giấy Phép Sử Dụng *</span>
                </div>

                <div className="space-y-2 text-xs text-studio-300">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={confirmOwnership}
                      onChange={(e) => setConfirmOwnership(e.target.checked)}
                      className="mt-0.5 rounded border-white/20 text-f1red focus:ring-0 w-4 h-4 bg-black"
                    />
                    <span>
                      Tôi xác nhận tôi là chủ sở hữu bức ảnh này, hoặc có quyền được chia sẻ tác phẩm này lên kho lưu trữ cộng đồng.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={confirmGuidelines}
                      onChange={(e) => setConfirmGuidelines(e.target.checked)}
                      className="mt-0.5 rounded border-white/20 text-f1red focus:ring-0 w-4 h-4 bg-black"
                    />
                    <span>
                      Tuân thủ quy chuẩn hình ảnh F1: Không vi phạm nhãn hiệu thương mại, ghi rõ thông tin tác giả và nguồn gốc minh bạch.
                    </span>
                  </label>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-4">
                  <span className="text-[11px] text-studio-400 font-medium">Giấy phép phát hành:</span>
                  <select
                    value={licenseType}
                    onChange={(e) => setLicenseType(e.target.value)}
                    className="bg-black/60 border border-white/15 rounded-lg px-2.5 py-1 text-[11px] text-white focus:outline-none"
                  >
                    <option value="Personal photograph">Ảnh Tự Chụp (Personal Photograph)</option>
                    <option value="CC BY 4.0">Creative Commons (CC BY 4.0)</option>
                    <option value="Editorial Curation">Ảnh Báo Chí / Editorial Use</option>
                    <option value="Community Archive Share">Chia Sẻ Lưu Trữ Cộng Đồng</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-white/15 text-studio-300 hover:text-white hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Hủy Bỏ
                </button>

                <button
                  type="submit"
                  disabled={isCompressing}
                  className="px-6 py-2.5 rounded-xl bg-f1red hover:bg-f1red/90 disabled:bg-studio-800 disabled:text-studio-500 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-f1red/30 hover:scale-102 transition-all flex items-center gap-2"
                >
                  {isCompressing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang nén ảnh...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gửi Ảnh Vào Hàng Chờ Duyệt</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
