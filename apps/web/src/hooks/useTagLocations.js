import { useState, useEffect, useCallback } from 'react';

// Função para obter o status de uma tag
const getTagStatus = (lastRead) => {
    if (!lastRead) return 'never_used'; // Nunca teve leitura

    const lastReadTime = new Date(lastRead);
    const now = new Date();
    const diffInMinutes = (now - lastReadTime) / (1000 * 60);

    if (diffInMinutes <= 5) return 'active'; // Ativa (última leitura < 5 min)
    return 'inactive'; // Inativa (última leitura > 5 min)
};

// Função para verificar se uma tag está ativa (última leitura há menos de 5 minutos)
const isTagActive = (lastRead) => {
    return getTagStatus(lastRead) === 'active';
};

export function useTagLocations(places = [], devices = [], refreshInterval = 5000) {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchLocationForTag = useCallback(async (macAddress, placeName, device, place) => {
        try {
            // Verificar se a tag está ativa antes de buscar localização
            if (!isTagActive(device.last_read)) {
                console.log(`⏰ Tag ${macAddress} inativa (última leitura: ${device.last_read})`);
                return null;
            }

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

            // Verificar se a tag está dentro dos limites do mapa
            const isOutOfBounds = data.x < 0 || data.x > place.width || data.y < 0 || data.y > place.height;

            if (isOutOfBounds) {
                console.log(`🚨 Tag ${macAddress} está FORA DO MAPA em ${placeName}!`);
                console.log(`   Coordenadas: x=${data.x.toFixed(2)}, y=${data.y.toFixed(2)}`);
                console.log(`   Limites: x=[0, ${place.width}], y=[0, ${place.height}]`);
            }

            return {
                ...data,
                placeName,
                deviceName: device.name || macAddress,
                last_read: device.last_read,
                isOutOfBounds
            };
        } catch (err) {
            console.warn(`❌ Erro ao buscar localização para ${macAddress} em ${placeName}:`, err);
            return null;
        }
    }, []);

    const fetchAllLocations = useCallback(async () => {
        if (places.length === 0 || devices.length === 0) {
            setLocations([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const locationPromises = [];

            // Para cada place, buscar a localização de cada device ativo
            places.forEach(place => {
                devices.forEach(device => {
                    locationPromises.push(
                        fetchLocationForTag(device.mac_address, place.name, device, place)
                    );
                });
            });

            const results = await Promise.all(locationPromises);
            const validLocations = results.filter(location => location !== null);

            // Garantir que cada tag apareça apenas uma vez (última posição conhecida)
            // Priorizar tags dentro do mapa sobre tags fora do mapa
            const uniqueLocations = {};
            validLocations.forEach(location => {
                const key = location.mac_address;

                if (!uniqueLocations[key]) {
                    // Primeira ocorrência desta tag
                    uniqueLocations[key] = location;
                } else {
                    // Tag já existe, verificar se devemos substituir
                    const existing = uniqueLocations[key];

                    // Se a existente está fora do mapa e a nova está dentro, substituir
                    if (existing.isOutOfBounds && !location.isOutOfBounds) {
                        uniqueLocations[key] = location;
                    }
                    // Se ambas estão dentro ou ambas estão fora, manter a primeira
                }
            });

            const finalLocations = Object.values(uniqueLocations);

            console.log(`📍 Total de localizações válidas encontradas: ${validLocations.length}`);
            console.log(`📍 Localizações únicas (última posição): ${finalLocations.length}`);
            console.log('📍 Localizações finais:', finalLocations);

            setLocations(finalLocations);
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
        refetch: fetchAllLocations,
        isTagActive, // Exportar função para uso em outros componentes
        getTagStatus // Exportar função de status
    };
}

// Exportar também como funções standalone
export { isTagActive, getTagStatus };