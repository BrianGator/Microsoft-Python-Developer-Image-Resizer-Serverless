import React from 'react';
import { GuideStep } from '../types';
import { CheckCircle2, Circle, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface GuideWalkthroughProps {
  steps: GuideStep[];
  onToggleStep: (id: number) => void;
  currentStepIndex: number;
  onSelectStep: (index: number) => void;
}

export default function GuideWalkthrough({
  steps,
  onToggleStep,
  currentStepIndex,
  onSelectStep,
}: GuideWalkthroughProps) {
  const completedCount = steps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm" id="guide-walkthrough-panel">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50/75 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-50 text-azure-blue rounded-lg border border-blue-105">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans font-bold text-gray-800 text-sm md:text-base">Interactive Training Walkthrough</h2>
            <p className="text-[11px] text-gray-500 font-sans">Deploying serverless python image processing • Written by Brian McCarthy</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-azure-blue block font-mono">{completedCount}/{steps.length} Done</span>
          <span className="text-[10px] text-gray-400 block font-sans uppercase tracking-wider font-semibold">Progress</span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="h-1.5 bg-gray-100 w-full relative">
        <motion.div 
          className="h-full bg-azure-blue"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Guide Steps */}
      <div className="p-4 space-y-2.5 max-h-[340px] overflow-y-auto custom-scrollbar">
        {steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isCompleted = step.completed;

          return (
            <motion.div
              layoutId={`step-card-${step.id}`}
              key={step.id}
              onClick={() => onSelectStep(idx)}
              className={`group flex items-start gap-3 p-3 rounded-lg border text-left cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50/70 border-l-4 border-l-azure-blue border-blue-200/80 shadow-xs'
                  : isCompleted
                    ? 'bg-gray-50/50 border-gray-200/60 opacity-85 hover:bg-gray-50 hover:border-gray-350'
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
              id={`guide-step-${step.id}`}
            >
              {/* Checkbox Trigger */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStep(step.id);
                }}
                className="mt-0.5 flex-shrink-0 transition-transform duration-150 active:scale-95 focus:outline-none cursor-pointer"
                id={`btn-complete-step-${step.id}`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50/60" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                )}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isCompleted 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                      : isActive 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                        : 'bg-gray-100 text-gray-500'
                  }`}>
                    STEP {step.id}
                  </span>
                  {isActive && (
                    <span className="text-[10px] bg-blue-105 text-blue-700 font-sans font-semibold px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                      Target Area <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <h3 className={`text-sm font-sans font-semibold line-clamp-1 ${
                  isCompleted ? 'text-gray-400 line-through decoration-gray-400/50' : 'text-gray-800'
                }`}>
                  {step.title}
                </h3>
                {isActive && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-xs text-gray-600 font-sans leading-relaxed mt-1"
                  >
                    {step.description}
                  </motion.p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Azure Help Prompt */}
      <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 text-[11px] font-sans text-gray-500 flex items-center justify-between">
        <span className="font-medium">Prerequisite: Microsoft Azure Account setup</span>
        <a 
          href="https://portal.azure.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-azure-blue hover:text-azure-hover hover:underline flex items-center gap-1 font-bold"
        >
          Portal <ArrowRight className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  );
}

