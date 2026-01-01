import React from 'react';
import { Folder } from 'lucide-react';
import { Logo } from './Logo';
import { FileSystemDirectoryHandle } from '../types';

interface HeaderProps {
  rootHandle: FileSystemDirectoryHandle | null;
  isProcessing: boolean;
}

export const Header: React.FC<HeaderProps> = ({ rootHandle, isProcessing }) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm z-10 shrink-0">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        
        <div className="flex items-center gap-4">
          {rootHandle && (
            <div className="flex items-center text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              <Folder className="w-4 h-4 mr-2 text-indigo-500" />
              <span className="truncate max-w-[150px] md:max-w-[300px] font-medium">{rootHandle.name}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};