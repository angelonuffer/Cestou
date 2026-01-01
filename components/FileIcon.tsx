import React from 'react';
import { File, FileText, Image, Film, FileCode, HelpCircle } from 'lucide-react';
import { getFileExtension } from '../utils/fileUtils';

interface FileIconProps {
  filename: string;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ filename, className = "w-5 h-5" }) => {
  const ext = getFileExtension(filename);

  const iconProps = { className };

  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  const docExts = ['pdf', 'doc', 'docx', 'txt', 'md'];
  const sheetExts = ['xlsx', 'xls', 'csv'];
  const videoExts = ['mp4', 'mov', 'mkv', 'avi', 'webm'];
  const codeExts = ['js', 'ts', 'tsx', 'html', 'css', 'json', 'py'];

  if (imageExts.includes(ext)) return <Image {...iconProps} className={`${className} text-purple-500`} />;
  if (docExts.includes(ext)) return <FileText {...iconProps} className={`${className} text-blue-500`} />;
  if (sheetExts.includes(ext)) return <FileText {...iconProps} className={`${className} text-green-500`} />;
  if (videoExts.includes(ext)) return <Film {...iconProps} className={`${className} text-rose-500`} />;
  if (codeExts.includes(ext)) return <FileCode {...iconProps} className={`${className} text-yellow-600`} />;

  return <File {...iconProps} className={`${className} text-slate-400`} />;
};