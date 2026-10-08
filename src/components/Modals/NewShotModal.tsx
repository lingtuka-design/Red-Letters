import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Upload, Sparkles } from 'lucide-react';
import type { Shot, UserAccount } from '../../types';

interface NewShotModalProps {
  isOpen: boolean;
  currentUser: UserAccount;
  onClose: () => void;
  onAddShot: (shot: Omit<Shot, 'id' | 'updatedAt'>) => void;
  lastShotNumber: number;
}

export const NewShotModal: React.FC<NewShotModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onAddShot,
  lastShotNumber
}) => {
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const nextCode = `SH_${(lastShotNumber + 1).toString().padStart(2, '0')}`;
  
  const [sceneName, setSceneName] = useState('Scene 01');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [previewImage, setPreviewImage] = useState<string>('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80');

  const samplePictures = [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80'
  ];

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPreviewImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !sceneName.trim()) return;

    onAddShot({
      projectId: 'proj_aura_01',
      code: nextCode,
      title: title.trim() || `${sceneName.trim()} - Shot`,
      sceneName: sceneName.trim(),
      description: description.trim(),
      notes: description.trim(),
      stage: 'Keyframe',
      thumbnailUrl: previewImage,
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      authorAvatar: currentUser.avatar,
      durationSec: 4.0,
      startFrame: 1,
      endFrame: 96,
      revisionCount: 0
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
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-semibold text-stone-900 leading-tight">
                Upload Animation Shot Picture
              </h3>
              <p className="text-xs text-stone-500">Shot thar picture, scene leh description dah luhna</p>
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

        {/* Creator Info Pill */}
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
          {/* Picture Upload Area */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1.5">
              1. Picture Upload Rawh *
            </label>

            {/* Preview Box */}
            <div className="relative rounded-xl overflow-hidden aspect-video bg-stone-900 border border-[#e9e3d8] mb-2 flex items-center justify-center group">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Shot Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4 text-stone-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span className="text-xs">Picture upload la a lang nghal ang</span>
                </div>
              )}

              {/* Upload Overlay Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 hover:bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity cursor-pointer p-2"
              >
                <Upload className="w-6 h-6 mb-1 text-amber-400" />
                <span className="text-xs font-semibold">Computer / Phone atangin thlang rawh</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/*"
              className="hidden"
            />

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-medium cursor-pointer transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Device atanga picture thlan</span>
              </button>

              <div className="flex items-center space-x-1">
                <span className="text-[10px] text-stone-400 mr-1">Presets:</span>
                {samplePictures.map((pic, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPreviewImage(pic)}
                    className="w-6 h-6 rounded-md overflow-hidden border border-stone-200 hover:border-amber-500 cursor-pointer"
                  >
                    <img src={pic} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scene & Shot Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                2. Scene *
              </label>
              <input
                type="text"
                value={sceneName}
                onChange={(e) => setSceneName(e.target.value)}
                placeholder="e.g. Scene 01, Scene 02"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e9e3d8] bg-[#fcfaf6] focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Shot Title / Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Kaelia Close Up"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e9e3d8] bg-[#fcfaf6] focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              3. Description / Action Notes
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="He animation shot-a thil thleng leh animation chet dan tlangpui ziak rawh..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#e9e3d8] bg-[#fcfaf6] focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none leading-relaxed"
            />
          </div>

          {/* Form Actions */}
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
              <span>Post Shot Picture</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
