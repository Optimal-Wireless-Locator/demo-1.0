import { useState, useEffect, useCallback } from 'react';

export function useApiData() {
    const [places, setPlaces] = useState([]);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPlaces = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/places');
            if (!response.ok) {
                throw new Error('Erro ao carregar places');
            }
            const data = await response.json();
            setPlaces(data);
        } catch (err) {
            setError(err.message);
            console.error('Erro ao carregar places:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDevices = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/devices');
            if (!response.ok) {
                throw new Error('Erro ao carregar devices');
            }
            const data = await response.json();
            setDevices(data);
        } catch (err) {
            setError(err.message);
            console.error('Erro ao carregar devices:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createPlace = useCallback(async (placeData) => {
        try {
            const response = await fetch('/places', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(placeData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao criar place');
            }

            const newPlace = await response.json();
            setPlaces(prev => [...prev, newPlace]);
            return newPlace;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const createDevice = useCallback(async (deviceData) => {
        try {
            const response = await fetch('/devices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(deviceData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao criar device');
            }

            const newDevice = await response.json();
            setDevices(prev => [...prev, newDevice]);
            return newDevice;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const updatePlace = useCallback(async (placeName, updateData) => {
        try {
            const response = await fetch(`/places/${encodeURIComponent(placeName)}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao atualizar place');
            }

            const updatedPlace = await response.json();
            setPlaces(prev => prev.map(place =>
                place.name === placeName ? updatedPlace : place
            ));
            return updatedPlace;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const updateDevice = useCallback(async (macAddress, updateData) => {
        try {
            const response = await fetch(`/devices/${encodeURIComponent(macAddress)}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao atualizar device');
            }

            const updatedDevice = await response.json();
            setDevices(prev => prev.map(device =>
                device.mac_address === macAddress ? updatedDevice : device
            ));
            return updatedDevice;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const deletePlace = useCallback(async (placeName) => {
        try {
            const response = await fetch(`/places/${encodeURIComponent(placeName)}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao deletar place');
            }

            setPlaces(prev => prev.filter(place => place.name !== placeName));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const deleteDevice = useCallback(async (macAddress) => {
        try {
            const response = await fetch(`/devices/${encodeURIComponent(macAddress)}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao deletar device');
            }

            setDevices(prev => prev.filter(device => device.mac_address !== macAddress));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Carregar dados iniciais
    useEffect(() => {
        fetchPlaces();
        fetchDevices();
    }, [fetchPlaces, fetchDevices]);

    // Escutar eventos customizados dos modais
    useEffect(() => {
        const handlePlaceCreated = (event) => {
            setPlaces(prev => [...prev, event.detail]);
        };

        const handleDeviceCreated = (event) => {
            setDevices(prev => [...prev, event.detail]);
        };

        window.addEventListener('places:created', handlePlaceCreated);
        window.addEventListener('devices:created', handleDeviceCreated);

        return () => {
            window.removeEventListener('places:created', handlePlaceCreated);
            window.removeEventListener('devices:created', handleDeviceCreated);
        };
    }, []);

    return {
        places,
        devices,
        loading,
        error,
        fetchPlaces,
        fetchDevices,
        createPlace,
        createDevice,
        updatePlace,
        updateDevice,
        deletePlace,
        deleteDevice
    };
}