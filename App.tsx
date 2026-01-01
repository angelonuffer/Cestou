import React from 'react';
import { useFileOrganizer } from './hooks/useFileOrganizer';
import { Header } from './components/Header';
import { FileList } from './components/FileList';
import { OrganizerPreview } from './components/OrganizerPreview';
import { AccessErrorModal } from './components/AccessErrorModal';
import { MobileWarning } from './components/MobileWarning';

const App: React.FC = () => {
  const {
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
    executeOrganization
  } = useFileOrganizer();

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      <Header 
        rootHandle={rootHandle} 
        isProcessing={isProcessing} 
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        
        {/* Left Column: Current State & Open Action */}
        <FileList 
          files={files} 
          isDone={isDone}
          rootHandle={rootHandle}
          isProcessing={isProcessing}
          onOpenDirectory={openDirectory}
        />

        {/* Right Column: Preview / Action */}
        <OrganizerPreview 
          rootHandle={rootHandle}
          filesCount={files.length}
          categorizedFiles={categorizedFiles}
          isProcessing={isProcessing}
          progress={progress}
          isDone={isDone}
          statusMessage={statusMessage}
          onExecute={executeOrganization}
        />

      </main>
      
      <AccessErrorModal 
        isOpen={accessError} 
        isBlobUrl={isBlobUrl} 
        onClose={() => setAccessError(false)} 
      />

      <MobileWarning />

    </div>
  );
};

export default App;