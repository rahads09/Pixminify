import React, { useRef, useState, useCallback, useEffect } from 'react';
import { UploadCloud } from 'lucide-react';
import { AdSlot } from './AdSlot';

export interface ToolUploadPageProps {
  /** Clean, focused title of the tool */
  title: string;
  /** Short subtitle (approximately 1 short sentence) */
  subtitle: string;
  /** Optional hint of supported formats */
  acceptedFormats?: string;
  /** File input accept string (e.g., "image/*" or specific extensions) */
  accept?: string;
  /** Allow selecting multiple files (e.g., for Image to PDF or batch tools) */
  multiple?: boolean;
  /** Button label (defaults to "Upload Image" or "Upload Images" if multiple) */
  buttonText?: string;
  /** Callback when valid file(s) are selected/dropped */
  onImageSelected: (files: File[]) => void;
  /** Optional theme color accents: blue (default), emerald, indigo, rose, amber, purple, cyan, sky */
  accentColor?: 'blue' | 'emerald' | 'indigo' | 'rose' | 'amber' | 'purple' | 'cyan' | 'sky';
}

export const ToolUploadPage: React.FC<ToolUploadPageProps> = ({
  title,
  subtitle,
  acceptedFormats = 'Supports JPG, PNG, WebP, AVIF',
  accept = 'image/*',
  multiple = false,
  buttonText,
  onImageSelected,
  accentColor = 'blue',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayButtonText = buttonText || (multiple ? 'Upload Images' : 'Upload Image');

  const processFiles = useCallback(
    (fileList: FileList | File[]) => {
      const validFiles: File[] = [];
      const list = Array.isArray(fileList) ? fileList : Array.from(fileList);

      for (const file of list) {
        if (
          file.type.startsWith('image/') ||
          file.name.match(/\.(jpg|jpeg|png|webp|avif|gif|svg|bmp|heic|tiff)$/i)
        ) {
          validFiles.push(file);
        }
      }

      if (validFiles.length > 0) {
        onImageSelected(multiple ? validFiles : [validFiles[0]]);
      }
    },
    [multiple, onImageSelected]
  );

  // Global paste handler (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const items = e.clipboardData.items;
      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) pastedFiles.push(file);
        }
      }
      if (pastedFiles.length > 0) {
        processFiles(pastedFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFiles]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  // Accent styling mappings
  const colorStyles = {
    blue: {
      btn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25 focus-visible:ring-blue-500',
      dropActive: 'border-blue-500 bg-blue-50/70',
      iconBg: 'bg-blue-50 text-blue-600',
    },
    emerald: {
      btn: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/25 focus-visible:ring-emerald-500',
      dropActive: 'border-emerald-500 bg-emerald-50/70',
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    indigo: {
      btn: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25 focus-visible:ring-indigo-500',
      dropActive: 'border-indigo-500 bg-indigo-50/70',
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    rose: {
      btn: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/25 focus-visible:ring-rose-500',
      dropActive: 'border-rose-500 bg-rose-50/70',
      iconBg: 'bg-rose-50 text-rose-600',
    },
    amber: {
      btn: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/25 focus-visible:ring-amber-500',
      dropActive: 'border-amber-500 bg-amber-50/70',
      iconBg: 'bg-amber-50 text-amber-600',
    },
    purple: {
      btn: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/25 focus-visible:ring-purple-500',
      dropActive: 'border-purple-500 bg-purple-50/70',
      iconBg: 'bg-purple-50 text-purple-600',
    },
    cyan: {
      btn: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-500/25 focus-visible:ring-cyan-500',
      dropActive: 'border-cyan-500 bg-cyan-50/70',
      iconBg: 'bg-cyan-50 text-cyan-600',
    },
    sky: {
      btn: 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-500/25 focus-visible:ring-sky-500',
      dropActive: 'border-sky-500 bg-sky-50/70',
      iconBg: 'bg-sky-50 text-sky-600',
    },
  }[accentColor];

  const uniqueId = title.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return (
    <section
      id={`tool-upload-section-${uniqueId}`}
      aria-labelledby={`tool-title-${uniqueId}`}
      className="w-full flex-1 flex flex-col items-center justify-center py-8 sm:py-14 md:py-20 px-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center space-y-6 sm:space-y-8">
        {/* 1. Tool Title & Short Subtitle */}
        <header className="space-y-2.5 max-w-xl">
          <h1
            id={`tool-title-${uniqueId}`}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
          >
            {title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {subtitle}
          </p>
        </header>

        {/* 2. Large Upload Image Area / Button */}
        <div
          id={`dropzone-${uniqueId}`}
          tabIndex={0}
          role="button"
          aria-label={`${displayButtonText}. Click or drag and drop image file.`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={handleKeyDown}
          className={`w-full rounded-3xl border-2 border-dashed transition-all duration-200 p-8 sm:p-12 md:p-14 flex flex-col items-center justify-center cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            isDragging
              ? `${colorStyles.dropActive} scale-[1.01] shadow-md`
              : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50/80 focus-visible:border-slate-500'
          }`}
        >
          <input
            id={`file-input-${uniqueId}`}
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
            className="hidden"
            aria-hidden="true"
          />

          {/* Prominent Large Upload Button */}
          <button
            id={`upload-button-${uniqueId}`}
            type="button"
            tabIndex={-1}
            className={`btn-interactive px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl font-bold text-base sm:text-lg shadow-lg flex items-center space-x-3 cursor-pointer pointer-events-none ${colorStyles.btn}`}
          >
            <UploadCloud className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true" />
            <span>{displayButtonText}</span>
          </button>

          {/* Drag & Drop text + Format hint */}
          <div className="mt-5 space-y-1">
            <p className="text-xs sm:text-sm font-medium text-slate-600">
              or drag & drop {multiple ? 'images' : 'your image'} here
            </p>
            {acceptedFormats && (
              <p className="text-[11px] sm:text-xs text-slate-500 font-mono">
                {acceptedFormats}
              </p>
            )}
          </div>
        </div>

        {/* 3. Responsive Empty AdSense-ready slot (collapsed when unconfigured) */}
        <div className="w-full pt-2">
          <AdSlot />
        </div>
      </div>
    </section>
  );
};

