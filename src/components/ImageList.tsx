import React from 'react';
import {
  Download,
  Trash2,
  Eye,
  Loader2,
  FileArchive,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProcessedImage } from '../types';
import { formatBytes, downloadImage, downloadAllAsZip } from '../utils/imageProcessor';

interface ImageListProps {
  items: ProcessedImage[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onOpenCompare: (item: ProcessedImage) => void;
  onOpenItemSettings?: (item: ProcessedImage) => void;
  isProcessing: boolean;
}

export const ImageList: React.FC<ImageListProps> = ({
  items,
  onRemoveItem,
  onClearAll,
  onOpenCompare,
  isProcessing,
}) => {
  if (items.length === 0) return null;

  // Calculate aggregate stats
  const totalOriginalBytes = items.reduce((acc, curr) => acc + curr.originalSize, 0);
  const completedItems = items.filter((item) => item.status === 'done' && item.compressedSize);
  const totalCompressedBytes = completedItems.reduce((acc, curr) => acc + (curr.compressedSize || 0), 0);

  const totalSavedBytes = Math.max(0, totalOriginalBytes - totalCompressedBytes);
  const overallSavingsPct =
    totalOriginalBytes > 0 && totalCompressedBytes > 0
      ? Math.round(((totalOriginalBytes - totalCompressedBytes) / totalOriginalBytes) * 100)
      : 0;

  const handleDownloadAllZip = async () => {
    // Fire celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    await downloadAllAsZip(items);
  };

  return (
    <div className="w-full space-y-4">
      {/* Batch Summary Header Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Images</div>
            <div className="text-lg sm:text-xl font-bold text-slate-900">{items.length} files</div>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block" />

          <div>
            <div className="text-xs text-slate-500 font-medium">Original Size</div>
            <div className="text-base sm:text-lg font-medium text-slate-700 font-mono">
              {formatBytes(totalOriginalBytes)}
            </div>
          </div>

          <div className="hidden sm:block text-slate-400">➔</div>

          <div>
            <div className="text-xs text-slate-500 font-medium">Optimized Size</div>
            <div className="text-base sm:text-lg font-bold text-blue-600 font-mono">
              {completedItems.length > 0 ? formatBytes(totalCompressedBytes) : 'Processing...'}
            </div>
          </div>

          {overallSavingsPct > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center space-x-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-sm font-bold font-mono">
                -{overallSavingsPct}% Saved ({formatBytes(totalSavedBytes)})
              </span>
            </div>
          )}
        </div>

        {/* Global Batch Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            id="clear-all-images-btn"
            onClick={onClearAll}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 border border-slate-200 text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            Clear All
          </button>

          <button
            id="download-all-zip-btn"
            onClick={handleDownloadAllZip}
            disabled={completedItems.length === 0}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <FileArchive className="w-4 h-4" />
            <span>Download All (ZIP)</span>
          </button>
        </div>
      </div>

      {/* Image Cards List */}
      <div className="space-y-2.5">
        {items.map((item) => {
          const isDone = item.status === 'done';
          const isProcessingItem = item.status === 'processing';
          const isError = item.status === 'error';
          const savings = item.savingsPercentage || 0;

          return (
            <div
              key={item.id}
              id={`image-row-${item.id}`}
              className="group p-3 sm:p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
            >
              {/* Left: Thumbnail & Name info */}
              <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 w-full sm:w-auto">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 flex items-center justify-center">
                  <img
                    src={item.compressedPreviewUrl || item.originalPreviewUrl}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                  {isProcessingItem && (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                </div>

                {/* Name & Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-[280px]">
                      {item.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                      {item.compressedType ? item.compressedType.replace('image/', '') : item.originalType.replace('image/', '')}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 font-mono">
                    <span>
                      {item.originalWidth > 0 ? `${item.originalWidth}×${item.originalHeight}` : ''}
                    </span>
                    {isDone && item.compressedWidth && (
                      <>
                        <ArrowRight className="w-3 h-3 text-slate-400 inline" />
                        <span className="text-blue-600 font-semibold">
                          {item.compressedWidth}×{item.compressedHeight}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Middle: Size comparison & Savings percentage badge */}
              <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-start">
                <div className="text-left sm:text-right font-mono">
                  <div className="text-xs text-slate-400 line-through">
                    {formatBytes(item.originalSize)}
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {isDone && item.compressedSize
                      ? formatBytes(item.compressedSize)
                      : isProcessingItem
                      ? 'Compressing...'
                      : isError
                      ? 'Error'
                      : formatBytes(item.originalSize)}
                  </div>
                </div>

                {/* Savings Pill */}
                {isDone && (
                  <div
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center space-x-1 ${
                      savings > 0
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span>{savings > 0 ? `-${savings}%` : '0%'}</span>
                  </div>
                )}

                {/* Status indicator */}
                {isError && (
                  <div className="flex items-center text-red-600 text-xs space-x-1 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-red-600" />
                    <span>Failed</span>
                  </div>
                )}
              </div>

              {/* Right: Individual Action Buttons */}
              <div className="flex items-center space-x-1.5 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {/* Visual Split Compare Button */}
                {isDone && (
                  <button
                    type="button"
                    id={`compare-btn-${item.id}`}
                    onClick={() => onOpenCompare(item)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 border border-slate-200 transition-all cursor-pointer shadow-2xs"
                    title="Compare Before vs After"
                  >
                    <Eye className="w-4 h-4 text-blue-600" />
                  </button>
                )}

                {/* Download Single Image */}
                {isDone && (
                  <button
                    type="button"
                    id={`download-single-btn-${item.id}`}
                    onClick={() => downloadImage(item)}
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-all cursor-pointer"
                    title="Download Compressed Image"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}

                {/* Delete button */}
                <button
                  type="button"
                  id={`remove-item-btn-${item.id}`}
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-slate-200 text-slate-500 transition-all cursor-pointer shadow-2xs"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
