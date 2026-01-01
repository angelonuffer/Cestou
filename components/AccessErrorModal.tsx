import React from 'react';
import { AlertCircle, ExternalLink, Download } from 'lucide-react';

interface AccessErrorModalProps {
  isOpen: boolean;
  isBlobUrl: boolean;
  onClose: () => void;
}

export const AccessErrorModal: React.FC<AccessErrorModalProps> = ({ isOpen, isBlobUrl, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        
        {isBlobUrl ? (
          <>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Ambiente de Teste Limitado</h3>
            <p className="text-slate-600 mb-6 leading-relaxed text-sm">
              Você está visualizando este app através de um link temporário (Blob URL). A <strong>File System Access API</strong> exige uma conexão direta (localhost ou HTTPS) e não funciona neste modo de preview.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-slate-700 text-left">
              <p className="font-semibold mb-1 text-amber-900 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Como testar?
              </p>
              <p>Para usar o Cestou, você precisa baixar o código e rodá-lo em seu computador (ex: usando VS Code com Live Server).</p>
            </div>
            <button 
              onClick={onClose}
              className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition-all"
            >
              Entendi
            </button>
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Acesso Restrito</h3>
            <p className="text-slate-600 mb-6 leading-relaxed text-sm">
              O navegador bloqueou o acesso aos arquivos porque este aplicativo está rodando em um quadro pré-visualização (iframe).
            </p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 text-sm text-slate-700 text-left">
              <p className="font-semibold mb-1 text-slate-900">Como resolver:</p>
              <p>Abra este site em uma <strong>nova aba</strong> para permitir que o Cestou acesse seus arquivos locais.</p>
            </div>

            <a 
              href={window.location.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-5 h-5" />
              Abrir em Nova Aba
            </a>
            <button 
              onClick={onClose}
              className="mt-4 text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
};