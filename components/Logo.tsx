import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", showText = true }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex items-center justify-center">
        <svg 
          width="32" 
          height="32" 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-indigo-600"
        >
          {/* Alça do cesto */}
          <path 
            d="M10 11V8C10 4.68629 12.6863 2 16 2C19.3137 2 22 4.68629 22 8V11" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Corpo do cesto */}
          <path 
            d="M5 11H27L25.619 26.1904C25.538 27.0817 24.7924 27.765 23.897 27.765H8.10298C7.20761 27.765 6.46197 27.0817 6.38096 26.1904L5 11Z" 
            fill="currentColor" 
            fillOpacity="0.1" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinejoin="round"
          />
          {/* Linhas de "Arquivos/Trama" */}
          <path 
            d="M10 17H22" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeOpacity="0.8"
          />
          <path 
            d="M12 22H20" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeOpacity="0.6"
          />
        </svg>
        
        {/* Adorno visual (partícula) */}
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-400 rounded-full border-2 border-white"></div>
      </div>
      
      {showText && (
        <div className="flex flex-col justify-center">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">
            Cestou
          </h1>
          <span className="text-[10px] font-semibold tracking-wider text-indigo-600 uppercase">
            Organizador de Arquivos
          </span>
        </div>
      )}
    </div>
  );
};