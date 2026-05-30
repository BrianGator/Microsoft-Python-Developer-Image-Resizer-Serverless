import React, { useState, useEffect } from 'react';
import { DEFAULT_PYTHON_CODE, REQUIREMENTS_TXT, parsePythonResizeDimensions } from '../data';
import { Code, FileCode, Check, Clipboard, Key, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CodeWorkspaceProps {
  code: string;
  onCodeChange: (newCode: string) => void;
  connectionString: string;
  onConnectionStringChange: (val: string) => void;
  onTriggerResize: () => void;
  hasActiveImage: boolean;
  isProcessing: boolean;
}

export default function CodeWorkspace({
  code,
  onCodeChange,
  connectionString,
  onConnectionStringChange,
  onTriggerResize,
  hasActiveImage,
  isProcessing,
}: CodeWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'main.py' | 'requirements.txt'>('main.py');
  const [copied, setCopied] = useState(false);

  // Extracted width and height to show in simple UI tweak bars
  const { width, height } = parsePythonResizeDimensions(code);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activeTab === 'main.py' ? code : REQUIREMENTS_TXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Easily adjust width & height in the Python script via handy sliders
  const handleDimensionChange = (newWidth: number, newHeight: number) => {
    // Replace .resize((x, y)) with new values
    const regex = /(\.resize\(\s*\(\s*)(\d+)(\s*,\s*)(\d+)(\s*\)\s*\))/;
    const updatedCode = code.replace(regex, `$1${newWidth}$3${newHeight}$5`);
    onCodeChange(updatedCode);
  };

  const generateMockConnectionString = () => {
    const randomHash = Math.random().toString(36).substring(2, 20);
    onConnectionStringChange(
      `DefaultEndpointsProtocol=https;AccountName=photohubstorage;AccountKey=${randomHash}==;EndpointSuffix=core.windows.net`
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm" id="code-workspace-panel">
      {/* Tab bar header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50/75 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-azure-blue" />
          <h2 className="font-sans font-bold text-gray-800 text-sm">Serverless Workspace <span className="text-[10px] text-gray-400 font-normal ml-1">by Brian McCarthy</span></h2>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200/60">
          <button
            type="button"
            onClick={() => setActiveTab('main.py')}
            className={`px-3 py-1 text-xs font-sans font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'main.py'
                ? 'bg-azure-blue text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            id="tab-main-py"
          >
            main.py
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('requirements.txt')}
            className={`px-3 py-1 text-xs font-sans font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'requirements.txt'
                ? 'bg-azure-blue text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            id="tab-requirements-txt"
          >
            requirements.txt
          </button>
        </div>
      </div>

      {/* Connection string configuration section */}
      <div className="p-4 border-b border-gray-200/80 bg-white" id="connection-string-config">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-sans font-bold text-gray-700 flex items-center gap-1.5" htmlFor="connection-string-input">
            <Key className="w-3.5 h-3.5 text-azure-blue" />
            AZURE_STORAGE_CONNECTION_STRING
          </label>
          <button
            type="button"
            onClick={generateMockConnectionString}
            className="text-[11px] text-azure-blue hover:text-azure-hover font-bold transition-colors flex items-center gap-1 font-sans cursor-pointer"
            id="btn-auto-fill-connection"
          >
            <RefreshCw className="w-3 h-3" /> Auto-Fill Mock Connection
          </button>
        </div>
        <div className="relative">
          <input
            id="connection-string-input"
            type="text"
            placeholder="paste your storage connection string. e.g. DefaultEndpointsProtocol=https;..."
            value={connectionString}
            onChange={(e) => onConnectionStringChange(e.target.value)}
            className="w-full bg-gray-50 text-xs text-gray-800 font-mono pl-3 pr-10 py-2.5 rounded-lg border border-gray-200 focus:bg-white focus:outline-none focus:border-azure-blue transition-all placeholder:text-gray-400 focus:shadow-xs"
          />
          <div className="absolute right-2.5 top-3 flex items-center">
            {connectionString ? (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Connection config found" />
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" title="Missing configuration" />
            )}
          </div>
        </div>
      </div>

      {/* Interactive Parameters Quick Control */}
      {activeTab === 'main.py' && (
        <div className="px-4 py-3 border-b border-gray-200/80 bg-blue-50/45 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-azure-blue" />
            <span className="text-xs font-sans font-bold text-gray-700">PIL Pillow Resize Target Sizing:</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-gray-500">W:</span>
              <input
                type="number"
                min="50"
                max="2000"
                value={width}
                onChange={(e) => handleDimensionChange(Number(e.target.value), height)}
                className="w-16 bg-white text-gray-800 text-xs font-mono text-center py-1 rounded border border-gray-200 focus:outline-none focus:border-azure-blue"
                id="input-resize-width"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-gray-500">H:</span>
              <input
                type="number"
                min="50"
                max="2000"
                value={height}
                onChange={(e) => handleDimensionChange(width, Number(e.target.value))}
                className="w-16 bg-white text-gray-800 text-xs font-mono text-center py-1 rounded border border-gray-200 focus:outline-none focus:border-azure-blue"
                id="input-resize-height"
              />
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleDimensionChange(500, 500)}
                className="text-[10px] bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-2 py-1 rounded transition-colors cursor-pointer"
                id="btn-preset-500"
              >
                Square (500x500)
              </button>
              <button
                type="button"
                onClick={() => handleDimensionChange(800, 600)}
                className="text-[10px] bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-2 py-1 rounded transition-colors cursor-pointer"
                id="btn-preset-800"
              >
                Classic (800x600)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor view */}
      <div className="relative">
        {/* Secondary buttons bar */}
        <div className="absolute right-3 top-3 z-10 flex gap-2">
          <button
            type="button"
            onClick={copyToClipboard}
            className="p-1 px-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded text-[10px] font-sans font-bold flex items-center gap-1.5 transition-colors active:scale-95 cursor-pointer shadow-xs"
            id="btn-copy-code"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Clipboard className="w-3 h-3 text-slate-300" />}
            {copied ? 'Copied' : 'Copy Code'}
          </button>
        </div>

        {/* Text workspace representing IDE (High-contrast embedded Monaco look) */}
        <div className="flex font-mono text-xs overflow-x-auto h-[350px] bg-[#0F172A] custom-scrollbar">
          {/* Simulated Line numbers */}
          <div className="py-4 px-3 bg-[#0F172A] text-slate-600 text-right select-none border-r border-slate-800/80 text-[11px] font-mono leading-relaxed min-w-[38px]">
            {Array.from({ length: activeTab === 'main.py' ? code.split('\n').length : REQUIREMENTS_TXT.split('\n').length }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Actual textarea for editing */}
          {activeTab === 'main.py' ? (
            <textarea
              id="python-code-editor"
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              className="flex-1 py-4 px-4 bg-[#0F172A] text-blue-300 font-mono text-xs leading-relaxed focus:outline-none resize-none overflow-y-auto whitespace-pre custom-scrollbar select-text selection:bg-indigo-500/30 font-semibold"
              style={{ minWidth: '550px' }}
              spellCheck="false"
            />
          ) : (
            <pre 
              className="flex-1 py-4 px-4 bg-[#0F172A] text-emerald-400 font-mono text-xs leading-relaxed select-text overflow-y-auto font-semibold"
            >
              <code>{REQUIREMENTS_TXT}</code>
            </pre>
          )}
        </div>
      </div>

      {/* Execution bottom panel with helpful quick guidance */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="font-sans text-[11px]">
          {!connectionString ? (
            <span className="text-amber-600 font-semibold">⚠️ Missing credentials - click Auto-Fill Mock Connection in STEP 2!</span>
          ) : !hasActiveImage ? (
            <span className="text-blue-600 font-semibold">💡 Select or upload a training photo below in STEP 4.</span>
          ) : (
            <span className="text-emerald-700 font-semibold">Ready to trigger cloud deployment resize logic!</span>
          )}
        </div>

        <button
          type="button"
          disabled={isProcessing}
          onClick={onTriggerResize}
          className={`px-5 py-2.5 rounded-lg font-sans font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:scale-100 cursor-pointer ${
            isProcessing
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : !connectionString || !hasActiveImage
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-500 border border-gray-250/60'
                : 'bg-azure-blue hover:bg-azure-hover text-white shadow-sm shadow-blue-500/10'
          }`}
          id="btn-trigger-resize"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-gray-500" />
              <span>Executing Function...</span>
            </>
          ) : (
            <>
              <Code className="w-4 h-4" />
              <span>Run Azure Function Trigger</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

