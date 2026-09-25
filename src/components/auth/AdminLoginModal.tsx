import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { getRateLimitStatus } from '../../utils/security';
import {
  X,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  KeyRound,
  Info,
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { login } = useAuthStore();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Lockout countdown state
  const [lockoutSec, setLockoutSec] = useState<number>(0);

  // Escape key handler to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    // Check rate limit status on open
    const status = getRateLimitStatus();
    if (status.isLocked) {
      setLockoutSec(status.remainingSeconds);
    } else {
      setLockoutSec(0);
    }
  }, [isOpen]);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutSec <= 0) return;
    const interval = setInterval(() => {
      setLockoutSec((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setErrorMessage('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSec]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSec > 0) return;

    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await login(username, password, rememberMe);
      setIsLoading(false);

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setPassword('');
          onClose();
          if (onSuccess) onSuccess();
        }, 1200);
      } else {
        setErrorMessage(result.error || 'Đăng nhập thất bại.');
        const status = getRateLimitStatus();
        if (status.isLocked) {
          setLockoutSec(status.remainingSeconds);
        }
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('Đã xảy ra lỗi bảo mật khi xác thực.');
    }
  };

  const handleFillDemo = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setErrorMessage('');
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[10005] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-studio-950 border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto animate-scale-up text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="h-1.5 bg-gradient-to-r from-f1red via-amber-500 to-f1red" />

        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-f1red/20 border border-f1red/40 flex items-center justify-center text-f1red">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-black uppercase text-white tracking-wide">
                  Xác Thực Quản Trị Viên
                </h3>
              </div>
              <p className="text-xs text-studio-400">
                F1 Curator & Moderation Access Control
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

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {isSuccess ? (
            <div className="text-center py-6 space-y-3 animate-scale-up">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h4 className="font-display text-lg font-black uppercase text-white">
                Xác Thực Thành Công!
              </h4>
              <p className="text-xs text-studio-300">
                Đã cấp quyền duyệt ảnh F1 cho tài khoản <span className="text-f1red font-bold font-mono">@{username}</span>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error or Lockout Notice */}
              {lockoutSec > 0 ? (
                <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                  <div>
                    <span className="font-bold block">Khóa tạm thời chống dò mật khẩu!</span>
                    <span>Vui lòng chờ {lockoutSec} giây nữa trước khi thử lại.</span>
                  </div>
                </div>
              ) : errorMessage ? (
                <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              ) : null}

              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-studio-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-f1red" />
                  <span>Tên Tài Khoản Admin</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  disabled={lockoutSec > 0 || isLoading}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin hoặc baobungbu"
                  className="w-full bg-studio-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-studio-500 focus:outline-none focus:border-f1red font-mono disabled:opacity-50"
                />
              </div>

              {/* Password Input with eye toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-studio-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-f1red" />
                    <span>Mật Khẩu Xác Thực</span>
                  </span>
                  <span className="text-[10px] text-studio-400 font-mono">Bảo mật SHA-256</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={lockoutSec > 0 || isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu admin..."
                    className="w-full bg-studio-900 border border-white/15 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-studio-500 focus:outline-none focus:border-f1red disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-studio-400 hover:text-white p-1"
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-studio-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/20 text-f1red focus:ring-0 w-3.5 h-3.5 bg-black"
                  />
                  <span>Ghi nhớ phiên đăng nhập (7 ngày)</span>
                </label>
              </div>

              {/* Quick Demo Credentials Box */}
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-[11px] space-y-1.5 text-studio-400">
                <div className="flex items-center gap-1.5 font-bold text-studio-300">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tài khoản thử nghiệm sẵn có:</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => handleFillDemo('admin', 'admin')}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[10px] transition-colors"
                  >
                    User: <span className="text-amber-400">admin</span> / Pass: <span className="text-emerald-400">admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('baobungbu', 'baobungbu')}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[10px] transition-colors"
                  >
                    User: <span className="text-amber-400">baobungbu</span> / Pass: <span className="text-emerald-400">baobungbu</span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={lockoutSec > 0 || isLoading}
                  className="w-full py-3 rounded-xl bg-f1red hover:bg-f1red/90 disabled:bg-studio-800 disabled:text-studio-500 text-white text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-f1red/30 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Đăng Nhập Quản Trị Viên</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer Security Notice */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-white/[0.01] flex items-center justify-between text-[10px] text-studio-500 font-mono">
          <span>Web Crypto SHA-256 + PBKDF2</span>
          <span>Role-Based Access Control (RBAC)</span>
        </div>
      </div>
    </div>,
    document.body
  );
};
