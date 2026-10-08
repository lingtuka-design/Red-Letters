import React, { useState } from 'react';
import { X, Video, Link2, Sparkles, AlertCircle } from 'lucide-react';
import type { RenderFile, UserAccount } from '../../types';

interface NewRenderModalProps {
  isOpen: boolean;
  currentUser: UserAccount;
  onClose: () => void;
  onAddRender: (render: Omit<RenderFile, 'id' | 'createdAt' | 'feedback'>) => void;
}

export const NewRenderModal: React.FC<NewRenderModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onAddRender
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const sampleDemoDriveLink = 'https://drive.google.com/file/d/1X8-SAMPLE-DRIVE-VIDEO-ID/view';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveUrl.trim()) {
      setErrorMessage('Khawngaihin Google Drive link (emaw video link) dah rawh.');
      return;
    }

    onAddRender({
      projectId: 'proj_aura_01',
      title: title.trim() || 'Animation Render Pass',
      videoUrl: driveUrl.trim(),
      driveUrl: driveUrl.trim(),
      description: description.trim(),
      notes: description.trim(),
      shotCode: `V${Date.now().toString().slice(-3)}`,
      version: 'v1.0',
      fileName: title.trim() || 'render_video.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      status: 'In Review',
      renderEngine: 'Drive Stream',
      durationSec: 120,
      resolution: '1080p HD',
      fps: 24,
      fileSizeMb: 45,
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      authorAvatar: currentUser.avatar
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#e9e3d8] p-5 sm:p-6 max-w-lg w-full shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#e9e3d8]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-semibold text-stone-900 leading-tight">
                Add Render Review Video
              </h3>
              <p className="text-xs text-stone-500">Google Drive upload link dah luhna & play-na</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Creator Pill */}
        <div className="flex items-center justify-between p-2.5 mb-4 rounded-xl bg-[#fcfaf6] border border-[#e9e3d8]">
          <div className="flex items-center space-x-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-400"
            />
            <div>
              <div className="text-xs font-semibold text-stone-800 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-amber-800 font-medium leading-tight">
                {currentUser.role}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
            Post-tu
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Google Drive Link Input */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              1. Google Drive Upload Link (emaw Video URL) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Link2 className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/.../view"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#e9e3d8] bg-[#fcfaf6] focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                required
              />
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px] text-stone-500 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Google Drive link 'Anyone with link can view' tih a ni tur a ni e.</span>
              </p>
              <button
                type="button"
                onClick={() => setDriveUrl(sampleDemoDriveLink)}
                className="text-[10px] text-stone-400 hover:text-stone-600 underline cursor-pointer"
              >
                Sample link
              </button>
            </div>
          </div>

          {/* Render Title */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              2. Render / Scene Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Scene 01 - Lighting & Composite Pass v2"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#e9e3d8] bg-[#fcfaf6] focus:outline-none focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              3. Description / Review Notes
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="He render-a thil thar, animation correction, director feedback duh lai etc. ziak rawh..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#e9e3d8] bg-[#fcfaf6] focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none leading-relaxed"
            />
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-[#e9e3d8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-5 py-2 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Post Render Video</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
