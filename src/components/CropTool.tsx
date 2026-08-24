import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Crop as CropIcon,
  Download,
  UploadCloud,
  Check,
  RefreshCw,
  Sparkles,
  Maximize,
  Square,
} from 'lucide-react';
import { saveAs } from 'file-saver';
import { loadImageElement, formatBytes } from '../utils/imageProcessor';

type AspectRatio = 'free' | '1:1' | '16:9' | '4:3' | '3:2' | '9:16' | 'circle';

export const CropTool: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [imgNaturalSize, setImgNaturalSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('free');
  const [cropBox, setCropBox] = useState<{ x: number; y: number; w: number; h: number }>({
    x: 10,
    y: 10,
    w: 80,
    h: 80,
  }); // percentages 0-100%

  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState(90);

  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDraggingBox, setIsDraggingBox] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; boxX: number; boxY: number }>({
    x: 0,
    y: 0,
    boxX: 10,
    boxY: 10,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSourceFile(file);
      const url = URL.createObjectURL(file);
      setSourceImage(url);

      const img = await loadImageElement(file);
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      setImgNaturalSize({ w, h });

      // Reset initial crop box
      setCropBox({ x: 10, y: 10, w: 80, h: 80 });
      setAspectRatio('free');
    }
  };

  // Adjust crop box based on selected aspect ratio
  const applyRatio = (ratio: AspectRatio) => {
    setAspectRatio(ratio);
    if (!imgNaturalSize.w || !imgNaturalSize.h) return;

    const imgRatio = imgNaturalSize.w / imgNaturalSize.h;
    let targetRatioNum = 1;

    if (ratio === '1:1' || ratio === 'circle') targetRatioNum = 1;
    else if (ratio === '16:9') targetRatioNum = 16 / 9;
    else if (ratio === '4:3') targetRatioNum = 4 / 3;
    else if (ratio === '3:2') targetRatioNum = 3 / 2;
    else if (ratio === '9:16') targetRatioNum = 9 / 16;
    else return; // 'free'

    // Compute width/height in percentage that matches target ratio
    let newW = 80;
    let newH = (newW * imgRatio) / targetRatioNum;

    if (newH > 80) {
      newH = 80;
      newW = (newH * targetRatioNum) / imgRatio;
    }

    const newX = (100 - newW) / 2;
    const newY = (100 - newH) / 2;

    setCropBox({
      x: Math.max(0, newX),
      y: Math.max(0, newY),
      w: Math.min(100, newW),
      h: Math.min(100, newH),
    });
  };

  // Render cropped preview canvas
  const renderCroppedImage = useCallback(async () => {
    if (!sourceImage || !imgNaturalSize.w || !imgNaturalSize.h) return;
    setIsProcessing(true);

    try {
      const img = await loadImageElement(sourceImage);
      const canvas = document.createElement('canvas');

      const pixelX = Math.round((cropBox.x / 100) * imgNaturalSize.w);
      const pixelY = Math.round((cropBox.y / 100) * imgNaturalSize.h);
      const pixelW = Math.max(1, Math.round((cropBox.w / 100) * imgNaturalSize.w));
      const pixelH = Math.max(1, Math.round((cropBox.h / 100) * imgNaturalSize.h));

      canvas.width = pixelW;
      canvas.height = pixelH;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Background
      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pixelW, pixelH);
      }

      if (aspectRatio === 'circle') {
        ctx.save();
        ctx.beginPath();
        ctx.arc(pixelW / 2, pixelH / 2, Math.min(pixelW, pixelH) / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
      }

      ctx.drawImage(img, pixelX, pixelY, pixelW, pixelH, 0, 0, pixelW, pixelH);

      if (aspectRatio === 'circle') {
        ctx.restore();
      }

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('Blob fail'))),
          outputFormat,
          outputFormat === 'image/png' ? undefined : quality / 100
        );
      });

      const url = URL.createObjectURL(blob);
      setResultBlob(blob);
      setResultUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [sourceImage, imgNaturalSize, cropBox, aspectRatio, outputFormat, quality]);

  useEffect(() => {
    if (sourceImage) {
      const timer = setTimeout(() => {
        renderCroppedImage();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [renderCroppedImage, sourceImage]);

  // Dragging crop box across image
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDraggingBox(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      boxX: cropBox.x,
      boxY: cropBox.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingBox || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const deltaXPct = ((e.clientX - dragStart.x) / rect.width) * 100;
    const deltaYPct = ((e.clientY - dragStart.y) / rect.height) * 100;

    let newX = dragStart.boxX + deltaXPct;
    let newY = dragStart.boxY + deltaYPct;

    newX = Math.max(0, Math.min(100 - cropBox.w, newX));
    newY = Math.max(0, Math.min(100 - cropBox.h, newY));

    setCropBox((prev) => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    setIsDraggingBox(false);
  };

  const handleDownload = () => {
    if (!resultBlob || !sourceFile) return;
    const baseName = sourceFile.name.substring(0, sourceFile.name.lastIndexOf('.')) || sourceFile.name;
    const ext = outputFormat === 'image/png' ? 'png' : outputFormat === 'image/webp' ? 'webp' : 'jpg';
    saveAs(resultBlob, `cropped_${baseName}.${ext}`);
  };

  return (
    <div className="space-y-6" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1">
          <CropIcon className="w-4 h-4" />
          <span>Precision Crop Studio</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Crop Photos Online with Custom Ratios
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Trim, re-frame, or convert images into standard ratios (Square, 16:9, 4:3, Circular Avatar) without uploading files to any server.
        </p>
      </div>

      {!sourceImage ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-white hover:bg-slate-50 rounded-2xl p-12 text-center transition-all cursor-pointer shadow-xs group flex flex-col items-center justify-center space-y-4"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-600 group-hover:text-white flex items-center justify-center transition-all shadow-xs group-hover:scale-105">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Select or Drop an Image to Crop
            </h3>
            <p className="text-xs text-slate-600 max-w-sm">
              Supports JPEG, PNG, WebP, and AVIF formats.
            </p>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer">
            Browse File
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Cropping Stage (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              {/* Aspect Ratio Selector Pills */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-semibold text-slate-700">Aspect Ratio:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'free', label: 'Freeform' },
                    { id: '1:1', label: '1:1 Square' },
                    { id: '16:9', label: '16:9 Landscape' },
                    { id: '4:3', label: '4:3 Standard' },
                    { id: '3:2', label: '3:2 Photo' },
                    { id: '9:16', label: '9:16 Story' },
                    { id: 'circle', label: 'Circle Avatar' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => applyRatio(r.id as AspectRatio)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        aspectRatio === r.id
                          ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Visual Overlay Stage */}
              <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                className="relative w-full h-[400px] sm:h-[460px] bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-4 select-none"
              >
                <div className="relative inline-block max-w-full max-h-full">
                  <img
                    src={sourceImage}
                    alt="Original To Crop"
                    className="max-h-[380px] max-w-full object-contain pointer-events-none rounded shadow"
                  />

                  {/* Darkened Mask */}
                  <div className="absolute inset-0 bg-black/50 pointer-events-none rounded" />

                  {/* Crop Window Highlight */}
                  <div
                    onMouseDown={handleMouseDown}
                    style={{
                      left: `${cropBox.x}%`,
                      top: `${cropBox.y}%`,
                      width: `${cropBox.w}%`,
                      height: `${cropBox.h}%`,
                      borderRadius: aspectRatio === 'circle' ? '9999px' : '4px',
                    }}
                    className="absolute border-2 border-emerald-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] cursor-move transition-shadow"
                  >
                    {/* Grid lines */}
                    <div className="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                      <div className="border-r border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-b border-white" />
                      <div className="border-r border-white" />
                      <div className="border-r border-white" />
                      <div />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>💡 Click & drag the highlighted box over the photo to adjust crop placement.</span>
                <span className="font-mono">
                  {imgNaturalSize.w} × {imgNaturalSize.h} px
                </span>
              </div>
            </div>
          </div>

          {/* Right Export Settings & Live Preview (1 col) */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>Live Crop Output</span>
                {resultBlob && (
                  <span className="text-xs font-mono font-bold text-emerald-600">
                    {formatBytes(resultBlob.size)}
                  </span>
                )}
              </h3>

              {/* Live Preview Box */}
              <div className="w-full h-44 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center p-2 overflow-hidden">
                {resultUrl ? (
                  <img
                    src={resultUrl}
                    alt="Cropped Preview"
                    className={`max-h-full max-w-full object-contain ${
                      aspectRatio === 'circle' ? 'rounded-full' : 'rounded-lg'
                    } shadow-xs`}
                  />
                ) : (
                  <span className="text-xs text-slate-400">Rendering preview...</span>
                )}
              </div>

              {/* Crop Size Sliders */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span>Crop Window Size:</span>
                    <span className="font-mono font-bold text-emerald-600">{Math.round(cropBox.w)}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={cropBox.w}
                    onChange={(e) => {
                      const newW = Number(e.target.value);
                      setCropBox((prev) => {
                        const newH = aspectRatio === 'free' ? prev.h : (newW * imgNaturalSize.w) / (imgNaturalSize.h * (aspectRatio === '16:9' ? 16/9 : aspectRatio === '4:3' ? 4/3 : 1));
                        return {
                          ...prev,
                          w: newW,
                          h: Math.min(100, Math.max(10, newH)),
                          x: Math.min(100 - newW, prev.x),
                        };
                      });
                    }}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                {/* Output Format */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Output Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'image/jpeg', label: 'JPG' },
                      { id: 'image/png', label: 'PNG' },
                      { id: 'image/webp', label: 'WebP' },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        onClick={() => setOutputFormat(fmt.id as any)}
                        className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          outputFormat === fmt.id
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Download Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleDownload}
                  disabled={!resultBlob || isProcessing}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Cropped Image</span>
                </button>
              </div>
            </div>

            {/* Change File Button */}
            <button
              onClick={() => {
                setSourceImage(null);
                setSourceFile(null);
              }}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-medium transition-all cursor-pointer shadow-2xs"
            >
              Choose Another Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
