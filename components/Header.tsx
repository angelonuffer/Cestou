import React from 'react';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm z-10 shrink-0">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        {/* A área direita do header foi limpa para focar o nome da pasta na coluna de arquivos */}
      </div>
    </header>
  );
};