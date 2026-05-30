import React, { useState, useRef } from 'react';
import { BlobFile } from '../types';
import { PRESETS, svgToDataUri } from '../data';
import { Folder, HardDrive, Upload, Trash2, FileImage, Layers, Info, AlertCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StorageExplorerProps {
  files: BlobFile[];
  onUploadFile: (name: string, size: number, width: number, height: number, url: string) => void;
  onDeleteFile: (name: string) => void;
  selectedFile: BlobFile | null;
  onSelectFile: (file: BlobFile | null) => void;
  onLoadPreset: (id: string) => void;
}

export default function StorageExplorer({
  files,
  onUploadFile,
  onDeleteFile,
  selectedFile,
  onSelectFile,
  onLoadPreset,
}: StorageExplorerProps) {
  const [currentFolderFilter, setCurrentFolderFilter] = useState<'all' | 'original' | 'resized'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Format bytes into readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filter files based on selected category folder
  const filteredFiles = files.filter((f) => {
    if (currentFolderFilter === 'all') return true;
    return f.category === currentFolderFilter;
  });

  // Handle local file uploads inside the mock sandbox
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesUploaded = e.target.files;
    if (filesUploaded && filesUploaded.length > 0) {
      processAndUploadFile(filesUploaded[0]);
    }
  };

  const processAndUploadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const uniqueSuffix = Math.floor(Math.random() * 1000);
        // Replace whitespace to prevent bugs
        const cleanedName = file.name.replace(/\s+/g, '_');
        const filename = `original/${cleanedName}`;
        onUploadFile(
          filename,
          file.size,
          img.width,
          img.height,
          event.target?.result as string
        );
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag-and-drop support
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAndUploadFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm" id="storage-explorer-panel">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50/75 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans font-bold text-gray-800 text-sm">Azure Blob Storage Account</h2>
            <p className="text-[11px] text-gray-500 font-mono">Container: <span className="text-emerald-600 font-bold font-mono">images</span> • Written by Brian McCarthy</p>
          </div>
        </div>

        {/* Quick Presets Picker */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg border border-gray-200/60">
          <span className="text-[10px] text-gray-500 font-sans pl-1.5 pr-1 font-bold">Mock Presets:</span>
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset.id)}
              className="text-[10px] hover:text-azure-blue bg-white border border-gray-200 rounded px-2.5 py-0.5 font-bold transition-all cursor-pointer shadow-xs"
              title={`Load high-res ${preset.title}`}
              id={`preset-btn-${preset.id}`}
            >
              {preset.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Selector and Upload trigger */}
      <div className="p-3 border-b border-gray-200 bg-gray-50/25 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200/50 text-[11px] font-sans font-bold self-start">
          <button
            type="button"
            onClick={() => setCurrentFolderFilter('all')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              currentFolderFilter === 'all'
                ? 'bg-white text-gray-850 shadow-xs border border-gray-200/40'
                : 'text-gray-500 hover:text-gray-850'
            }`}
            id="folder-tab-all"
          >
            All Folders
          </button>
          <button
            type="button"
            onClick={() => setCurrentFolderFilter('original')}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer ${
              currentFolderFilter === 'original'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs font-bold'
                : 'text-gray-500 hover:text-gray-850'
            }`}
            id="folder-tab-original"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            original/
          </button>
          <button
            type="button"
            onClick={() => setCurrentFolderFilter('resized')}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer ${
              currentFolderFilter === 'resized'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs font-bold'
                : 'text-gray-500 hover:text-gray-850'
            }`}
            id="folder-tab-resized"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            resized/
          </button>
        </div>

        {/* Upload Trigger Input */}
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
            id="azure-upload-input"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 bg-azure-blue hover:bg-azure-hover text-white font-sans font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            id="btn-upload-local-file"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Photo
          </button>
        </div>
      </div>

      {/* Explorer Space (Split panel layout: left files list, right active detail) */}
      <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-200 min-h-[350px]">
        {/* Left: Files column */}
        <div 
          className="md:col-span-3 p-3 space-y-2 max-h-[360px] overflow-y-auto custom-scrollbar relative bg-white"
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          id="explorer-files-list"
        >
          {dragActive && (
            <div className="absolute inset-0 bg-blue-105 border-2 border-dashed border-azure-blue rounded-lg m-2 flex flex-col items-center justify-center backdrop-blur-xs z-20">
              <Upload className="w-8 h-8 text-azure-blue animate-bounce mb-2" />
              <p className="text-xs font-sans text-azure-blue font-bold">Drop picture back into Azure images</p>
            </div>
          )}

          {filteredFiles.length === 0 ? (
            <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center p-6 bg-gray-50 border border-dashed border-gray-200 rounded-lg">
              <FileImage className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-xs font-sans font-bold text-gray-700">Container is empty</p>
              <p className="text-[11px] text-gray-505 font-sans mt-1 max-w-[220px]">
                Drag in a photo, click upload, or use a sample preset above to quick start!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {filteredFiles.map((file) => {
                const isSelected = selectedFile?.name === file.name;
                return (
                  <div
                    key={file.name}
                    onClick={() => onSelectFile(file)}
                    className={`group flex items-center justify-between p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/50 border-blue-300 shadow-xs'
                        : 'bg-white border-gray-200 hover:bg-gray-50/70 hover:border-gray-250'
                    }`}
                    id={`storage-file-${file.name.replace(/\//g, '-')}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onSelectFile(file);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-1.5 rounded-md ${
                        file.category === 'original' 
                          ? 'bg-blue-550/10 text-azure-blue' 
                          : 'bg-emerald-555/10 text-emerald-600'
                      }`}>
                        <FileImage className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-mono font-bold text-gray-800 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                          {formatBytes(file.size)} • {file.width}x{file.height} px
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        file.category === 'original' 
                          ? 'bg-blue-100Text/60 text-blue-700' 
                          : 'bg-emerald-100/60 text-emerald-700'
                      }`}>
                        {file.category}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteFile(file.name);
                        }}
                        className="p-1 text-gray-405 hover:text-red-700 hover:bg-red-50 rounded transition-all md:opacity-0 group-hover:opacity-100 cursor-pointer animate-fade"
                        title="Delete from Storage"
                        id={`btn-delete-${file.name.replace(/\//g, '-')}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: File details preview */}
        <div className="md:col-span-2 p-3 bg-gray-50/25 flex flex-col justify-between max-h-[360px] overflow-y-auto custom-scrollbar" id="explorer-file-detail">
          {selectedFile ? (
            <div className="space-y-4 h-full flex flex-col justify-between">
              {/* Image Preview Window */}
              <div className="space-y-3">
                <div className="relative aspect-video w-full bg-slate-900 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center group shadow-xs">
                  <img
                    src={selectedFile.url}
                    alt={selectedFile.name}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-full object-contain"
                  />
                  <div className="absolute top-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[8px] font-mono font-bold text-slate-200 border border-slate-800">
                    PREVIEW
                  </div>
                </div>

                {/* Details Table */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-sans font-bold text-gray-450 tracking-wider">BLOB PROPERTIES</div>
                  <div className="space-y-1 bg-white p-2.5 rounded-lg border border-gray-205 text-[11px] font-sans">
                    <div className="flex justify-between py-1 border-b border-gray-105">
                      <span className="text-gray-500 font-semibold">Name:</span>
                      <span className="text-gray-800 font-bold truncate max-w-[130px]" title={selectedFile.name}>{selectedFile.name.split('/').pop()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-105">
                      <span className="text-gray-500 font-semibold">Path:</span>
                      <span className="text-azure-blue font-bold font-mono truncate max-w-[140px]">{selectedFile.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-105">
                      <span className="text-gray-500 font-semibold">Dimensions:</span>
                      <span className="text-gray-800 font-extrabold">{selectedFile.width} x {selectedFile.height} px</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-105">
                      <span className="text-gray-500 font-semibold">File Size:</span>
                      <span className="text-emerald-700 font-extrabold">{formatBytes(selectedFile.size)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500 font-semibold">Created At:</span>
                      <span className="text-gray-700 font-medium">{selectedFile.createdAt}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delete / Info banner */}
              <div className="pt-3 border-t border-gray-200/80 flex items-center justify-between text-[11px] font-sans text-gray-500">
                <span className="flex items-center gap-1 text-gray-500 font-medium font-sans">
                  <Info className="w-3.5 h-3.5 text-azure-blue" /> Loaded from virtual cache
                </span>
                <button
                  type="button"
                  onClick={() => onDeleteFile(selectedFile.name)}
                  className="text-red-650 hover:text-red-700 font-bold cursor-pointer"
                >
                  Delete blob
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 py-12 text-gray-400">
              <Layers className="w-6 h-6 text-gray-300 mb-2" />
              <p className="text-xs font-sans font-semibold text-gray-650">No Blob Selected</p>
              <p className="text-[10px] text-gray-505 font-sans mt-1">
                Click any image blob to inspect cloud headers, file parameters, and sizes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
