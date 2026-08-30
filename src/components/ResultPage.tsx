import React, { useState, useEffect } from 'react';
import {
  Download,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  FileText,
  FileArchive,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Layers,
  HelpCircle,
  FileCode,
  Image as ImageIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveAs } from 'file-saver';
import { ActiveTab, ToolResultData } from '../types';
import { formatBytes } from '../utils/imageProcessor';
import { AdSlot } from './AdSlot';

interface ResultPageProps {
  result: ToolResultData | null;
  onSelectTab: (tab: ActiveTab) => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ result, onSelectTab }) => {
  const [copied, setCopied] = useState(false);
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);

  // Trigger celebration once on mount if result is valid
  useEffect(() => {
    if (result && !hasTriggeredConfetti) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.5 },
          disableForReducedMotion: true,
        });
      } catch (e) {
        // Safe fallback if confetti isn't supported
      }
      setHasTriggeredConfetti(true);
    }
  }, [result, hasTriggeredConfetti]);

  // Handle file download
  const handleDownload = () => {
    if (!result) return;

    if (result.onDownload) {
      result.onDownload();
      return;
    }

    if (result.blob) {
      saveAs(result.blob, result.fileName);
    } else if (result.downloadUrl) {
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = result.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (result.extractedText) {
      const textBlob = new Blob([result.extractedText], { type: 'text/plain;charset=utf-8' });
      saveAs(textBlob, result.fileName || 'extracted-text.txt');
    }
  };

  // Handle copying extracted text
  const handleCopyText = async () => {
    if (!result?.extractedText) return;
    try {
      await navigator.clipboard.writeText(result.extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // Handle starting a new operation with the same tool (fresh upload)
  const handleStartFresh = () => {
    if (result?.onResetTool) {
      result.onResetTool();
    }
    if (result?.toolId) {
      onSelectTab(result.toolId);
    } else {
      onSelectTab('home');
    }
  };

  // Handle going back to the workspace keeping existing image/settings
  const handleBackToWorkspace = () => {
    if (result?.onBackToWorkspace) {
      result.onBackToWorkspace();
    }
    if (result?.toolId) {
      onSelectTab(result.toolId);
    } else {
      onSelectTab('home');
    }
  };

  // 1. Expired / direct access state (e.g., page refreshed or accessed with no active result)
  if (!result) {
    return (
      <div className="w-full max-w-2xl mx-auto py-12 px-4 animate-in fade-in duration-200 text-center">
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
            <HelpCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Your processed file is no longer available
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              For your privacy, files are processed entirely in your browser and are not stored on any server. If you refreshed the page, please select a tool below to process a new image.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onSelectTab('compress')}
              className="btn-interactive w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xs transition-all cursor-pointer"
            >
              Compress Image
            </button>
            <button
              onClick={() => onSelectTab('home')}
              className="btn-interactive w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all cursor-pointer"
            >
              Browse All Tools
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-center space-x-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% In-Browser & Private • Zero Cloud Storage</span>
          </div>
        </div>
      </div>
    );
  }

  const isOcr = result.toolId === 'ocr' || Boolean(result.extractedText);
  const isPdf = result.toolId === 'pdf' || result.fileType === 'application/pdf';
  const isZip = result.fileType === 'application/zip' || result.fileName.endsWith('.zip');

  const wordCount = result.extractedText ? result.extractedText.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = result.extractedText ? result.extractedText.length : 0;

  return (
    <div className="w-full max-w-3xl mx-auto py-4 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Top Main Result Card */}
      <div className="p-6 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-6 sm:space-y-8">
        {/* Success Icon & Heading */}
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-2xs">
            <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Your file is ready!
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-md mx-auto">
              Your {isOcr ? 'text' : isPdf ? 'document' : 'image'} has been processed successfully.
            </p>
          </div>
        </div>

        {/* Primary & Secondary Action Buttons (Stacked Hierarchy) */}
        <div className="max-w-md mx-auto space-y-3">
          {/* Primary: Download File Button */}
          <button
            id="download-file-btn"
            onClick={handleDownload}
            className="btn-interactive w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-base shadow-md shadow-blue-500/25 flex items-center justify-center space-x-2.5 transition-all cursor-pointer"
          >
            <Download className="w-5 h-5 stroke-[2.5]" />
            <span>Download File</span>
            {result.fileSize ? (
              <span className="text-xs font-normal opacity-85 font-mono ml-1">
                ({formatBytes(result.fileSize)})
              </span>
            ) : null}
          </button>

          {/* Secondary: Start Fresh Tool Upload */}
          <button
            id="start-tool-fresh-btn"
            onClick={handleStartFresh}
            className="btn-interactive w-full py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>{result.toolName}</span>
          </button>

          {/* Tertiary: Back to Tool Workspace (Keeps state) */}
          <button
            id="back-to-tool-workspace-btn"
            onClick={handleBackToWorkspace}
            className="btn-interactive w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {result.toolName}</span>
          </button>
        </div>

        {/* Privacy Note */}
        <div className="pt-2 flex items-center justify-center space-x-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Processed 100% locally in your browser • No files uploaded</span>
        </div>
      </div>

      {/* Ad Slot #1 (Directly below primary actions, collapsed if unconfigured) */}
      <AdSlot format="horizontal" className="my-2" />

      {/* Result Information / Preview Area */}
      {isOcr ? (
        /* OCR Text Extractor Preview */
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-900 text-base sm:text-lg">
                Extracted Text Output
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono">
                {wordCount} words
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono">
                {charCount} characters
              </span>
              <button
                onClick={handleCopyText}
                className="btn-interactive px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs sm:text-sm text-slate-800 whitespace-pre-wrap max-h-80 overflow-y-auto leading-relaxed selection:bg-blue-100">
            {result.extractedText || 'No text extracted.'}
          </div>
        </div>
      ) : (
        /* Image / PDF / Zip Result Details Card */
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
          <h2 className="font-bold text-slate-900 text-base sm:text-lg">
            File Summary & Preview
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Visual Thumbnail / Icon */}
            <div className="w-full sm:w-48 h-48 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 relative p-2">
              {result.previewUrl ? (
                <img
                  src={result.previewUrl}
                  alt={result.fileName}
                  className="w-full h-full object-contain"
                />
              ) : isPdf ? (
                <div className="text-center space-y-2">
                  <FileText className="w-12 h-12 text-red-500 mx-auto" />
                  <span className="text-xs font-bold text-slate-700 font-mono">PDF Document</span>
                </div>
              ) : isZip ? (
                <div className="text-center space-y-2">
                  <FileArchive className="w-12 h-12 text-blue-500 mx-auto" />
                  <span className="text-xs font-bold text-slate-700 font-mono">ZIP Archive</span>
                </div>
              ) : (
                <ImageIcon className="w-12 h-12 text-slate-400" />
              )}
            </div>

            {/* Metadata Badges & Details */}
            <div className="w-full space-y-3 min-w-0">
              <div>
                <div className="text-xs text-slate-500 font-medium">Filename</div>
                <div className="text-sm sm:text-base font-bold text-slate-900 truncate font-mono">
                  {result.fileName}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {result.fileSize ? (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[11px] text-slate-500 font-medium">File Size</div>
                    <div className="text-sm font-bold text-slate-800 font-mono">
                      {formatBytes(result.fileSize)}
                    </div>
                  </div>
                ) : null}

                {result.dimensions ? (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[11px] text-slate-500 font-medium">Dimensions</div>
                    <div className="text-sm font-bold text-slate-800 font-mono">
                      {result.dimensions.width} × {result.dimensions.height} px
                    </div>
                  </div>
                ) : null}

                {result.savingsPercentage !== undefined && result.savingsPercentage > 0 ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="text-[11px] text-emerald-700 font-medium">Compression</div>
                    <div className="text-sm font-bold text-emerald-800 font-mono">
                      -{result.savingsPercentage}% Smaller
                    </div>
                  </div>
                ) : null}

                {result.details?.map((detail, index) => (
                  <div key={index} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[11px] text-slate-500 font-medium">{detail.label}</div>
                    <div className="text-sm font-bold text-slate-800 font-mono truncate">
                      {detail.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ad Slot #2 (Below details card) */}
      <AdSlot format="rectangle" className="my-4" />

      {/* Quick Launch Other Tools Section */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Try Other Free Tools
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'compress', label: 'Compress Image', desc: 'Reduce file size' },
            { id: 'crop', label: 'Crop Image', desc: 'Custom aspect ratio' },
            { id: 'background-remover', label: 'Remove BG', desc: 'Clean transparent cutout' },
            { id: 'pdf', label: 'Image to PDF', desc: 'Combine & export' },
          ].map((tool) => (
            <button
              key={tool.id}
              onClick={() => onSelectTab(tool.id as ActiveTab)}
              className="btn-interactive p-3 rounded-xl bg-slate-50 hover:bg-blue-50/80 hover:border-blue-200 border border-slate-200/80 text-left transition-all cursor-pointer group"
            >
              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {tool.label}
              </div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">
                {tool.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Ad Slot #3 (Bottom area) */}
      <AdSlot format="horizontal" className="mt-6" />
    </div>
  );
};
