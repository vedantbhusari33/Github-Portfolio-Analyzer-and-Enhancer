
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <i className="fa-brands fa-github text-xl"></i>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800 hidden sm:block">
              Portfolio<span className="text-indigo-600">Analyzer</span>
            </span>
          </div>
          <nav className="flex space-x-4">
             <a href="https://github.com" target="_blank" className="text-slate-600 hover:text-indigo-600 transition-colors">
               <i className="fa-brands fa-github text-xl"></i>
             </a>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            &copy; 2026 Vedant Bhusari. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
