import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';

function CreateForms({ activeTab, onPlaceCreated, onDeviceCreated }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Place form states
  const [placeName, setPlaceName] = useState('');
  const [placeWidth, setPlaceWidth] = useState('');
  const [placeHeight, setPlaceHeight] = useState('');
  const [placeRssi, setPlaceRssi] = useState('');
  const [placePropagation, setPlacePropagation] = useState('');

  // Device form states
  const [deviceName, setDeviceName] = useState('');
  const [deviceMac, setDeviceMac] = useState('');

  const resetForms = () => {
    setPlaceName('');
    setPlaceWidth('');
    setPlaceHeight('');
    setPlaceRssi('');
    setPlacePropagation('');
    setDeviceName('');
    setDeviceMac('');
    setError(null);
  };

  const handleSubmitPlace = async (e) => {
    e.preventDefault();
    setError(null);

    if (!placeName || !placeWidth || !placeHeight || !placeRssi || !placePropagation) {
      setError('Preencha todos os campos.');
      return;
    }

    const body = {
      name: placeName,
      width: parseFloat(placeWidth),
      height: parseFloat(placeHeight),
      one_meter_rssi: parseFloat(placeRssi),
      propagation_factor: parseFloat(placePropagation),
    };

    setLoading(true);
    try {
      const response = await fetch('/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao criar place');
      }

      const newPlace = await response.json();
      onPlaceCreated(newPlace);
      resetForms();
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDevice = async (e) => {
    e.preventDefault();
    setError(null);

    if (!deviceName || !deviceMac) {
      setError('Preencha todos os campos.');
      return;
    }

    const body = {
      name: deviceName,
      mac_address: deviceMac
    };

    setLoading(true);
    try {
      const response = await fetch('/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao criar device');
      }

      const newDevice = await response.json();
      onDeviceCreated(newDevice);
      resetForms();
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-[rgb(93,191,78)] text-white rounded-lg hover:bg-green-600 transition-colors "
      >
        <Plus size={16} />
        <span>Criar {activeTab === 'places' ? 'Place' : 'Tag'}</span>
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 mb-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">
          Criar {activeTab === 'places' ? 'Novo Place' : 'Nova Tag'}
        </h3>
        <button
          onClick={() => {
            setShowForm(false);
            resetForms();
          }}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X size={20} />
        </button>
      </div>

      {activeTab === 'places' ? (
        <form onSubmit={handleSubmitPlace} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1 ">
                Nome
              </label>
              <input
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded px-3 py-2"
                placeholder="Ex: Escritório Principal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Largura (metros)
              </label>
              <input
                type="number"
                step="0.1"
                value={placeWidth}
                onChange={(e) => setPlaceWidth(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded px-3 py-2"
                placeholder="Ex: 20.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Altura (metros)
              </label>
              <input
                type="number"
                step="0.1"
                value={placeHeight}
                onChange={(e) => setPlaceHeight(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded px-3 py-2"
                placeholder="Ex: 15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                RSSI (1 metro)
              </label>
              <input
                type="number"
                step="0.1"
                value={placeRssi}
                onChange={(e) => setPlaceRssi(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded px-3 py-2"
                placeholder="Ex: -45.5"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white mb-1">
                Fator de Propagação
              </label>
              <input
                type="number"
                step="0.1"
                value={placePropagation}
                onChange={(e) => setPlacePropagation(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded px-3 py-2"
                placeholder="Ex: 2.1"
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForms();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[rgb(93,191,78)] text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Place'}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmitDevice} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Nome
              </label>
              <input
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded px-3 py-2"
                placeholder="Ex: Tag de Teste 1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                MAC Address
              </label>
              <input
                value={deviceMac}
                onChange={(e) => setDeviceMac(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded px-3 py-2"
                placeholder="Ex: 00:1B:44:11:3A:B7"
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForms();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[rgb(93,191,78)] text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Tag'}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
}

export default CreateForms;