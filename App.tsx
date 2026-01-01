import React, { useState } from 'react';
import { FolderOpen, Sparkles, Folder, ArrowRight, CheckCircle, RefreshCw, AlertCircle, ExternalLink, Download } from 'lucide-react';
import { FileSystemDirectoryHandle, FileSystemFileHandle, CategorizedFiles, Category } from './types';
import { categorizeFile, getCategoryColor } from './utils/fileUtils';
import { FileIcon } from './components/FileIcon';

const App: React.FC = () => {
  const [rootHandle, setRootHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [files, setFiles] = useState<FileSystemFileHandle[]>([]);
  const [categorizedFiles, setCategorizedFiles] = useState<CategorizedFiles>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isDone, setIsDone] = useState(false);
  const [accessError, setAccessError] = useState(false);

  // Check if running in a blob environment (AI Studio Preview often uses blobs)
  const isBlobUrl = typeof window !== 'undefined' && window.location.protocol === 'blob:';

  // 1. Open Directory
  const handleOpenDirectory = async () => {
    try {
      // Safer feature detection
      if (!('showDirectoryPicker' in window)) {
        alert("Seu navegador não suporta a File System Access API. Por favor, use o Chrome, Edge ou Opera em Desktop.");
        return;
      }
      
      const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
      setRootHandle(handle);
      await scanDirectory(handle);
      setIsDone(false);
      setProgress(0);
      setStatusMessage("");
      setAccessError(false);
    } catch (err: any) {
      // Handle user cancellation gracefully
      if (err.name === 'AbortError') {
        return;
      }

      // Handle iframe/security restrictions specifically
      // "Cross origin sub frames" is the specific error message for iframes
      if (err.name === 'SecurityError' || (err.message && err.message.includes('Cross origin sub frames'))) {
        setAccessError(true);
        setStatusMessage("Acesso bloqueado pelo navegador.");
        return;
      }
      
      console.error("Erro ao abrir pasta:", err);
      setStatusMessage("Erro ao tentar abrir a pasta.");
    }
  };

  // 2. Scan Files
  const scanDirectory = async (handle: FileSystemDirectoryHandle) => {
    const fileList: FileSystemFileHandle[] = [];
    const grouped: CategorizedFiles = {
      'Imagens': [],
      'Documentos': [],
      'Vídeos': [],
      'Outros': []
    };

    setIsProcessing(true);
    setStatusMessage("Lendo arquivos...");

    try {
      for await (const entry of handle.values()) {
        if (entry.kind === 'file') {
          // Explicitly cast to FileSystemFileHandle as the iterator type is a union
          const fileEntry = entry as FileSystemFileHandle;
          fileList.push(fileEntry);
          const category = categorizeFile(fileEntry.name);
          grouped[category].push(fileEntry);
        }
      }
      
      // Sort alphabetically
      fileList.sort((a, b) => a.name.localeCompare(b.name));
      
      setFiles(fileList);
      setCategorizedFiles(grouped);
      
    } catch (error) {
      console.error("Erro ao ler diretório:", error);
      setStatusMessage("Erro ao ler arquivos da pasta.");
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  };

  // 3. Execute Cleanup ("Cestou!")
  const handleCestou = async () => {
    if (!rootHandle) return;

    setIsProcessing(true);
    setIsDone(false);
    setProgress(0);
    
    const totalFiles = files.length;
    let processedCount = 0;

    try {
      const categories = Object.keys(categorizedFiles) as Category[];

      for (const category of categories) {
        const filesInCategory = categorizedFiles[category];
        if (filesInCategory.length === 0) continue;

        // Create or get subfolder
        setStatusMessage(`Criando pasta ${category}...`);
        const dirHandle = await rootHandle.getDirectoryHandle(category, { create: true });

        for (const fileHandle of filesInCategory) {
          setStatusMessage(`Movendo ${fileHandle.name}...`);
          
          try {
            // 1. Get content
            const fileData = await fileHandle.getFile();
            
            // 2. Create new file in subfolder
            const newFileHandle = await dirHandle.getFileHandle(fileHandle.name, { create: true });
            const writable = await newFileHandle.createWritable();
            
            // 3. Write content
            await writable.write(fileData);
            await writable.close();

            // 4. Remove original
            await rootHandle.removeEntry(fileHandle.name);

            processedCount++;
            setProgress((processedCount / totalFiles) * 100);

          } catch (err) {
            console.error(`Falha ao mover ${fileHandle.name}`, err);
          }
        }
      }
      
      setIsDone(true);
      setStatusMessage("Faxina concluída com sucesso! 🎉");
      
      // Rescan to show empty state
      await scanDirectory(rootHandle);

    } catch (error) {
      console.error("Erro crítico na execução:", error);
      setStatusMessage("Ocorreu um erro durante a organização.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* --- Header --- */}
      <header className="bg-white border-b border-slate-200 shadow-sm z-10 shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧺</span>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Cestou</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {rootHandle && (
              <div className="hidden md:flex items-center text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                <Folder className="w-4 h-4 mr-2" />
                <span className="truncate max-w-[200px]">{rootHandle.name}</span>
              </div>
            )}
            <button
              onClick={handleOpenDirectory}
              disabled={isProcessing}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shadow-sm"
            >
              <FolderOpen className="w-4 h-4" />
              {rootHandle ? 'Trocar Pasta' : 'Abrir Pasta'}
            </button>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        
        {/* Left Column: Current State */}
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

        {/* Right Column: Preview / Action */}
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
            ) : files.length === 0 && !isDone ? (
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
                onClick={handleCestou}
                disabled={!rootHandle || files.length === 0 || isProcessing}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-indigo-200
                  transition-all transform hover:-translate-y-0.5 active:translate-y-0
                  ${!rootHandle || files.length === 0 || isProcessing
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
      </main>
      
      {/* Access Error Modal */}
      {accessError && (
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
                  onClick={() => setAccessError(false)}
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
                  onClick={() => setAccessError(false)}
                  className="mt-4 text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile/Small Screen Warning */}
      <div className="md:hidden fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-40 flex items-center justify-center p-6 text-center text-white">
        <div>
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-rose-400" />
          <h2 className="text-xl font-bold mb-2">Desktop Necessário</h2>
          <p className="text-slate-300">A File System API requer um navegador desktop para gerenciar arquivos locais com segurança.</p>
        </div>
      </div>

    </div>
  );
};

export default App;