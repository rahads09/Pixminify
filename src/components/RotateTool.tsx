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

export const RotateTool: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [imgNaturalSize, setImgNaturalSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  // Transforms
  const [rotationAngle, setRotationAngle] = useState(0); // in degrees (0, 90, 180, 270 or arbitrary)
  const [fineAngle, setFineAngle] = useState(0); // -45 to +45 degrees fine straightening
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

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
      resetTransforms();
    }
  };

  const resetTransforms = () => {
    setRotationAngle(0);
    setFineAngle(0);
    setFlipH(false);
    setFlipV(false);
  };

  const rotateBy = (deg: number) => {
    setRotationAngle((prev) => (prev + deg + 360) % 360);
  };

  // Render rotated canvas
  const renderRotatedImage = useCallback(async () => {
    if (!sourceImage || !imgNaturalSize.w || !imgNaturalSize.h) return;
    setIsProcessing(true);

    try {
      const img = await loadImageElement(sourceImage);
      const totalDegrees = (rotationAngle + fineAngle) % 360;
      const totalRad = (totalDegrees * Math.PI) / 180;

      // Calculate bounding box of rotated rectangle
      const sin = Math.abs(Math.sin(totalRad));
      const cos = Math.abs(Math.cos(totalRad));
      const newWidth = Math.round(imgNaturalSize.w * cos + imgNaturalSize.h * sin);
      const newHeight = Math.round(imgNaturalSize.w * sin + imgNaturalSize.h * cos);

      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Background if converting to JPG
      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, newWidth, newHeight);
      }

      ctx.save();
      // Move to canvas center
      ctx.translate(newWidth / 2, newHeight / 2);
      ctx.rotate(totalRad);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      // Draw image centered
      ctx.drawImage(img, -imgNaturalSize.w / 2, -imgNaturalSize.h / 2, imgNaturalSize.w, imgNaturalSize.h);
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
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [sourceImage, imgNaturalSize, rotationAngle, fineAngle, flipH, flipV, outputFormat, quality]);

  useEffect(() => {
    if (sourceImage) {
      const timer = setTimeout(() => {
        renderRotatedImage();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [renderRotatedImage, sourceImage]);

  const handleDownload = () => {
    if (!resultBlob || !sourceFile) return;
    const baseName = sourceFile.name.substring(0, sourceFile.name.lastIndexOf('.')) || sourceFile.name;
    const ext = outputFormat === 'image/png' ? 'png' : outputFormat === 'image/webp' ? 'webp' : 'jpg';
    saveAs(resultBlob, `rotated_${baseName}.${ext}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
          <RotateCw className="w-4 h-4" />
          <span>Rotate & Flip Studio</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Rotate, Straighten & Flip Images
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Instantly fix upside down or sideways photos with 90° clockwise/counter-clockwise turns, custom straightening, and mirroring.
        </p>
      </div>

      {!sourceImage ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-white hover:bg-slate-50 rounded-2xl p-12 text-center transition-all cursor-pointer shadow-xs group flex flex-col items-center justify-center space-y-4"
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
            <p className="text-xs text-slate-600 max-w-sm">
              Supports JPEG, PNG, WebP, and AVIF formats.
            </p>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer">
            Browse File
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Stage (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              {/* Quick Action Bar */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => rotateBy(-90)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-white text-slate-700 hover:text-indigo-600 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>-90° Left</span>
                  </button>

                  <button
                    onClick={() => rotateBy(90)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-white text-slate-700 hover:text-indigo-600 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>+90° Right</span>
                  </button>

                  <button
                    onClick={() => rotateBy(180)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-white text-slate-700 hover:text-indigo-600 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                  >
                    <span>180° Flip</span>
                  </button>
                </div>

                <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setFlipH(!flipH)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      flipH ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:text-indigo-600'
                    }`}
                  >
                    <FlipHorizontal className="w-3.5 h-3.5" />
                    <span>Flip H</span>
                  </button>

                  <button
                    onClick={() => setFlipV(!flipV)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      flipV ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:text-indigo-600'
                    }`}
                  >
                    <FlipVertical className="w-3.5 h-3.5" />
                    <span>Flip V</span>
                  </button>

                  <button
                    onClick={resetTransforms}
                    className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Preview image */}
              <div className="w-full min-h-[380px] max-h-[520px] rounded-xl bg-slate-900/90 overflow-hidden flex items-center justify-center p-4 border border-slate-200">
                {resultUrl ? (
                  <img
                    src={resultUrl}
                    alt="Rotated Result"
                    className="max-h-[460px] max-w-full object-contain rounded-lg shadow-md transition-all duration-200"
                  />
                ) : (
                  <div className="text-xs text-slate-400">Rendering preview...</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Adjustments & Export (1 col) */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>Straightening & Export</span>
                {resultBlob && (
                  <span className="text-xs font-mono font-bold text-indigo-600">
                    {formatBytes(resultBlob.size)}
                  </span>
                )}
              </h3>

              {/* Fine Straightening Angle Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-700">
                  <span>Fine Angle Straighten:</span>
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
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>-45°</span>
                  <span>0°</span>
                  <span>+45°</span>
                </div>
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
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Download Action */}
              <div className="pt-2">
                <button
                  onClick={handleDownload}
                  disabled={!resultBlob || isProcessing}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Rotated Image</span>
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
