import React, { useEffect, useRef } from 'react';
import { TerminalLog } from '../types';
import { Terminal, Trash2, Cpu, RefreshCw, Smartphone, Circle } from 'lucide-react';
import { motion } from 'motion/react';

interface SimulatorConsoleProps {
  logs: TerminalLog[];
  onClearLogs: () => void;
  isProcessing: boolean;
  connectionString: string;
}

export default function SimulatorConsole({
  logs,
  onClearLogs,
  isProcessing,
  connectionString,
}: SimulatorConsoleProps) {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the console when new logs print out
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-slate-950 border border-gray-200 rounded-xl overflow-hidden shadow-sm font-mono text-[11px] leading-relaxed select-text" id="simulator-console-panel">
      {/* Header tab */}
      <div className="p-3 bg-slate-950 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#0078D4]" />
          <span className="font-sans font-bold text-slate-105">Azure Function Streaming Logs</span>
          <span className="text-[9px] bg-white/5 border border-white/10 text-slate-300 px-1.5 py-0.5 rounded font-mono font-medium">
            python3.11-slim • Written by Brian McCarthy
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {isProcessing ? (
              <>
                <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
                <span className="text-amber-400 font-sans text-[10px] font-bold">RESIZING...</span>
              </>
            ) : connectionString ? (
              <>
                <Circle className="w-2 h-2 text-emerald-400 fill-emerald-500 animate-pulse" />
                <span className="text-emerald-400 font-sans text-[10px] font-bold">MONITORING BLOB</span>
              </>
            ) : (
              <>
                <Circle className="w-2 h-2 text-amber-400 fill-amber-500" />
                <span className="text-slate-500 font-sans text-[10px] font-bold">OFFLINE</span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onClearLogs}
            className="p-1 hover:bg-white/10 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
            title="Clear Terminal Logs"
            id="btn-clear-terminal-logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Details Info strip */}
      <div className="px-3 py-1.5 bg-slate-950 border-b border-white/5 text-[10px] text-slate-400 flex justify-between font-semibold">
        <span>Region: westus3</span>
        <span>Plan: Consumption (Y1)</span>
        <span>Trigger: blobs/images/{"{name}"}</span>
      </div>

      {/* Actual Logs Output Window */}
      <div className="p-4 bg-slate-950 h-[220px] overflow-y-auto custom-scrollbar flex flex-col space-y-1.5 text-left font-mono">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 font-sans italic p-4 text-[11px] font-medium">
            <Cpu className="w-5 h-5 text-slate-700 mb-1.5" />
            <span>Console quiet. Run the Azure Function to watch the serverless PIL (Pillow) stream execute...</span>
          </div>
        ) : (
          logs.map((log, index) => {
            const isError = log.type === 'error';
            const isSuccess = log.type === 'success';
            const isSystem = log.type === 'system';

            let logColor = 'text-slate-205';
            let categoryText = '[Info]';

            if (isError) {
              logColor = 'text-rose-400 font-bold';
              categoryText = '[Error]';
            } else if (isSuccess) {
              logColor = 'text-emerald-400 font-bold';
              categoryText = '[Success]';
            } else if (isSystem) {
              logColor = 'text-sky-400 font-bold';
              categoryText = '[System]';
            }

            return (
              <div key={index} className={`flex items-start gap-1 font-mono hover:bg-white/5 py-0.5 rounded px-1 transition-colors ${logColor}`}>
                <span className="text-slate-500 select-none mr-1 font-mono">[{log.timestamp}]</span>
                <span className="mr-1 select-none font-bold font-mono">{categoryText}</span>
                <span className="font-mono whitespace-pre-wrap break-all flex-1">{log.message}</span>
              </div>
            );
          })
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Virtual Terminal Footer */}
      <div className="px-4 py-2 border-t border-white/5 bg-slate-950 text-slate-500 text-[9px] font-mono flex justify-between font-semibold">
        <span>AZURE_FUNCTIONS_VERSION: v4</span>
        <span>FUNCTIONS_EXTENSION_VERSION: ~4</span>
      </div>
    </div>
  );
}
