import { Category, FileSystemFileHandle } from '../types';

export const CATEGORIES: Record<Category, string[]> = {
  'Imagens': ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'],
  'Documentos': ['pdf', 'doc', 'docx', 'txt', 'xlsx', 'xls', 'ppt', 'pptx', 'csv', 'md'],
  'Vídeos': ['mp4', 'mov', 'mkv', 'avi', 'webm', 'm4v'],
  'Outros': [] // Catch-all
};

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
};

export const categorizeFile = (filename: string): Category => {
  const ext = getFileExtension(filename);
  
  if (CATEGORIES['Imagens'].includes(ext)) return 'Imagens';
  if (CATEGORIES['Documentos'].includes(ext)) return 'Documentos';
  if (CATEGORIES['Vídeos'].includes(ext)) return 'Vídeos';
  
  return 'Outros';
};

export const getCategoryIconName = (category: Category): string => {
  switch (category) {
    case 'Imagens': return 'image';
    case 'Documentos': return 'file-text';
    case 'Vídeos': return 'film';
    default: return 'folder';
  }
};

export const getCategoryColor = (category: Category): string => {
  switch (category) {
    case 'Imagens': return 'text-purple-600 bg-purple-50 border-purple-100';
    case 'Documentos': return 'text-blue-600 bg-blue-50 border-blue-100';
    case 'Vídeos': return 'text-rose-600 bg-rose-50 border-rose-100';
    default: return 'text-slate-600 bg-slate-50 border-slate-100';
  }
};