import { useState, useCallback } from 'react';

export function useTagHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchHistory = useCallback(async (macAddress) => {
        if (!macAddress) {
            setHistory([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/locations/historic/${encodeURIComponent(macAddress)}`);

            if (!response.ok) {
                throw new Error(`Erro ao buscar histórico para ${macAddress}`);
            }

            const data = await response.json();

            console.log('📜 Histórico recebido da API:', data);
            console.log('📜 Primeiro registro:', data[0]);

            // Ordenar por data (mais recente primeiro para visualização)
            const sortedData = data.sort((a, b) =>
                new Date(b.tracked_at) - new Date(a.tracked_at)
            );

            console.log('📜 Histórico ordenado:', sortedData);

            setHistory(sortedData);
        } catch (err) {
            setError(err.message);
            console.error('Erro ao carregar histórico:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearHistory = useCallback(() => {
        setHistory([]);
        setError(null);
    }, []);

    return {
        history,
        loading,
        error,
        fetchHistory,
        clearHistory
    };
}
