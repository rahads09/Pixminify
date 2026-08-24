import React, { useState } from 'react';
import { RefreshCw, ArrowRight, Download } from 'lucide-react';
import { ImageFormat, ProcessedImage } from '../types';
import { DropZone } from './DropZone';
import { processSingleImage, downloadAllAsZip, downloadImage, formatBytes } from '../utils/imageProcessor';

interface FormatConverterToolProps {
  onLoadSample: (url: string, name: string) => void;
}

export const FormatConverterTool: React.FC<FormatConverterToolProps> = ({ onLoadSample }) => {
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('image/webp');
  const [items, setItems] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const formats: { value: ImageFormat; label: string; desc: string }[] = [
    { value: 'image/webp', label: 'WebP', desc: 'Fast, lightweight & modern for all web browsers' },
    { value: 'image/avif', label: 'AVIF', desc: 'Ultra-compressed next-generation codec' },
    { value: 'image/png', label: 'PNG', desc: 'Lossless with transparent alpha channel' },
    { value: 'image/jpeg', label: 'JPEG', desc: 'Universally compatible format' },
  ];

  const handleFilesAdded = async (files: File[]) => {
    const newItems: ProcessedImage[] = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      name: file.name,
      originalSize: file.size,
      originalWidth: 0,
      originalHeight: 0,
      originalType: file.type || 'image/jpeg',
      originalPreviewUrl: URL.createObjectURL(file),
      status: 'idle',
    }));

    setItems((prev) => [...prev, ...newItems]);

    setIsProcessing(true);
    const processedList: ProcessedImage[] = [];

    for (const item of newItems) {
      const result = await processSingleImage(item, {
        format: targetFormat,
        quality: 0.85,
        resizeMode: 'none',
        resizePercent: 100,
        maintainAspectRatio: true,
        stripExif: true,
      });
      processedList.push(result);
    }

    setItems((prev) =>
      prev.map((it) => {
        const found = processedList.find((p) => p.id === it.id);
        return found || it;
      })
    );
    setIsProcessing(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-1">
          <RefreshCw className="w-4 h-4" />
          <span>Batch Format Converter</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Convert Between PNG, JPG, WebP & AVIF in Batches
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Convert hundreds of images right in your browser with zero upload wait time and complete privacy.
        </p>

        {/* Target format selection row */}
        <div className="mt-5 pt-5 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
            Select Target Conversion Format:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {formats.map((fmt) => (
              <button
                key={fmt.value}
                onClick={() => setTargetFormat(fmt.value)}
                className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                  targetFormat === fmt.value
                    ? 'border-blue-500 bg-blue-50/80 shadow-xs ring-1 ring-blue-500/40'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="font-bold text-slate-900 text-sm">{fmt.label}</div>
                <div className="text-[11px] text-slate-600 mt-0.5">{fmt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <DropZone onFilesAdded={handleFilesAdded} onLoadSample={onLoadSample} disabled={isProcessing} />

      {/* Processed Results */}
      {items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Converted Files ({items.length})
            </h3>
            <button
              onClick={() => downloadAllAsZip(items)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download All as ZIP</span>
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={item.compressedPreviewUrl || item.originalPreviewUrl}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200"
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-900 truncate max-w-xs">{item.name}</div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
                      <span>{item.originalType.replace('image/', '')}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="text-blue-600 font-bold">
                        {item.compressedType ? item.compressedType.replace('image/', '') : targetFormat.replace('image/', '')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono text-slate-700">
                    {item.compressedSize ? formatBytes(item.compressedSize) : 'Processing...'}
                  </span>
                  {item.compressedBlob && (
                    <button
                      onClick={() => downloadImage(item)}
                      className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors cursor-pointer"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
