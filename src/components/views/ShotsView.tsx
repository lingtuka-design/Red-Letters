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
  Plus,
  Trash2
} from 'lucide-react';

interface ShotsViewProps {
  shots: Shot[];
  team: TeamMember[];
  fps: number;
  selectedShot: Shot | null;
  onSelectShot: (shot: Shot) => void;
  onUpdateStage: (shotId: string, stage: ProductionStage) => void;
  onOpenNewShot: () => void;
  onDeleteShot?: (shotId: string) => void;
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
  fps: _fps,
  selectedShot,
  onSelectShot,
  onUpdateStage,
  onOpenNewShot,
  onDeleteShot
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
                          {/* Picture Preview */}
                          {shot.thumbnailUrl && (
                            <div className="relative rounded-lg overflow-hidden aspect-video mb-2.5 bg-stone-900 shadow-2xs">
                              <img 
                                src={shot.thumbnailUrl} 
                                alt={shot.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                              />
                              {shot.sceneName && (
                                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[10px] font-semibold text-amber-300">
                                  {shot.sceneName}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Title */}
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <h4 className="text-xs font-semibold text-stone-900 leading-snug">
                              {shot.title}
                            </h4>
                          </div>

                          {/* Description */}
                          {(shot.description || shot.notes) && (
                            <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed mb-2">
                              {shot.description || shot.notes}
                            </p>
                          )}

                          {/* Post-tu & Footer */}
                          <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                            <div className="flex items-center space-x-1.5" title={`Posted by ${shot.createdByName || assignee?.name || 'Artist'}`}>
                              <img 
                                src={shot.authorAvatar || assignee?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                                alt={shot.createdByName || assignee?.name || 'Artist'} 
                                className="w-5 h-5 rounded-full object-cover ring-1 ring-amber-300" 
                              />
                              <span className="text-[11px] text-stone-700 font-medium truncate max-w-[85px]">
                                {shot.createdByName ? shot.createdByName : assignee?.name?.split(' ')[0] || 'Artist'}
                              </span>
                            </div>

                            {/* Quick Stage Shifters & Delete */}
                            <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                              {onDeleteShot && (
                                <button
                                  type="button"
                                  onClick={() => onDeleteShot(shot.id)}
                                  title="Delete shot picture"
                                  className="p-1 rounded text-stone-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
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
                    <th className="py-3 px-4">Picture</th>
                    <th className="py-3 px-4">Scene</th>
                    <th className="py-3 px-4">Shot Title & Description</th>
                    <th className="py-3 px-4">Stage</th>
                    <th className="py-3 px-4">Post-tu (Artist)</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredShots.map((shot) => {
                    const assignee = team.find(m => m.id === shot.assignedTo);
                    const isSelected = selectedShot?.id === shot.id;

                    return (
                      <tr 
                        key={shot.id}
                        onClick={() => onSelectShot(shot)}
                        className={`hover:bg-[#f6efe3]/40 cursor-pointer transition-colors ${
                          isSelected ? 'bg-amber-50/50' : ''
                        }`}
                      >
                        <td className="py-2.5 px-4">
                          <img 
                            src={shot.thumbnailUrl} 
                            alt={shot.title} 
                            className="w-14 h-9 object-cover rounded-md border border-stone-200"
                          />
                        </td>
                        <td className="py-3 px-4 font-semibold text-amber-800">
                          {shot.sceneName || shot.code || '-'}
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-medium text-stone-800">{shot.title}</div>
                          {(shot.description || shot.notes) && (
                            <div className="text-[11px] text-stone-500 truncate">{shot.description || shot.notes}</div>
                          )}
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
                          <div className="flex items-center space-x-2">
                            <img 
                              src={shot.authorAvatar || assignee?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                              alt={shot.createdByName || assignee?.name || 'Artist'} 
                              className="w-5 h-5 rounded-full object-cover" 
                            />
                            <span className="text-stone-700 font-medium">
                              {shot.createdByName ? shot.createdByName : assignee?.name || 'Artist'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-stone-400">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectShot(shot);
                              }}
                              className="text-amber-700 hover:text-amber-800 font-medium"
                            >
                              View
                            </button>
                            {onDeleteShot && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteShot(shot.id);
                                }}
                                className="text-red-500 hover:text-red-700"
                                title="Delete shot"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
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
