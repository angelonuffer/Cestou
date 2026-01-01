import React from 'react';
import { Sparkles, Folder } from 'lucide-react';
import { FileSystemFileHandle } from '../types';
import { FileIcon } from './FileIcon';

interface FileListProps {
  files: FileSystemFileHandle[];
  isDone: boolean;
}

export const FileList: React.FC<FileListProps> = ({ files, isDone }) => {
  return (
    <section className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-slate-400 rounded-full"></div>
          <h2 className="font-semibold text-slate-700">Arquivos na Raiz</h2>
        </div>
        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
          {files.length} itens
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {files.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            {isDone ? (
              <>
                <Sparkles className="w-12 h-12 text-yellow-400 mb-3" />
                <p className="text-slate-600 font-medium">Tudo limpo por aqui!</p>
                <p className="text-sm">Seus arquivos foram organizados.</p>
              </>
            ) : (
              <>
                <Folder className="w-12 h-12 mb-3 opacity-50" />
                <p>Nenhum arquivo solto encontrado.</p>
                <p className="text-sm opacity-70">Abra uma pasta com arquivos para começar.</p>
              </>
            )}
          </div>
        ) : (
          files.map((file, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg group transition-colors text-sm border border-transparent hover:border-slate-100">
              <FileIcon filename={file.name} className="w-5 h-5 shrink-0" />
              <span className="truncate text-slate-600 group-hover:text-slate-900">{file.name}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
};