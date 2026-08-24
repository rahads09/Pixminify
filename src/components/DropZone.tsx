import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, ArrowUpRight } from 'lucide-react';
import { SAMPLE_IMAGES } from '../utils/presets';

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  onLoadSample: (url: string, name: string) => void;
  disabled?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFilesAdded,
  onLoadSample,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle global paste event (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (disabled || !e.clipboardData) return;
      const items = e.clipboardData.items;
      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) imageFiles.push(file);
        }
      }
      if (imageFiles.length > 0) {
        onFilesAdded(imageFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [disabled, onFilesAdded]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles: File[] = [];
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i];
        if (file.type.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png|webp|avif|gif|svg|bmp|heic)$/i)) {
          validFiles.push(file);
        }
      }
      if (validFiles.length > 0) {
        onFilesAdded(validFiles);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesAdded(filesArray);
      e.target.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.avif,.webp,.png,.jpg,.jpeg,.gif,.svg,.bmp"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Main Upload Card */}
      <div
        id="drop-zone-container"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/70 scale-[1.01] shadow-md'
            : 'border-slate-300 hover:border-blue-500 bg-white hover:bg-slate-50/60 shadow-xs'
        }`}
      >
        <div className="relative px-6 py-12 sm:py-16 text-center flex flex-col items-center justify-center">
          {/* Icon Badge */}
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 shadow-xs ${
              isDragOver
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 border border-blue-200 text-blue-600'
            }`}
          >
            <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
          </div>

          {/* Heading */}
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 tracking-tight">
            Drop your images here, or browse files
          </h3>

          <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
            Batch upload multiple images (JPEG, PNG, WebP, AVIF, SVG). Fast lossless & lossy in-browser compression.
          </p>

          {/* Action Button */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              id="browse-files-btn"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Select Images</span>
            </button>

            <span className="text-xs text-slate-600 font-mono hidden sm:inline-block px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 font-semibold">
              or paste with Ctrl+V
            </span>
          </div>

          {/* Supported Format Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {['PNG', 'JPEG', 'WEBP', 'AVIF', 'GIF', 'SVG'].map((fmt) => (
              <span
                key={fmt}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200"
              >
                .{fmt.toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Sample Image Loaders */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2">
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Or try with high-res sample photos:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SAMPLE_IMAGES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              id={`sample-btn-${idx}`}
              onClick={(e) => {
                e.stopPropagation();
                onLoadSample(sample.url, sample.name);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              <span>{idx === 0 ? '🏔️ 4K Nature' : idx === 1 ? '👤 Studio Portrait' : '🏛️ Modern Urban'}</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
