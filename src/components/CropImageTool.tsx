import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Crop,
  Download,
  UploadCloud,
  Check,
  RefreshCw,
  Maximize2,
  Ratio,
  Sparkles,
} from 'lucide-react';
import { saveAs } from 'file-saver';
import { loadImageElement, formatBytes } from '../utils/imageProcessor';

interface CropBox {
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  width: number; // percentage
  height: number; // percentage
}

type AspectRatioOption = 'free' | '1:1' | '16:9' | '9:16' | '4:3' | '3:2' | '2:3';

export const CropImageTool: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [imgNaturalSize, setImgNaturalSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('free');
  
  // Crop area in percentage (0 to 100)
  const [cropBox, setCropBox] = useState<CropBox>({ x: 10, y: 10, width: 80, height: 80 });
  const [isCropping, setIsCropping] = useState(false);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState(90);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Dragging state
  const isDraggingRef = useRef(false);
  const dragModeRef = useRef<'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'w' | 'e' | null>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; box: CropBox }>({
    mouseX: 0,
    mouseY: 0,
    box: { x: 0, y: 0, width: 0, height: 0 },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      loadNewFile(e.target.files[0]);
    }
  };

  const loadNewFile = async (file: File) => {
    setSourceFile(file);
    const url = URL.createObjectURL(file);
    setSourceImage(url);
    setCroppedPreviewUrl(null);
    setCroppedBlob(null);

    const img = await loadImageElement(file);
    setImgNaturalSize({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
    resetCropBox(aspectRatio, img.naturalWidth || img.width, img.naturalHeight || img.height);
  };

  const resetCropBox = (ratio: AspectRatioOption, origW = imgNaturalSize.w, origH = imgNaturalSize.h) => {
    if (!origW || !origH) {
      setCropBox({ x: 10, y: 10, width: 80, height: 80 });
      return;
    }

    if (ratio === 'free') {
      setCropBox({ x: 10, y: 10, width: 80, height: 80 });
      return;
    }

    let targetRatio = 1;
    if (ratio === '1:1') targetRatio = 1;
    else if (ratio === '16:9') targetRatio = 16 / 9;
    else if (ratio === '9:16') targetRatio = 9 / 16;
    else if (ratio === '4:3') targetRatio = 4 / 3;
    else if (ratio === '3:2') targetRatio = 3 / 2;
    else if (ratio === '2:3') targetRatio = 2 / 3;

    const imgAspect = origW / origH;

    let width = 80;
    let height = 80;

    if (targetRatio > imgAspect) {
      // Crop box width limited by image width
      width = 80;
      height = (width / targetRatio) * imgAspect;
    } else {
      // Crop box height limited by image height
      height = 80;
      width = height * targetRatio * (1 / imgAspect);
    }

    // Ensure within bounds
    width = Math.min(90, Math.max(10, width));
    height = Math.min(90, Math.max(10, height));
    const x = (100 - width) / 2;
    const y = (100 - height) / 2;

    setCropBox({ x, y, width, height });
  };

  const handleRatioChange = (newRatio: AspectRatioOption) => {
    setAspectRatio(newRatio);
    resetCropBox(newRatio);
  };

  // Perform crop on canvas
  const executeCrop = useCallback(async () => {
    if (!sourceImage || !imgNaturalSize.w || !imgNaturalSize.h) return;
    setIsCropping(true);

    try {
      const img = await loadImageElement(sourceImage);
      const canvas = document.createElement('canvas');

      const cropX = Math.round((cropBox.x / 100) * imgNaturalSize.w);
      const cropY = Math.round((cropBox.y / 100) * imgNaturalSize.h);
      const cropW = Math.max(1, Math.round((cropBox.width / 100) * imgNaturalSize.w));
      const cropH = Math.max(1, Math.round((cropBox.height / 100) * imgNaturalSize.h));

      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Could not get canvas context');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Background fill if converting to JPG
      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, cropW, cropH);
      }

      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Failed to generate cropped blob'));
          },
          outputFormat,
          outputFormat === 'image/png' ? undefined : quality / 100
        );
      });

      const previewUrl = URL.createObjectURL(blob);
      setCroppedBlob(blob);
      setCroppedPreviewUrl(previewUrl);
    } catch (err) {
      console.error('Crop failed:', err);
    } finally {
      setIsCropping(false);
    }
  }, [sourceImage, imgNaturalSize, cropBox, outputFormat, quality]);

  // Execute crop whenever cropBox or format changes
  useEffect(() => {
    if (sourceImage) {
      const timer = setTimeout(() => {
        executeCrop();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [cropBox, outputFormat, quality, sourceImage, executeCrop]);

  // Drag listeners
  const startDrag = (mode: 'move' | 'nw' | 'ne' | 'sw' | 'se', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    dragModeRef.current = mode;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      box: { ...cropBox },
    };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!isDraggingRef.current || !imageContainerRef.current) return;

      const containerRect = imageContainerRef.current.getBoundingClientRect();
      const deltaXPercent = ((ev.clientX - dragStartRef.current.mouseX) / containerRect.width) * 100;
      const deltaYPercent = ((ev.clientY - dragStartRef.current.mouseY) / containerRect.height) * 100;
      const initial = dragStartRef.current.box;

      let newBox = { ...initial };

      if (dragModeRef.current === 'move') {
        newBox.x = Math.max(0, Math.min(100 - initial.width, initial.x + deltaXPercent));
        newBox.y = Math.max(0, Math.min(100 - initial.height, initial.y + deltaYPercent));
      } else if (dragModeRef.current === 'se') {
        newBox.width = Math.max(5, Math.min(100 - initial.x, initial.width + deltaXPercent));
        newBox.height = Math.max(5, Math.min(100 - initial.y, initial.height + deltaYPercent));
      } else if (dragModeRef.current === 'sw') {
        const potentialWidth = initial.width - deltaXPercent;
        if (potentialWidth >= 5 && initial.x + deltaXPercent >= 0) {
          newBox.x = initial.x + deltaXPercent;
          newBox.width = potentialWidth;
        }
        newBox.height = Math.max(5, Math.min(100 - initial.y, initial.height + deltaYPercent));
      } else if (dragModeRef.current === 'ne') {
        newBox.width = Math.max(5, Math.min(100 - initial.x, initial.width + deltaXPercent));
        const potentialHeight = initial.height - deltaYPercent;
        if (potentialHeight >= 5 && initial.y + deltaYPercent >= 0) {
          newBox.y = initial.y + deltaYPercent;
          newBox.height = potentialHeight;
        }
      } else if (dragModeRef.current === 'nw') {
        const potentialWidth = initial.width - deltaXPercent;
        const potentialHeight = initial.height - deltaYPercent;
        if (potentialWidth >= 5 && initial.x + deltaXPercent >= 0) {
          newBox.x = initial.x + deltaXPercent;
          newBox.width = potentialWidth;
        }
        if (potentialHeight >= 5 && initial.y + deltaYPercent >= 0) {
          newBox.y = initial.y + deltaYPercent;
          newBox.height = potentialHeight;
        }
      }

      setCropBox(newBox);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      dragModeRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleDownload = () => {
    if (!croppedBlob || !sourceFile) return;
    const baseName = sourceFile.name.substring(0, sourceFile.name.lastIndexOf('.')) || sourceFile.name;
    const ext = outputFormat === 'image/png' ? 'png' : outputFormat === 'image/webp' ? 'webp' : 'jpg';
    saveAs(croppedBlob, `cropped_${baseName}.${ext}`);
  };

  // Target cropped pixel dimensions
  const croppedPixelW = Math.round((cropBox.width / 100) * imgNaturalSize.w);
  const croppedPixelH = Math.round((cropBox.height / 100) * imgNaturalSize.h);

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="p-6 rounded-2xl bg-white/90 border border-sky-100/90 backdrop-blur-xl shadow-xs">
        <div className="flex items-center space-x-2 text-sky-600 text-xs font-semibold uppercase tracking-wider mb-1">
          <Crop className="w-4 h-4" />
          <span>Interactive Image Cropper</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Crop & Trim Images with Precision
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Select standard social aspect ratios or drag handles freely. Real-time preview with zero image quality degradation.
        </p>
      </div>

      {/* Upload area if no image */}
      {!sourceImage ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-sky-200 hover:border-blue-400 bg-white/80 hover:bg-sky-50/50 rounded-2xl p-12 text-center transition-all cursor-pointer shadow-xs group flex flex-col items-center justify-center space-y-4"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-sky-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-all shadow-xs group-hover:scale-105">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Select or Drop an Image to Crop
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Supports JPEG, PNG, WebP, AVIF, and BMP formats with instant client-side rendering.
            </p>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer">
            Browse File
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Cropping Stage (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 rounded-2xl bg-white/90 border border-sky-100 shadow-xs space-y-3">
              {/* Aspect Ratio Presets Bar */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
                  <Ratio className="w-4 h-4 text-blue-600" />
                  <span>Aspect Ratio:</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'free', label: 'Freeform' },
                    { id: '1:1', label: '1:1 Square' },
                    { id: '16:9', label: '16:9 Landscape' },
                    { id: '9:16', label: '9:16 Story' },
                    { id: '4:3', label: '4:3 Standard' },
                    { id: '3:2', label: '3:2 Photo' },
                  ].map((ratio) => (
                    <button
                      key={ratio.id}
                      onClick={() => handleRatioChange(ratio.id as AspectRatioOption)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                        aspectRatio === ratio.id
                          ? 'bg-blue-600 text-white shadow-xs font-semibold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crop Canvas Visual Area */}
              <div className="relative w-full max-h-[520px] rounded-xl overflow-hidden bg-slate-900/90 flex items-center justify-center select-none border border-slate-200 p-2">
                <div
                  ref={imageContainerRef}
                  className="relative inline-block max-w-full max-h-[500px]"
                >
                  <img
                    ref={imgRef}
                    src={sourceImage}
                    alt="Source"
                    className="max-h-[480px] w-auto object-contain block pointer-events-none rounded-lg"
                  />

                  {/* Darkened overlay outside crop box */}
                  <div
                    className="absolute inset-0 bg-black/55 pointer-events-none"
                    style={{
                      clipPath: `polygon(
                        0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%,
                        ${cropBox.x}% ${cropBox.y}%,
                        ${cropBox.x + cropBox.width}% ${cropBox.y}%,
                        ${cropBox.x + cropBox.width}% ${cropBox.y + cropBox.height}%,
                        ${cropBox.x}% ${cropBox.y + cropBox.height}%,
                        ${cropBox.x}% ${cropBox.y}%
                      )`,
                    }}
                  />

                  {/* Interactive Crop Box */}
                  <div
                    onMouseDown={(e) => startDrag('move', e)}
                    className="absolute border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.5)] cursor-move transition-shadow"
                    style={{
                      left: `${cropBox.x}%`,
                      top: `${cropBox.y}%`,
                      width: `${cropBox.width}%`,
                      height: `${cropBox.height}%`,
                    }}
                  >
                    {/* Rule-of-thirds grid lines */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                      <div className="border-r border-b border-white/30" />
                      <div className="border-r border-b border-white/30" />
                      <div className="border-b border-white/30" />
                      <div className="border-r border-b border-white/30" />
                      <div className="border-r border-b border-white/30" />
                      <div className="border-b border-white/30" />
                      <div className="border-r border-white/30" />
                      <div className="border-r border-white/30" />
                      <div />
                    </div>

                    {/* Corner Handles */}
                    <div
                      onMouseDown={(e) => startDrag('nw', e)}
                      className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-blue-600 rounded-sm cursor-nwse-resize shadow-md"
                    />
                    <div
                      onMouseDown={(e) => startDrag('ne', e)}
                      className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-blue-600 rounded-sm cursor-nesw-resize shadow-md"
                    />
                    <div
                      onMouseDown={(e) => startDrag('sw', e)}
                      className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-blue-600 rounded-sm cursor-nesw-resize shadow-md"
                    />
                    <div
                      onMouseDown={(e) => startDrag('se', e)}
                      className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-blue-600 rounded-sm cursor-nwse-resize shadow-md"
                    />

                    {/* Dimension Tag */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-white pointer-events-none">
                      {croppedPixelW} × {croppedPixelH} px
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Controls */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Drag the crop box or corners to adjust.</span>
                <button
                  onClick={() => resetCropBox(aspectRatio)}
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Box</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Output & Settings Panel (1 col) */}
          <div className="space-y-4">
            {/* Cropped Output Preview Card */}
            <div className="p-5 rounded-2xl bg-white/90 border border-sky-100 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>Cropped Output</span>
                {croppedBlob && (
                  <span className="text-xs font-mono font-bold text-blue-600">
                    {formatBytes(croppedBlob.size)}
                  </span>
                )}
              </h3>

              {/* Thumbnail */}
              <div className="w-full aspect-square rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center p-2 bg-transparency-grid">
                {croppedPreviewUrl ? (
                  <img
                    src={croppedPreviewUrl}
                    alt="Cropped Preview"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-xs"
                  />
                ) : (
                  <div className="text-xs text-slate-400">Rendering crop...</div>
                )}
              </div>

              {/* Stats & Info */}
              <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Output Dimensions:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {croppedPixelW} × {croppedPixelH} px
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Original Size:</span>
                  <span className="font-mono text-slate-600">
                    {imgNaturalSize.w} × {imgNaturalSize.h} px
                  </span>
                </div>
              </div>

              {/* Format & Quality Selection */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Save Format
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'image/jpeg', label: 'JPG' },
                      { id: 'image/png', label: 'PNG' },
                      { id: 'image/webp', label: 'WebP' },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        onClick={() => setOutputFormat(fmt.id as any)}
                        className={`py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                          outputFormat === fmt.id
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {outputFormat !== 'image/png' && (
                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                      <span className="font-medium">Quality:</span>
                      <span className="font-mono font-bold text-blue-600">{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleDownload}
                  disabled={!croppedBlob || isCropping}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Cropped Image</span>
                </button>

                <button
                  onClick={() => {
                    setSourceImage(null);
                    setSourceFile(null);
                  }}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-all cursor-pointer"
                >
                  Choose Another Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
