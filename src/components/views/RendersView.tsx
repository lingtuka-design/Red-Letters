import React, { useState } from 'react';
import type { 
  RenderFile, 
  TeamMember,
  UserAccount
} from '../../types';
import { 
  Video, 
  Plus, 
  Trash2, 
  ExternalLink,
  MessageSquare, 
  Send,
  User
} from 'lucide-react';
import { NewRenderModal } from '../Modals/NewRenderModal';

interface RendersViewProps {
  renders: RenderFile[];
  team?: TeamMember[];
  currentUser: UserAccount;
  onAddFeedback: (
    renderId: string, 
    authorId: string, 
    timecodeSec: number, 
    comment: string, 
    authorName?: string, 
    authorAvatar?: string
  ) => void;
  onAddRender?: (render: Omit<RenderFile, 'id' | 'createdAt' | 'feedback'>) => void;
  onDeleteRender?: (renderId: string) => void;
}

export const RendersView: React.FC<RendersViewProps> = ({
  renders,
  team: _team,
  currentUser,
  onAddFeedback,
  onAddRender,
  onDeleteRender
}) => {
  const [selectedRenderId, setSelectedRenderId] = useState<string>(renders[0]?.id || '');
  const [isNewRenderModalOpen, setIsNewRenderModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Fallback to first if selected not found
  const currentRender = renders.find(r => r.id === selectedRenderId) || renders[0];

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentRender) return;

    onAddFeedback(
      currentRender.id, 
      currentUser.id, 
      0, 
      commentText.trim(),
      currentUser.name,
      currentUser.avatar
    );
    setCommentText('');
  };

  // Helper to resolve embed URL
  const getEmbedInfo = (url: string = '') => {
    if (!url) return { type: 'none', src: '' };

    // Google Drive URL
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const driveIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    const fileId = driveMatch?.[1] || driveIdMatch?.[1];

    if (fileId) {
      return {
        type: 'drive',
        src: `https://drive.google.com/file/d/${fileId}/preview`
      };
    }

    // YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch) {
      return {
        type: 'youtube',
        src: `https://www.youtube.com/embed/${ytMatch[1]}`
      };
    }

    // Direct Video
    return {
      type: 'direct',
      src: url
    };
  };

  const embed = currentRender ? getEmbedInfo(currentRender.driveUrl || currentRender.videoUrl) : null;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#fcfaf6]">
      {/* Top Control Bar */}
      <div className="min-h-16 border-b border-[#e9e3d8] bg-white px-4 sm:px-6 py-2.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-base font-semibold text-stone-900 leading-tight">
              Video Renders & Review
            </h2>
            <p className="text-[11px] text-stone-500 hidden sm:block">
              Google Drive renders upload & in-website video review
            </p>
          </div>
        </div>

        {/* Versions Tabs & Add Render Button */}
        <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-[#fcfaf6] border border-[#e9e3d8]">
            {renders.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRenderId(r.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  (currentRender?.id === r.id)
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-200/60'
                }`}
              >
                {r.title || r.shotCode || 'Render'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsNewRenderModalOpen(true)}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition-colors shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Render</span>
          </button>
        </div>
      </div>

      {/* Main Review Center */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3">
        {/* Left 2 Cols: Video Player & Description */}
        <div className="lg:col-span-2 p-4 sm:p-6 overflow-y-auto space-y-4">
          {currentRender ? (
            <>
              {/* Player Viewport */}
              <div className="relative rounded-2xl overflow-hidden bg-black border border-stone-800 shadow-lg aspect-video flex items-center justify-center">
                {embed?.type === 'drive' || embed?.type === 'youtube' ? (
                  <iframe
                    src={embed.src}
                    className="w-full h-full border-0 rounded-2xl"
                    allow="autoplay; fullscreen"
                    title={currentRender.title || 'Render Video'}
                  />
                ) : embed?.type === 'direct' ? (
                  <video 
                    src={embed.src} 
                    controls 
                    className="w-full h-full object-contain"
                    poster={currentRender.posterUrl}
                  />
                ) : (
                  <div className="text-center p-6 text-stone-400">
                    <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Video link invalid or unavailable</p>
                  </div>
                )}
              </div>

              {/* Render Meta & Description Card */}
              <div className="p-4 rounded-2xl bg-white border border-[#e9e3d8] shadow-xs space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-stone-900 leading-tight">
                      {currentRender.title || 'Animation Video Render'}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        {currentRender.status || 'In Review'}
                      </span>
                      {currentRender.createdAt && (
                        <span className="text-xs text-stone-400">
                          {currentRender.createdAt}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {currentRender.driveUrl && (
                      <a
                        href={currentRender.driveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:text-amber-800 bg-[#fcfaf6] text-xs font-medium text-stone-700 transition-colors"
                        title="Open in Google Drive"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Google Drive-ah en rawh</span>
                      </a>
                    )}

                    {onDeleteRender && (
                      <button
                        type="button"
                        onClick={() => onDeleteRender(currentRender.id)}
                        className="p-1.5 rounded-xl border border-stone-200 hover:border-red-300 hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete render"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Description Text */}
                {(currentRender.description || currentRender.notes) && (
                  <div className="p-3 rounded-xl bg-[#fcfaf6] border border-stone-100 text-xs text-stone-700 leading-relaxed">
                    {currentRender.description || currentRender.notes}
                  </div>
                )}

                {/* Post-tu (Creator Info) */}
                <div className="pt-2 border-t border-stone-100 flex items-center space-x-2 text-xs">
                  <img
                    src={currentRender.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={currentRender.createdByName || 'Artist'}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-400"
                  />
                  <span className="text-stone-600 font-medium">
                    Posted by: <strong className="text-stone-900">{currentRender.createdByName || 'Maltea'}</strong>
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-dashed border-[#e9e3d8]">
              <Video className="w-10 h-10 text-stone-300 mb-2" />
              <h3 className="font-serif text-stone-800 font-semibold text-sm">Render a la awm lo</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm">
                Google drive link dah lutin video render review tur dah rawh le.
              </p>
              <button
                onClick={() => setIsNewRenderModalOpen(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                + Add Render Video
              </button>
            </div>
          )}
        </div>

        {/* Right 1 Col: Artist Feedback / Review Comments */}
        <div className="border-t lg:border-t-0 lg:border-l border-[#e9e3d8] bg-white flex flex-col justify-between h-full">
          {/* Header */}
          <div className="p-4 border-b border-[#e9e3d8] flex items-center justify-between bg-[#fcfaf6]">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-stone-500" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Team Review & Notes ({currentRender?.feedback?.length || 0})
              </h3>
            </div>
          </div>

          {/* Feedback Stream */}
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {(!currentRender?.feedback || currentRender.feedback.length === 0) ? (
              <div className="text-center py-8 text-stone-400 text-xs">
                Review comment a la awm lo. A hnuaiah khian i ngaihdan ziak rawh le.
              </div>
            ) : (
              currentRender.feedback.map((fb) => (
                <div
                  key={fb.id}
                  className="p-3 rounded-xl border border-stone-100 bg-[#fcfaf6] hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <img
                        src={fb.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={fb.authorName || 'Artist'}
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-amber-300"
                      />
                      <span className="text-xs font-semibold text-stone-800">
                        {fb.authorName || 'Artist'}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400">{fb.createdAt}</span>
                  </div>

                  <p className="text-xs text-stone-700 leading-snug">
                    {fb.comment}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* New Feedback Note Input */}
          <form onSubmit={handlePostComment} className="p-4 border-t border-[#e9e3d8] bg-[#fcfaf6] space-y-2">
            <div className="flex items-center space-x-1.5 text-xs text-stone-500">
              <User className="w-3.5 h-3.5 text-amber-700" />
              <span>Comment as <strong>{currentUser.name}</strong></span>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Write feedback or note on this render..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-[#e9e3d8] bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white transition-colors cursor-pointer"
                title="Post Review Note"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add Render Modal */}
      {isNewRenderModalOpen && onAddRender && (
        <NewRenderModal
          isOpen={isNewRenderModalOpen}
          currentUser={currentUser}
          onClose={() => setIsNewRenderModalOpen(false)}
          onAddRender={onAddRender}
        />
      )}
    </div>
  );
};
