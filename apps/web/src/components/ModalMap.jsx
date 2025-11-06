import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

function ModalMap({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [oneMeterRssi, setOneMeterRssi] = useState("");
  const [propagationFactor, setPropagationFactor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setWidth("");
      setHeight("");
      setOneMeterRssi("");
      setPropagationFactor("");
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const saveToLocal = (key, item) => {
    try {
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(item);
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (err) {
      console.warn("localStorage error", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // validation
    if (!name || !width || !height || !oneMeterRssi || !propagationFactor) {
      setError("Preencha todos os campos.");
      return;
    }

    const body = {
      name,
      width: parseFloat(width),
      height: parseFloat(height),
      one_meter_rssi: parseFloat(oneMeterRssi),
      propagation_factor: parseFloat(propagationFactor),
    };

    setLoading(true);
    try {
      console.log('Enviando dados para API:', body);
      
      const res = await fetch("/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      console.log('Resposta da API:', res.status, res.statusText);

      if (!res.ok) {
        const text = await res.text();
        console.error('Erro da API:', text);
        throw new Error(text || "Erro ao salvar place");
      }

      const newPlace = await res.json();
      console.log('Place criado:', newPlace);

      saveToLocal("places", newPlace);
      window.dispatchEvent(
        new CustomEvent("places:created", { detail: newPlace })
      );

      setLoading(false);
      onClose();
    } catch (err) {
      console.error('Erro completo:', err);
      setLoading(false);
      setError(err.message || "Erro ao salvar");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative bg-white/30 backdrop-blur-md border border-white/20 rounded-lg shadow-xl w-full max-w-lg mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-900/30 hover:backdrop-blur-md border border-white/20"
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4">Map</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border rounded-md bg-gray-900/30 backdrop-blur-md border-white/20 p-2 placeholder-white"
              placeholder="Ex: Escritório princpal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Width
            </label>
            <input
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="mt-1 block w-full border rounded-md bg-gray-900/30 backdrop-blur-md  border-white/20 p-2 placeholder-white"
              type="text"
              placeholder="Ex: 20.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Height
            </label>
            <input
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="mt-1 block w-full border rounded-md bg-gray-900/30 backdrop-blur-md  border-white/20 p-2 placeholder-white"
              placeholder="Ex: 15"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              One meter RSSI
            </label>
            <input
              value={oneMeterRssi}
              onChange={(e) => setOneMeterRssi(e.target.value)}
              className="mt-1 block w-full border rounded-md bg-gray-900/30 backdrop-blur-md  border-white/20 p-2 placeholder-white"
              placeholder="Ex: -45.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Propagation factor
            </label>
            <input
              value={propagationFactor}
              onChange={(e) => setPropagationFactor(e.target.value)}
              className="mt-1 block w-full border rounded-md  bg-gray-900/30 backdrop-blur-md  border-white/20 p-2 placeholder-white"
              placeholder="Ex: 2.1"
            />
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 hover:bg-gray-900/30 hover:backdrop-blur-md border hover:border-white/20 rounded-md mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2  bg-[rgb(93,191,78)] border hover:bg-gray-900/50 hover:backdrop-blur-md hover:border-white/20 text-white rounded-md"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default ModalMap;
