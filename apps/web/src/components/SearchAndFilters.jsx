import React from 'react';
import { Search, Filter } from 'lucide-react';

function SearchAndFilters({ 
  searchTerm, 
  onSearchChange, 
  activeTab,
  sortBy,
  onSortChange 
}) {
  const placeSortOptions = [
    { value: 'name', label: 'Nome' },
    { value: 'area', label: 'Área Total' }
  ];

  const deviceSortOptions = [
    { value: 'name', label: 'Nome' },
    { value: 'mac_address', label: 'MAC Address' }
  ];

  const sortOptions = activeTab === 'places' ? placeSortOptions : deviceSortOptions;

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4 mt-5">
      {/* Search */}
      <div className="relative flex-1 ">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder={`Buscar ${activeTab === 'places' ? 'places' : 'tags'}...`}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Sort */}
      <div className="flex items-center space-x-2">
        <Filter size={20} className="text-gray-400" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        >
          <option value="">Ordenar por...</option>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SearchAndFilters;