import React from 'react';
import { ArrowRight, CheckCircle, RefreshCw, Sparkles, Folder } from 'lucide-react';
import { FileSystemDirectoryHandle, CategorizedFiles, Category } from '../types';
import { getCategoryColor } from '../utils/fileUtils';

interface OrganizerPreviewProps {
  rootHandle: FileSystemDirectoryHandle | null;
  filesCount: number;
  categorizedFiles: CategorizedFiles;
  isProcessing: boolean;
  progress: number;
  isDone: boolean;
  statusMessage: string;
  onExecute: () => void;
}

export const OrganizerPreview: React.FC<OrganizerPreviewProps> = ({
  rootHandle,
  filesCount,
  categorizedFiles,
  isProcessing,
  progress,
  isDone,
  statusMessage,
  onExecute
}) => {
  return (
    <section className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full relative">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
          <h2 className="font-semibold text-slate-700">Sugestão de Organização</h2>
        </div>
        {isProcessing && <span className="text-xs text-indigo-600 animate-pulse font-medium">{Math.round(progress)}%</span>}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {!rootHandle ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center opacity-60">
            <ArrowRight className="w-12 h-12 mb-3" />
            <p>A prévia aparecerá aqui</p>
          </div>
        ) : filesCount === 0 && !isDone ? (
           <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
             <CheckCircle className="w-12 h-12 mb-3 text-green-500/50" />
             <p>Nada para organizar.</p>
           </div>
        ) : (
          Object.entries(categorizedFiles).map(([category, catFiles]) => (
            catFiles.length > 0 && (
              <div key={category} className="group">
                <div className="flex items-center gap-2 mb-2 sticky top-0 bg-white/95 backdrop-blur-sm py-1 z-10">
                  <Folder className={`w-5 h-5 fill-current ${getCategoryColor(category as Category).split(' ')[0]}`} />
                  <h3 className="font-semibold text-slate-800">{category}</h3>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full ml-auto">
                    {catFiles.length}
                  </span>
                </div>
                <div className={`rounded-lg border p-1 ${getCategoryColor(category as Category)} bg-opacity-30`}>
                  <div className="bg-white/80 rounded-md divide-y divide-slate-100">
                    {catFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 text-sm text-slate-600 px-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0"></div>
                         <span className="truncate opacity-80">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          ))
        )}

        {isDone && (
          <div className="flex flex-col items-center justify-center py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Faxina Completa!</h3>
            <p className="text-slate-500 text-center max-w-xs">
              Todos os arquivos foram movidos para suas respectivas pastas com sucesso.
            </p>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="p-4 border-t border-slate-100 bg-white shrink-0">
         {/* Progress Bar Overlay if Processing */}
        {isProcessing && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100">
            <div 
              className="h-full bg-indigo-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
             {statusMessage && (
               <p className="text-xs font-medium text-slate-500 animate-pulse flex items-center gap-1">
                 {isProcessing && <RefreshCw className="w-3 h-3 animate-spin" />}
                 {statusMessage}
               </p>
             )}
          </div>

          <button
            onClick={onExecute}
            disabled={!rootHandle || filesCount === 0 || isProcessing}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-indigo-200
              transition-all transform hover:-translate-y-0.5 active:translate-y-0
              ${!rootHandle || filesCount === 0 || isProcessing
                ? 'bg-slate-300 cursor-not-allowed shadow-none text-slate-500' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300'
              }
            `}
          >
            {isProcessing ? (
              <>Processando...</>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Cestou!
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};