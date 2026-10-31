import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Introduction from './components/Introduction.jsx';
import DesktopIntelligence from './components/DesktopIntelligence.jsx';
import VoiceIntelligence from './components/VoiceIntelligence.jsx';
import VibeCodingStudio from './components/VibeCodingStudio.jsx';
import AdaptiveInterface from './components/AdaptiveInterface.jsx';
import ConnectedCapabilities from './components/ConnectedCapabilities.jsx';
import PrivacyAndControl from './components/PrivacyAndControl.jsx';
import ProductShowcase from './components/ProductShowcase.jsx';
import FinalCTA from './components/FinalCTA.jsx';
import Footer from './components/Footer.jsx';
import DownloadModal from './components/DownloadModal.jsx';
import DocModal from './components/DocModal.jsx';
import EmergencyStopModal from './components/EmergencyStopModal.jsx';

// Code-split RemotePortal so desktop users don't download remote bundle
const RemotePortal = React.lazy(() => import('./components/remote/RemotePortal.jsx'));

export default function App() {
  const [downloadModalOpen, setDownloadModalOpen] = useState(() => {
    return window.location.hash.includes('download') || window.location.search.includes('download');
  });
  const [docsModalOpen, setDocsModalOpen] = useState(() => {
    return window.location.hash.includes('docs') || window.location.search.includes('docs');
  });
  const [emergencyStopModalOpen, setEmergencyStopModalOpen] = useState(false);
  const [remotePortalOpen, setRemotePortalOpen] = useState(() => {
    return window.location.hash.includes('remote') || window.location.search.includes('token');
  });

  // Listen to hash changes for #remote, #docs, #download
  React.useEffect(() => {
    const handleHash = () => {
      if (window.location.hash.includes('remote') || window.location.search.includes('token')) {
        setRemotePortalOpen(true);
      }
      if (window.location.hash.includes('docs') || window.location.search.includes('docs')) {
        setDocsModalOpen(true);
      }
      if (window.location.hash.includes('download') || window.location.search.includes('download')) {
        setDownloadModalOpen(true);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const openDownload = () => setDownloadModalOpen(true);
  const closeDownload = () => {
    setDownloadModalOpen(false);
    if (window.location.hash.includes('download')) {
      history.pushState(null, '', window.location.pathname);
    }
  };

  const openDocs = () => setDocsModalOpen(true);
  const closeDocs = () => setDocsModalOpen(false);

  const openEmergencyStop = () => setEmergencyStopModalOpen(true);
  const closeEmergencyStop = () => setEmergencyStopModalOpen(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-neutral-800 selection:text-white">
      {/* 0. Top Navigation */}
      <Navbar
        onOpenDownload={openDownload}
        onOpenDocs={openDocs}
        onOpenRemote={() => setRemotePortalOpen(true)}
      />

      {/* Main Landing Page Sections in Exact Required Order */}
      <main>
        {/* 1. Hero */}
        <Hero
          onExplore={() => {
            const el = document.getElementById('product');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onDiscover={() => {
            const el = document.getElementById('capabilities');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 2. Introduction */}
        <Introduction />

        {/* 3. Desktop Intelligence */}
        <DesktopIntelligence
          onExploreCapabilities={() => {
            const el = document.getElementById('capabilities');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 4. Voice Intelligence */}
        <VoiceIntelligence />

        {/* 5. Vibe Coding Studio */}
        <VibeCodingStudio />

        {/* 6. Adaptive Interface */}
        <AdaptiveInterface />

        {/* 7. Connected Capabilities */}
        <ConnectedCapabilities />

        {/* 8. Privacy and Control */}
        <PrivacyAndControl
          onTriggerEmergencyStop={openEmergencyStop}
        />

        {/* 9. Product Showcase */}
        <ProductShowcase
          onExploreExperience={openDownload}
        />

        {/* 10. Final CTA */}
        <FinalCTA
          onEnterWorld={openDownload}
          onExploreProduct={() => {
            const el = document.getElementById('product');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </main>

      {/* 11. Footer */}
      <Footer
        onOpenDownload={openDownload}
        onOpenDocs={openDocs}
        onOpenPrivacy={openDocs}
        onOpenTerms={openDocs}
      />

      {/* Interactive Modals */}
      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={closeDownload}
      />

      <DocModal
        isOpen={docsModalOpen}
        onClose={() => {
          closeDocs();
          if (window.location.hash.includes('docs')) {
            history.pushState(null, '', window.location.pathname);
          }
        }}
      />

      <EmergencyStopModal
        isOpen={emergencyStopModalOpen}
        onClose={closeEmergencyStop}
      />

      {/* Mobile-Only Remote Connection Portal */}
      {remotePortalOpen && (
        <React.Suspense fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white font-mono text-xs">
            Loading MIHO Remote…
          </div>
        }>
          <RemotePortal
            onClose={() => {
              setRemotePortalOpen(false);
              if (window.location.hash.includes('remote')) {
                history.pushState(null, '', window.location.pathname);
              }
            }}
          />
        </React.Suspense>
      )}
    </div>
  );
}
