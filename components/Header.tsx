import React from 'react';
import { FolderOpen, Folder } from 'lucide-react';
import { Logo } from './Logo';
import { FileSystemDirectoryHandle } from '../types';

interface HeaderProps {
  rootHandle: FileSystemDirectoryHandle | null;
  isProcessing: boolean;
  onOpenDirectory: () => void;
}

export const Header: React.FC<HeaderProps> = ({ rootHandle, isProcessing, onOpenDirectory }) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm z-10 shrink-0">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        
        <div className="flex items-center gap-4">
          {rootHandle && (
            <div className="hidden md:flex items-center text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              <Folder className="w-4 h-4 mr-2 text-indigo-500" />
              <span className="truncate max-w-[200px] font-medium">{rootHandle.name}</span>
            </div>
          )}
          <button
            onClick={onOpenDirectory}
            disabled={isProcessing}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shadow-sm"
          >
            <FolderOpen className="w-4 h-4" />
            {rootHandle ? 'Trocar Pasta' : 'Abrir Pasta'}
          </button>
        </div>
      </div>
    </header>
  );
};