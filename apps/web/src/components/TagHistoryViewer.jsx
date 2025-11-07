import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, MapPin, Play, Pause, SkipBack, SkipForward, Calendar } from 'lucide-react';
import { useTagHistory } from '../hooks/useTagHistory';
import PlaceVisualization from './PlaceVisualization';

function TagHistoryViewer({ tag, places, onClose }) {
  const { history, loading, fetchHistory } = useTagHistory();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState('');

  useEffect(() => {
    if (tag) {
      fetchHistory(tag.mac_address);
    }
  }, [tag, fetchHistory]);

  // Função para encontrar o registro mais próximo de uma data/hora
  const findClosestRecord = (targetDateTime) => {
    if (!targetDateTime || history.length === 0) return;

    const targetTime = new Date(targetDateTime).getTime();
    
    let closestIndex = 0;
    let minDiff = Math.abs(new Date(history[0].tracked_at).getTime() - targetTime);

    history.forEach((record, index) => {
      const recordTime = new Date(record.tracked_at).getTime();
      const diff = Math.abs(recordTime - targetTime);
      
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });

    setSelectedIndex(closestIndex);
    
    // Rolar a timeline para o item selecionado
    setTimeout(() => {
      const element = document.getElementById(`timeline-item-${closestIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Quando o usuário seleciona uma data/hora
  const handleDateTimeChange = (e) => {
    const dateTime = e.target.value;
    setSelectedDateTime(dateTime);
    findClosestRecord(dateTime);
  };

  useEffect(() => {
    if (!isPlaying || history.length === 0) return;

    const interval = setInterval(() => {
      setSelectedIndex(prev => {
        if (prev >= history.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000); // Avança 1 posição por segundo

    return () => clearInterval(interval);
  }, [isPlaying, history.length]);

  if (!tag) return null;

  const selectedRecord = history[selectedIndex];
  
  console.log('🔍 Selected record:', selectedRecord);
  console.log('🔍 Places disponíveis:', places.map(p => p.name));
  
  // Suportar tanto placesName quanto place_name
  const placeName = selectedRecord ? (selectedRecord.placesName || selectedRecord.place_name) : null;
  const currentPlace = placeName ? places.find(p => p.name === placeName) : null;
  
  console.log('🔍 Place name:', placeName);
  console.log('🔍 Current place encontrado:', currentPlace);

  // Criar um objeto de localização para o PlaceVisualization
  const currentLocation = selectedRecord && placeName ? [{
    mac_address: tag.mac_address,
    deviceName: tag.name,
    placeName: placeName,
    x: selectedRecord.x,
    y: selectedRecord.y,
    used_sensors: selectedRecord.calculation_inputs?.used_sensors || []
  }] : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80" />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex flex-col max-h-full overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-white">Histórico de Localização</h3>
              <p className="text-gray-300">{tag.name} ({tag.mac_address})</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Seletor de Data/Hora */}
          {history.length > 0 && (
            <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center space-x-4">
                <Calendar className="text-[rgb(93,191,78)]" size={20} />
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-2">
                    Buscar por data e hora (aproximado)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="datetime-local"
                      value={selectedDateTime}
                      onChange={handleDateTimeChange}
                      min={history.length > 0 ? new Date(history[history.length - 1].tracked_at).toISOString().slice(0, 16) : ''}
                      max={history.length > 0 ? new Date(history[0].tracked_at).toISOString().slice(0, 16) : ''}
                      className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white focus:outline-none focus:border-[rgb(93,191,78)]"
                    />
                    {selectedDateTime && (
                      <button
                        onClick={() => {
                          setSelectedDateTime('');
                          setSelectedIndex(0);
                        }}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-lg text-white transition-colors"
                        title="Limpar busca"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                  {selectedDateTime && selectedRecord && (
                    <p className="text-xs text-[rgb(93,191,78)] mt-1">
                      ✓ Registro mais próximo encontrado: {new Date(selectedRecord.tracked_at).toLocaleString('pt-BR')}
                      {(() => {
                        const diff = Math.abs(new Date(selectedRecord.tracked_at) - new Date(selectedDateTime));
                        const seconds = Math.floor(diff / 1000);
                        const minutes = Math.floor(seconds / 60);
                        const hours = Math.floor(minutes / 60);
                        
                        if (hours > 0) return ` (${hours}h ${minutes % 60}min de diferença)`;
                        if (minutes > 0) return ` (${minutes}min ${seconds % 60}s de diferença)`;
                        return ` (${seconds}s de diferença)`;
                      })()}
                    </p>
                  )}
                  {!selectedDateTime && (
                    <p className="text-xs text-gray-500 mt-1">
                      O sistema encontrará o registro mais próximo do horário selecionado
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(93,191,78)]"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MapPin size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhum histórico encontrado para esta tag</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
              {/* Timeline */}
              <div className="lg:col-span-1 flex flex-col overflow-hidden">
                <h4 className="text-lg font-semibold text-white mb-4">Timeline</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.map((record, index) => (
                    <button
                      key={record.id}
                      id={`timeline-item-${index}`}
                      onClick={() => setSelectedIndex(index)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                        index === selectedIndex
                          ? 'bg-[rgb(93,191,78)]/30 border-2 border-[rgb(93,191,78)] shadow-lg shadow-[rgb(93,191,78)]/20'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-sm text-white">
                            {new Date(record.tracked_at).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-gray-400">
                        {record.placesName || record.place_name || 'Place desconhecido'}
                      </div>
                      <div className="mt-1 text-xs text-gray-500 font-mono">
                        x: {record.x.toFixed(2)}m, y: {record.y.toFixed(2)}m
                      </div>
                    </button>
                  ))}
                </div>

                {/* Controles de Reprodução */}
                <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">
                      {selectedIndex + 1} / {history.length}
                    </span>
                    <span className="text-xs text-gray-500">
                      {selectedRecord && new Date(selectedRecord.tracked_at).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setSelectedIndex(0)}
                      disabled={selectedIndex === 0}
                      className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-lg transition-colors"
                    >
                      <SkipBack size={20} className="text-white" />
                    </button>
                    
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      disabled={selectedIndex >= history.length - 1}
                      className="p-3 bg-[rgb(93,191,78)]/30 hover:bg-[rgb(93,191,78)]/50 disabled:opacity-30 rounded-lg transition-colors"
                    >
                      {isPlaying ? (
                        <Pause size={24} className="text-white" />
                      ) : (
                        <Play size={24} className="text-white" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setSelectedIndex(history.length - 1)}
                      disabled={selectedIndex === history.length - 1}
                      className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-lg transition-colors"
                    >
                      <SkipForward size={20} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mapa */}
              <div className="lg:col-span-2 overflow-y-auto">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Localização {placeName ? `em ${placeName}` : ''}
                </h4>
                
                {!selectedRecord ? (
                  <div className="text-center py-12 text-gray-400">
                    <MapPin size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Selecione um registro na timeline</p>
                  </div>
                ) : !currentPlace ? (
                  <div className="text-center py-12 text-gray-400">
                    <MapPin size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Place "{placeName || 'desconhecido'}" não encontrado</p>
                    <p className="text-sm mt-2">O place pode ter sido excluído</p>
                  </div>
                ) : (
                  <div>
                    <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                      <PlaceVisualization
                        place={currentPlace}
                        tagLocations={currentLocation}
                        fullscreen={false}
                      />
                    </div>
                    
                    <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                      <h5 className="font-semibold text-white mb-2 text-sm">Detalhes da Posição</h5>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-gray-400">Posição X:</span>
                          <span className="ml-2 font-mono text-white">{selectedRecord.x.toFixed(2)}m</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Posição Y:</span>
                          <span className="ml-2 font-mono text-white">{selectedRecord.y.toFixed(2)}m</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Registrado em:</span>
                          <span className="ml-2 text-white">
                            {new Date(selectedRecord.tracked_at).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Sensores usados:</span>
                          <span className="ml-2 text-white">
                            {selectedRecord.calculation_inputs?.used_sensors?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default TagHistoryViewer;
