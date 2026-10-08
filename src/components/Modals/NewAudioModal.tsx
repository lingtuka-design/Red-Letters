import React, { useState, useRef } from 'react';
import { X, Mic2, Upload, Music, Sparkles } from 'lucide-react';
import type { AudioTake, UserAccount } from '../../types';

interface NewAudioModalProps {
  isOpen: boolean;
  currentUser: UserAccount;
  onClose: () => void;
  onAddAudioTake: (take: Omit<AudioTake, 'id' | 'createdAt'>) => void;
}

export const NewAudioModal: React.FC<NewAudioModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onAddAudioTake
}) => {
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [audioDuration] = useState<number>(3.5);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAudioUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const sampleDemoAudio = 'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3';

  const handleUseDemo = () => {
    setAudioUrl(sampleDemoAudio);
    setFileName('sample_voice_take.mp3');
    if (!title) setTitle('Demo Voice Monologue');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioUrl) {
      setErrorMessage('Khawngaihin MP3 file upload rawh (emaw Demo audio thlang rawh)');
      return;
    }

    onAddAudioTake({
      projectId: 'proj_aura_01',
      title: title.trim() || fileName || 'Voiceover Take',
      characterName: title.trim() || 'Dialogue Track',
      description: description.trim(),
      notes: description.trim(),
      audioUrl: audioUrl,
      audioDataUrl: audioUrl,
      durationSec: audioDuration,
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      authorAvatar: currentUser.avatar,
      rating: 5,
      isSelected: false
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
              <Mic2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-semibold text-stone-900 leading-tight">
                Upload MP3 Voice / Audio Take
              </h3>
              <p className="text-xs text-stone-500">Voiceover emaw sound effect dah luhna</p>
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

        {/* Creator Tag */}
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
          {/* File Upload Box */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1.5">
              1. MP3 / Audio File Upload Rawh *
            </label>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                audioUrl 
                  ? 'border-amber-500 bg-amber-50/40' 
                  : 'border-[#e9e3d8] hover:border-amber-400 bg-[#fcfaf6]'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAudioFileChange}
                accept="audio/*,.mp3,.wav,.ogg,.m4a"
                className="hidden"
              />

              {audioUrl ? (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
                    <Music className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-stone-800 truncate">
                    {fileName || 'MP3 File Loaded'}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-medium">✓ Audio file thlan fel a ni e</p>
                  
                  {/* Immediate Preview Audio Player */}
                  <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                    <audio controls src={audioUrl} className="w-full h-8" />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-2">
                  <Upload className="w-8 h-8 mx-auto text-amber-600" />
                  <p className="text-xs font-medium text-stone-700">
                    Click la, MP3 / audio file thlang rawh
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Support: .mp3, .wav, .m4a, .ogg
                  </p>
                </div>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-medium text-amber-700 hover:text-amber-800 underline cursor-pointer"
              >
                Device atanga thlan
              </button>

              <button
                type="button"
                onClick={handleUseDemo}
                className="text-[11px] font-medium text-stone-500 hover:text-stone-700 bg-stone-100 px-2 py-0.5 rounded cursor-pointer"
              >
                Hman tur demo audio
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              2. Audio / Track Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Scene 01 - Kaelia Line 1"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#e9e3d8] bg-[#fcfaf6] focus:outline-none focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              3. Description / Notes
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Audio chungchang, voice acting emotion, sound notes etc. ziak rawh..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#e9e3d8] bg-[#fcfaf6] focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none leading-relaxed"
            />
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Action Buttons */}
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
              <span>Post Audio Take</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
