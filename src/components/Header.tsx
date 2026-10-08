import React from 'react';
import { 
  Clapperboard, 
  CloudLightning, 
  Plus, 
  Download, 
  Film,
  Layers
} from 'lucide-react';
import type { Project, TeamMember, Shot } from '../types';

interface HeaderProps {
  project: Project;
  team: TeamMember[];
  shots: Shot[];
  onOpenNewShot: () => void;
  onOpenExport: () => void;
  selectedShot?: Shot | null;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  team,
  shots,
  onOpenNewShot,
  onOpenExport
}) => {
  const approvedCount = shots.filter(s => s.stage === 'Approved').length;
  const progressPct = shots.length > 0 ? Math.round((approvedCount / shots.length) * 100) : 0;
  const totalFrames = shots.reduce((acc, s) => acc + (s.endFrame - s.startFrame + 1), 0);
  const totalDurationSec = (totalFrames / project.fps).toFixed(1);

  return (
    <header className="h-16 border-b border-[#e9e3d8] bg-[#ffffff]/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-20">
      {/* Brand & Project Metadata */}
      <div className="flex items-center space-x-5">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white shadow-sm shadow-amber-600/30">
            <Film className="w-5 h-5 text-amber-50" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif italic font-medium text-base text-stone-900 tracking-tight">
                AURA Studio
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                Indie Hub
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium truncate max-w-[200px] md:max-w-[260px]">
              {project.title}
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-2 pl-4 border-l border-[#e9e3d8]/80 text-xs text-stone-600">
          <span className="px-2 py-0.5 rounded bg-stone-100 font-mono text-[11px] text-stone-700">
            {project.fps} FPS
          </span>
          <span className="px-2 py-0.5 rounded bg-stone-100 font-mono text-[11px] text-stone-700">
            {project.aspectRatio}
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-100/60 text-amber-900 text-[11px] font-medium">
            {project.status}
          </span>
        </div>
      </div>

      {/* Center Production Metrics */}
      <div className="hidden md:flex items-center space-x-6 px-4 py-1.5 rounded-full bg-[#fcfaf6] border border-[#e9e3d8]">
        <div className="flex items-center space-x-2 text-xs">
          <Layers className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-500 font-medium">Shots:</span>
          <span className="font-mono font-semibold text-stone-800">{shots.length}</span>
        </div>
        <div className="h-3 w-px bg-stone-200" />
        <div className="flex items-center space-x-2 text-xs">
          <Clapperboard className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-500 font-medium">Approved:</span>
          <span className="font-mono font-semibold text-emerald-700">{approvedCount} ({progressPct}%)</span>
        </div>
        <div className="h-3 w-px bg-stone-200" />
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-stone-500 font-medium">Cut:</span>
          <span className="font-mono font-semibold text-stone-800">{totalFrames} f ({totalDurationSec}s)</span>
        </div>
      </div>

      {/* Right Actions & Team Presence */}
      <div className="flex items-center space-x-4">
        {/* Indie Team Stack (5 Members) */}
        <div className="hidden sm:flex items-center -space-x-2 hover:space-x-1 transition-all duration-200 p-1 rounded-full bg-[#fcfaf6] border border-[#e9e3d8]/80">
          {team.map((m) => (
            <div 
              key={m.id} 
              className="relative group cursor-pointer"
              title={`${m.name} (${m.role}) — ${m.currentTask}`}
            >
              <img 
                src={m.avatar} 
                alt={m.name} 
                className="w-7 h-7 rounded-full object-cover ring-2 ring-white hover:ring-amber-500 transition-all"
              />
              <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1 ring-white ${
                m.status === 'online' ? 'bg-emerald-500' :
                m.status === 'busy' ? 'bg-amber-500' : 'bg-stone-300'
              }`} />
            </div>
          ))}
        </div>

        {/* Cloudflare Edge Badge */}
        <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200/70 text-[11px] text-orange-800 font-medium">
          <CloudLightning className="w-3.5 h-3.5 text-orange-600" />
          <span>Pages + D1 & R2</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenExport}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-white border border-[#e9e3d8] hover:bg-[#f7f2e9] hover:border-stone-300 transition-colors shadow-xs"
            title="Export Shot Sheet & Breakdown"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export</span>
          </button>

          <button
            onClick={onOpenNewShot}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 transition-colors shadow-sm shadow-amber-600/25"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Shot</span>
          </button>
        </div>
      </div>
    </header>
  );
};
