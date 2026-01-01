import { useState } from 'react';
import { FileSystemDirectoryHandle, FileSystemFileHandle, CategorizedFiles, Category } from '../types';
import { categorizeFile } from '../utils/fileUtils';

export const useFileOrganizer = () => {
  const [rootHandle, setRootHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [files, setFiles] = useState<FileSystemFileHandle[]>([]);
  const [categorizedFiles, setCategorizedFiles] = useState<CategorizedFiles>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isDone, setIsDone] = useState(false);
  const [accessError, setAccessError] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileSystemFileHandle | null>(null);

  // Check if running in a blob environment
  const isBlobUrl = typeof window !== 'undefined' && window.location.protocol === 'blob:';

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
    setSelectedFile(null); // Reset selection on new scan

    try {
      for await (const entry of handle.values()) {
        if (entry.kind === 'file') {
          const fileEntry = entry as FileSystemFileHandle;
          fileList.push(fileEntry);
          const category = categorizeFile(fileEntry.name);
          grouped[category].push(fileEntry);
        }
      }
      
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

  const openDirectory = async () => {
    try {
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
      if (err.name === 'AbortError') return;

      if (err.name === 'SecurityError' || (err.message && err.message.includes('Cross origin sub frames'))) {
        setAccessError(true);
        setStatusMessage("Acesso bloqueado pelo navegador.");
        return;
      }
      
      console.error("Erro ao abrir pasta:", err);
      setStatusMessage("Erro ao tentar abrir a pasta.");
    }
  };

  const executeOrganization = async () => {
    if (!rootHandle) return;

    setIsProcessing(true);
    setIsDone(false);
    setProgress(0);
    setSelectedFile(null);
    
    const totalFiles = files.length;
    let processedCount = 0;

    try {
      const categories = Object.keys(categorizedFiles) as Category[];

      for (const category of categories) {
        const filesInCategory = categorizedFiles[category];
        if (filesInCategory.length === 0) continue;

        setStatusMessage(`Criando pasta ${category}...`);
        const dirHandle = await rootHandle.getDirectoryHandle(category, { create: true });

        for (const fileHandle of filesInCategory) {
          setStatusMessage(`Movendo ${fileHandle.name}...`);
          
          try {
            const fileData = await fileHandle.getFile();
            const newFileHandle = await dirHandle.getFileHandle(fileHandle.name, { create: true });
            const writable = await newFileHandle.createWritable();
            
            await writable.write(fileData);
            await writable.close();
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
      await scanDirectory(rootHandle);

    } catch (error) {
      console.error("Erro crítico na execução:", error);
      setStatusMessage("Ocorreu um erro durante a organização.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectFile = (file: FileSystemFileHandle) => {
    setSelectedFile(file);
  };

  return {
    rootHandle,
    files,
    categorizedFiles,
    isProcessing,
    progress,
    statusMessage,
    isDone,
    accessError,
    setAccessError,
    isBlobUrl,
    openDirectory,
    executeOrganization,
    selectedFile,
    handleSelectFile
  };
};