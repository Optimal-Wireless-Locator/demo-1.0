import React from 'react';

function PlaceVisualization({ place, fullscreen = false }) {
  if (!place) return null;

  const { width, height, name } = place;
  
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
  
  const svgWidth = width * pixelsPerMeter;
  const svgHeight = height * pixelsPerMeter;
  
  // Limitar tamanho máximo do SVG para não quebrar o layout
  const maxSvgSize = fullscreen ? 800 : 400;
  let finalWidth = svgWidth;
  let finalHeight = svgHeight;
  
  if (svgWidth > maxSvgSize || svgHeight > maxSvgSize) {
    const scale = maxSvgSize / Math.max(svgWidth, svgHeight);
    finalWidth = svgWidth * scale;
    finalHeight = svgHeight * scale;
  }

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
    <div className={`${fullscreen ? 'bg-transparent' : 'bg-gray-900 border border-gray-700'} rounded-lg p-4`}>
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
      
      <div className="flex justify-center">
        <svg
          width={finalWidth}
          height={finalHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="border border-gray-300 bg-white rounded"
        >
          {/* Fundo do ambiente */}
          <rect
            x="0"
            y="0"
            width={svgWidth}
            height={svgHeight}
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
            x="0"
            y="0"
            width={svgWidth}
            height={svgHeight}
            fill={`url(#grid-${place.id})`}
          />
          
          {/* ESP32s */}
          {Object.entries(espPositions).map(([espName, position]) => (
            <g key={espName}>
              <circle
                cx={position.x * pixelsPerMeter}
                cy={position.y * pixelsPerMeter}
                r="8"
                fill="rgb(93,191,78)"
                stroke="#000000"
                strokeWidth="2"
              />
              <text
                x={position.x * pixelsPerMeter}
                y={position.y * pixelsPerMeter - 12}
                textAnchor="middle"
                fontSize="10"
                fill="#000000"
                fontWeight="bold"
              >
                {espName.replace('ESP32_', 'E')}
              </text>
            </g>
          ))}
          
          {/* Dimensões */}
          <g>
            {/* Largura */}
            <line
              x1="0"
              y1={svgHeight + 15}
              x2={svgWidth}
              y2={svgHeight + 15}
              stroke="#000000"
              strokeWidth="1"
            />
            <text
              x={svgWidth / 2}
              y={svgHeight + 28}
              textAnchor="middle"
              fontSize="12"
              fill="#000000"
            >
              {width}m
            </text>
            
            {/* Altura */}
            <line
              x1={svgWidth + 15}
              y1="0"
              x2={svgWidth + 15}
              y2={svgHeight}
              stroke="#000000"
              strokeWidth="1"
            />
            <text
              x={svgWidth + 28}
              y={svgHeight / 2}
              textAnchor="middle"
              fontSize="12"
              fill="#000000"
              transform={`rotate(90, ${svgWidth + 28}, ${svgHeight / 2})`}
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