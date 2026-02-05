import { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

export function ImagePreviewModal(props: {
  isOpen: boolean;
  url: string | null;
  title?: string;
  onClose: () => void;
}) {
  const { isOpen, url, title, onClose } = props;

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !url) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold text-gray-900 truncate">{title ?? 'Preview'}</div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600"
            >
              <ExternalLink className="h-4 w-4" />
              Open
            </a>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="bg-gray-100">
          <img src={url} alt={title ?? 'Preview'} className="w-full max-h-[75vh] object-contain" />
        </div>
      </div>
    </div>
  );
}
