import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Film, 
  Sparkles
} from 'lucide-react';
import type { Shot, TeamMember, ProductionStage } from '../types';

interface InspectorProps {
  selectedShot: Shot | null;
  onClose: () => void;
  team: TeamMember[];
  onUpdateStage: (shotId: string, stage: ProductionStage) => void;
  fps: number;
}

const STAGES: ProductionStage[] = [
  'Script',
  'Layout',
  'Keyframe',
  'In-Between',
  'Color & FX',
  'Composite',
  'Approved'
];

export const Inspector: React.FC<InspectorProps> = ({
  selectedShot,
  onClose,
  team,
  onUpdateStage,
  fps
}) => {
  const [celebrate, setCelebrate] = useState(false);

  if (!selectedShot) {
    return (
      <aside className="w-80 lg:w-96 border-l border-[#e9e3d8] bg-[#fcfaf6] p-6 flex flex-col justify-between shrink-0 h-full overflow-y-auto">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#e9e3d8]">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Studio Inspector
            </span>
          </div>

          <div className="mt-12 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/70 text-amber-700 mx-auto flex items-center justify-center mb-4">
              <Film className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-base font-semibold text-stone-900 mb-1">
              Select an Asset or Shot
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
              Click any shot, storyboard frame, audio take, or render version to inspect camera cuts, frame pacing, assignees, and revision histories.
            </p>
          </div>

          <div className="mt-12 p-4 rounded-xl bg-white border border-[#e9e3d8] shadow-xs">
            <div className="flex items-center space-x-2 text-xs font-semibold text-stone-700 mb-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Indie Team Guidelines</span>
            </div>
            <ul className="text-xs text-stone-500 space-y-2 list-disc list-inside">
              <li>24fps cine standard locked for all keyframe timing.</li>
              <li>Renders output in 4K DCI anamorphic crop.</li>
              <li>Sound takes synced to frame 1 of each beat.</li>
            </ul>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-stone-100 text-stone-500 text-[11px] text-center">
          Cloudflare D1 SQLite & R2 Edge connected
        </div>
      </aside>
    );
  }

  const assignedMember = team.find(m => m.id === selectedShot.assignedTo);
  const frameLength = selectedShot.endFrame - selectedShot.startFrame + 1;
  const calculatedSeconds = (frameLength / fps).toFixed(2);

  const handleApprove = () => {
    setCelebrate(true);
    onUpdateStage(selectedShot.id, 'Approved');
    setTimeout(() => setCelebrate(false), 2400);
  };

  return (
    <aside className="w-80 lg:w-96 border-l border-[#e9e3d8] bg-white flex flex-col shrink-0 h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-[#e9e3d8] flex items-center justify-between bg-[#fcfaf6]">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-800">
            {selectedShot.code}
          </span>
          <span className="text-xs text-stone-500 truncate max-w-[130px]">
            {selectedShot.title}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-stone-200/70 text-stone-400 hover:text-stone-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-6 flex-1 overflow-y-auto">
        {/* Thumbnail Preview */}
        <div className="relative rounded-xl overflow-hidden border border-[#e9e3d8] bg-stone-900 aspect-video group shadow-xs">
          <img 
            src={selectedShot.thumbnailUrl} 
            alt={selectedShot.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-stone-200">
            {selectedShot.cameraAngle}
          </div>
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-amber-300">
            {frameLength} frames • {calculatedSeconds}s
          </div>
        </div>

        {/* Quick Approve or Progression CTA */}
        {selectedShot.stage !== 'Approved' ? (
          <button
            onClick={handleApprove}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-medium text-xs flex items-center justify-center space-x-2 shadow-sm transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark as Director Approved</span>
          </button>
        ) : (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between text-xs">
            <span className="flex items-center space-x-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Director Sign-off Approved</span>
            </span>
            <span className="text-[10px] font-mono">LOCKED</span>
          </div>
        )}

        {celebrate && (
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-center text-xs animate-bounce font-medium">
            🎉 Stage approved and locked for Master Cut!
          </div>
        )}

        {/* Stage Stepper */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2 block">
            Production Stage
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {STAGES.map((st) => {
              const isActive = selectedShot.stage === st;
              return (
                <button
                  key={st}
                  onClick={() => onUpdateStage(selectedShot.id, st)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs text-left transition-all flex items-center justify-between ${
                    isActive 
                      ? 'bg-amber-600 text-white font-medium shadow-xs' 
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200/60'
                  }`}
                >
                  <span className="truncate">{st}</span>
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Assigned Artist */}
        <div className="p-3.5 rounded-xl bg-[#fcfaf6] border border-[#e9e3d8]">
          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2 block">
            Lead Assignee
          </label>
          {assignedMember ? (
            <div className="flex items-center space-x-3">
              <img 
                src={assignedMember.avatar} 
                alt={assignedMember.name} 
                className="w-9 h-9 rounded-full object-cover ring-1 ring-stone-300" 
              />
              <div>
                <p className="text-xs font-semibold text-stone-900 leading-tight">
                  {assignedMember.name}
                </p>
                <p className="text-[11px] text-stone-500 leading-tight">
                  {assignedMember.role}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-xs text-stone-400 italic">Unassigned</div>
          )}
        </div>

        {/* Timing Details */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-[#fcfaf6] border border-[#e9e3d8]">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold block mb-1">
              Start - End Frame
            </span>
            <span className="font-mono font-medium text-stone-800">
              {selectedShot.startFrame} → {selectedShot.endFrame}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#fcfaf6] border border-[#e9e3d8]">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold block mb-1">
              Complexity
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-medium inline-block ${
              selectedShot.complexity === 'Hero' ? 'bg-purple-100 text-purple-800' :
              selectedShot.complexity === 'Complex' ? 'bg-amber-100 text-amber-800' :
              'bg-stone-100 text-stone-700'
            }`}>
              {selectedShot.complexity}
            </span>
          </div>
        </div>

        {/* Director Notes */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">
            Director & Continuity Notes
          </label>
          <div className="p-3 rounded-xl bg-[#fcfaf6] border border-[#e9e3d8] text-xs text-stone-700 leading-relaxed font-sans">
            {selectedShot.notes || "No notes documented yet."}
          </div>
        </div>
      </div>
    </aside>
  );
};
