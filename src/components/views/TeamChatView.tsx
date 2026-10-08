import React, { useState } from 'react';
import type { 
  ChatMessage, 
  TeamMember,
  UserAccount,
  Shot 
} from '../../types';
import { 
  Send, 
  Users,
  Film
} from 'lucide-react';

interface TeamChatViewProps {
  messages: ChatMessage[];
  team: TeamMember[];
  currentUser: UserAccount;
  shots: Shot[];
  onSendMessage: (authorId: string, message: string, shotRefId?: string) => void;
  onSelectShot: (shot: Shot) => void;
}

export const TeamChatView: React.FC<TeamChatViewProps> = ({
  messages,
  team,
  currentUser,
  shots,
  onSendMessage,
  onSelectShot
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedShotRef, setSelectedShotRef] = useState<string>('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(currentUser.id, inputText.trim(), selectedShotRef || undefined);
    setInputText('');
    setSelectedShotRef('');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#fcfaf6]">
      {/* Top Bar */}
      <div className="h-16 border-b border-[#e9e3d8] bg-white px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif text-base font-semibold text-stone-900">
              Indie Team Room (3 Artists)
            </h2>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            Encrypted Studio Channel
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs text-stone-500">
          <span>Posting as:</span>
          <strong className="text-stone-800">{currentUser.name} ({currentUser.role})</strong>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-5 max-w-4xl mx-auto w-full">
        {messages.map((msg) => {
          const author = team.find(m => m.id === msg.authorId);
          const referencedShot = msg.shotRefId ? shots.find(s => s.id === msg.shotRefId) : null;
          const isCurrentUser = msg.authorId === currentUser.id;

          return (
            <div 
              key={msg.id}
              className={`flex items-start space-x-3.5 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <img 
                src={author?.avatar} 
                alt={author?.name} 
                className="w-8 h-8 rounded-full object-cover ring-1 ring-stone-200 shrink-0" 
              />

              <div className={`max-w-xl ${isCurrentUser ? 'items-end text-right' : ''}`}>
                <div className={`flex items-center space-x-2 mb-1 ${isCurrentUser ? 'justify-end' : ''}`}>
                  <span className="text-xs font-semibold text-stone-900">{author?.name}</span>
                  <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50 font-medium">
                    {author?.role}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">{msg.createdAt}</span>
                </div>

                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isCurrentUser 
                    ? 'bg-amber-700 text-white shadow-xs rounded-tr-none' 
                    : 'bg-white border border-[#e9e3d8] text-stone-800 shadow-xs rounded-tl-none'
                }`}>
                  <p>{msg.message}</p>

                  {/* Shot Tag Reference */}
                  {referencedShot && (
                    <button
                      onClick={() => onSelectShot(referencedShot)}
                      className={`mt-2 inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all ${
                        isCurrentUser 
                          ? 'bg-amber-800 text-amber-100 hover:bg-amber-900' 
                          : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      <Film className="w-3 h-3" />
                      <span>Linked Shot: #{referencedShot.code} ({referencedShot.title})</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-[#e9e3d8] bg-white max-w-4xl mx-auto w-full">
        {selectedShotRef && (
          <div className="mb-2 flex items-center space-x-2 text-xs text-amber-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
            <span>Tagging Shot: <strong>{shots.find(s => s.id === selectedShotRef)?.code}</strong></span>
            <button 
              type="button" 
              onClick={() => setSelectedShotRef('')} 
              className="text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex items-center space-x-2">
          {/* Reference Shot Quick Dropdown */}
          <select
            value={selectedShotRef}
            onChange={(e) => setSelectedShotRef(e.target.value)}
            className="hidden sm:inline-block text-xs py-2 px-2 rounded-lg border border-[#e9e3d8] bg-[#fcfaf6] text-stone-600 focus:outline-none"
          >
            <option value=""># Link Shot...</option>
            {shots.map(s => (
              <option key={s.id} value={s.id}>{s.code} - {s.title}</option>
            ))}
          </select>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type note or production update for the team..."
            className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-[#e9e3d8] bg-[#fcfaf6] text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            required
          />

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </form>
    </div>
  );
};
