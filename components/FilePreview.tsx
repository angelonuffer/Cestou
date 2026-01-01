import React, { useEffect, useState } from 'react';
import { Eye, File as FileGeneric, Info } from 'lucide-react';
import { FileSystemFileHandle } from '../types';
import { getFileExtension, categorizeFile } from '../utils/fileUtils';
import { FileIcon } from './FileIcon';

interface FilePreviewProps {
  selectedFile: FileSystemFileHandle | null;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ selectedFile }) => {
  const [contentUrl, setContentUrl] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [fileData, setFileData] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let isActive = true;

    const loadContent = async () => {
      if (!selectedFile) {
        setFileData(null);
        setContentUrl(null);
        setTextContent(null);
        return;
      }

      setLoading(true);
      try {
        const file = await selectedFile.getFile();
        if (!isActive) return;

        setFileData(file);
        
        const category = categorizeFile(file.name);
        const ext = getFileExtension(file.name);

        // Reset previous states
        setContentUrl(null);
        setTextContent(null);

        if (category === 'Imagens' || category === 'Vídeos') {
          objectUrl = URL.createObjectURL(file);
          setContentUrl(objectUrl);
        } else if (['txt', 'md', 'json', 'css', 'js', 'html', 'csv', 'svg'].includes(ext)) {
          const text = await file.slice(0, 2048).text(); // Read only first 2KB
          if (!isActive) return;
          setTextContent(text);
        }
      } catch (err) {
        console.error("Error reading file for preview", err);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadContent();

    return () => {
      isActive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const renderPreview = () => {
    if (!selectedFile || !fileData) return null;

    const category = categorizeFile(selectedFile.name);

    if (loading) {
      return (
        <div className="flex-1 flex items-center justify-center text-slate-400">
           <div className="animate-pulse flex flex-col items-center">
             <div className="w-12 h-12 bg-slate-200 rounded-full mb-3"></div>
             <div className="h-4 w-24 bg-slate-200 rounded"></div>
           </div>
        </div>
      );
    }

    if (category === 'Imagens' && contentUrl) {
      return (
        <div className="flex-1 flex items-center justify-center p-4 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
          <img src={contentUrl} alt={selectedFile.name} className="max-w-full max-h-[300px] object-contain shadow-sm rounded" />
        </div>
      );
    }

    if (category === 'Vídeos' && contentUrl) {
      return (
        <div className="flex-1 flex items-center justify-center p-4 bg-slate-900 rounded-lg overflow-hidden">
          <video controls src={contentUrl} className="max-w-full max-h-[300px] rounded" />
        </div>
      );
    }

    if (textContent !== null) {
      return (
        <div className="flex-1 overflow-auto bg-slate-800 text-slate-200 p-4 rounded-lg font-mono text-xs border border-slate-700 shadow-inner">
          <pre className="whitespace-pre-wrap break-all">
            {textContent}
            {fileData.size > 2048 && <span className="text-slate-500 block mt-2 italic">... (conteúdo truncado)</span>}
          </pre>
        </div>
      );
    }

    // Fallback Generic Preview
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-lg border border-slate-200 p-8">
        <FileIcon filename={selectedFile.name} className="w-20 h-20 mb-4 opacity-75" />
        <p className="text-slate-500 text-sm">Visualização indisponível para este formato</p>
      </div>
    );
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <section className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 shrink-0">
        <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
        <h2 className="font-semibold text-slate-700">Visualizar</h2>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
        {!selectedFile ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center opacity-60">
            <Eye className="w-12 h-12 mb-3" />
            <p>Selecione um arquivo para ver os detalhes</p>
          </div>
        ) : (
          <>
            {/* Header Card */}
            <div className="flex items-start gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                <FileIcon filename={selectedFile.name} className="w-8 h-8" />
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-slate-800 truncate leading-tight mb-1" title={selectedFile.name}>
                  {selectedFile.name}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                  {categorizeFile(selectedFile.name)}
                </span>
              </div>
            </div>

            {/* Preview Area */}
            {renderPreview()}

            {/* Metadata Footer */}
            {fileData && (
              <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 border border-slate-100 space-y-2 shrink-0">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-400">Tamanho</span>
                  <span className="font-medium">{formatSize(fileData.size)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-400">Tipo</span>
                  <span className="font-medium truncate max-w-[150px]">{fileData.type || 'Desconhecido'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Modificado</span>
                  <span className="font-medium">{new Date(fileData.lastModified).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};