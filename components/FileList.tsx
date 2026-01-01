import React from 'react';
import { Sparkles, Folder, FolderOpen } from 'lucide-react';
import { FileSystemFileHandle, FileSystemDirectoryHandle } from '../types';
import { FileIcon } from './FileIcon';

interface FileListProps {
  files: FileSystemFileHandle[];
  isDone: boolean;
  rootHandle: FileSystemDirectoryHandle | null;
  isProcessing: boolean;
  onOpenDirectory: () => void;
}

export const FileList: React.FC<FileListProps> = ({ 
  files, 
  isDone, 
  rootHandle, 
  isProcessing, 
  onOpenDirectory 
}) => {
  return (
    <section className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 overflow-hidden mr-2">
          {rootHandle ? (
            <>
              <div className="bg-indigo-100 p-1.5 rounded-md shrink-0">
                <FolderOpen className="w-4 h-4 text-indigo-600" />
              </div>
              <h2 className="font-semibold text-slate-700 truncate" title={rootHandle.name}>
                {rootHandle.name}
              </h2>
            </>
          ) : (
            <>
              <div className="w-2 h-6 bg-slate-400 rounded-full shrink-0"></div>
              <h2 className="font-semibold text-slate-700">Arquivos</h2>
            </>
          )}
        </div>
        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md shrink-0">
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
                <p className="text-sm opacity-70">Abra uma pasta para começar.</p>
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

      {/* Footer Action */}
      <div className="p-4 border-t border-slate-100 bg-white shrink-0">
        <button
          onClick={onOpenDirectory}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shadow-sm"
        >
          <FolderOpen className="w-4 h-4" />
          {rootHandle ? 'Trocar Pasta Selecionada' : 'Abrir Pasta Local'}
        </button>
      </div>
    </section>
  );
};