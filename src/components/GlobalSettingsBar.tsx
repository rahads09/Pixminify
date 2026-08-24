import React, { useState } from 'react';
import { Sliders, Shield, RefreshCw, ChevronDown, ChevronUp, Cpu } from 'lucide-react';
import { CompressionSettings, ImageFormat, ResizeMode } from '../types';
import { QUALITY_PRESETS, SOCIAL_PRESETS } from '../utils/presets';

interface GlobalSettingsBarProps {
  settings: CompressionSettings;
  onChangeSettings: (newSettings: CompressionSettings) => void;
  onApplyToAll: () => void;
  itemCount: number;
  isProcessing: boolean;
}

export const GlobalSettingsBar: React.FC<GlobalSettingsBarProps> = ({
  settings,
  onChangeSettings,
  onApplyToAll,
  itemCount,
  isProcessing,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const formatLabels: { format: ImageFormat; label: string; desc: string; badge?: string }[] = [
    { format: 'image/webp', label: 'WebP', desc: 'Best web performance', badge: 'Recommended' },
    { format: 'image/avif', label: 'AVIF', desc: 'Highest compression ratio', badge: 'Ultra Next-Gen' },
    { format: 'image/jpeg', label: 'JPEG', desc: 'Universal compatibility' },
    { format: 'image/png', label: 'PNG', desc: 'Crisp graphics / transparency' },
    { format: 'original', label: 'Keep Format', desc: 'Preserves original extension' },
  ];

  const handleQualityChange = (val: number) => {
    onChangeSettings({ ...settings, quality: val });
  };

  const handleFormatChange = (fmt: ImageFormat) => {
    onChangeSettings({ ...settings, format: fmt });
  };

  const handleResizeModeChange = (mode: ResizeMode) => {
    onChangeSettings({ ...settings, resizeMode: mode });
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header bar of settings */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shadow-xs">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 tracking-tight">
              Optimization & Format Settings
            </h4>
            <p className="text-xs text-slate-600">
              Fine-tune output format, visual quality, and target dimensions
            </p>
          </div>
        </div>

        {/* Apply & Re-process All Action */}
        <div className="flex items-center space-x-2">
          {itemCount > 0 && (
            <button
              id="apply-recompress-all-btn"
              onClick={onApplyToAll}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center space-x-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>Apply & Recompress All</span>
            </button>
          )}
        </div>
      </div>

      {/* Row 1: Target Output Format */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
          1. Select Output Format
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {formatLabels.map((fmt) => {
            const isSelected = settings.format === fmt.format;
            return (
              <button
                key={fmt.format}
                type="button"
                id={`format-btn-${fmt.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleFormatChange(fmt.format)}
                className={`relative p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/80 shadow-sm ring-1 ring-blue-500/50'
                    : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-slate-100/70 text-slate-600'
                }`}
              >
                {fmt.badge && (
                  <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                    {fmt.badge}
                  </span>
                )}
                <div className={`font-bold text-sm ${isSelected ? 'text-blue-950' : 'text-slate-800'}`}>
                  {fmt.label}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">{fmt.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 2: Quality Slider & Quality Presets */}
      {settings.format !== 'image/png' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              2. Compression Quality:
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-700 border border-blue-200">
                {Math.round(settings.quality * 100)}%
              </span>
              <span className="text-xs text-slate-500">
                {settings.quality <= 0.65
                  ? '(Ultra Max Savings)'
                  : settings.quality <= 0.85
                  ? '(Balanced - Recommended)'
                  : '(Crisp High Quality)'}
              </span>
            </div>
          </div>

          {/* Range Slider */}
          <div className="relative flex items-center">
            <input
              type="range"
              min="5"
              max="100"
              step="1"
              value={Math.round(settings.quality * 100)}
              onChange={(e) => handleQualityChange(Number(e.target.value) / 100)}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Quick Presets Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {QUALITY_PRESETS.map((preset, idx) => {
              const isMatch = Math.abs(settings.quality - preset.quality) < 0.02;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChangeSettings({
                      ...settings,
                      quality: preset.quality,
                      format: preset.format,
                    });
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    isMatch
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {preset.name} ({Math.round(preset.quality * 100)}%)
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Row 3: Resize & Dimensions */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            3. Resize & Dimensions
          </label>
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleResizeModeChange('none')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                settings.resizeMode === 'none'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Original Size
            </button>
            <button
              type="button"
              onClick={() => handleResizeModeChange('percentage')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                settings.resizeMode === 'percentage'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Scale %
            </button>
            <button
              type="button"
              onClick={() => handleResizeModeChange('exact')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                settings.resizeMode === 'exact'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Exact WxH
            </button>
            <button
              type="button"
              onClick={() => handleResizeModeChange('preset')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                settings.resizeMode === 'preset'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Social Presets
            </button>
          </div>
        </div>

        {/* Dynamic Resize Config Area */}
        {settings.resizeMode === 'percentage' && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs text-slate-700">
              <span>Scale Dimensions:</span>
              <span className="font-mono font-bold text-blue-600">{settings.resizePercent}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={settings.resizePercent}
              onChange={(e) =>
                onChangeSettings({ ...settings, resizePercent: Number(e.target.value) })
              }
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex gap-2 pt-1">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => onChangeSettings({ ...settings, resizePercent: pct })}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono border cursor-pointer ${
                    settings.resizePercent === pct
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
        )}

        {settings.resizeMode === 'exact' && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-xs text-slate-600 font-medium">Width (px):</label>
              <input
                type="number"
                placeholder="Auto"
                value={settings.exactWidth || ''}
                onChange={(e) =>
                  onChangeSettings({
                    ...settings,
                    exactWidth: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-24 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-xs text-slate-600 font-medium">Height (px):</label>
              <input
                type="number"
                placeholder="Auto"
                value={settings.exactHeight || ''}
                onChange={(e) =>
                  onChangeSettings({
                    ...settings,
                    exactHeight: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-24 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>

            <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintainAspectRatio}
                onChange={(e) =>
                  onChangeSettings({ ...settings, maintainAspectRatio: e.target.checked })
                }
                className="rounded border-slate-300 text-blue-600 focus:ring-0"
              />
              <span>Lock Aspect Ratio</span>
            </label>
          </div>
        )}

        {settings.resizeMode === 'preset' && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SOCIAL_PRESETS.map((preset) => {
              const isSelected = settings.selectedPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() =>
                    onChangeSettings({
                      ...settings,
                      selectedPreset: preset.id,
                    })
                  }
                  className={`p-2 rounded-lg text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-semibold truncate">{preset.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {preset.width} × {preset.height}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Advanced Drawer Toggle */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <Cpu className="w-3.5 h-3.5 text-blue-600" />
          <span>Advanced Options (EXIF & Target File Size)</span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvanced && (
          <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target File Size in KB */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-700 font-medium flex items-center space-x-1.5">
                <span>Target Max File Size (KB):</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  (e.g. Under 200 KB)
                </span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="e.g. 150 (Optional)"
                  value={settings.targetFileSizeKB || ''}
                  onChange={(e) =>
                    onChangeSettings({
                      ...settings,
                      targetFileSizeKB: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-36 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-mono focus:border-blue-500 focus:outline-none"
                />
                <span className="text-xs text-slate-500">KB</span>
              </div>
            </div>

            {/* Strip EXIF GPS metadata */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-700 font-medium">
                Metadata & Privacy:
              </label>
              <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={settings.stripExif}
                  onChange={(e) => onChangeSettings({ ...settings, stripExif: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0"
                />
                <span className="flex items-center space-x-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Strip EXIF & GPS Camera Metadata</span>
                </span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
