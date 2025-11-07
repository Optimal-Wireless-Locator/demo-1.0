import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Save, X, RefreshCw, Eye, Maximize2, ArrowLeft, Clock } from 'lucide-react';
import { useApiData } from '../hooks/useApiData';
import { useTagLocations } from '../hooks/useTagLocations';
import StatsCards from './StatsCards';
import SearchAndFilters from './SearchAndFilters';
import PlaceVisualization from './PlaceVisualization';
import PlacesGallery from './PlacesGallery';
import ConfirmDialog from './ConfirmDialog';
import TagHistoryViewer from './TagHistoryViewer';

import logo from '../assets/images/logo.svg';
import logotipo from '../assets/images/logo.svg';

function ManagementPage({ onBackToHome }) {
  const [activeTab, setActiveTab] = useState('places');
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [viewingPlace, setViewingPlace] = useState(null);
  const [fullscreenPlace, setFullscreenPlace] = useState(null);
  const [viewingTagHistory, setViewingTagHistory] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'danger'
  });
  
  const {
    places,
    devices,
    loading,
    error,
    fetchPlaces,
    fetchDevices,
    updatePlace,
    updateDevice,
    deletePlace,
    deleteDevice
  } = useApiData();

  // Hook para localizações das tags
  const { 
    locations: tagLocations
  } = useTagLocations(places, devices, 5000);

  const handleEdit = (item, type) => {
    setEditingItem({ ...item, type });
    setEditForm({ ...item });
  };

  const handleSaveEdit = async () => {
    try {
      const { type } = editingItem;
      
      if (type === 'place') {
        await updatePlace(editingItem.name, editForm);
      } else {
        await updateDevice(editingItem.mac_address, editForm);
      }
      
      setEditingItem(null);
      setEditForm({});
    } catch (error) {
      console.error('Erro ao salvar:', error);
      // Aqui podemos adicionar um toast de erro no futuro
    }
  };

  const handleDelete = (item, type) => {
    const itemName = item.name || item.mac_address;
    const itemType = type === 'place' ? 'place' : 'tag';
    
    setConfirmDialog({
      isOpen: true,
      title: `Excluir ${itemType}`,
      message: `Tem certeza que deseja excluir "${itemName}"? Esta ação não pode ser desfeita.`,
      onConfirm: async () => {
        try {
          if (type === 'place') {
            await deletePlace(item.name);
          } else {
            await deleteDevice(item.mac_address);
          }
        } catch (error) {
          console.error('Erro ao excluir:', error);
          // Aqui podemos adicionar um toast de erro no futuro
        }
      },
      type: 'danger'
    });
  };

  const handleRefresh = () => {
    if (activeTab === 'places') {
      fetchPlaces();
    } else {
      fetchDevices();
    }
  };



  // Filtrar e ordenar dados - apenas nome e área
  const filteredPlaces = useMemo(() => {
    let filtered = places.filter(place =>
      place.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy) {
      filtered.sort((a, b) => {
        if (sortBy === 'area') {
          return (b.width * b.height) - (a.width * a.height);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
    }

    return filtered;
  }, [places, searchTerm, sortBy]);

  const filteredDevices = useMemo(() => {
    let filtered = devices.filter(device =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.mac_address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [devices, searchTerm, sortBy]);

  const PlacesTable = () => (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/10 backdrop-blur-md">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Nome</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Largura</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Altura</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">RSSI (1m)</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Fator Prop.</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlaces.map((place) => (
              <tr key={place.id} className="border-t border-gray-800 text-white">
                <td className="px-4 py-3">
                  {editingItem?.id === place.id ? (
                    <input
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded px-2 py-1"
                    />
                  ) : (
                    place.name
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingItem?.id === place.id ? (
                    <input
                      type="number"
                      value={editForm.width || ''}
                      onChange={(e) => setEditForm({...editForm, width: parseFloat(e.target.value)})}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded px-2 py-1"
                    />
                  ) : (
                    `${place.width}m`
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingItem?.id === place.id ? (
                    <input
                      type="number"
                      value={editForm.height || ''}
                      onChange={(e) => setEditForm({...editForm, height: parseFloat(e.target.value)})}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded px-2 py-1"
                    />
                  ) : (
                    `${place.height}m`
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingItem?.id === place.id ? (
                    <input
                      type="number"
                      value={editForm.one_meter_rssi || ''}
                      onChange={(e) => setEditForm({...editForm, one_meter_rssi: parseFloat(e.target.value)})}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded px-2 py-1"
                    />
                  ) : (
                    `${place.one_meter_rssi} dBm`
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingItem?.id === place.id ? (
                    <input
                      type="number"
                      step="0.1"
                      value={editForm.propagation_factor || ''}
                      onChange={(e) => setEditForm({...editForm, propagation_factor: parseFloat(e.target.value)})}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded px-2 py-1"
                    />
                  ) : (
                    place.propagation_factor
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    {editingItem?.id === place.id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="p-1 text-[rgb(93,191,78)] hover:bg-white/10 hover:backdrop-blur-md rounded"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={() => {setEditingItem(null); setEditForm({});}}
                          className="p-1 text-gray-400 hover:bg-white/10 hover:backdrop-blur-md rounded"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setViewingPlace(place)}
                          className="p-1 text-gray-400 hover:bg-white/10 hover:backdrop-blur-md rounded"
                          title="Visualizar place"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setFullscreenPlace(place)}
                          className="p-1 text-[rgb(93,191,78)] hover:bg-white/10 hover:backdrop-blur-md rounded"
                          title="Ver em tela cheia"
                        >
                          <Maximize2 size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(place, 'place')}
                          className="p-1 text-gray-400 hover:bg-white/10 hover:backdrop-blur-md rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(place, 'place')}
                          className="p-1 text-red-400 hover:bg-white/10 hover:backdrop-blur-md rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const DevicesTable = () => (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/10 backdrop-blur-md">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Nome</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">MAC Address</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.map((device) => (
              <tr key={device.mac_address} className="border-t border-gray-800 text-white">
                <td className="px-4 py-3">
                  {editingItem?.mac_address === device.mac_address ? (
                    <input
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded px-2 py-1"
                    />
                  ) : (
                    device.name
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingItem?.mac_address === device.mac_address ? (
                    <input
                      value={editForm.mac_address || ''}
                      onChange={(e) => setEditForm({...editForm, mac_address: e.target.value})}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded px-2 py-1"
                    />
                  ) : (
                    device.mac_address
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    {editingItem?.mac_address === device.mac_address ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="p-1 text-[rgb(93,191,78)] hover:bg-white/10 hover:backdrop-blur-md rounded"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={() => {setEditingItem(null); setEditForm({});}}
                          className="p-1 text-gray-400 hover:bg-white/10 hover:backdrop-blur-md rounded"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setViewingTagHistory(device)}
                          className="p-1 text-[rgb(93,191,78)] hover:bg-white/10 hover:backdrop-blur-md rounded"
                          title="Ver histórico"
                        >
                          <Clock size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(device, 'device')}
                          className="p-1 text-gray-400 hover:bg-white/10 hover:backdrop-blur-md rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(device, 'device')}
                          className="p-1 text-red-400 hover:bg-white/10 hover:backdrop-blur-md rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Modal de visualização em tela cheia
  if (fullscreenPlace) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <img src={logotipo} alt="OWL Logo" className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-white">{fullscreenPlace.name}</h1>
          </div>
          <button
            onClick={() => setFullscreenPlace(null)}
            className="p-2 text-white hover:bg-white/10 hover:backdrop-blur-md rounded-lg"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="mb-6 text-center text-white">
            <p className="text-xl font-semibold">
              Dimensões: {fullscreenPlace.width}m × {fullscreenPlace.height}m
            </p>
            <p className="text-lg text-gray-300">
              Área total: {(fullscreenPlace.width * fullscreenPlace.height).toFixed(1)} m²
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Use o scroll do mouse para dar zoom no mapa
            </p>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <PlaceVisualization 
              place={fullscreenPlace} 
              tagLocations={tagLocations}
              fullscreen={true} 
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="OWL Logo" className="h-10 w-10" />
              <h1 className="text-3xl text-white font-cool">OWL</h1>
            </div>
            <button
              onClick={onBackToHome}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-lg transition-colors"
              title="Voltar para Home"
            >
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </button>
          </div>
          <p className="text-gray-400">Sistema de gerenciamento de places e tags</p>
        </div>

        {/* Stats Cards */}
        <StatsCards places={places} devices={devices} />

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-800">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('places')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'places'
                    ? 'border-[rgb(93,191,78)] text-[rgb(93,191,78)]'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                }`}
              >
                Places ({places.length})
              </button>
              <button
                onClick={() => setActiveTab('devices')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'devices'
                    ? 'border-[rgb(93,191,78)] text-[rgb(93,191,78)]'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                }`}
              >
                Tags ({devices.length})
              </button>
              <button
                onClick={() => setActiveTab('visualizations')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'visualizations'
                    ? 'border-[rgb(93,191,78)] text-[rgb(93,191,78)]'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                }`}
              >
                Visualizações
              </button>

            </nav>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
            <div className="flex">
              <div className="text-red-300">
                <strong>Erro:</strong> {error}
              </div>
            </div>
          </div>
        )}



        {/* Search and Filters - apenas para places e devices */}
        {activeTab !== 'visualizations' && (
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeTab={activeTab}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        )}

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(93,191,78)]"></div>
            </div>
          ) : (
            <>
              {activeTab === 'places' && (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-cool text-white">Places</h2>
                    <button
                      onClick={handleRefresh}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                      <span>Atualizar</span>
                    </button>
                  </div>
                  {filteredPlaces.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      {places.length === 0 
                        ? "Nenhum place encontrado. Vá para a página Home para criar um novo."
                        : "Nenhum place corresponde à sua busca."
                      }
                    </div>
                  ) : (
                    <PlacesTable />
                  )}
                </div>
              )}

              {activeTab === 'devices' && (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">Tags</h2>
                    <button
                      onClick={handleRefresh}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                      <span>Atualizar</span>
                    </button>
                  </div>
                  {filteredDevices.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      {devices.length === 0 
                        ? "Nenhuma tag encontrada. Vá para a página Home para criar uma nova."
                        : "Nenhuma tag corresponde à sua busca."
                      }
                    </div>
                  ) : (
                    <DevicesTable />
                  )}
                </div>
              )}

              {activeTab === 'visualizations' && (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">Visualizações dos Places</h2>
                    <button
                      onClick={fetchPlaces}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                      <span>Atualizar</span>
                    </button>
                  </div>
                  <PlacesGallery 
                    places={places} 
                    tagLocations={tagLocations}
                    onPlaceFullscreen={setFullscreenPlace}
                  />
                </div>
              )}


            </>
          )}
        </motion.div>

        {/* Modal de Visualização do Place */}
        {viewingPlace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setViewingPlace(null)}
          >
            <div className="absolute inset-0 bg-black/80" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    Visualização do Place
                  </h3>
                  <button
                    onClick={() => setViewingPlace(null)}
                    className="p-2 hover:bg-white/10 hover:backdrop-blur-md rounded-full text-gray-400"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <PlaceVisualization 
                  place={viewingPlace} 
                  tagLocations={tagLocations}
                  fullscreen={false}
                />
                
                <div className="mt-4 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Detalhes Técnicos</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">RSSI (1m):</span>
                      <span className="ml-2 font-mono text-white">{viewingPlace.one_meter_rssi} dBm</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Fator de Propagação:</span>
                      <span className="ml-2 font-mono text-white">{viewingPlace.propagation_factor}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Área Total:</span>
                      <span className="ml-2 font-mono text-white">{(viewingPlace.width * viewingPlace.height).toFixed(1)} m²</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Perímetro:</span>
                      <span className="ml-2 font-mono text-white">{(2 * (viewingPlace.width + viewingPlace.height)).toFixed(1)} m</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Tag History Viewer */}
        {viewingTagHistory && (
          <TagHistoryViewer
            tag={viewingTagHistory}
            places={places}
            onClose={() => setViewingTagHistory(null)}
          />
        )}

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          type={confirmDialog.type}
        />
      </div>
    </div>
  );
}

export default ManagementPage;
