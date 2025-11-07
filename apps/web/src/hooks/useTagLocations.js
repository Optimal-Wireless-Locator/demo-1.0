import { useState, useEffect, useCallback } from 'react';

export function useTagLocations(places = [], devices = [], refreshInterval = 5000) {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchLocationForTag = useCallback(async (macAddress, placeName) => {
        try {
            console.log(`🔍 Buscando localização para tag ${macAddress} no place ${placeName}`);

            const response = await fetch('/locations/current', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ macAddress, placeName })
            });

            if (!response.ok) {
                console.warn(`❌ Erro HTTP ${response.status} para ${macAddress} em ${placeName}`);
                throw new Error(`Erro ao buscar localização para ${macAddress}`);
            }

            const data = await response.json();
            console.log(`✅ Localização encontrada para ${macAddress}:`, data);

            return {
                ...data,
                placeName,
                deviceName: devices.find(d => d.mac_address === macAddress)?.name || macAddress
            };
        } catch (err) {
            console.warn(`❌ Erro ao buscar localização para ${macAddress} em ${placeName}:`, err);
            return null;
        }
    }, [devices]);

    const fetchAllLocations = useCallback(async () => {
        if (places.length === 0 || devices.length === 0) {
            setLocations([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const locationPromises = [];

            // Para cada place, buscar a localização de cada device
            places.forEach(place => {
                devices.forEach(device => {
                    locationPromises.push(
                        fetchLocationForTag(device.mac_address, place.name)
                    );
                });
            });

            const results = await Promise.all(locationPromises);
            const validLocations = results.filter(location => location !== null);

            console.log(`📍 Total de localizações válidas encontradas: ${validLocations.length}`);
            console.log('📍 Localizações válidas:', validLocations);

            setLocations(validLocations);
        } catch (err) {
            setError(err.message);
            console.error('Erro ao carregar localizações:', err);
        } finally {
            setLoading(false);
        }
    }, [places, devices, fetchLocationForTag]);

    // Carregar dados iniciais
    useEffect(() => {
        fetchAllLocations();
    }, [fetchAllLocations]);

    // Atualizar automaticamente
    useEffect(() => {
        if (refreshInterval > 0) {
            const interval = setInterval(fetchAllLocations, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [fetchAllLocations, refreshInterval]);

    return {
        locations,
        loading,
        error,
        refetch: fetchAllLocations
    };
}