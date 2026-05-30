import React, { useState, useEffect } from 'react';
import { GuideStep, BlobFile, TerminalLog } from './types';
import { 
  INITIAL_GUIDE_STEPS, 
  DEFAULT_PYTHON_CODE, 
  PRESETS, 
  svgToDataUri, 
  parsePythonResizeDimensions 
} from './data';
import GuideWalkthrough from './components/GuideWalkthrough';
import CodeWorkspace from './components/CodeWorkspace';
import StorageExplorer from './components/StorageExplorer';
import SimulatorConsole from './components/SimulatorConsole';
import { 
  Cpu, 
  Gauge, 
  Image as ImageIcon, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Layers, 
  Activity,
  ArrowRight,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [code, setCode] = useState(DEFAULT_PYTHON_CODE);
  const [connectionString, setConnectionString] = useState('');
  const [files, setFiles] = useState<BlobFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<BlobFile | null>(null);
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<GuideStep[]>(INITIAL_GUIDE_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Load a default preset on startup
  useEffect(() => {
    loadMockPreset('sunset_mountains');
    appendLog('system', 'Virtual backend simulator initialized.');
    appendLog('system', 'Azure Function runtime container booted. Listening for triggers.');
  }, []);

  // Update progress steps automatically based on interactions
  useEffect(() => {
    // Step 2: Connection string
    if (connectionString && !steps[1].completed) {
      completeStep(2);
    }
    // Step 3: Code edited from default
    if (code !== DEFAULT_PYTHON_CODE && !steps[2].completed) {
      completeStep(3);
    }
  }, [connectionString, code]);

  // Append a console log helper with timestamp
  const appendLog = (type: TerminalLog['type'], message: string) => {
    const now = new Date();
    const timestamp = now.toISOString().split('T')[1].substring(0, 8);
    setLogs((prev) => [...prev, { timestamp, type, message }]);
  };

  const completeStep = (stepId: number) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, completed: true } : s))
    );
    // Auto shift current focus to next uncompleted step
    const targetIdx = stepId - 1;
    if (targetIdx === currentStepIndex && currentStepIndex < INITIAL_GUIDE_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const forceCompleteStep = (stepId: number) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, completed: !s.completed } : s))
    );
  };

  // Pre-load preset images (converting high resolution SVG mockups to Data URIs)
  const loadMockPreset = (id: string) => {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;

    const dataUrl = svgToDataUri(preset.svg);
    const fileName = `original/${preset.id}.jpg`;

    // Filter out existing ones with the same name to avoid duplicates
    setFiles((prev) => {
      const filtered = prev.filter((f) => f.name !== fileName && f.name !== `resized/${preset.id}.jpg`);
      const newFile: BlobFile = {
        name: fileName,
        size: preset.originalSize,
        width: preset.width,
        height: preset.height,
        url: dataUrl,
        createdAt: new Date().toLocaleTimeString(),
        category: 'original',
      };
      
      // Auto-select newly loaded file
      setSelectedFile(newFile);
      return [newFile, ...filtered];
    });

    appendLog('info', `Blob loaded in container: 'images/${fileName}' (Dimensions: ${preset.width}x${preset.height}px, Size: ${(preset.originalSize / (1024 * 1024)).toFixed(2)} MB)`);
    completeStep(1); // Done resource setup
    completeStep(4); // Done file upload
  };

  // Manual local upload inside virtual Azure Storage
  const handleFileUpload = (name: string, size: number, width: number, height: number, url: string) => {
    const newFile: BlobFile = {
      name,
      size,
      width,
      height,
      url,
      createdAt: new Date().toLocaleTimeString(),
      category: 'original',
    };
    setFiles((prev) => [newFile, ...prev.filter((f) => f.name !== name)]);
    setSelectedFile(newFile);
    appendLog('info', `Blob uploaded manually: 'images/${name}' (${width}x${height}px, Size: ${(size / 1024).toFixed(1)} KB)`);
    completeStep(4); // Trigger upload file step done
  };

  // Delete files in simulator
  const handleDeleteFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
    if (selectedFile?.name === name) {
      setSelectedFile(null);
    }
    appendLog('info', `Blob deleted from container: 'images/${name}'`);
  };

  // Execute PIL serverless resize simulator via Canvas
  const handleTriggerResize = () => {
    // Validate Connection String First
    if (!connectionString) {
      appendLog('error', 'Execution Error: "AZURE_STORAGE_CONNECTION_STRING" is missing. Please configure credentials in STEP 2 to authenticate function.');
      return;
    }

    // Validate Selected File
    if (!selectedFile) {
      appendLog('error', 'Trigger Failure: Request contains empty or invalid payload. "blob_name" missing from request body. Select or upload file in STEP 4.');
      return;
    }

    if (selectedFile.category !== 'original') {
      appendLog('error', 'Target Error: Selected image is already in the /resized/ folder. Please select an original base image to process.');
      return;
    }

    setIsProcessing(true);
    appendLog('system', `[HTTP Request] POST /api/resize - Payload: { "blob_name": "${selectedFile.name}" }`);
    
    // Parse dimensions from python code
    const targetSize = parsePythonResizeDimensions(code);
    const originalFile = selectedFile;

    // Simulation logs interval sequence
    setTimeout(() => {
      appendLog('info', `Executing Azure Function client: 'Functions.ResizeImage' (Request ID: fx_${Math.random().toString(36).substring(2, 9)})`);
    }, 400);

    setTimeout(() => {
      appendLog('info', `Downloading target input blob: 'images/${originalFile.name}'... OK.`);
    }, 1000);

    setTimeout(() => {
      appendLog('info', `Pillow (PIL) runtime initiated. Input dimensions: ${originalFile.width}x${originalFile.height}px.`);
    }, 1500);

    setTimeout(() => {
      appendLog('info', `Executing: image.resize((${targetSize.width}, ${targetSize.height})) using LANCZOS/BICUBIC filtering...`);
    }, 2000);

    // Canvas real resizing logic
    setTimeout(() => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetSize.width;
        canvas.height = targetSize.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, targetSize.width, targetSize.height);
          
          // Get resized image
          const resizedUrl = canvas.toDataURL('image/jpeg', 0.85);
          
          // Compute a realistic smaller compressed file size
          const originalRes = originalFile.width * originalFile.height;
          const targetRes = targetSize.width * targetSize.height;
          const ratio = targetRes / originalRes;
          // Compression adds extra 3-4x size savings typically
          const computedSize = Math.max(8100, Math.round(originalFile.size * ratio * 0.25));

          const resizedBlobName = `resized/${originalFile.name.replace('original/', '')}`;

          setFiles((prev) => {
            const newResized: BlobFile = {
              name: resizedBlobName,
              size: computedSize,
              width: targetSize.width,
              height: targetSize.height,
              url: resizedUrl,
              createdAt: new Date().toLocaleTimeString(),
              category: 'resized',
            };
            
            // Auto Select the new file
            setSelectedFile(newResized);
            return [newResized, ...prev.filter((f) => f.name !== resizedBlobName)];
          });

          appendLog('success', `Success: Resized photo written to buffer. Size reduced from ${(originalFile.size / (1024 * 1024)).toFixed(2)} MB to ${(computedSize / 1024).toFixed(1)} KB.`);
          appendLog('info', `Uploading output stream to: 'images/${resizedBlobName}'... Done.`);
          appendLog('success', `Executed successfully. Server returned HTTP 200 OK.`);

          setIsProcessing(false);
          completeStep(3); // Code verified and adjusted
          completeStep(5); // Run Trigger Complete
          completeStep(6); // Verify load optimization
        }
      };
      img.src = originalFile.url;
    }, 2800);
  };

  // Optimization metrics calculators for Step 6 analysis
  const getSelectedRelatedFiles = () => {
    if (!selectedFile) return { original: null, resized: null };
    
    if (selectedFile.category === 'resized') {
      const origName = `original/${selectedFile.name.replace('resized/', '')}`;
      const original = files.find((f) => f.name === origName) || null;
      return { original, resized: selectedFile };
    } else {
      const resName = `resized/${selectedFile.name.replace('original/', '')}`;
      const resized = files.find((f) => f.name === resName) || null;
      return { original: selectedFile, resized };
    }
  };

  const { original: optOriginal, resized: optResized } = getSelectedRelatedFiles();

  // Network parameters and 3G Latency formula simulation
  const calculateLoadTimeSeconds = (sizeInBytes: number, speedMbps: number = 1.6) => {
    // 3G speed average is ~1.6 Mbps = 200 KB/sec
    const speedBytesPerSec = (speedMbps * 1000 * 1000) / 8;
    return parseFloat((sizeInBytes / speedBytesPerSec).toFixed(2));
  };

  const savingsPercentage = optOriginal && optResized
    ? Math.round(((optOriginal.size - optResized.size) / optOriginal.size) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-gray-800 flex flex-col justify-between" id="applet-container">
      {/* Visual Navigation Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 px-4 py-3 md:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-azure-blue text-white rounded-xl shadow-xs">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="font-sans font-extrabold text-base md:text-lg tracking-tight text-gray-900 flex flex-wrap items-center gap-2">
                Serverless Python Image Processor
                <span className="text-[10px] bg-blue-50 border border-blue-200 text-azure-blue font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Azure Function Sandbox</span>
                <span className="text-[10px] bg-gray-100 border border-gray-200 text-gray-700 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">Written by Brian McCarthy</span>
              </h1>
              <p className="text-xs text-gray-500 font-sans mt-0.5">Automated image resizing using Pillow (PIL) and Blob triggers in the cloud</p>
            </div>
          </div>
          
          {/* Quick Metrics Header Overlay */}
          <div className="flex items-center gap-4 text-xs font-mono bg-gray-50 py-1.5 px-3 rounded-lg border border-gray-200">
            <div className="flex items-center gap-1.5 border-r border-gray-200 pr-3">
              <Activity className="w-3.5 h-3.5 text-azure-blue" />
              <span className="text-gray-500 font-sans font-bold">Simulated CPU:</span>
              <span className="text-gray-800 font-bold">0.05%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-gray-500 font-sans font-bold">Memory Limit:</span>
              <span className="text-gray-800 font-bold">256 MB</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="applet-main-grid">
        {/* Left Side: Walkthrough Guide and Code Workspace (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          {/* Collapsible interactive guide steps to learn how cloud is deployed */}
          <GuideWalkthrough
            steps={steps}
            onToggleStep={forceCompleteStep}
            currentStepIndex={currentStepIndex}
            onSelectStep={setCurrentStepIndex}
          />

          {/* Code Workspace IDE container */}
          <CodeWorkspace
            code={code}
            onCodeChange={setCode}
            connectionString={connectionString}
            onConnectionStringChange={setConnectionString}
            onTriggerResize={handleTriggerResize}
            hasActiveImage={!!files.some((f) => f.category === 'original')}
            isProcessing={isProcessing}
          />
        </div>

        {/* Right Side: Storage Container & Console (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col">
          {/* Cloud Storage container block */}
          <StorageExplorer
            files={files}
            onUploadFile={handleFileUpload}
            onDeleteFile={handleDeleteFile}
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
            onLoadPreset={loadMockPreset}
          />

          {/* Real-time server logs simulated block */}
          <SimulatorConsole
            logs={logs}
            onClearLogs={() => setLogs([])}
            isProcessing={isProcessing}
            connectionString={connectionString}
          />

          {/* Comparative analysis metrics module (Shows up when original or resized is selected) */}
          <AnimatePresence>
            {optOriginal && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden p-5 shadow-sm space-y-4 animate-fade"
                id="optimization-metrics-panel"
              >
                {/* Panel Header */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-azure-blue rounded-lg border border-blue-100">
                      <Gauge className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-sans font-bold text-gray-800 text-sm">Step 6: Optimization & Load Performance Metrics</h3>
                      <p className="text-[11px] text-gray-500 font-sans">Simulating loading latency under standard mobile connections</p>
                    </div>
                  </div>
                  {optResized ? (
                    <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold font-sans px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> High Speed Optimal
                    </span>
                  ) : (
                    <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 font-bold font-sans px-2.5 py-1 rounded-full animate-pulse">
                      Pending Optimization
                    </span>
                  )}
                </div>

                {/* Main Metrics Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Original Card */}
                  <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-lg space-y-2">
                    <div className="text-[10px] text-gray-450 font-sans font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      ORIGINAL MASTER
                    </div>
                    <div>
                      <div className="text-sm font-sans font-bold text-gray-800 truncate" title={optOriginal.name.split('/').pop()}>
                        {optOriginal.name.split('/').pop()}
                      </div>
                      <div className="text-[10px] text-gray-450 font-mono mt-0.5">
                        Resolution: {optOriginal.width} x {optOriginal.height} px
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-500 font-sans font-semibold">Storage Size:</div>
                      <div className="text-lg font-bold font-mono text-gray-800">
                        {(optOriginal.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-sans font-semibold">Simulated 3G Load Delay:</div>
                      <div className="text-sm font-bold font-mono text-rose-600">
                        {calculateLoadTimeSeconds(optOriginal.size)} seconds
                      </div>
                    </div>
                  </div>

                  {/* Resized/Optimized Card */}
                  <div className={`border p-3.5 rounded-lg space-y-2 transition-all ${
                    optResized 
                      ? 'bg-emerald-50/20 border-emerald-250' 
                      : 'bg-gray-50/50 border-gray-200/60 opacity-60 text-gray-400'
                  }`}>
                    <div className={`text-[10px] font-sans font-bold flex items-center gap-1.5 ${optResized ? 'text-emerald-700' : 'text-gray-400'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      AZURE SERVERLESS COMPRESSED
                    </div>
                    {optResized ? (
                      <>
                        <div>
                          <div className="text-sm font-sans font-bold text-emerald-700 truncate">
                            {optResized.name.split('/').pop()}
                          </div>
                          <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                            Resolution: {optResized.width} x {optResized.height} px (PIL Adjusted)
                          </div>
                        </div>
                        <div className="pt-2 border-t border-emerald-200/50">
                          <div className="text-xs text-emerald-700 font-sans font-semibold">Storage Size:</div>
                          <div className="text-lg font-bold font-mono text-emerald-600">
                            {(optResized.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-emerald-705 font-sans font-semibold">Simulated 3G Load Delay:</div>
                          <div className="text-sm font-bold font-mono text-emerald-600">
                            {calculateLoadTimeSeconds(optResized.size)} seconds
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="py-8 text-center text-xs font-sans text-gray-400 flex flex-col items-center justify-center gap-1.5">
                        <Zap className="w-5 h-5 text-gray-300" />
                        <span>Run Trigger to see savings!</span>
                      </div>
                    )}
                  </div>

                  {/* Savings summary Card */}
                  <div className="bg-gradient-to-b from-blue-50/40 to-white border border-blue-100 p-3.5 rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] text-azure-blue font-sans font-bold flex items-center gap-1.5">
                        <TrendingDown className="w-3.5 h-3.5" />
                        BANDWIDTH EFFICIENCY
                      </div>
                      {optResized ? (
                        <div className="mt-3 text-center space-y-1">
                          <div className="text-3xl md:text-4xl font-extrabold font-mono text-emerald-600 tracking-tight">
                            -{savingsPercentage}%
                          </div>
                          <div className="text-[10px] text-gray-500 font-sans tracking-wide uppercase font-bold">
                            Data footprint slashed
                          </div>
                        </div>
                      ) : (
                        <div className="py-6 text-center text-xs font-sans text-gray-405 leading-relaxed">
                          Resizing removes excessive meta, downsizes layout pixels, and applies optimal JPEG algorithms.
                        </div>
                      )}
                    </div>
                    {optResized && (
                      <div className="mt-3 p-2.5 bg-blue-50 border border-blue-100 rounded-lg text-[10px] font-sans text-blue-800 leading-relaxed font-medium">
                        ✨ **Optimization Result:** User loading speed is increased by **{(calculateLoadTimeSeconds(optOriginal.size) / Math.max(0.01, calculateLoadTimeSeconds(optResized.size))).toFixed(0)}x**! Reduced server request overhead on mobile devices.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Branding and reference */}
      <footer className="mt-12 py-6 border-t border-gray-200 bg-white text-center text-xs text-gray-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-semibold">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Virtual Serverless Cloud Environment Console
          </span>
          <span>Written by Brian McCarthy • © 2026 Photo Sharing Inc. • Serverless Image Processing Lab</span>
        </div>
      </footer>
    </div>
  );
}
