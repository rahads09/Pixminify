import React, { useState, useRef } from 'react';
import {
  FileText,
  UploadCloud,
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  Settings,
  Sparkles,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { loadImageElement, formatBytes } from '../utils/imageProcessor';

interface PdfImageItem {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  name: string;
  size: number;
}

export const ImageToPdfTool: React.FC = () => {
  const [images, setImages] = useState<PdfImageItem[]>([]);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'auto'>('portrait');
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [margin, setMargin] = useState<'none' | 'small' | 'normal'>('small');
  const [imageFit, setImageFit] = useState<'fit' | 'fill' | 'center'>('fit');
  const [showPageNumbers, setShowPageNumbers] = useState<boolean>(true);
  const [pdfFileName, setPdfFileName] = useState<string>('pixminify_document');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesAdded = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: PdfImageItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        try {
          const img = await loadImageElement(file);
          newItems.push({
            id: `pdf-img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file,
            previewUrl,
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height,
            name: file.name,
            size: file.size,
          });
        } catch (e) {
          console.error('Failed to load image for PDF:', e);
        }
      }
    }

    setImages((prev) => [...prev, ...newItems]);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setImages(updated);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const clearAll = () => {
    setImages([]);
  };

  // Generate & Download PDF
  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      // Create first page
      let doc: jsPDF | null = null;

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        const img = await loadImageElement(item.file);

        // Determine orientation
        let pageOrient: 'p' | 'l' = 'p';
        if (orientation === 'landscape') pageOrient = 'l';
        else if (orientation === 'portrait') pageOrient = 'p';
        else {
          // Auto: match image aspect ratio
          pageOrient = item.width > item.height ? 'l' : 'p';
        }

        // Determine page dimensions in mm
        let pWidth = 210; // A4 portrait width
        let pHeight = 297; // A4 portrait height

        if (pageSize === 'letter') {
          pWidth = 215.9;
          pHeight = 279.4;
        } else if (pageSize === 'fit') {
          // Exactly fit the image pixels converted to mm (roughly 96 DPI: 1px = 0.264583 mm)
          pWidth = Math.max(50, item.width * 0.264583);
          pHeight = Math.max(50, item.height * 0.264583);
        }

        if (pageOrient === 'l' && pageSize !== 'fit') {
          const temp = pWidth;
          pWidth = pHeight;
          pHeight = temp;
        }

        // Initialize doc on first item or add new page
        if (i === 0) {
          doc = new jsPDF({
            orientation: pageOrient,
            unit: 'mm',
            format: pageSize === 'fit' ? [pWidth, pHeight] : pageSize,
          });
        } else if (doc) {
          doc.addPage(pageSize === 'fit' ? [pWidth, pHeight] : pageSize, pageOrient);
        }

        if (!doc) continue;

        // Margins in mm
        let marginMm = 0;
        if (margin === 'small') marginMm = 6;
        else if (margin === 'normal') marginMm = 15;

        if (pageSize === 'fit') marginMm = 0;

        const availableW = pWidth - marginMm * 2;
        const availableH = pHeight - marginMm * 2;

        let renderW = availableW;
        let renderH = availableH;
        let posX = marginMm;
        let posY = marginMm;

        const imgRatio = item.width / item.height;
        const pageRatio = availableW / availableH;

        if (imageFit === 'fit') {
          if (imgRatio > pageRatio) {
            // Limited by width
            renderW = availableW;
            renderH = renderW / imgRatio;
            posY = marginMm + (availableH - renderH) / 2;
          } else {
            // Limited by height
            renderH = availableH;
            renderW = renderH * imgRatio;
            posX = marginMm + (availableW - renderW) / 2;
          }
        } else if (imageFit === 'center') {
          // Center without scaling larger than available
          const naturalW_mm = item.width * 0.264583;
          const naturalH_mm = item.height * 0.264583;

          const scale = Math.min(1, availableW / naturalW_mm, availableH / naturalH_mm);
          renderW = naturalW_mm * scale;
          renderH = naturalH_mm * scale;
          posX = marginMm + (availableW - renderW) / 2;
          posY = marginMm + (availableH - renderH) / 2;
        } else {
          // Fill / Stretch
          renderW = availableW;
          renderH = availableH;
        }

        // Draw image onto canvas to get clean JPEG/PNG data URL
        const canvas = document.createElement('canvas');
        canvas.width = item.width;
        canvas.height = item.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          doc.addImage(dataUrl, 'JPEG', posX, posY, renderW, renderH, undefined, 'FAST');
        }

        // Optional page number footer
        if (showPageNumbers && pageSize !== 'fit') {
          doc.setFontSize(9);
          doc.setTextColor(130, 140, 155);
          doc.text(
            `Page ${i + 1} of ${images.length}`,
            pWidth / 2,
            pHeight - Math.max(3, marginMm / 2),
            { align: 'center' }
          );
        }
      }

      if (doc) {
        doc.save(`${pdfFileName.trim() || 'pixminify_document'}.pdf`);
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 text-rose-600 text-xs font-semibold uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4" />
          <span>Image to PDF Document Generator</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Convert Images to a Single Multi-Page PDF
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Combine photos, scans, receipts or presentation slides into a professional, compressed PDF with custom layouts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Images List & Drag Area (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-rose-300 hover:border-rose-500 bg-white hover:bg-slate-50 rounded-2xl p-8 text-center transition-all cursor-pointer shadow-xs group flex flex-col items-center justify-center space-y-3"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFilesAdded(e.target.files)}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-xl bg-rose-50 group-hover:bg-rose-600 text-rose-600 group-hover:text-white flex items-center justify-center transition-all shadow-xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-0.5">
                Drop Images Here or Click to Add
              </h3>
              <p className="text-xs text-slate-600">
                Add multiple JPG, PNG, WebP images to merge into pages.
              </p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer">
              + Add Images
            </button>
          </div>

          {/* Image List & Ordering */}
          {images.length > 0 && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <span>Pages in PDF ({images.length})</span>
                </h3>
                <button
                  onClick={clearAll}
                  className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {images.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:border-slate-300 transition-all"
                  >
                    {/* Thumbnail & Index */}
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>

                      <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                        <img
                          src={item.previewUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-[280px]">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {item.width} × {item.height} px • {formatBytes(item.size)}
                        </div>
                      </div>
                    </div>

                    {/* Controls: Reorder & Delete */}
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => moveImage(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-600 disabled:opacity-30 border border-slate-200 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => moveImage(idx, 'down')}
                        disabled={idx === images.length - 1}
                        className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-600 disabled:opacity-30 border border-slate-200 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => removeImage(item.id)}
                        className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-red-500 hover:text-red-700 border border-slate-200 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: PDF Settings & Generate (1 col) */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Settings className="w-4 h-4 text-rose-600" />
              <span>PDF Settings</span>
            </h3>

            {/* Document Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Document File Name
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={pdfFileName}
                  onChange={(e) => setPdfFileName(e.target.value)}
                  placeholder="pixminify_document"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-l-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
                />
                <span className="px-3 py-2 bg-slate-200 border border-l-0 border-slate-200 rounded-r-xl text-xs font-mono text-slate-600 font-bold">
                  .pdf
                </span>
              </div>
            </div>

            {/* Orientation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Page Orientation
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'portrait', label: 'Portrait' },
                  { id: 'landscape', label: 'Landscape' },
                  { id: 'auto', label: 'Auto Fit' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setOrientation(opt.id as any)}
                    className={`py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      orientation === opt.id
                        ? 'bg-rose-600 text-white font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Page Size */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Page Size
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'a4', label: 'A4' },
                  { id: 'letter', label: 'US Letter' },
                  { id: 'fit', label: 'Fit Image' },
                ].map((sz) => (
                  <button
                    key={sz.id}
                    onClick={() => setPageSize(sz.id as any)}
                    className={`py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      pageSize === sz.id
                        ? 'bg-rose-600 text-white font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Margins */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Page Margins
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'none', label: 'No Margin' },
                  { id: 'small', label: 'Small (6mm)' },
                  { id: 'normal', label: 'Standard' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMargin(m.id as any)}
                    className={`py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      margin === m.id
                        ? 'bg-rose-600 text-white font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Page Numbers */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">Add Page Numbers Footer</span>
              <input
                type="checkbox"
                checked={showPageNumbers}
                onChange={(e) => setShowPageNumbers(e.target.checked)}
                className="w-4 h-4 accent-rose-600 cursor-pointer"
              />
            </div>

            {/* Generate & Download Button */}
            <div className="pt-2">
              <button
                onClick={generatePdf}
                disabled={images.length === 0 || isGenerating}
                className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isGenerating
                    ? 'Creating PDF Document...'
                    : `Download PDF (${images.length} Pages)`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
