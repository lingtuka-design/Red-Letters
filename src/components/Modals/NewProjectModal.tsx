import React, { useState } from 'react';
import { 
  X, 
  Film 
} from 'lucide-react';
import type { Project } from '../../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: Omit<Project, 'id'>) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onAddProject
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [fps, setFps] = useState(24);
  const [aspectRatio, setAspectRatio] = useState('2.39:1 (Anamorphic)');
  const [resolution, setResolution] = useState('4K DCI (4096x1716)');
  const [status, setStatus] = useState<Project['status']>('Pre-Production');
  const [deadline, setDeadline] = useState('Dec 30, 2026');
  const [targetDurationSec, setTargetDurationSec] = useState(300);
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80');

  const sampleCovers = [
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    onAddProject({
      title: title.trim(),
      slug,
      synopsis: synopsis.trim() || 'No synopsis added yet.',
      fps: Number(fps),
      aspectRatio,
      resolution,
      status,
      deadline,
      targetDurationSec: Number(targetDurationSec),
      coverImage
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#e9e3d8] p-6 max-w-xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e9e3d8]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-stone-900 leading-tight">
                Create New Film Project
              </h3>
              <p className="text-xs text-stone-500">Initialize a production pipeline for an animated short</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Film Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Whispers of the Cloud Meadow"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e9e3d8] focus:outline-none focus:ring-1 focus:ring-amber-500 bg-[#fcfaf6]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Logline / Synopsis
            </label>
            <textarea
              rows={2}
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="A brief 1-2 sentence pitch of the animated film..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e9e3d8] focus:outline-none focus:ring-1 focus:ring-amber-500 bg-[#fcfaf6]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Frame Rate</label>
              <select
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e9e3d8] bg-[#fcfaf6]"
              >
                <option value={24}>24 FPS (Cinematic)</option>
                <option value={30}>30 FPS (Standard)</option>
                <option value={60}>60 FPS (High Motion)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e9e3d8] bg-[#fcfaf6]"
              >
                <option value="2.39:1 (Anamorphic)">2.39:1 (Anamorphic)</option>
                <option value="16:9 Cinema">16:9 Cinema</option>
                <option value="1.85:1 Flat">1.85:1 Flat</option>
                <option value="4:3 Academy">4:3 Academy</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e9e3d8] bg-[#fcfaf6]"
              >
                <option value="Pre-Production">Pre-Production</option>
                <option value="Production">Production</option>
                <option value="Post-Production">Post-Production</option>
                <option value="Final Polish">Final Polish</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Resolution Standard</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e9e3d8] bg-[#fcfaf6]"
              >
                <option value="4K DCI (4096x1716)">4K DCI (4096x1716)</option>
                <option value="4K UHD (3840x2160)">4K UHD (3840x2160)</option>
                <option value="1080p Cine (1920x804)">1080p Cine (1920x804)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Target Premiere Date</label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="e.g. Dec 30, 2026"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e9e3d8] bg-[#fcfaf6]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Target Duration (s)</label>
              <input
                type="number"
                value={targetDurationSec}
                onChange={(e) => setTargetDurationSec(Number(e.target.value))}
                placeholder="300"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e9e3d8] bg-[#fcfaf6] font-mono"
              />
            </div>
          </div>

          {/* Cover Image Presets */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1.5">
              Concept Poster Art
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {sampleCovers.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setCoverImage(img)}
                  className={`aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    coverImage === img ? 'border-amber-600 ring-2 ring-amber-200' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Or paste artwork URL..."
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e9e3d8] bg-[#fcfaf6] font-mono text-stone-600"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-[#e9e3d8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
