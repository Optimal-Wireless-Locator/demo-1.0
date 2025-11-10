import { useEffect, useRef, useState } from 'react';

/**
 * Hook para detectar e notificar quando tags saem do mapa
 */
export function useOutOfBoundsNotification(tagLocations) {
    const [notification, setNotification] = useState(null);
    const previousOutOfBoundsRef = useRef(new Set());

    useEffect(() => {
        if (!tagLocations || tagLocations.length === 0) return;

        const currentOutOfBounds = new Set();
        const newOutOfBounds = [];

        // Identificar tags que estão fora do mapa
        tagLocations.forEach(location => {
            if (location.isOutOfBounds) {
                const key = `${location.mac_address}-${location.placeName}`;
                currentOutOfBounds.add(key);

                // Se não estava fora antes, é uma nova ocorrência
                if (!previousOutOfBoundsRef.current.has(key)) {
                    newOutOfBounds.push(location);
                }
            }
        });

        // Se há novas tags fora do mapa, mostrar notificação
        if (newOutOfBounds.length > 0) {
            const location = newOutOfBounds[0]; // Mostrar apenas a primeira
            setNotification({
                deviceName: location.deviceName,
                placeName: location.placeName,
                x: location.x,
                y: location.y
            });
        }

        // Atualizar referência
        previousOutOfBoundsRef.current = currentOutOfBounds;
    }, [tagLocations]);

    const clearNotification = () => {
        setNotification(null);
    };

    return {
        notification,
        clearNotification
    };
}
