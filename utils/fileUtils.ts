import { Category } from '../types';

export const CATEGORIES: Record<string, string[]> = {
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
  const lower = category.toLowerCase();
  if (lower.includes('image') || lower.includes('foto') || lower.includes('pic')) return 'image';
  if (lower.includes('doc') || lower.includes('text') || lower.includes('pdf')) return 'file-text';
  if (lower.includes('vid') || lower.includes('mov') || lower.includes('film')) return 'film';
  if (lower.includes('cod') || lower.includes('script') || lower.includes('dev')) return 'code';
  if (lower.includes('music') || lower.includes('audio') || lower.includes('sound')) return 'music';
  return 'folder';
};

export const getCategoryColor = (category: Category): string => {
  const lower = category.toLowerCase();
  
  if (lower.includes('image') || lower.includes('foto') || lower.includes('pic')) 
    return 'text-purple-600 bg-purple-50 border-purple-100';
  
  if (lower.includes('doc') || lower.includes('text') || lower.includes('pdf')) 
    return 'text-blue-600 bg-blue-50 border-blue-100';
  
  if (lower.includes('vid') || lower.includes('mov') || lower.includes('film')) 
    return 'text-rose-600 bg-rose-50 border-rose-100';
    
  if (lower.includes('cod') || lower.includes('script') || lower.includes('dev'))
    return 'text-amber-600 bg-amber-50 border-amber-100';

  if (lower.includes('finan') || lower.includes('pag') || lower.includes('invoice'))
    return 'text-emerald-600 bg-emerald-50 border-emerald-100';

  // Dynamic fallback generation based on string length to give variety
  const colors = [
    'text-indigo-600 bg-indigo-50 border-indigo-100',
    'text-cyan-600 bg-cyan-50 border-cyan-100',
    'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100',
    'text-orange-600 bg-orange-50 border-orange-100',
  ];
  
  return colors[category.length % colors.length];
};