import React from 'react';
import { useFileOrganizer } from './hooks/useFileOrganizer';
import { Header } from './components/Header';
import { FileList } from './components/FileList';
import { OrganizerPreview } from './components/OrganizerPreview';
import { FilePreview } from './components/FilePreview';
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
    executeOrganization,
    selectedFile,
    handleSelectFile
  } = useFileOrganizer();

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      <Header />

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        
        {/* Left Column: Current State */}
        <FileList 
          files={files} 
          isDone={isDone}
          rootHandle={rootHandle}
          isProcessing={isProcessing}
          onOpenDirectory={openDirectory}
          selectedFile={selectedFile}
          onSelectFile={handleSelectFile}
        />

        {/* Middle Column: Organization Action */}
        <OrganizerPreview 
          rootHandle={rootHandle}
          filesCount={files.length}
          categorizedFiles={categorizedFiles}
          isProcessing={isProcessing}
          progress={progress}
          isDone={isDone}
          statusMessage={statusMessage}
          onExecute={executeOrganization}
          selectedFile={selectedFile}
          onSelectFile={handleSelectFile}
        />

        {/* Right Column: File Preview */}
        <FilePreview 
          selectedFile={selectedFile} 
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