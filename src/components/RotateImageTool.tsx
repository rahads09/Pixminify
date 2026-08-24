import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Download,
  UploadCloud,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { saveAs } from 'file-saver';
import { loadImageElement, formatBytes } from '../utils/imageProcessor';

export const RotateImageTool: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [imgNaturalSize, setImgNaturalSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  // Transformation states
  const [rotationDegrees, setRotationDegrees] = useState<number>(0); // 0, 90, 180, 270, etc.
  const [fineAngle, setFineAngle] = useState<number>(0); // -45 to +45
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState(90);

  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSourceFile(file);
      const url = URL.createObjectURL(file);
      setSourceImage(url);

      const img = await loadImageElement(file);
      setImgNaturalSize({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
      resetTransformations();
    }
  };

  const resetTransformations = () => {
    setRotationDegrees(0);
    setFineAngle(0);
    setFlipH(false);
    setFlipV(false);
  };

  // Render transformed canvas
  const renderTransformedImage = useCallback(async () => {
    if (!sourceImage || !imgNaturalSize.w || !imgNaturalSize.h) return;
    setIsProcessing(true);

    try {
      const img = await loadImageElement(sourceImage);
      const canvas = document.createElement('canvas');

      const totalAngleRad = ((rotationDegrees + fineAngle) * Math.PI) / 180;
      const sin = Math.abs(Math.sin(totalAngleRad));
      const cos = Math.abs(Math.cos(totalAngleRad));

      const newWidth = Math.round(img.naturalWidth * cos + img.naturalHeight * sin);
      const newHeight = Math.round(img.naturalWidth * sin + img.naturalHeight * cos);

      canvas.width = Math.max(1, newWidth);
      canvas.height = Math.max(1, newHeight);
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Failed to get canvas context');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Background if converting to JPG
      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(totalAngleRad);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      ctx.restore();

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Blob creation failed'));
          },
          outputFormat,
          outputFormat === 'image/png' ? undefined : quality / 100
        );
      });

      const url = URL.createObjectURL(blob);
      setResultBlob(blob);
      setResultUrl(url);
    } catch (err) {
      console.error('Transform error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [sourceImage, imgNaturalSize, rotationDegrees, fineAngle, flipH, flipV, outputFormat, quality]);

  useEffect(() => {
    if (sourceImage) {
      const timer = setTimeout(() => {
        renderTransformedImage();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [renderTransformedImage, sourceImage]);

  const handleDownload = () => {
    if (!resultBlob || !sourceFile) return;
    const baseName = sourceFile.name.substring(0, sourceFile.name.lastIndexOf('.')) || sourceFile.name;
    const ext = outputFormat === 'image/png' ? 'png' : outputFormat === 'image/webp' ? 'webp' : 'jpg';
    saveAs(resultBlob, `rotated_${baseName}.${ext}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white/90 border border-sky-100/90 backdrop-blur-xl shadow-xs">
        <div className="flex items-center space-x-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
          <RotateCw className="w-4 h-4" />
          <span>Rotate & Mirror Tool</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Rotate, Flip & Straighten Images
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Easily fix image orientations with 90° rotations, horizontal/vertical mirror flipping, and fine angle adjustments.
        </p>
      </div>

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
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition-all shadow-xs group-hover:scale-105">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Select or Drop an Image to Rotate
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Supports JPEG, PNG, WebP, and AVIF with instant interactive previews.
            </p>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer">
            Browse File
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Stage (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 rounded-2xl bg-white/90 border border-sky-100 shadow-xs space-y-4">
              {/* Quick Transform Buttons Toolbar */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => setRotationDegrees((prev) => (prev - 90 + 360) % 360)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-indigo-600" />
                  <span>Rotate -90°</span>
                </button>

                <button
                  onClick={() => setRotationDegrees((prev) => (prev + 90) % 360)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <RotateCw className="w-4 h-4 text-indigo-600" />
                  <span>Rotate +90°</span>
                </button>

                <button
                  onClick={() => setRotationDegrees((prev) => (prev + 180) % 360)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-indigo-600" />
                  <span>180°</span>
                </button>

                <button
                  onClick={() => setFlipH((prev) => !prev)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    flipH ? 'bg-indigo-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <FlipHorizontal className="w-4 h-4" />
                  <span>Flip Horizontal</span>
                </button>

                <button
                  onClick={() => setFlipV((prev) => !prev)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    flipV ? 'bg-indigo-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <FlipVertical className="w-4 h-4" />
                  <span>Flip Vertical</span>
                </button>

                <button
                  onClick={resetTransformations}
                  className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium transition-all cursor-pointer"
                >
                  Reset
                </button>
              </div>

              {/* Fine Angle Slider */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex justify-between text-xs text-slate-700">
                  <span className="font-medium">Fine Angle Straighten:</span>
                  <span className="font-mono font-bold text-indigo-600">{fineAngle}°</span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={fineAngle}
                  onChange={(e) => setFineAngle(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Live Preview Display */}
              <div className="w-full min-h-[380px] max-h-[520px] rounded-xl bg-slate-900/90 overflow-hidden flex items-center justify-center p-4 border border-slate-200">
                {resultUrl ? (
                  <img
                    src={resultUrl}
                    alt="Rotated result"
                    className="max-h-[460px] max-w-full object-contain rounded-lg shadow-md"
                  />
                ) : (
                  <div className="text-xs text-slate-400">Rendering preview...</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Download & Settings (1 col) */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white/90 border border-sky-100 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>Export Settings</span>
                {resultBlob && (
                  <span className="text-xs font-mono font-bold text-indigo-600">
                    {formatBytes(resultBlob.size)}
                  </span>
                )}
              </h3>

              {/* Format selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Output Format
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
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality slider */}
              {outputFormat !== 'image/png' && (
                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span className="font-medium">Quality:</span>
                    <span className="font-mono font-bold text-indigo-600">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              )}

              {/* Transformation Summary */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Total Rotation:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {(rotationDegrees + fineAngle + 360) % 360}°
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Horizontal Flip:</span>
                  <span className="font-medium text-slate-800">{flipH ? 'Yes (Mirrored)' : 'No'}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Vertical Flip:</span>
                  <span className="font-medium text-slate-800">{flipV ? 'Yes' : 'No'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleDownload}
                  disabled={!resultBlob || isProcessing}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Rotated Image</span>
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
