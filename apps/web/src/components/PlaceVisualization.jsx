import React, { useState } from 'react';
import tagIcon from '../assets/images/tag.png';

function PlaceVisualization({ place, fullscreen = false, tagLocations = [], onFullscreen }) {
  if (!place) return null;

  const { width, height, name } = place;
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Calcular escala baseada na regra: 15 metros = 40px
  // Se for maior que 15m, cada metro vale menos px
  // Se for menor que 15m, cada metro vale mais px
  const baseMeters = 15;
  const basePixels = 40;
  
  const maxDimension = Math.max(width, height);
  let pixelsPerMeter;
  
  if (maxDimension <= baseMeters) {
    // Para dimensões menores ou iguais a 15m, aumenta proporcionalmente
    pixelsPerMeter = basePixels * (baseMeters / maxDimension);
  } else {
    // Para dimensões maiores que 15m, diminui proporcionalmente
    pixelsPerMeter = basePixels * (baseMeters / maxDimension);
  }
  
  // Garantir um mínimo de pixels para visualização
  pixelsPerMeter = Math.max(pixelsPerMeter, 10);
  
  // Adicionar padding para não cortar textos dos ESP32s
  const padding = 40;
  const svgWidth = width * pixelsPerMeter + (padding * 2);
  const svgHeight = height * pixelsPerMeter + (padding * 2);
  
  // Limitar tamanho máximo do SVG para não quebrar o layout
  const maxSvgSize = fullscreen ? 800 : 400;
  let finalWidth = svgWidth;
  let finalHeight = svgHeight;
  
  if (svgWidth > maxSvgSize || svgHeight > maxSvgSize) {
    const scale = maxSvgSize / Math.max(svgWidth, svgHeight);
    finalWidth = svgWidth * scale;
    finalHeight = svgHeight * scale;
  }

  // Aplicar zoom
  const zoomedWidth = finalWidth * zoomLevel;
  const zoomedHeight = finalHeight * zoomLevel;

  // Função para lidar com o scroll/zoom
  const handleWheel = (e) => {
    if (fullscreen) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)));
    }
  };

  // Posições dos ESP32s (calculadas pela API)
  let espPositions = {};
  try {
    if (place.esp_positions) {
      espPositions = JSON.parse(place.esp_positions);
    }
  } catch (error) {
    console.warn('Erro ao parsear posições dos ESP32s:', error);
  }

  return (
    <div className={`${fullscreen ? 'bg-transparent' : 'bg-white/10 backdrop-blur-md border border-white/20'} rounded-lg p-4`}>
      {!fullscreen && (
        <div className="mb-3">
          <h4 className="font-semibold text-white">{name}</h4>
          <p className="text-sm text-gray-400">
            {width}m × {height}m ({(width * height).toFixed(1)}m²)
          </p>
          <p className="text-xs text-gray-500">
            Escala: {pixelsPerMeter.toFixed(1)}px/metro
          </p>
        </div>
      )}
      
      <div 
        className="flex justify-center"
        style={{ 
          overflow: fullscreen ? 'auto' : 'hidden',
          maxHeight: fullscreen ? '80vh' : 'auto'
        }}
      >
        <svg
          width={zoomedWidth}
          height={zoomedHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className={`border border-gray-300 bg-white rounded ${!fullscreen ? 'cursor-pointer' : ''}`}
          onWheel={handleWheel}
          onClick={!fullscreen && onFullscreen ? onFullscreen : undefined}
        >
          {/* Fundo do ambiente */}
          <rect
            x={padding}
            y={padding}
            width={width * pixelsPerMeter}
            height={height * pixelsPerMeter}
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="2"
          />
          
          {/* Grid quadriculado para referência */}
          <defs>
            <pattern
              id={`grid-${place.id}`}
              width={pixelsPerMeter}
              height={pixelsPerMeter}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${pixelsPerMeter} 0 L 0 0 0 ${pixelsPerMeter}`}
                fill="none"
                stroke="#cccccc"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          
          <rect
            x={padding}
            y={padding}
            width={width * pixelsPerMeter}
            height={height * pixelsPerMeter}
            fill={`url(#grid-${place.id})`}
          />
          
          {/* ESP32s */}
          {Object.entries(espPositions).map(([espName, position]) => {
            // Corrigir a inversão do Y para ESP32s também e adicionar padding
            const espX = (position.x * pixelsPerMeter) + padding;
            const espY = ((height - position.y) * pixelsPerMeter) + padding;
            const circleRadius = fullscreen ? 12 : 10;
            const fontSize = fullscreen ? 16 : 14;
            
            return (
              <g key={espName}>
                {/* Sombra do fundo */}
                <rect
                  x={espX - 18}
                  y={espY - circleRadius - 28}
                  width="36"
                  height="22"
                  fill="rgba(0,0,0,0.2)"
                  rx="4"
                />
                
                {/* Fundo branco para o texto */}
                <rect
                  x={espX - 16}
                  y={espY - circleRadius - 26}
                  width="32"
                  height="20"
                  fill="rgba(255,255,255,0.95)"
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth="1"
                  rx="3"
                />
                
                {/* Círculo do ESP32 */}
                <circle
                  cx={espX}
                  cy={espY}
                  r={circleRadius}
                  fill="rgb(93,191,78)"
                  stroke="#000000"
                  strokeWidth="3"
                />
                
                {/* Texto do ESP32 */}
                <text
                  x={espX}
                  y={espY - circleRadius - 10}
                  textAnchor="middle"
                  fontSize={fontSize}
                  fill="#000000"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {espName.replace('ESP32_', 'E')}
                </text>
                
                {/* Texto adicional dentro do círculo */}
                <text
                  x={espX}
                  y={espY + 2}
                  textAnchor="middle"
                  fontSize={fullscreen ? 8 : 6}
                  fill="#ffffff"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {espName.replace('ESP32_', '')}
                </text>
              </g>
            );
          })}

          {/* Tags em tempo real */}
          {tagLocations
            .filter(tag => tag.placeName === name)
            .map((tagLocation) => {
              const tagX = (tagLocation.x * pixelsPerMeter) + padding;
              // CORREÇÃO DO EIXO Y: Inverter para que o Y=0 seja embaixo
              const tagY = ((height - tagLocation.y) * pixelsPerMeter) + padding;
              const tagSize = fullscreen ? 32 : 24;
              
              return (
                <g key={`${tagLocation.mac_address}-${tagLocation.placeName}`}>
                  {/* Tag diretamente sem pin */}
                  <image
                    x={tagX - tagSize/2}
                    y={tagY - tagSize/2}
                    width={tagSize}
                    height={tagSize}
                    href={tagIcon}
                  />
                  
                  {/* Label da tag */}
                  <text
                    x={tagX}
                    y={tagY + tagSize/2 + 15}
                    textAnchor="middle"
                    fontSize={fullscreen ? "14" : "12"}
                    fill="#000000"
                    fontWeight="bold"
                    style={{ 
                      textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
                      fontFamily: 'monospace'
                    }}
                  >
                    {tagLocation.deviceName}
                  </text>
                </g>
              );
            })}
          
          {/* Dimensões */}
          <g>
            {/* Largura */}
            <line
              x1={padding}
              y1={height * pixelsPerMeter + padding + 15}
              x2={width * pixelsPerMeter + padding}
              y2={height * pixelsPerMeter + padding + 15}
              stroke="#000000"
              strokeWidth="1"
            />
            <text
              x={width * pixelsPerMeter / 2 + padding}
              y={height * pixelsPerMeter + padding + 28}
              textAnchor="middle"
              fontSize="12"
              fill="#000000"
            >
              {width}m
            </text>
            
            {/* Altura */}
            <line
              x1={width * pixelsPerMeter + padding + 15}
              y1={padding}
              x2={width * pixelsPerMeter + padding + 15}
              y2={height * pixelsPerMeter + padding}
              stroke="#000000"
              strokeWidth="1"
            />
            <text
              x={width * pixelsPerMeter + padding + 28}
              y={height * pixelsPerMeter / 2 + padding}
              textAnchor="middle"
              fontSize="12"
              fill="#000000"
              transform={`rotate(90, ${width * pixelsPerMeter + padding + 28}, ${height * pixelsPerMeter / 2 + padding})`}
            >
              {height}m
            </text>
          </g>
        </svg>
      </div>
      
      {/* Legenda */}
      {!fullscreen && (
        <div className="mt-3 text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full border border-black" style={{backgroundColor: 'rgb(93,191,78)'}}></div>
              <span>ESP32</span>
            </div>
            <div className="flex items-center space-x-1">
              <img src={tagIcon} alt="Tag" className="w-3 h-3" />
              <span>Tags</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-white border border-gray-600"></div>
              <span>1m²</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaceVisualization;