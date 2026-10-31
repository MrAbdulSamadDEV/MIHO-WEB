import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer({ onOpenDownload, onOpenDocs, onOpenPrivacy, onOpenTerms }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const devSocials = [
    {
      name: 'GitHub',
      url: 'https://github.com/MrAbdulSamadDEV',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    {
      name: 'Portfolio',
      url: 'https://samad.vexr.dev',
      icon: (
        <svg className="w-3.5 h-3.5 fill-none stroke-current shrink-0" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/MRABDULSAMADDEV',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@epicflixplus',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/ABDULSAMAD8492',
      icon: (
        <svg className="w-3 h-3 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/samad_boy.dev',
      icon: (
        <svg className="w-3.5 h-3.5 fill-none stroke-current shrink-0" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="footer bg-[#050505] border-t border-[#1c1c1c] py-20 lg:py-24">
      <div className="wrap">
        {/* Main 4-Column Balanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-14">
          
          {/* Column 1: Brand, Mission & Attribution */}
          <div className="lg:col-span-5 flex flex-col justify-between pr-0 lg:pr-8">
            <div>
              <a href="#home" className="brand block text-white text-3xl font-bold tracking-[0.12em] mb-4">
                MIHO
              </a>
              <p className="text-sm text-[#888] leading-relaxed max-w-sm mb-6">
                A voice-first AI companion designed to understand your world, work across your desktop, and help you create.
              </p>
              
              {/* Creator Credit */}
              <div className="text-xs font-mono text-[#777] mb-3">
                CREATED &amp; DEVELOPED BY{' '}
                <a
                  href="https://samad.vexr.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:underline font-medium"
                >
                  ABDUL SAMAD
                </a>
              </div>

              {/* Direct Contact */}
              <div className="text-xs font-mono text-[#777]">
                <span>GET IN TOUCH: </span>
                <a
                  href="mailto:mr.abdulsamadabdullah@gmail.com"
                  className="text-[#aaa] hover:text-white transition-colors"
                >
                  mr.abdulsamadabdullah@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-mono font-semibold text-white tracking-widest uppercase mb-5">
              PRODUCT
            </h4>
            <ul className="space-y-3.5 text-sm text-[#888]">
              <li>
                <a href="#product" className="hover:text-white transition-colors block">
                  Overview
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenDownload}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Download MIHO
                </button>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors block">
                  The Idea
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-white transition-colors block">
                  Capabilities
                </a>
              </li>
              <li>
                <span className="text-[#555] block">
                  Free &amp; Open Source
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-mono font-semibold text-white tracking-widest uppercase mb-5">
              RESOURCES
            </h4>
            <ul className="space-y-3.5 text-sm text-[#888]">
              <li>
                <button
                  onClick={onOpenDocs}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Documentation
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Terms &amp; Security
                </button>
              </li>
              <li>
                <a
                  href="https://github.com/MrAbdulSamadDEV/WINDOWS-AI-VOICE-AGENT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors block"
                >
                  GitHub Repository ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect With The Developer */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-mono font-semibold text-white tracking-widest uppercase mb-5">
              CONNECT WITH THE DEVELOPER
            </h4>
            <ul className="space-y-3 text-sm text-[#888]">
              {devSocials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-[#888] hover:text-white transition-colors group"
                  >
                    <span className="text-[#666] group-hover:text-white transition-colors">
                      {social.icon}
                    </span>
                    <span>{social.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Clean Balanced Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#1c1c1c] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666]">
          <div>
            © 2026 MIHO. All rights reserved. One intelligence. Endless possibilities.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[#888] hover:text-white transition-colors cursor-pointer"
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
