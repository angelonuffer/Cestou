import React from 'react';
import { Sparkles, Folder, FolderOpen, File as FileIconGeneric } from 'lucide-react';
import { FileSystemFileHandle, FileSystemDirectoryHandle } from '../types';
import { FileIcon } from './FileIcon';

interface FileListProps {
  files: FileSystemFileHandle[];
  folders?: string[]; // New prop for existing folders
  isDone: boolean;
  rootHandle: FileSystemDirectoryHandle | null;
  isProcessing: boolean;
  onOpenDirectory: () => void;
  selectedFile: FileSystemFileHandle | null;
  onSelectFile: (file: FileSystemFileHandle) => void;
}

export const FileList: React.FC<FileListProps> = ({ 
  files, 
  folders = [],
  isDone, 
  rootHandle, 
  isProcessing, 
  onOpenDirectory,
  selectedFile,
  onSelectFile
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
        <div className="flex gap-2">
           {folders.length > 0 && (
             <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md shrink-0 border border-amber-100">
               {folders.length} pastas
             </span>
           )}
           <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md shrink-0 border border-slate-200">
             {files.length} arqs
           </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {files.length === 0 && folders.length === 0 ? (
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
                <p>Nenhum arquivo encontrado.</p>
                <p className="text-sm opacity-70">Abra uma pasta para começar.</p>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Existing Folders Section */}
            {folders.length > 0 && (
              <div className="mb-2">
                <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subpastas Encontradas</p>
                {folders.map((folderName, idx) => (
                  <div 
                    key={`folder-${idx}`}
                    className="flex items-center gap-3 p-2 rounded-lg text-sm border border-transparent text-slate-500 opacity-75 hover:opacity-100 hover:bg-slate-50"
                  >
                    <Folder className="w-5 h-5 text-amber-400 fill-amber-100 shrink-0" />
                    <span className="truncate">{folderName}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Files Section */}
            {files.length > 0 && (
              <div>
                 {folders.length > 0 && <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">Arquivos Soltos</p>}
                 {files.map((file, idx) => {
                  const isSelected = selectedFile?.name === file.name;
                  return (
                    <div 
                      key={idx} 
                      onClick={() => onSelectFile(file)}
                      className={`
                        flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all text-sm border 
                        ${isSelected 
                          ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                          : 'border-transparent hover:bg-slate-50 hover:border-slate-100'
                        }
                      `}
                    >
                      <FileIcon filename={file.name} className={`w-5 h-5 shrink-0 ${isSelected ? 'text-indigo-600' : ''}`} />
                      <span className={`truncate ${isSelected ? 'text-indigo-900 font-medium' : 'text-slate-600'}`}>
                        {file.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
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