import React, { useState } from 'react';
import type { 
  AudioTake, 
  TeamMember,
  UserAccount
} from '../../types';
import { 
  Mic2, 
  Plus, 
  Trash2, 
  Search,
  Music2
} from 'lucide-react';
import { NewAudioModal } from '../Modals/NewAudioModal';

interface AudioLabViewProps {
  takes: AudioTake[];
  team?: TeamMember[];
  currentUser: UserAccount;
  onSelectTake?: (takeId: string) => void;
  onAddAudioTake?: (take: Omit<AudioTake, 'id' | 'createdAt'>) => void;
  onDeleteAudioTake?: (takeId: string) => void;
}

export const AudioLabView: React.FC<AudioLabViewProps> = ({
  takes,
  team: _team,
  currentUser,
  onAddAudioTake,
  onDeleteAudioTake
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewAudioModalOpen, setIsNewAudioModalOpen] = useState(false);

  const filteredTakes = takes.filter(t => {
    const text = `${t.title || ''} ${t.characterName || ''} ${t.description || ''} ${t.notes || ''}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#fcfaf6]">
      {/* Top Control Bar */}
      <div className="h-16 border-b border-[#e9e3d8] bg-white px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center">
            <Mic2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-base font-semibold text-stone-900 leading-tight">
              Voiceover & Sound Lab
            </h2>
            <p className="text-[11px] text-stone-500 hidden sm:block">
              MP3 voice takes leh audio clips play-na & repository
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
            {takes.length} Takes
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search audio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#e9e3d8] bg-[#fcfaf6] focus:outline-none focus:ring-1 focus:ring-amber-500 w-44"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsNewAudioModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Upload MP3</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {filteredTakes.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-dashed border-[#e9e3d8]">
            <Music2 className="w-10 h-10 text-stone-300 mb-2" />
            <h3 className="font-serif text-stone-800 font-semibold text-sm">Audio take a la awm lo</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm">
              Voiceover emaw sound effect MP3 file i neih chuan Upload MP3 button hmetin dah lut rawh le.
            </p>
            <button
              onClick={() => setIsNewAudioModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              + Upload MP3 Take
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTakes.map((take) => {
              const displayTitle = take.title || take.characterName || 'Voice Take';
              const displayDesc = take.description || take.notes || take.lineText;

              return (
                <div
                  key={take.id}
                  className="bg-white rounded-2xl border border-[#e9e3d8] p-4 shadow-xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Title & Badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/60">
                          <Music2 className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif text-sm font-semibold text-stone-900 truncate">
                          {displayTitle}
                        </h3>
                      </div>

                      {onDeleteAudioTake && (
                        <button
                          type="button"
                          onClick={() => onDeleteAudioTake(take.id)}
                          className="p-1 rounded-lg text-stone-300 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                          title="Delete audio take"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Description */}
                    {displayDesc && (
                      <p className="text-xs text-stone-600 leading-relaxed mb-3 line-clamp-3 bg-[#fcfaf6] p-2.5 rounded-xl border border-stone-100">
                        {displayDesc}
                      </p>
                    )}

                    {/* Native Audio Player */}
                    <div className="mb-3">
                      <audio
                        controls
                        src={take.audioDataUrl || take.audioUrl}
                        className="w-full h-9 rounded-lg accent-amber-600"
                        preload="metadata"
                      />
                    </div>
                  </div>

                  {/* Card Footer: Poster / Author Info */}
                  <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <img
                        src={take.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={take.createdByName || 'Artist'}
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-amber-300"
                      />
                      <span className="text-[11px] font-medium text-stone-700">
                        Posted by <strong>{take.createdByName || 'Maltea'}</strong>
                      </span>
                    </div>

                    <span className="text-[10px] text-stone-400 font-mono">
                      {take.createdAt || 'Active'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload MP3 Modal */}
      {isNewAudioModalOpen && onAddAudioTake && (
        <NewAudioModal
          isOpen={isNewAudioModalOpen}
          currentUser={currentUser}
          onClose={() => setIsNewAudioModalOpen(false)}
          onAddAudioTake={onAddAudioTake}
        />
      )}
    </div>
  );
};
