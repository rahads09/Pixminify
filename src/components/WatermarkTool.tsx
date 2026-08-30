import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Stamp,
  Type,
  Image as ImageIcon,
  Download,
  Grid,
  RefreshCw,
  UploadCloud,
} from 'lucide-react';
import { saveAs } from 'file-saver';
import { loadImageElement, formatBytes } from '../utils/imageProcessor';
import { ToolUploadPage } from './ToolUploadPage';
import { ToolResultData } from '../types';

type WatermarkMode = 'text' | 'image';
type PositionOption =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'tile';

export interface WatermarkToolProps {
  onHasImageChange?: (hasImage: boolean) => void;
  onShowResult?: (result: ToolResultData) => void;
}

export const WatermarkTool: React.FC<WatermarkToolProps> = ({ onHasImageChange, onShowResult }) => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [imgNaturalSize, setImgNaturalSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    onHasImageChange?.(Boolean(sourceImage));
  }, [sourceImage, onHasImageChange]);

  const [mode, setMode] = useState<WatermarkMode>('text');

  // Text Watermark Options
  const [watermarkText, setWatermarkText] = useState('© 2026 Pixminify Copyright');
  const [fontFamily, setFontFamily] = useState<'sans-serif' | 'serif' | 'monospace' | 'Impact'>('sans-serif');
  const [fontSize, setFontSize] = useState(36);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [opacity, setOpacity] = useState(70);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState<PositionOption>('bottom-right');

  // Logo Watermark Options
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoNaturalSize, setLogoNaturalSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [logoScale, setLogoScale] = useState(25); // percentage of image width

  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState(90);

  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setSourceFile(file);
    const url = URL.createObjectURL(file);
    setSourceImage(url);

    const img = await loadImageElement(file);
    setImgNaturalSize({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
  };

  const handleMainFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setLogoImage(url);

      const img = await loadImageElement(file);
      setLogoNaturalSize({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
    }
  };

  // Render watermarked image onto high-res canvas
  const renderWatermarkedImage = useCallback(async () => {
    if (!sourceImage || !imgNaturalSize.w || !imgNaturalSize.h) return;
    setIsProcessing(true);

    try {
      const mainImg = await loadImageElement(sourceImage);
      const canvas = document.createElement('canvas');
      canvas.width = imgNaturalSize.w;
      canvas.height = imgNaturalSize.h;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas 2D context unavailable');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Background if converting to JPG
      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw original image
      ctx.drawImage(mainImg, 0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.globalAlpha = opacity / 100;

      const padding = Math.round(canvas.width * 0.03); // 3% margin

      if (mode === 'text') {
        // Calculate scaled font size based on image resolution
        const scaleFactor = Math.max(1, canvas.width / 1200);
        const actualFontSize = Math.round(fontSize * scaleFactor);

        ctx.font = `bold ${actualFontSize}px ${fontFamily}`;
        ctx.fillStyle = textColor;
        ctx.textBaseline = 'middle';

        // Add soft drop shadow for readability on any background
        ctx.shadowColor = textColor === '#FFFFFF' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)';
        ctx.shadowBlur = Math.round(actualFontSize * 0.15);

        const textMetrics = ctx.measureText(watermarkText);
        const textW = textMetrics.width;
        const textH = actualFontSize;

        if (position === 'tile') {
          // Tiled repeating pattern across entire canvas
          ctx.rotate((rotation * Math.PI) / 180);
          const stepX = textW + padding * 3;
          const stepY = textH + padding * 3;

          const diag = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);

          for (let x = -diag; x < diag * 1.5; x += stepX) {
            for (let y = -diag; y < diag * 1.5; y += stepY) {
              ctx.fillText(watermarkText, x, y);
            }
          }
        } else {
          // Specific 9-grid position
          let x = padding;
          let y = padding + textH / 2;

          if (position.includes('center') && !position.includes('left') && !position.includes('right')) {
            x = (canvas.width - textW) / 2;
          } else if (position.includes('right')) {
            x = canvas.width - textW - padding;
          }

          if (position.startsWith('center')) {
            y = canvas.height / 2;
          } else if (position.startsWith('bottom')) {
            y = canvas.height - padding - textH / 2;
          }

          ctx.translate(x + textW / 2, y);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.fillText(watermarkText, -textW / 2, 0);
        }
      } else if (mode === 'image' && logoImage && logoNaturalSize.w) {
        // Logo Watermark
        const logoImg = await loadImageElement(logoImage);
        const targetLogoW = Math.round(canvas.width * (logoScale / 100));
        const targetLogoH = Math.round(targetLogoW * (logoNaturalSize.h / logoNaturalSize.w));

        let x = padding;
        let y = padding;

        if (position.includes('center') && !position.includes('left') && !position.includes('right')) {
          x = (canvas.width - targetLogoW) / 2;
        } else if (position.includes('right')) {
          x = canvas.width - targetLogoW - padding;
        }

        if (position.startsWith('center')) {
          y = (canvas.height - targetLogoH) / 2;
        } else if (position.startsWith('bottom')) {
          y = canvas.height - targetLogoH - padding;
        }

        ctx.drawImage(logoImg, x, y, targetLogoW, targetLogoH);
      }

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
      console.error('Watermark generation error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [
    sourceImage,
    imgNaturalSize,
    mode,
    watermarkText,
    fontFamily,
    fontSize,
    textColor,
    opacity,
    rotation,
    position,
    logoImage,
    logoNaturalSize,
    logoScale,
    outputFormat,
    quality,
  ]);

  useEffect(() => {
    if (sourceImage) {
      const timer = setTimeout(() => {
        renderWatermarkedImage();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [renderWatermarkedImage, sourceImage]);

  const handleDownload = () => {
    if (!resultBlob || !sourceFile) return;
    const baseName = sourceFile.name.substring(0, sourceFile.name.lastIndexOf('.')) || sourceFile.name;
    const ext = outputFormat === 'image/png' ? 'png' : outputFormat === 'image/webp' ? 'webp' : 'jpg';
    const fileName = `watermarked_${baseName}.${ext}`;

    if (onShowResult) {
      onShowResult({
        toolId: 'watermark',
        toolName: 'Watermark Image',
        fileName,
        fileType: outputFormat,
        fileSize: resultBlob.size,
        blob: resultBlob,
        previewUrl: resultUrl || undefined,
        dimensions: imgNaturalSize.w && imgNaturalSize.h ? { width: imgNaturalSize.w, height: imgNaturalSize.h } : undefined,
        details: [
          { label: 'Mode', value: mode === 'text' ? `Text ("${watermarkText}")` : 'Logo / Image' },
          { label: 'Position', value: position.replace('-', ' ').toUpperCase() },
          { label: 'Output Format', value: outputFormat.replace('image/', '').toUpperCase() },
        ],
        onResetTool: () => {
          setSourceImage(null);
          setSourceFile(null);
          setResultBlob(null);
          setResultUrl(null);
        },
        onBackToWorkspace: () => {
          // Keep watermark workspace
        },
      });
    } else {
      saveAs(resultBlob, fileName);
    }
  };

  if (!sourceImage) {
    return (
      <ToolUploadPage
        title="Watermark Image"
        subtitle="Add a text or image watermark to your photo."
        acceptedFormats="Supports JPG, PNG, WebP, AVIF"
        accept="image/*"
        accentColor="amber"
        buttonText="Upload Image"
        onImageSelected={(files) => {
          if (files[0]) handleProcessFile(files[0]);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <Stamp className="w-4 h-4" />
            <span>Image Watermark & Copyright Tool</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Protect Photos with Text or Logo Watermarks
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {sourceFile?.name} • {imgNaturalSize.w} × {imgNaturalSize.h}px • {sourceFile && formatBytes(sourceFile.size)}
          </p>
        </div>

        <button
          onClick={() => {
            setSourceImage(null);
            setSourceFile(null);
            setResultBlob(null);
            setResultUrl(null);
          }}
          className="btn-interactive px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
        >
          Change Image
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Stage (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              {/* Mode Toggle Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setMode('text')}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      mode === 'text'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span>Text Watermark</span>
                  </button>

                  <button
                    onClick={() => setMode('image')}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      mode === 'image'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Logo Watermark</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setSourceImage(null);
                    setSourceFile(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
                >
                  Change Photo
                </button>
              </div>

              {/* Live Canvas Preview */}
              <div className="w-full min-h-[380px] max-h-[520px] rounded-xl bg-slate-900/90 overflow-hidden flex items-center justify-center p-4 border border-slate-200">
                {resultUrl ? (
                  <img
                    src={resultUrl}
                    alt="Watermarked Preview"
                    className="max-h-[460px] max-w-full object-contain rounded-lg shadow-md"
                  />
                ) : (
                  <div className="text-xs text-slate-400">Rendering watermark...</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Watermark Controls (1 col) */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>Watermark Settings</span>
                {resultBlob && (
                  <span className="text-xs font-mono font-bold text-amber-600">
                    {formatBytes(resultBlob.size)}
                  </span>
                )}
              </h3>

              {/* Text Mode Specific Controls */}
              {mode === 'text' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Watermark Text
                    </label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="e.g. © 2026 Copyright"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  {/* Font & Color */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Font
                      </label>
                      <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value as any)}
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                      >
                        <option value="sans-serif">Sans-Serif</option>
                        <option value="serif">Serif</option>
                        <option value="monospace">Monospace</option>
                        <option value="Impact">Bold Impact</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Color
                      </label>
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0.5"
                        />
                        <div className="flex space-x-1">
                          {['#FFFFFF', '#000000', '#FF3B30', '#FFCC00'].map((c) => (
                            <button
                              key={c}
                              onClick={() => setTextColor(c)}
                              className="w-5 h-5 rounded-full border border-slate-300 shadow-xs cursor-pointer"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Font Size Slider */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                      <span>Size:</span>
                      <span className="font-mono font-bold text-amber-600">{fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="14"
                      max="100"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>

                  {/* Rotation Slider */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                      <span>Rotation:</span>
                      <span className="font-mono font-bold text-amber-600">{rotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      value={rotation}
                      onChange={(e) => setRotation(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                /* Logo Mode Specific Controls */
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Select PNG Logo
                    </label>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/png,image/webp,image/svg+xml"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>{logoImage ? 'Change Logo File' : 'Upload PNG Logo'}</span>
                    </button>
                  </div>

                  {/* Scale Slider */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                      <span>Logo Scale:</span>
                      <span className="font-mono font-bold text-amber-600">{logoScale}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="80"
                      value={logoScale}
                      onChange={(e) => setLogoScale(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Shared Opacity Slider */}
              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1">
                  <span>Opacity:</span>
                  <span className="font-mono font-bold text-amber-600">{opacity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              {/* Position Grid 3x3 + Tile Pattern */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Placement Position
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-100 rounded-xl">
                  {[
                    'top-left',
                    'top-center',
                    'top-right',
                    'center-left',
                    'center',
                    'center-right',
                    'bottom-left',
                    'bottom-center',
                    'bottom-right',
                  ].map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setPosition(pos as PositionOption)}
                      className={`h-7 rounded text-[10px] font-medium transition-all cursor-pointer ${
                        position === pos
                          ? 'bg-amber-600 text-white font-bold shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {pos.replace('-', ' ')}
                    </button>
                  ))}
                </div>

                {mode === 'text' && (
                  <button
                    onClick={() => setPosition('tile')}
                    className={`w-full mt-2 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      position === 'tile'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    🛡️ Tiled Full Pattern (Anti-Theft)
                  </button>
                )}
              </div>

              {/* Download Action */}
              <div className="pt-2">
                <button
                  onClick={handleDownload}
                  disabled={!resultBlob || isProcessing}
                  className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Watermarked Image</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};
