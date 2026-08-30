import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Download,
  RefreshCw,
  Eye,
  Layers,
  ShieldCheck,
  Zap,
  Info,
  Check,
  SlidersHorizontal,
  AlertCircle,
  Maximize2,
} from 'lucide-react';
import { saveAs } from 'file-saver';
import { formatBytes } from '../utils/imageProcessor';
import { ToolUploadPage } from './ToolUploadPage';
import { ToolResultData } from '../types';

// Dynamic import or direct import for @imgly/background-removal to support lazy loading
type RemoveBackgroundFn = typeof import('@imgly/background-removal').removeBackground;
let removeBgFn: RemoveBackgroundFn | null = null;

async function getRemoveBgFunction(): Promise<RemoveBackgroundFn> {
  if (!removeBgFn) {
    const mod = await import('@imgly/background-removal');
    removeBgFn = (mod.removeBackground || (mod as unknown as { default: RemoveBackgroundFn }).default) as RemoveBackgroundFn;
  }
  return removeBgFn;
}

export interface BackgroundRemoverToolProps {
  onHasImageChange?: (hasImage: boolean) => void;
  onShowResult?: (result: ToolResultData) => void;
}

export const BackgroundRemoverTool: React.FC<BackgroundRemoverToolProps> = ({ onHasImageChange, onShowResult }) => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [imgNaturalSize, setImgNaturalSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    onHasImageChange?.(Boolean(sourceImage));
  }, [sourceImage, onHasImageChange]);

  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [processingTimeSec, setProcessingTimeSec] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Preview options
  const [bgPreviewMode, setBgPreviewMode] = useState<'transparent' | 'white' | 'dark' | 'color'>('transparent');
  const [customBgColor, setCustomBgColor] = useState<string>('#3b82f6');
  const [splitPosition, setSplitPosition] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'split' | 'result' | 'original'>('split');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDraggingSplit = useRef(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  // Clean up object URLs on unmount or file change
  useEffect(() => {
    return () => {
      if (sourceImage) URL.revokeObjectURL(sourceImage);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [sourceImage, resultUrl]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setErrorMessage(null);
    setResultBlob(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setProcessingTimeSec(null);

    setSourceFile(file);
    const url = URL.createObjectURL(file);
    setSourceImage(url);

    // Read image dimensions
    const img = new Image();
    img.onload = () => {
      setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = url;

    // Start background removal automatically
    processBackgroundRemoval(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleLoadSample = async () => {
    try {
      setIsProcessing(true);
      setProgressStatus('Loading sample portrait...');
      setProgressPercent(10);
      
      // Load a clean sample image via canvas
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw background gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 600, 600);
        bgGrad.addColorStop(0, '#e0e7ff');
        bgGrad.addColorStop(1, '#c7d2fe');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 600, 600);

        // Draw subject (a circular portrait silhouette with features)
        ctx.fillStyle = '#312e81';
        ctx.beginPath();
        ctx.arc(300, 240, 100, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(300, 480, 180, Math.PI, 0, false);
        ctx.fill();

        // Accent badge
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(360, 200, 25, 0, Math.PI * 2);
        ctx.fill();
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'sample-portrait.png', { type: 'image/png' });
          handleFile(file);
        }
      }, 'image/png');
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const processBackgroundRemoval = async (file: File) => {
    setIsProcessing(true);
    setProgressPercent(15);
    setProgressStatus('Initializing AI segmentation engine...');
    const startTime = performance.now();

    try {
      const removeBg = await getRemoveBgFunction();

      setProgressPercent(30);
      setProgressStatus('Loading segmentation model (~20MB on first run, cached locally)...');

      // Call imgly background removal
      const outputBlob = await removeBg(file, {
        progress: (key: string, current: number, total: number) => {
          if (total > 0) {
            const pct = Math.round((current / total) * 100);
            if (key.includes('fetch')) {
              setProgressStatus(`Downloading neural model weights (${pct}%)...`);
              setProgressPercent(30 + Math.round(pct * 0.35));
            } else if (key.includes('compute') || key.includes('process')) {
              setProgressStatus(`Segmenting foreground & alpha matte (${pct}%)...`);
              setProgressPercent(65 + Math.round(pct * 0.3));
            }
          }
        },
      });

      const endTime = performance.now();
      const elapsed = Math.round((endTime - startTime) / 100) / 10;
      setProcessingTimeSec(elapsed);

      setResultBlob(outputBlob);
      const url = URL.createObjectURL(outputBlob);
      setResultUrl(url);
      setProgressPercent(100);
      setProgressStatus('Background successfully removed!');
    } catch (err: unknown) {
      console.error('Background removal error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(
        `Failed to remove background: ${msg}. Make sure your browser supports WebAssembly and has sufficient memory.`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !sourceFile) return;
    const baseName = sourceFile.name.replace(/\.[^/.]+$/, '');
    const filename = `${baseName}-transparent.png`;

    if (onShowResult) {
      onShowResult({
        toolId: 'background-remover',
        toolName: 'Background Remover',
        fileName: filename,
        fileType: 'image/png',
        fileSize: resultBlob.size,
        blob: resultBlob,
        previewUrl: resultUrl || undefined,
        dimensions: imgNaturalSize.w && imgNaturalSize.h ? { width: imgNaturalSize.w, height: imgNaturalSize.h } : undefined,
        details: [
          { label: 'Format', value: 'PNG (Transparent)' },
          { label: 'Processing', value: 'In-Browser AI (WASM)' },
        ],
        onResetTool: handleReset,
        onBackToWorkspace: () => {
          // Keep current background removal workspace
        },
      });
    } else {
      saveAs(resultBlob, filename);
    }
  };

  const handleReset = () => {
    if (sourceImage) URL.revokeObjectURL(sourceImage);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setSourceImage(null);
    setSourceFile(null);
    setResultBlob(null);
    setResultUrl(null);
    setErrorMessage(null);
    setProgressPercent(0);
    setProgressStatus('');
    setProcessingTimeSec(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Split view dragging handlers
  const handleSplitMouseDown = () => {
    isDraggingSplit.current = true;
  };

  const handleSplitMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingSplit.current || !splitContainerRef.current) return;
    const rect = splitContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSplitPosition((x / rect.width) * 100);
  };

  const handleSplitMouseUp = () => {
    isDraggingSplit.current = false;
  };

  const handleSplitTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!splitContainerRef.current || !e.touches[0]) return;
    const rect = splitContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    setSplitPosition((x / rect.width) * 100);
  };

  if (!sourceImage) {
    return (
      <ToolUploadPage
        title="Background Remover"
        subtitle="Remove the background from your image quickly."
        acceptedFormats="Supports JPG, PNG, WebP, AVIF"
        accept="image/png,image/jpeg,image/webp,image/avif"
        accentColor="blue"
        buttonText="Upload Image"
        onImageSelected={(files) => {
          if (files[0]) handleFile(files[0]);
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Workspace Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Neural Segmentation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            AI Background Remover & Cutout
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {sourceFile?.name} • {imgNaturalSize.w} × {imgNaturalSize.h}px • {sourceFile && formatBytes(sourceFile.size)}
          </p>
        </div>

        <button
          onClick={handleReset}
          className="btn-interactive px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
        >
          Change Image
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Image Workspace & Preview */}
        <div className="space-y-6">
          {/* Top Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Preview Mode:
                </span>
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                  <button
                    onClick={() => setViewMode('split')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      viewMode === 'split' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Split Compare
                  </button>
                  <button
                    onClick={() => setViewMode('result')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      viewMode === 'result' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Cutout Only
                  </button>
                  <button
                    onClick={() => setViewMode('original')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      viewMode === 'original' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Original
                  </button>
                </div>
              </div>

              {/* Background Color Swatches for Cutout Preview */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                  Backdrop:
                </span>
                <button
                  onClick={() => setBgPreviewMode('transparent')}
                  title="Transparent Checkerboard"
                  className={`w-7 h-7 rounded-lg border-2 transition-all ${
                    bgPreviewMode === 'transparent' ? 'border-blue-600 ring-2 ring-blue-400/20' : 'border-slate-300'
                  }`}
                  style={{
                    backgroundImage: `linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)`,
                    backgroundSize: '8px 8px',
                    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                  }}
                />
                <button
                  onClick={() => setBgPreviewMode('white')}
                  title="Solid White"
                  className={`w-7 h-7 rounded-lg bg-white border-2 transition-all ${
                    bgPreviewMode === 'white' ? 'border-blue-600 ring-2 ring-blue-400/20' : 'border-slate-300'
                  }`}
                />
                <button
                  onClick={() => setBgPreviewMode('dark')}
                  title="Dark Studio"
                  className={`w-7 h-7 rounded-lg bg-slate-900 border-2 transition-all ${
                    bgPreviewMode === 'dark' ? 'border-blue-600 ring-2 ring-blue-400/20' : 'border-slate-300'
                  }`}
                />
                <div className="relative flex items-center">
                  <input
                    type="color"
                    value={customBgColor}
                    onChange={(e) => {
                      setCustomBgColor(e.target.value);
                      setBgPreviewMode('color');
                    }}
                    title="Custom Backdrop Color"
                    className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Processing Banner */}
            {isProcessing && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                    <span>{progressStatus || 'Processing image with AI...'}</span>
                  </div>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-blue-700">
                  First run downloads the in-browser model weights (~20MB) directly into your browser cache.
                </p>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start space-x-3 text-rose-800 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Background Removal Error</p>
                  <p>{errorMessage}</p>
                  <button
                    onClick={() => sourceFile && processBackgroundRemoval(sourceFile)}
                    className="mt-2 inline-flex items-center space-x-1 font-semibold text-rose-700 underline"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Retry Process</span>
                  </button>
                </div>
              </div>
            )}

            {/* Image Canvas Preview Area */}
            <div
              ref={splitContainerRef}
              onMouseMove={handleSplitMouseMove}
              onMouseUp={handleSplitMouseUp}
              onTouchMove={handleSplitTouchMove}
              className="relative w-full h-[380px] sm:h-[480px] rounded-xl overflow-hidden select-none border border-slate-200 flex items-center justify-center"
              style={{
                backgroundColor:
                  bgPreviewMode === 'white'
                    ? '#ffffff'
                    : bgPreviewMode === 'dark'
                    ? '#0f172a'
                    : bgPreviewMode === 'color'
                    ? customBgColor
                    : 'transparent',
                backgroundImage:
                  bgPreviewMode === 'transparent'
                    ? `linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)`
                    : 'none',
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
              }}
            >
              {/* Only Result */}
              {viewMode === 'result' && (
                <img
                  src={resultUrl || sourceImage}
                  alt="Background Removed Result"
                  className="max-h-full max-w-full object-contain pointer-events-none"
                />
              )}

              {/* Only Original */}
              {viewMode === 'original' && (
                <img
                  src={sourceImage}
                  alt="Original Image"
                  className="max-h-full max-w-full object-contain pointer-events-none"
                />
              )}

              {/* Split Comparison */}
              {viewMode === 'split' && (
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Right side: Original */}
                  <img
                    src={sourceImage}
                    alt="Original"
                    className="absolute inset-0 m-auto max-h-full max-w-full object-contain pointer-events-none"
                  />

                  {/* Left side: Transparent Cutout overlaid with clipPath */}
                  {resultUrl && (
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{
                        clipPath: `polygon(0 0, ${splitPosition}% 0, ${splitPosition}% 100%, 0 100%)`,
                      }}
                    >
                      <img
                        src={resultUrl}
                        alt="Cutout"
                        className="absolute inset-0 m-auto max-h-full max-w-full object-contain pointer-events-none"
                      />
                    </div>
                  )}

                  {/* Split Divider Line and Handle */}
                  {resultUrl && (
                    <div
                      className="absolute top-0 bottom-0 z-20 cursor-ew-resize flex items-center justify-center"
                      style={{ left: `${splitPosition}%` }}
                      onMouseDown={handleSplitMouseDown}
                    >
                      <div className="w-0.5 h-full bg-white shadow-md" />
                      <div className="absolute w-8 h-8 rounded-full bg-white border border-slate-300 shadow-lg flex items-center justify-center text-slate-700 hover:scale-110 transition-transform">
                        <SlidersHorizontal className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                  )}

                  {/* Floating Labels */}
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold">
                    Cutout
                  </div>
                  <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold">
                    Original
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions & Statistics */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">
                  {sourceFile?.name}
                </span>
                <span>•</span>
                <span>
                  {imgNaturalSize.w} × {imgNaturalSize.h} px
                </span>
                <span>•</span>
                <span>{sourceFile ? formatBytes(sourceFile.size) : ''}</span>
                {processingTimeSec !== null && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold">
                      Processed in {processingTimeSec}s
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  onClick={handleReset}
                  disabled={isProcessing}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all disabled:opacity-50"
                >
                  Process Another Image
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!resultBlob || isProcessing}
                  className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Transparent PNG</span>
                </button>
              </div>
            </div>
          </div>

        {/* Privacy Note Badge */}
        <div className="flex items-center justify-center space-x-2 pt-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            Your images are processed directly in your browser and are not uploaded to our servers.
          </span>
        </div>
      </div>
    </div>
  );
};
