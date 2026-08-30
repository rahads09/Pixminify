import React, { useState } from 'react';
import { Maximize2, Check, FileArchive } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { SOCIAL_PRESETS } from '../utils/presets';
import { ResizePreset, ToolResultData } from '../types';
import { loadImageElement, formatBytes } from '../utils/imageProcessor';
import { ToolUploadPage } from './ToolUploadPage';

export interface SocialResizerToolProps {
  onHasImageChange?: (hasImage: boolean) => void;
  onShowResult?: (result: ToolResultData) => void;
}

export const SocialResizerTool: React.FC<SocialResizerToolProps> = ({ onHasImageChange, onShowResult }) => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [selectedPresets, setSelectedPresets] = useState<string[]>(['ig-square', 'ig-story', 'yt-thumb', 'x-post']);
  const [isGenerating, setIsGenerating] = useState(false);

  React.useEffect(() => {
    onHasImageChange?.(Boolean(sourceImage));
  }, [sourceImage, onHasImageChange]);

  const handleProcessFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setSourceFile(file);
    setSourceImage(URL.createObjectURL(file));
  };

  const togglePreset = (id: string) => {
    if (selectedPresets.includes(id)) {
      if (selectedPresets.length > 1) {
        setSelectedPresets(selectedPresets.filter((p) => p !== id));
      }
    } else {
      setSelectedPresets([...selectedPresets, id]);
    }
  };

  const generateSinglePreset = async (preset: ResizePreset, img: HTMLImageElement): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    canvas.width = preset.width;
    canvas.height = preset.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, preset.width, preset.height);

    const origW = img.naturalWidth || img.width;
    const origH = img.naturalHeight || img.height;
    const ratio = Math.max(preset.width / origW, preset.height / origH);
    const renderW = origW * ratio;
    const renderH = origH * ratio;
    const offsetX = (preset.width - renderW) / 2;
    const offsetY = (preset.height - renderH) / 2;

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

    return new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Export fail'))), 'image/jpeg', 0.9);
    });
  };

  const handleDownloadAllSelected = async () => {
    if (!sourceImage || !sourceFile) return;
    setIsGenerating(true);
    try {
      const img = await loadImageElement(sourceImage);
      const zip = new JSZip();
      const folder = zip.folder('social_resized_images') || zip;

      for (const presetId of selectedPresets) {
        const preset = SOCIAL_PRESETS.find((p) => p.id === presetId);
        if (preset) {
          const blob = await generateSinglePreset(preset, img);
          const baseName = sourceFile.name.substring(0, sourceFile.name.lastIndexOf('.')) || 'image';
          folder.file(`${baseName}_${preset.id}_${preset.width}x${preset.height}.jpg`, blob);
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const fileName = `pixminify_social_bundle_${Date.now()}.zip`;

      if (onShowResult) {
        onShowResult({
          toolId: 'resize',
          toolName: 'Resize Image',
          fileName,
          fileType: 'application/zip',
          fileSize: zipBlob.size,
          blob: zipBlob,
          previewUrl: sourceImage || undefined,
          details: [
            { label: 'Presets Included', value: `${selectedPresets.length} dimensions` },
            { label: 'Package Type', value: 'ZIP Archive' },
          ],
          onResetTool: () => {
            setSourceImage(null);
            setSourceFile(null);
          },
          onBackToWorkspace: () => {
            // Keep workspace
          },
        });
      } else {
        saveAs(zipBlob, fileName);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!sourceImage) {
    return (
      <ToolUploadPage
        title="Resize Image"
        subtitle="Resize your image quickly while keeping the right proportions."
        acceptedFormats="Supports JPG, PNG, WebP, AVIF"
        accept="image/*"
        accentColor="sky"
        buttonText="Upload Image"
        onImageSelected={(files) => {
          if (files[0]) handleProcessFile(files[0]);
        }}
      />
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header section */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <Maximize2 className="w-4 h-4" />
            <span>Multi-Platform Smart Resizer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Generate All Social Media Dimensions in 1-Click
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Upload a master photo to export pixel-perfect formats for Instagram, YouTube, X, Facebook, and LinkedIn.
          </p>
        </div>

        <button
          onClick={handleDownloadAllSelected}
          disabled={isGenerating || selectedPresets.length === 0}
          className="btn-interactive px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-xs flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
        >
          <FileArchive className="w-4 h-4" />
          <span>
            {isGenerating
              ? 'Generating...'
              : `Download Bundle (${selectedPresets.length})`}
          </span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Source photo banner */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <img src={sourceImage} alt="Master source" className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
            <div>
              <div className="text-sm font-bold text-slate-900">{sourceFile?.name}</div>
              <div className="text-xs text-slate-500 font-mono">
                {sourceFile ? formatBytes(sourceFile.size) : ''}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setSourceImage(null);
              setSourceFile(null);
            }}
            className="btn-interactive px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            Change Image
          </button>
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {SOCIAL_PRESETS.map((preset) => {
              const isSelected = selectedPresets.includes(preset.id);
              return (
                <div
                  key={preset.id}
                  onClick={() => togglePreset(preset.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-1 ring-blue-500/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{preset.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{preset.description}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isSelected
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'border-slate-300 bg-slate-50'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-blue-600">
                    <span>{preset.width} × {preset.height} px</span>
                    <span className="text-[11px] text-slate-500">
                      {preset.width === preset.height ? '1:1 Square' : preset.width > preset.height ? 'Landscape' : 'Portrait'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
  );
};
