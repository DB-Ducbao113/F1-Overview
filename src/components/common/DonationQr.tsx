import { Download, ExternalLink } from 'lucide-react';
import { author } from '../../data/author';
import { useNavigationStore } from '../../store/useNavigationStore';

export const DonationQr = () => {
  const isVi = useNavigationStore((state) => state.lang === 'vi');

  return (
    <div className="w-full max-w-xs">
      <figure className="rounded-xl border border-studio-200 bg-white p-4 text-center text-studio-900">
        <p className="text-sm font-bold uppercase tracking-wider text-f1red">
          {author.donation.bank}
        </p>
        <a
          href={author.donation.qrImage}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-f1red"
          aria-label={
            isVi ? 'Mở ảnh QR donate kích thước đầy đủ' : 'Open full-size donation QR image'
          }
        >
          <img
            src={author.donation.qrImage}
            alt={
              isVi
                ? 'Mã QR donate Techcombank của NGUYEN DUC BAO'
                : 'Techcombank donation QR code for NGUYEN DUC BAO'
            }
            className="h-auto w-full"
            width={540}
            height={540}
            loading="lazy"
            decoding="async"
          />
        </a>
        <figcaption className="text-xs leading-6">
          <p className="font-bold">{author.donation.recipient}</p>
          <p className="select-all font-mono">{author.donation.account}</p>
          <div className="mt-3 border-t border-studio-200 pt-3">
            <p className="text-studio-500">{isVi ? 'Nội dung chuyển khoản' : 'Transfer message'}</p>
            <p className="select-all font-mono font-semibold">{author.donation.transferMessage}</p>
          </div>
        </figcaption>
      </figure>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
        <a
          href={author.donation.qrImage}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center gap-2 hover:underline focus-visible:outline-f1red"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          {isVi ? 'Mở ảnh QR' : 'Open QR image'}
        </a>
        <a
          href={author.donation.qrImage}
          download="BaoBungBu-donate-QR.png"
          className="inline-flex min-h-10 items-center gap-2 hover:underline focus-visible:outline-f1red"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          {isVi ? 'Tải mã QR' : 'Download QR'}
        </a>
      </div>
    </div>
  );
};
