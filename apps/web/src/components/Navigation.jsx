import React from 'react';
import { Home, Database } from 'lucide-react';

function Navigation({ currentPage, onPageChange }) {
  const pages = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'management', name: 'OWL', icon: Database },
  ];

  const handlePageChange = (pageId) => {
    onPageChange(pageId);
  };

  return (
    <nav className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6">
      <div className="flex space-x-4">
        {pages.map((page) => {
          const Icon = page.icon;
          return (
            <button
              key={page.id}
              onClick={() => handlePageChange(page.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentPage === page.id
                  ? 'bg-[rgb(93,191,78)] text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span>{page.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default Navigation;