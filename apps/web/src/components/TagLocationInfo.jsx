import React from 'react';
import { MapPin, Clock, Wifi } from 'lucide-react';

function TagLocationInfo({ locations = [], loading = false }) {
  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <MapPin className="mr-2" size={20} />
          Informações das Tags
        </h3>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(93,191,78)]"></div>
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <MapPin className="mr-2" size={20} />
          Informações das Tags
        </h3>
        <div className="text-center py-8 text-gray-400">
          <MapPin size={48} className="mx-auto mb-4 opacity-50" />
          <p>Nenhuma tag sendo rastreada no momento</p>
          <p className="text-sm mt-2">Verifique se há tags e places cadastrados</p>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-800">
          <button
            onClick={async () => {
              console.log('🧪 Testando API manualmente...');
              try {
                const response = await fetch('/locations/current', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    macAddress: 'aa:bb:cc:11:22:33', 
                    placeName: 'Escritório Principal' 
                  })
                });
                
                console.log('🧪 Response status:', response.status);
                
                if (response.ok) {
                  const data = await response.json();
                  console.log('🧪 Response data:', data);
                  alert(`Teste OK! x: ${data.x}, y: ${data.y}`);
                } else {
                  const errorText = await response.text();
                  console.log('🧪 Error response:', errorText);
                  alert(`Erro ${response.status}: ${errorText}`);
                }
              } catch (error) {
                console.error('🧪 Erro no teste:', error);
                alert(`Erro: ${error.message}`);
              }
            }}
            className="w-full px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition-colors"
          >
            🧪 Testar API Manualmente
          </button>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Teste com dados de exemplo
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <MapPin className="mr-2" size={20} />
        Informações das Tags ({locations.length})
      </h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {locations.map((location, index) => (
          <div 
            key={`${location.mac_address}-${location.placeName}-${index}`}
            className="bg-gray-800 border border-gray-700 rounded-lg p-3"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-white">{location.deviceName}</h4>
                <p className="text-xs text-gray-400 font-mono">{location.mac_address}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Place</div>
                <div className="text-sm text-[rgb(93,191,78)]">{location.placeName}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-gray-400 text-xs">Posição X</div>
                <div className="text-white font-mono">{location.x?.toFixed(2) || 'N/A'}m</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs">Posição Y</div>
                <div className="text-white font-mono">{location.y?.toFixed(2) || 'N/A'}m</div>
              </div>
            </div>
            
            {location.used_sensors && location.used_sensors.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-700">
                <div className="flex items-center text-xs text-gray-400 mb-1">
                  <Wifi size={12} className="mr-1" />
                  Sensores utilizados ({location.used_sensors.length})
                </div>
                <div className="flex flex-wrap gap-1">
                  {location.used_sensors.slice(0, 3).map((sensor, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded"
                    >
                      {sensor.replace('ESP32_', 'E')}
                    </span>
                  ))}
                  {location.used_sensors.length > 3 && (
                    <span className="px-2 py-1 bg-gray-700 text-xs text-gray-400 rounded">
                      +{location.used_sensors.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-2 pt-2 border-t border-gray-700 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <Clock size={10} className="mr-1" />
                Atualizado agora
              </div>
              <div className="w-2 h-2 bg-[rgb(93,191,78)] rounded-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-800">
        <button
          onClick={async () => {
            console.log('🧪 Testando API manualmente...');
            try {
              const response = await fetch('/locations/current', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  macAddress: 'aa:bb:cc:11:22:33', 
                  placeName: 'Escritório Principal' 
                })
              });
              
              console.log('🧪 Response status:', response.status);
              
              if (response.ok) {
                const data = await response.json();
                console.log('🧪 Response data:', data);
                alert(`Teste OK! x: ${data.x}, y: ${data.y}`);
              } else {
                const errorText = await response.text();
                console.log('🧪 Error response:', errorText);
                alert(`Erro ${response.status}: ${errorText}`);
              }
            } catch (error) {
              console.error('🧪 Erro no teste:', error);
              alert(`Erro: ${error.message}`);
            }
          }}
          className="w-full px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition-colors"
        >
          🧪 Testar API Manualmente
        </button>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Atualização automática a cada 5 segundos
        </div>
      </div>
    </div>
  );
}

export default TagLocationInfo;