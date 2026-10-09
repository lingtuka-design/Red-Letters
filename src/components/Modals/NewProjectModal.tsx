import React, { useState, useRef } from 'react';
import { 
  X, 
  Film,
  Upload
} from 'lucide-react';
import type { Project, UserAccount } from '../../types';

interface NewProjectModalProps {
  isOpen: boolean;
  currentUser: UserAccount;
  onClose: () => void;
  onAddProject: (project: Omit<Project, 'id'>) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onAddProject
}) => {
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [fps, setFps] = useState(24);
  const [aspectRatio, setAspectRatio] = useState('2.39:1 (Anamorphic)');
  const [resolution, setResolution] = useState('4K DCI (4096x1716)');
  const [status, setStatus] = useState<Project['status']>('Pre-Production');
  const [deadline, setDeadline] = useState('Dec 30, 2026');
  const [targetDurationMin, setTargetDurationMin] = useState<number | string>(5);
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80');

  const sampleCovers = [
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCoverImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const durationMinutes = Number(targetDurationMin) > 0 ? Number(targetDurationMin) : 5;

    onAddProject({
      title: title.trim(),
      slug,
      synopsis: synopsis.trim() || 'No synopsis added yet.',
      fps: Number(fps),
      aspectRatio,
      resolution,
      status,
      deadline,
      targetDurationSec: Math.round(durationMinutes * 60),
      targetDurationMin: durationMinutes,
      coverImage,
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      approvals: {
        maltea: currentUser.id === 'maltea',
        valtea: currentUser.id === 'valtea',
        biaktea: currentUser.id === 'biaktea'
      }
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
          {/* Creator Tag */}
          <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <div className="text-xs">
              <span className="text-stone-500">Creating as: </span>
              <strong className="text-stone-900 font-semibold">{currentUser.name}</strong>
              <span className="text-amber-800 text-[11px] ml-1">({currentUser.role})</span>
            </div>
          </div>

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
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Target Duration (mins)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={targetDurationMin}
                  onChange={(e) => setTargetDurationMin(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="5"
                  className="w-full px-3 py-2 pr-12 text-xs rounded-xl border border-[#e9e3d8] bg-[#fcfaf6] font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <span className="absolute right-3 top-2 text-[11px] font-medium text-stone-400 pointer-events-none">
                  min
                </span>
              </div>
            </div>
          </div>

          {/* Concept Poster Art */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                Concept Poster Art
              </label>
              {uploadedFileName && (
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ Uploaded: {uploadedFileName}
                </span>
              )}
            </div>

            {/* Poster Preview and Upload Box */}
            <div className="flex flex-col sm:flex-row gap-3 p-3 rounded-2xl bg-[#fcfaf6] border border-[#e9e3d8] mb-2.5">
              <div className="w-full sm:w-44 aspect-video rounded-xl overflow-hidden bg-stone-900 border border-stone-200 shrink-0 relative group">
                <img 
                  src={coverImage} 
                  alt="Poster preview" 
                  className="w-full h-full object-cover" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity cursor-pointer"
                >
                  Change
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-3 rounded-xl border border-dashed border-amber-300 bg-white hover:bg-amber-50 text-amber-800 text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Poster Picture</span>
                  </button>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Device (phone/computer) atanga picture thlan theih
                  </p>
                </div>

                {/* Sample Presets */}
                <div>
                  <span className="text-[10px] text-stone-400 block mb-1">Emaw sample poster thlang rawh:</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {sampleCovers.map((img, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setCoverImage(img);
                          setUploadedFileName('');
                        }}
                        className={`aspect-video rounded-lg overflow-hidden border transition-all cursor-pointer ${
                          coverImage === img ? 'border-amber-600 ring-2 ring-amber-200' : 'border-stone-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Direct URL input fallback */}
            <input
              type="url"
              value={coverImage.startsWith('data:') ? '' : coverImage}
              onChange={(e) => {
                setCoverImage(e.target.value);
                setUploadedFileName('');
              }}
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
