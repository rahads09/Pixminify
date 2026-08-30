import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Copy,
  Download,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Check,
  Trash2,
  Globe,
  AlertCircle,
  Eye,
  AlignLeft,
  FileCode,
  Languages,
} from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { saveAs } from 'file-saver';
import { formatBytes } from '../utils/imageProcessor';
import { ToolUploadPage } from './ToolUploadPage';
import { ToolResultData } from '../types';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
  popular?: boolean;
}

const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'eng', name: 'English', nativeName: 'English', popular: true },
  { code: 'ben', name: 'Bengali (Bangla)', nativeName: 'বাংলা', popular: true },
  { code: 'hin', name: 'Hindi', nativeName: 'हिन्दी', popular: true },
  { code: 'urd', name: 'Urdu', nativeName: 'اردو', popular: true },
  { code: 'ara', name: 'Arabic', nativeName: 'العربية', popular: true },
  { code: 'spa', name: 'Spanish', nativeName: 'Español', popular: true },
  { code: 'fra', name: 'French', nativeName: 'Français', popular: true },
  { code: 'deu', name: 'German', nativeName: 'Deutsch', popular: true },
  { code: 'chi_sim', name: 'Chinese (Simplified)', nativeName: '简体中文', popular: true },
  { code: 'chi_tra', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
  { code: 'jpn', name: 'Japanese', nativeName: '日本語', popular: true },
  { code: 'kor', name: 'Korean', nativeName: '한국어' },
  { code: 'por', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ita', name: 'Italian', nativeName: 'Italiano' },
  { code: 'rus', name: 'Russian', nativeName: 'Русский' },
  { code: 'tur', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'vie', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'ind', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'tam', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'tel', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'guj', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'mar', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'pan', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'nld', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'pol', name: 'Polish', nativeName: 'Polski' },
  { code: 'swe', name: 'Swedish', nativeName: 'Svenska' },
];

export interface OcrToolProps {
  onHasImageChange?: (hasImage: boolean) => void;
  onShowResult?: (result: ToolResultData) => void;
}

export const OcrTool: React.FC<OcrToolProps> = ({ onHasImageChange, onShowResult }) => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [imgNaturalSize, setImgNaturalSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    onHasImageChange?.(Boolean(sourceImage));
  }, [sourceImage, onHasImageChange]);

  const [selectedLanguage, setSelectedLanguage] = useState<string>('eng');
  const [extractedText, setExtractedText] = useState<string>('');
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [processingTimeSec, setProcessingTimeSec] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (sourceImage) URL.revokeObjectURL(sourceImage);
    };
  }, [sourceImage]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP, AVIF, TIFF).');
      return;
    }

    setErrorMessage(null);
    setExtractedText('');
    setConfidenceScore(null);
    setProcessingTimeSec(null);

    setSourceFile(file);
    const url = URL.createObjectURL(file);
    setSourceImage(url);

    const img = new Image();
    img.onload = () => {
      setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
      runOcrExtraction(file, selectedLanguage);
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
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
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

  const handleLoadSample = () => {
    // Generate a high-contrast sample document image on canvas
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 460;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 720, 460);

      // Header Banner
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(0, 0, 720, 64);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillText('PIXMINIFY INVOICE & DOCUMENT SCAN', 32, 40);

      // Content text lines
      ctx.fillStyle = '#0f172a';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText('Invoice Number: #PX-2026-8849', 32, 110);
      ctx.fillText('Date: August 29, 2026', 32, 140);
      ctx.fillText('Customer: Global Creative Studio Inc.', 32, 170);

      ctx.fillStyle = '#334155';
      ctx.font = '15px system-ui, sans-serif';
      ctx.fillText('• Automated WebAssembly optical text extraction pipeline', 50, 220);
      ctx.fillText('• 100% In-Browser Privacy Guarantee (Zero Cloud Uploads)', 50, 250);
      ctx.fillText('• Multilingual recognition: English, বাংলা, हिन्दी, اردو, and more', 50, 280);

      // Total Line
      ctx.fillStyle = '#1e3a8a';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.fillText('Total Amount: $0.00 (100% Free Forever)', 32, 340);

      // Footer note
      ctx.fillStyle = '#64748b';
      ctx.font = 'italic 13px system-ui, sans-serif';
      ctx.fillText('Extracted directly on your device via client-side OCR engine.', 32, 410);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'sample-document.png', { type: 'image/png' });
        handleFile(file);
      }
    }, 'image/png');
  };

  const runOcrExtraction = async (file: File, lang: string) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setProgressPercent(10);
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
    const langName = langObj ? `${langObj.name} (${langObj.nativeName})` : lang;
    setProgressStatus(`Loading ${langName} optical recognition model...`);

    const startTime = performance.now();

    try {
      const worker = await createWorker(lang, 1, {
        logger: (m) => {
          if (m.status === 'loading tesseract core') {
            setProgressStatus('Loading WebAssembly OCR engine...');
            setProgressPercent(20);
          } else if (m.status === 'loading language traineddata') {
            const pct = Math.round((m.progress || 0) * 100);
            setProgressStatus(`Downloading ${langName} language model (${pct}%)...`);
            setProgressPercent(25 + Math.round(pct * 0.25));
          } else if (m.status === 'initializing api') {
            setProgressStatus('Initializing OCR engine API...');
            setProgressPercent(55);
          } else if (m.status === 'recognizing text') {
            const pct = Math.round((m.progress || 0) * 100);
            setProgressStatus(`Recognizing characters & layout (${pct}%)...`);
            setProgressPercent(60 + Math.round(pct * 0.38));
          }
        },
      });

      const ret = await worker.recognize(file);
      const text = ret.data.text.trim();
      const confidence = ret.data.confidence;

      await worker.terminate();

      const endTime = performance.now();
      const elapsed = Math.round((endTime - startTime) / 100) / 10;
      setProcessingTimeSec(elapsed);

      if (!text) {
        setExtractedText('');
        setConfidenceScore(0);
        setErrorMessage('No readable text detected in this image. Try uploading a clearer, higher-contrast image or adjusting the selected language.');
      } else {
        setExtractedText(text);
        setConfidenceScore(Math.round(confidence));
        setProgressPercent(100);
        setProgressStatus('Text extraction complete!');
      }
    } catch (err: unknown) {
      console.error('OCR Error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`OCR processing failed: ${msg}. Please ensure you have an active network connection to download the language model on first use.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    if (sourceFile) {
      runOcrExtraction(sourceFile, lang);
    }
  };

  const handleCopyText = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = extractedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleDownloadTxt = () => {
    if (!extractedText || !sourceFile) return;
    const baseName = sourceFile.name.replace(/\.[^/.]+$/, '');
    const fileName = `${baseName}-ocr.txt`;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });

    if (onShowResult) {
      onShowResult({
        toolId: 'ocr',
        toolName: 'OCR',
        fileName,
        fileType: 'text/plain',
        fileSize: blob.size,
        blob,
        extractedText,
        previewUrl: sourceImage || undefined,
        details: [
          { label: 'Language', value: SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage)?.name || selectedLanguage },
          { label: 'Confidence', value: confidenceScore !== null ? `${confidenceScore}%` : 'N/A' },
          { label: 'Words Count', value: `${extractedText.split(/\s+/).filter(Boolean).length} words` },
        ],
        onResetTool: handleReset,
        onBackToWorkspace: () => {
          // Keep current OCR workspace
        },
      });
    } else {
      saveAs(blob, fileName);
    }
  };

  const handleDownloadJson = () => {
    if (!extractedText || !sourceFile) return;
    const baseName = sourceFile.name.replace(/\.[^/.]+$/, '');
    const data = {
      filename: sourceFile.name,
      extractedAt: new Date().toISOString(),
      language: selectedLanguage,
      confidence: confidenceScore,
      characterCount: extractedText.length,
      wordCount: extractedText.split(/\s+/).filter(Boolean).length,
      text: extractedText,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, `${baseName}-ocr.json`);
  };

  const handleReset = () => {
    if (sourceImage) URL.revokeObjectURL(sourceImage);
    setSourceImage(null);
    setSourceFile(null);
    setExtractedText('');
    setConfidenceScore(null);
    setProcessingTimeSec(null);
    setErrorMessage(null);
    setProgressPercent(0);
    setProgressStatus('');
  };

  const popularLanguages = SUPPORTED_LANGUAGES.filter((l) => l.popular);
  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const wordCount = extractedText ? extractedText.split(/\s+/).filter(Boolean).length : 0;
  const charCount = extractedText ? extractedText.length : 0;

  if (!sourceImage) {
    return (
      <ToolUploadPage
        title="OCR"
        subtitle="Extract text from your image in supported languages."
        acceptedFormats="Supports JPG, PNG, WebP, AVIF, Scans"
        accept="image/*"
        accentColor="amber"
        buttonText="Upload Image"
        onImageSelected={(files) => {
          if (files[0]) handleFile(files[0]);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <Languages className="w-4 h-4" />
            <span>Multilingual Optical Character Recognition</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Image to Text (OCR) Converter
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Extract editable text from scanned documents, receipts, screenshots, and photos in English, বাংলা (Bangla), हिन्दी (Hindi), اردو (Urdu), Arabic, and 20+ languages. 100% in-browser privacy.
          </p>
        </div>

        {/* Privacy & Engine Badge */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Tesseract.js Engine</span>
          </div>
        </div>
      </div>

      {/* Language Selector Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Document Language:
            </span>
          </div>

          {/* Search / Select Dropdown */}
          <div className="flex items-center space-x-2">
            <select
              id="ocr-language-select"
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              disabled={isProcessing}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer disabled:opacity-50"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} — {lang.nativeName} ({lang.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Popular Language Quick Selection Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Popular:</span>
          {popularLanguages.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                disabled={isProcessing}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:opacity-50 ${
                  isSelected
                    ? 'bg-amber-600 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {lang.nativeName} ({lang.name})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Active File Bar */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center space-x-3">
              <img
                src={sourceImage}
                alt="Source preview"
                className="w-12 h-12 rounded-lg object-cover border border-slate-200"
              />
              <div>
                <div className="text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                  {sourceFile?.name}
                </div>
                <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                  <span>{sourceFile ? formatBytes(sourceFile.size) : ''}</span>
                  <span>•</span>
                  <span>{imgNaturalSize.w} × {imgNaturalSize.h} px</span>
                  {processingTimeSec && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-600 font-semibold">{processingTimeSec}s</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => sourceFile && runOcrExtraction(sourceFile, selectedLanguage)}
                disabled={isProcessing}
                className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>Re-run OCR</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Change Image
              </button>
            </div>
          </div>

          {/* Progress Bar (when extracting) */}
          {isProcessing && (
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
                <span className="flex items-center space-x-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  <span>{progressStatus || 'Extracting characters...'}</span>
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-amber-200/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message if any */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">OCR Processing Notice</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Side-by-Side Document & Extracted Text Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Original Image Viewer */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <Eye className="w-4 h-4 text-slate-500" />
                  <span>Original Document</span>
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {imgNaturalSize.w} × {imgNaturalSize.h}
                </span>
              </div>

              <div className="w-full h-[440px] bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-3">
                <img
                  src={sourceImage}
                  alt="Original Document"
                  className="max-h-full max-w-full object-contain rounded shadow"
                />
              </div>
            </div>

            {/* Right: Extracted Text Editor & Actions */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                  <div className="flex items-center space-x-2">
                    <AlignLeft className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Extracted Text Output
                    </span>
                  </div>

                  {/* Confidence Badge */}
                  {confidenceScore !== null && confidenceScore > 0 && (
                    <div
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        confidenceScore >= 80
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : confidenceScore >= 50
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      Accuracy: {confidenceScore}%
                    </div>
                  )}
                </div>

                {/* Text Area */}
                <textarea
                  id="ocr-extracted-textarea"
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder={
                    isProcessing
                      ? 'Recognizing characters from image...'
                      : 'Extracted text will appear here. You can freely edit, format, and copy it.'
                  }
                  rows={14}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                />

                {/* Stats Row */}
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2 px-1">
                  <span>
                    Words: <strong className="text-slate-800">{wordCount}</strong> | Characters: <strong className="text-slate-800">{charCount}</strong>
                  </span>
                  <span>Language: <strong className="text-slate-800 uppercase">{selectedLanguage}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  id="ocr-copy-button"
                  onClick={handleCopyText}
                  disabled={!extractedText || isProcessing}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-40 ${
                    isCopied
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    id="ocr-download-txt-button"
                    onClick={handleDownloadTxt}
                    disabled={!extractedText || isProcessing}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-40"
                  >
                    <Download className="w-4 h-4" />
                    <span>Save as .TXT</span>
                  </button>

                  <button
                    type="button"
                    id="ocr-download-json-button"
                    onClick={handleDownloadJson}
                    disabled={!extractedText || isProcessing}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer disabled:opacity-40"
                    title="Export structured JSON"
                  >
                    <FileCode className="w-3.5 h-3.5 text-slate-600" />
                    <span>JSON</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};
