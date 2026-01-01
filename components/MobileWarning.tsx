import React from 'react';
import { AlertCircle } from 'lucide-react';

export const MobileWarning: React.FC = () => {
  return (
    <div className="md:hidden fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-40 flex items-center justify-center p-6 text-center text-white">
      <div>
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-rose-400" />
        <h2 className="text-xl font-bold mb-2">Desktop Necessário</h2>
        <p className="text-slate-300">A File System API requer um navegador desktop para gerenciar arquivos locais com segurança.</p>
      </div>
    </div>
  );
};