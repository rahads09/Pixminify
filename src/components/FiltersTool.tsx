import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  SlidersHorizontal,
  Sparkles,
  Download,
  UploadCloud,
  RefreshCw,
  Sun,
  Contrast,
  Palette,
  Eye,
} from 'lucide-react';
import { saveAs } from 'file-saver';
import { loadImageElement, formatBytes } from '../utils/imageProcessor';

interface FilterPreset {
  id: string;
  name: string;
  brightness: number;
  contrast: number;
  saturate: number;
  grayscale: number;
  sepia: number;
  blur: number;
  hueRotate: number;
  invert: number;
}

const PRESETS: FilterPreset[] = [
  {
    id: 'original',
    name: 'Normal',
    brightness: 100,
    contrast: 100,
    saturate: 100,
    grayscale: 0,
    sepia: 0,
    blur: 0,
    hueRotate: 0,
    invert: 0,
  },
  {
    id: 'vivid',
    name: 'Vivid Pop',
    brightness: 105,
    contrast: 120,
    saturate: 140,
    grayscale: 0,
    sepia: 0,
    blur: 0,
    hueRotate: 0,
    invert: 0,
  },
  {
    id: 'bw_contrast',
    name: 'Noir B&W',
    brightness: 105,
    contrast: 140,
    saturate: 0,
    grayscale: 100,
    sepia: 0,
    blur: 0,
    hueRotate: 0,
    invert: 0,
  },
  {
    id: 'vintage',
    name: 'Vintage Film',
    brightness: 105,
    contrast: 90,
    saturate: 85,
    grayscale: 0,
    sepia: 40,
    blur: 0,
    hueRotate: -10,
    invert: 0,
  },
  {
    id: 'warm_sunset',
    name: 'Warm Sunset',
    brightness: 108,
    contrast: 110,
    saturate: 130,
    grayscale: 0,
    sepia: 25,
    blur: 0,
    hueRotate: 15,
    invert: 0,
  },
  {
    id: 'cool_cyber',
    name: 'Cool Cyber',
    brightness: 95,
    contrast: 125,
    saturate: 120,
    grayscale: 0,
    sepia: 0,
    blur: 0,
    hueRotate: 180,
    invert: 0,
  },
];

export const FiltersTool: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [imgNaturalSize, setImgNaturalSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  // Filter adjustments
  const [brightness, setBrightness] = useState(100); // 0 to 200%
  const [contrast, setContrast] = useState(100); // 0 to 200%
  const [saturate, setSaturate] = useState(100); // 0 to 200%
  const [grayscale, setGrayscale] = useState(0); // 0 to 100%
  const [sepia, setSepia] = useState(0); // 0 to 100%
  const [blur, setBlur] = useState(0); // 0 to 20px
  const [hueRotate, setHueRotate] = useState(0); // 0 to 360 deg
  const [invert, setInvert] = useState(0); // 0 to 100%

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
      resetFilters();
    }
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturate(100);
    setGrayscale(0);
    setSepia(0);
    setBlur(0);
    setHueRotate(0);
    setInvert(0);
  };

  const applyPreset = (preset: FilterPreset) => {
    setBrightness(preset.brightness);
    setContrast(preset.contrast);
    setSaturate(preset.saturate);
    setGrayscale(preset.grayscale);
    setSepia(preset.sepia);
    setBlur(preset.blur);
    setHueRotate(preset.hueRotate);
    setInvert(preset.invert);
  };

  // Render canvas with CSS filter string
  const renderFilteredImage = useCallback(async () => {
    if (!sourceImage || !imgNaturalSize.w || !imgNaturalSize.h) return;
    setIsProcessing(true);

    try {
      const img = await loadImageElement(sourceImage);
      const canvas = document.createElement('canvas');
      canvas.width = imgNaturalSize.w;
      canvas.height = imgNaturalSize.h;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas context error');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Background if converting to JPG
      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Apply CSS filter
      const filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px) hue-rotate(${hueRotate}deg) invert(${invert}%)`;
      ctx.filter = filterString;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

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
      console.error('Filter apply error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [
    sourceImage,
    imgNaturalSize,
    brightness,
    contrast,
    saturate,
    grayscale,
    sepia,
    blur,
    hueRotate,
    invert,
    outputFormat,
    quality,
  ]);

  useEffect(() => {
    if (sourceImage) {
      const timer = setTimeout(() => {
        renderFilteredImage();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [renderFilteredImage, sourceImage]);

  const handleDownload = () => {
    if (!resultBlob || !sourceFile) return;
    const baseName = sourceFile.name.substring(0, sourceFile.name.lastIndexOf('.')) || sourceFile.name;
    const ext = outputFormat === 'image/png' ? 'png' : outputFormat === 'image/webp' ? 'webp' : 'jpg';
    saveAs(resultBlob, `filtered_${baseName}.${ext}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 text-cyan-600 text-xs font-semibold uppercase tracking-wider mb-1">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Color & Filters Tool</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Enhance Photo Colors, Tone & Looks
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Fine-tune brightness, contrast, saturation, and blur, or apply curated 1-click aesthetic presets.
        </p>
      </div>

      {!sourceImage ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-cyan-300 hover:border-cyan-500 bg-white hover:bg-slate-50 rounded-2xl p-12 text-center transition-all cursor-pointer shadow-xs group flex flex-col items-center justify-center space-y-4"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 group-hover:bg-cyan-600 text-cyan-600 group-hover:text-white flex items-center justify-center transition-all shadow-xs group-hover:scale-105">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Select or Drop an Image to Filter
            </h3>
            <p className="text-xs text-slate-600 max-w-sm">
              Supports JPEG, PNG, WebP, and AVIF.
            </p>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer">
            Browse File
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Stage (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              {/* Presets Bar */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-semibold text-slate-700">1-Click Presets:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => applyPreset(p)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-all cursor-pointer"
                    >
                      {p.name}
                    </button>
                  ))}
                  <button
                    onClick={resetFilters}
                    className="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 cursor-pointer"
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
                    alt="Filtered Result"
                    className="max-h-[460px] max-w-full object-contain rounded-lg shadow-md"
                  />
                ) : (
                  <div className="text-xs text-slate-400">Rendering filters...</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Adjustments & Export (1 col) */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>Color Adjustments</span>
                {resultBlob && (
                  <span className="text-xs font-mono font-bold text-cyan-600">
                    {formatBytes(resultBlob.size)}
                  </span>
                )}
              </h3>

              {/* Brightness */}
              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1">
                  <span>Brightness:</span>
                  <span className="font-mono font-bold text-cyan-600">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>

              {/* Contrast */}
              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1">
                  <span>Contrast:</span>
                  <span className="font-mono font-bold text-cyan-600">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>

              {/* Saturation */}
              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1">
                  <span>Saturation:</span>
                  <span className="font-mono font-bold text-cyan-600">{saturate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturate}
                  onChange={(e) => setSaturate(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>

              {/* Grayscale */}
              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1">
                  <span>Grayscale:</span>
                  <span className="font-mono font-bold text-cyan-600">{grayscale}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={grayscale}
                  onChange={(e) => setGrayscale(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>

              {/* Blur */}
              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1">
                  <span>Blur:</span>
                  <span className="font-mono font-bold text-cyan-600">{blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>

              {/* Download Action */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleDownload}
                  disabled={!resultBlob || isProcessing}
                  className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Enhanced Image</span>
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
