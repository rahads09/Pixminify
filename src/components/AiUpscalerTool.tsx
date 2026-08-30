import React, { useState, useRef, useEffect } from 'react';
import {
  Maximize2,
  Download,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  AlertTriangle,
  Layers,
  ArrowRight,
  ZoomIn,
  Eye,
} from 'lucide-react';
import { saveAs } from 'file-saver';
import { formatBytes } from '../utils/imageProcessor';
import { upscaleImage, UpscaleProgress } from '../utils/upscalerEngine';
import { ToolUploadPage } from './ToolUploadPage';
import { ToolResultData } from '../types';

export interface AiUpscalerToolProps {
  onHasImageChange?: (hasImage: boolean) => void;
  onShowResult?: (result: ToolResultData) => void;
}

export const AiUpscalerTool: React.FC<AiUpscalerToolProps> = ({ onHasImageChange, onShowResult }) => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [imgNaturalSize, setImgNaturalSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    onHasImageChange?.(Boolean(sourceImage));
  }, [sourceImage, onHasImageChange]);

  const [scaleFactor, setScaleFactor] = useState<2 | 4>(2);
  const [resultCanvas, setResultCanvas] = useState<HTMLCanvasElement | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<UpscaleProgress>({
    currentTile: 0,
    totalTiles: 0,
    percent: 0,
    status: '',
  });
  const [processingTimeSec, setProcessingTimeSec] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Preview & Comparison controls
  const [splitPosition, setSplitPosition] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'split' | 'result' | 'original'>('split');
  const [outputFormat, setOutputFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDraggingSplit = useRef(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);

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
    setResultCanvas(null);
    setResultBlob(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setProcessingTimeSec(null);

    setSourceFile(file);
    const url = URL.createObjectURL(file);
    setSourceImage(url);

    const img = new Image();
    img.onload = () => {
      setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });

      // Run upscaling with current scale factor
      runUpscaling(img, scaleFactor, file.name);
    };
    img.src = url;
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

  const handleLoadSample = () => {
    // Generate a detailed sample photo on canvas
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 400, 300);
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 400, 300);

      // Fine geometric patterns and text
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        ctx.strokeRect(30 + i * 15, 30 + i * 10, 200 - i * 15, 160 - i * 10);
      }

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillText('Pixminify 4K Upscale', 40, 240);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText('Neural Super-Resolution Test', 40, 270);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'sample-lowres.png', { type: 'image/png' });
        handleFile(file);
      }
    }, 'image/png');
  };

  const runUpscaling = async (imgElement: HTMLImageElement, scale: 2 | 4, fileName?: string) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setProgress({
      currentTile: 0,
      totalTiles: 1,
      percent: 10,
      status: 'Preparing AI neural super-resolution model...',
    });

    const startTime = performance.now();

    try {
      // Memory warning for massive images
      if (imgElement.naturalWidth * scale > 8000 || imgElement.naturalHeight * scale > 8000) {
        throw new Error('Target image resolution exceeds browser canvas memory safety limits (8000px). Please try 2x or use a smaller input image.');
      }

      const canvas = await upscaleImage(imgElement, {
        scale,
        onProgress: (p) => setProgress(p),
      });

      setResultCanvas(canvas);

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setResultBlob(blob);
            if (resultUrl) URL.revokeObjectURL(resultUrl);
            const url = URL.createObjectURL(blob);
            setResultUrl(url);

            const endTime = performance.now();
            const elapsed = Math.round((endTime - startTime) / 100) / 10;
            setProcessingTimeSec(elapsed);
          }
          setIsProcessing(false);
        },
        outputFormat,
        0.95
      );
    } catch (err: unknown) {
      console.error('Upscaling error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
      setIsProcessing(false);
    }
  };

  const handleScaleChange = (scale: 2 | 4) => {
    setScaleFactor(scale);
    if (sourceImage) {
      const img = new Image();
      img.onload = () => {
        runUpscaling(img, scale);
      };
      img.src = sourceImage;
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !sourceFile) return;
    const baseName = sourceFile.name.replace(/\.[^/.]+$/, '');
    const ext = outputFormat === 'image/png' ? 'png' : outputFormat === 'image/webp' ? 'webp' : 'jpg';
    const filename = `${baseName}-upscaled-${scaleFactor}x.${ext}`;

    if (onShowResult) {
      onShowResult({
        toolId: 'upscaler',
        toolName: 'Image Upscaler',
        fileName: filename,
        fileType: outputFormat,
        fileSize: resultBlob.size,
        blob: resultBlob,
        previewUrl: resultUrl || undefined,
        dimensions: {
          width: imgNaturalSize.w * scaleFactor,
          height: imgNaturalSize.h * scaleFactor,
        },
        details: [
          { label: 'Scale Factor', value: `${scaleFactor}x Super Resolution` },
          { label: 'Output Resolution', value: `${imgNaturalSize.w * scaleFactor} × ${imgNaturalSize.h * scaleFactor} px` },
        ],
        onResetTool: handleReset,
        onBackToWorkspace: () => {
          // Keep current upscale workspace
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
    setResultCanvas(null);
    setResultBlob(null);
    setResultUrl(null);
    setErrorMessage(null);
    setProcessingTimeSec(null);
    setProgress({ currentTile: 0, totalTiles: 0, percent: 0, status: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Split view dragging
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

  const isLargeWarning = imgNaturalSize.w > 2000 || imgNaturalSize.h > 2000;

  if (!sourceImage) {
    return (
      <ToolUploadPage
        title="Image Upscaler"
        subtitle="Increase image resolution while preserving important details."
        acceptedFormats="Supports JPG, PNG, WebP"
        accept="image/png,image/jpeg,image/webp"
        accentColor="indigo"
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
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Neural Super-Resolution</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            AI Image Upscaler & Detail Enhancer
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
          {/* Top Toolbar: Scale Factor & Output Options */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Upscale Scale:
                </span>
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                  <button
                    onClick={() => handleScaleChange(2)}
                    disabled={isProcessing}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                      scaleFactor === 2
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 disabled:opacity-50'
                    }`}
                  >
                    <span>2x Scale</span>
                    <span className="text-[10px] opacity-80">
                      ({imgNaturalSize.w * 2} × {imgNaturalSize.h * 2})
                    </span>
                  </button>
                  <button
                    onClick={() => handleScaleChange(4)}
                    disabled={isProcessing}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                      scaleFactor === 4
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 disabled:opacity-50'
                    }`}
                  >
                    <span>4x Ultra Scale</span>
                    <span className="text-[10px] opacity-80">
                      ({imgNaturalSize.w * 4} × {imgNaturalSize.h * 4})
                    </span>
                  </button>
                </div>
              </div>

              {/* View Mode Tabs */}
              <div className="flex items-center space-x-2">
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
                    Upscaled Only
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
            </div>

            {/* Large Image Warning */}
            {isLargeWarning && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center space-x-3 text-amber-800 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Input image is large ({imgNaturalSize.w}×{imgNaturalSize.h}px). We recommend 2x upscaling to ensure smooth browser memory performance.
                </span>
              </div>
            )}

            {/* Processing Banner */}
            {isProcessing && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                    <span>{progress.status || 'Running neural super-resolution...'}</span>
                  </div>
                  <span>{progress.percent}%</span>
                </div>
                <div className="w-full h-2 bg-indigo-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300 ease-out"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
                <p className="text-[11px] text-indigo-700">
                  Processing completely client-side in WebAssembly & WebGPU.
                </p>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start space-x-3 text-rose-800 text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Upscaling Notice</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Interactive Preview Canvas Box */}
            <div
              ref={splitContainerRef}
              onMouseMove={handleSplitMouseMove}
              onMouseUp={handleSplitMouseUp}
              onTouchMove={handleSplitTouchMove}
              className="relative w-full h-[380px] sm:h-[480px] bg-slate-950 rounded-xl overflow-hidden select-none border border-slate-200 flex items-center justify-center"
            >
              {/* Only Result */}
              {viewMode === 'result' && (
                <img
                  src={resultUrl || sourceImage}
                  alt="Upscaled Image"
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

                  {/* Left side: Upscaled image with clipPath */}
                  {resultUrl && (
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{
                        clipPath: `polygon(0 0, ${splitPosition}% 0, ${splitPosition}% 100%, 0 100%)`,
                      }}
                    >
                      <img
                        src={resultUrl}
                        alt="Upscaled"
                        className="absolute inset-0 m-auto max-h-full max-w-full object-contain pointer-events-none"
                      />
                    </div>
                  )}

                  {/* Split Handle */}
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

                  {/* Floating Badges */}
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-blue-600/80 backdrop-blur-xs text-white text-[11px] font-bold flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{scaleFactor}x Upscaled ({imgNaturalSize.w * scaleFactor} × {imgNaturalSize.h * scaleFactor})</span>
                  </div>
                  <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold">
                    Original ({imgNaturalSize.w} × {imgNaturalSize.h})
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
                <span className="text-slate-500">Original:</span>
                <span>{imgNaturalSize.w} × {imgNaturalSize.h} px</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="text-blue-600 font-bold">
                  {imgNaturalSize.w * scaleFactor} × {imgNaturalSize.h * scaleFactor} px
                </span>
                {processingTimeSec !== null && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold">
                      Enhanced in {processingTimeSec}s
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
                  <span>Download {scaleFactor}x Image</span>
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
