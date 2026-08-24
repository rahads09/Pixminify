import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  Download,
  SplitSquareVertical,
  ArrowLeftRight,
} from 'lucide-react';
import { ProcessedImage } from '../types';
import { formatBytes, downloadImage } from '../utils/imageProcessor';

interface SplitCompareModalProps {
  item: ProcessedImage | null;
  onClose: () => void;
}

export const SplitCompareModal: React.FC<SplitCompareModalProps> = ({ item, onClose }) => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 to 100)
  const [zoomLevel, setZoomLevel] = useState(1); // 1x, 1.5x, 2x, 3x
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setSliderPosition((prev) => Math.max(0, prev - 5));
      if (e.key === 'ArrowRight') setSliderPosition((prev) => Math.min(100, prev + 5));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const updateSliderPos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updateSliderPos(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      updateSliderPos(e.touches[0].clientX);
    }
  };

  if (!item) return null;

  const originalSrc = item.originalPreviewUrl;
  const compressedSrc = item.compressedPreviewUrl || item.originalPreviewUrl;
  const savings = item.savingsPercentage || 0;

  return (
    <div
      id="split-compare-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6 select-none animate-in fade-in duration-200"
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 shadow-xs">
            <SplitSquareVertical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span>Side-by-Side Quality Comparison</span>
              <span className="text-xs font-normal text-slate-300">({item.name})</span>
            </h3>
            <p className="text-xs text-slate-300 hidden sm:block">
              Drag the vertical divider left or right to inspect pixel-perfect visual fidelity
            </p>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center space-x-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center space-x-1 bg-slate-800/80 border border-slate-700 rounded-xl p-1">
            <button
              onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-mono text-white font-bold">{zoomLevel}x</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(3, z + 0.5))}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Download compressed image */}
          <button
            onClick={() => downloadImage(item)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          {/* Close Modal */}
          <button
            id="close-compare-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Comparison Canvas */}
      <div className="relative flex-1 my-3 overflow-hidden rounded-2xl border border-white/20 bg-slate-950 flex items-center justify-center">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative w-full h-full max-h-[75vh] flex items-center justify-center overflow-hidden cursor-ew-resize"
        >
          {/* Compressed Image (Background layer - Right Side) */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <img
              src={compressedSrc}
              alt="Compressed preview"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
              }}
              className="max-w-full max-h-full object-contain pointer-events-none transition-transform duration-100"
            />
            {/* Compressed Label Badge */}
            <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-right">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
                Optimized Output
              </div>
              <div className="text-xs font-mono font-bold text-white">
                {item.compressedSize ? formatBytes(item.compressedSize) : ''}
              </div>
            </div>
          </div>

          {/* Original Image (Clipped layer - Left Side) */}
          <div
            className="absolute inset-0 flex items-center justify-center overflow-hidden z-10 pointer-events-none"
            style={{
              clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
            }}
          >
            <img
              src={originalSrc}
              alt="Original preview"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
              }}
              className="max-w-full max-h-full object-contain pointer-events-none transition-transform duration-100"
            />
            {/* Original Label Badge */}
            <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-left">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                Original Photo
              </div>
              <div className="text-xs font-mono font-medium text-white">
                {formatBytes(item.originalSize)}
              </div>
            </div>
          </div>

          {/* Draggable Divider Line & Knob */}
          <div
            className="absolute top-0 bottom-0 z-30 w-0.5 bg-blue-400 cursor-ew-resize shadow-md"
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-blue-500/30">
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="p-3 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center space-x-4">
          <div>
            Original:{' '}
            <span className="font-mono font-medium text-white">{formatBytes(item.originalSize)}</span>
          </div>
          <div>
            Optimized:{' '}
            <span className="font-mono font-bold text-blue-400">
              {item.compressedSize ? formatBytes(item.compressedSize) : ''}
            </span>
          </div>
          {savings > 0 && (
            <div className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono font-bold">
              -{savings}% Reduction
            </div>
          )}
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          {item.originalWidth}×{item.originalHeight} px ➔ {item.compressedWidth}×{item.compressedHeight} px
        </div>
      </div>
    </div>
  );
};
