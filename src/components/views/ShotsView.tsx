import React, { useState } from 'react';
import type { 
  Shot, 
  TeamMember, 
  ProductionStage 
} from '../../types';
import { 
  Kanban, 
  Table as TableIcon, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Plus
} from 'lucide-react';

interface ShotsViewProps {
  shots: Shot[];
  team: TeamMember[];
  fps: number;
  selectedShot: Shot | null;
  onSelectShot: (shot: Shot) => void;
  onUpdateStage: (shotId: string, stage: ProductionStage) => void;
  onOpenNewShot: () => void;
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

export const ShotsView: React.FC<ShotsViewProps> = ({
  shots,
  team,
  fps,
  selectedShot,
  onSelectShot,
  onUpdateStage,
  onOpenNewShot
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Filter shots
  const filteredShots = shots.filter(shot => {
    const matchesSearch = shot.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          shot.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAssignee = filterAssignee === 'all' || shot.assignedTo === filterAssignee;
    const matchesPriority = filterPriority === 'all' || shot.priority === filterPriority;
    return matchesSearch && matchesAssignee && matchesPriority;
  });

  const getNextStage = (current: ProductionStage): ProductionStage | null => {
    const idx = STAGES.indexOf(current);
    if (idx >= 0 && idx < STAGES.length - 1) return STAGES[idx + 1];
    return null;
  };

  const getPrevStage = (current: ProductionStage): ProductionStage | null => {
    const idx = STAGES.indexOf(current);
    if (idx > 0) return STAGES[idx - 1];
    return null;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#fcfaf6]">
      {/* Shots Control Bar */}
      <div className="min-h-16 border-b border-[#e9e3d8] bg-white px-3 sm:px-6 py-2.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap gap-y-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search shot..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#e9e3d8] bg-[#fcfaf6] text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 w-32 xs:w-40 sm:w-48 md:w-60"
            />
          </div>

          {/* Filter Assignee */}
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="text-xs py-1.5 px-2 rounded-lg border border-[#e9e3d8] bg-white text-stone-700 max-w-[110px] sm:max-w-none"
          >
            <option value="all">All Assignees</option>
            {team.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          {/* Filter Priority */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="hidden sm:inline-block text-xs py-1.5 px-2.5 rounded-lg border border-[#e9e3d8] bg-white text-stone-700"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* View Switcher & Action */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <div className="flex items-center p-1 rounded-lg bg-stone-100 border border-stone-200/60">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'kanban' ? 'bg-white text-amber-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'table' ? 'bg-white text-amber-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Table List View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenNewShot}
            className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden xs:inline">Add Shot</span>
          </button>
        </div>
      </div>

      {/* Main Board or Table */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-3 sm:p-6">
        {viewMode === 'kanban' ? (
          /* Kanban Board */
          <div className="flex space-x-4 h-full min-w-max pb-2">
            {STAGES.map((stage) => {
              const stageShots = filteredShots.filter(s => s.stage === stage);
              const isApprovedCol = stage === 'Approved';

              return (
                <div 
                  key={stage}
                  className={`w-72 flex flex-col rounded-2xl border ${
                    isApprovedCol 
                      ? 'bg-emerald-50/30 border-emerald-200/80' 
                      : 'bg-white border-[#e9e3d8]'
                  } shadow-xs`}
                >
                  {/* Column Header */}
                  <div className="p-3.5 border-b border-[#e9e3d8] flex items-center justify-between bg-[#fcfaf6]/60 rounded-t-2xl">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        isApprovedCol ? 'bg-emerald-500' :
                        stage === 'Composite' ? 'bg-indigo-500' :
                        stage === 'Keyframe' ? 'bg-amber-500' :
                        'bg-stone-400'
                      }`} />
                      <h3 className="text-xs font-semibold text-stone-800">
                        {stage}
                      </h3>
                    </div>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                      {stageShots.length}
                    </span>
                  </div>

                  {/* Column Cards */}
                  <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                    {stageShots.map((shot) => {
                      const assignee = team.find(m => m.id === shot.assignedTo);
                      const isSelected = selectedShot?.id === shot.id;
                      const nextSt = getNextStage(shot.stage);
                      const prevSt = getPrevStage(shot.stage);
                      const frameCount = shot.endFrame - shot.startFrame + 1;

                      return (
                        <div
                          key={shot.id}
                          onClick={() => onSelectShot(shot)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer group bg-white ${
                            isSelected 
                              ? 'border-amber-500 ring-2 ring-amber-100 shadow-sm' 
                              : 'border-[#e9e3d8] hover:border-stone-400 hover:shadow-xs'
                          }`}
                        >
                          {/* Thumbnail */}
                          {shot.thumbnailUrl && (
                            <div className="relative rounded-lg overflow-hidden aspect-video mb-2.5 bg-stone-900">
                              <img 
                                src={shot.thumbnailUrl} 
                                alt={shot.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                              />
                              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono text-stone-200">
                                {shot.code}
                              </div>
                              <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono text-amber-300">
                                {frameCount}f
                              </div>
                            </div>
                          )}

                          {/* Title & Priority */}
                          <div className="flex items-start justify-between gap-1 mb-2">
                            <h4 className="text-xs font-semibold text-stone-900 leading-snug">
                              {shot.title}
                            </h4>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                              shot.priority === 'Critical' ? 'bg-red-50 text-red-700 border border-red-200' :
                              shot.priority === 'High' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-stone-50 text-stone-600'
                            }`}>
                              {shot.priority}
                            </span>
                          </div>

                          {/* Assignee & Footer */}
                          <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                            <div className="flex items-center space-x-1.5">
                              {assignee ? (
                                <>
                                  <img 
                                    src={assignee.avatar} 
                                    alt={assignee.name} 
                                    className="w-5 h-5 rounded-full object-cover" 
                                    title={assignee.name}
                                  />
                                  <span className="text-[11px] text-stone-600 truncate max-w-[80px]">
                                    {assignee.name.split(' ')[0]}
                                  </span>
                                </>
                              ) : (
                                <span className="text-[10px] text-stone-400 italic">Unassigned</span>
                              )}
                            </div>

                            {/* Quick Stage Shifters */}
                            <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                              {prevSt && (
                                <button
                                  onClick={() => onUpdateStage(shot.id, prevSt)}
                                  title={`Move back to ${prevSt}`}
                                  className="p-1 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-700"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {nextSt && (
                                <button
                                  onClick={() => onUpdateStage(shot.id, nextSt)}
                                  title={`Advance to ${nextSt}`}
                                  className="p-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-700"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white border border-[#e9e3d8] rounded-2xl shadow-xs overflow-hidden h-full flex flex-col">
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fcfaf6] border-b border-[#e9e3d8] text-stone-500 uppercase tracking-wider font-semibold text-[10px] sticky top-0">
                  <tr>
                    <th className="py-3 px-4">Shot Code</th>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Stage</th>
                    <th className="py-3 px-4">Assignee</th>
                    <th className="py-3 px-4">Frames</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredShots.map((shot) => {
                    const assignee = team.find(m => m.id === shot.assignedTo);
                    const frameCount = shot.endFrame - shot.startFrame + 1;
                    const durationSec = (frameCount / fps).toFixed(2);
                    const isSelected = selectedShot?.id === shot.id;

                    return (
                      <tr 
                        key={shot.id}
                        onClick={() => onSelectShot(shot)}
                        className={`hover:bg-[#f6efe3]/40 cursor-pointer transition-colors ${
                          isSelected ? 'bg-amber-50/50' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-stone-900">
                          {shot.code}
                        </td>
                        <td className="py-3 px-4 font-medium text-stone-800">
                          {shot.title}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                            shot.stage === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            shot.stage === 'Composite' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
                            shot.stage === 'Keyframe' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                            'bg-stone-100 text-stone-700 border-stone-200'
                          }`}>
                            {shot.stage}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {assignee ? (
                            <div className="flex items-center space-x-2">
                              <img src={assignee.avatar} alt={assignee.name} className="w-5 h-5 rounded-full object-cover" />
                              <span className="text-stone-700">{assignee.name}</span>
                            </div>
                          ) : (
                            <span className="text-stone-400 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-stone-600">
                          {shot.startFrame} - {shot.endFrame} ({frameCount}f)
                        </td>
                        <td className="py-3 px-4 font-mono text-stone-600">
                          {durationSec}s
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                            shot.priority === 'Critical' ? 'bg-red-50 text-red-700' :
                            shot.priority === 'High' ? 'bg-amber-50 text-amber-700' :
                            'bg-stone-100 text-stone-600'
                          }`}>
                            {shot.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-stone-400">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectShot(shot);
                            }}
                            className="text-amber-700 hover:text-amber-800 font-medium"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
