import { prisma } from './prisma.js'
import { levenbergMarquardt } from 'ml-levenberg-marquardt'

// Função de trilateração
export async function trilateration( placeName, macAddress ) {
  console.log(`[TRILATERATION] Starting calculation for MAC: ${macAddress}`)

  // Busca o lugar pelo nome
  const place = await prisma.places.findFirst({
    where: {
      name: placeName,
    },
  })

  if (!place) {
    throw new Error('Place not found.')
  }

  const { width, height, name, one_meter_rssi, propagation_factor } = place

  // RSSI de um metro e Fator de Propagação
  const calibrationRssi = {
    // Potência de transmissão (RSSI a 1 metro). Deve ser calibrado.
    oneMeterRssi: one_meter_rssi,
    // Expoente de perda de caminho (path-loss). Depende do ambiente (paredes, etc.)
    propagationFactor: propagation_factor,
  }
  // Configurações da função 'levenbergMarquardt' da lib 'ml-levenberg-marquardt'
  const lmOptions = {
    damping: 1.5,
    gradientDifference: 1e-6,
    maxIterations: 100,
    errorTolerance: 1e-6,
  }

  // Retorna a distancia em metros
  function rssiToDistance(rssi) {
    const { oneMeterRssi, propagationFactor } = calibrationRssi

    // Fórmula de conversão
    return Math.pow(10, (oneMeterRssi - rssi) / (10 * propagationFactor))
  }

  console.log(`Place: ${name} - ${width}m x ${height}m`)

  // Definição da posição dos ESP32
  const espPositionsMap = JSON.parse(place.esp_positions)

  const knownEspIds = Object.keys(espPositionsMap)

  // Busca as ultimas leituras da tag específica
  const recentReadings = await prisma.readings.findMany({
    where: {
      devicesMac_address: macAddress,
      esp32: { in: knownEspIds }, // Filtra apenas ESPs conhecidos
    },
    orderBy: { read_at: 'desc' },
    take: 50, // Um buffer razoável para garantir a leitura mais recente de cada ESP
  })

  // Obter o RSSI Mais Recente de Cada ESP
  const latestRssiPerEsp = new Map()
  for (const reading of recentReadings) {
    if (!latestRssiPerEsp.has(reading.esp32)) {
      // O schema 'Readings' define 'rssi' como Int, eliminando
      // a necessidade de 'parseFloat' ou 'trim'.
      latestRssiPerEsp.set(reading.esp32, reading.rssi)
    }
  }

  // Montar Lista de Sensores Ativos
  const activeEsps = []
  for (const [espID, rssi] of latestRssiPerEsp.entries()) {
    activeEsps.push({
      espID,
      rssi,
      position: espPositionsMap[espID],
    })
  }

  // Validação crucial: O algoritmo precisa de pelo menos 3 pontos
  if (activeEsps.length < 3) {
    throw new Error(
      `Less than 3 active ESPs detected (detected: ${activeEsps.length}) - Impossible to triangular.`
    )
  }

  console.log(
    `Active ESPs: ${activeEsps.length} `,
    activeEsps.map((e) => `${e.espID} (RSSI: ${e.rssi})`).join(', ')
  )

  // Preparar Dados para Levenberg-Marquardt - O algoritmo espera vetores de dados.
  const distances = activeEsps.map((esp) => rssiToDistance(esp.rssi))
  const sensorPositions = activeEsps.map((esp) => esp.position)

  // 'data.x' são apenas os índices (0, 1, 2, ...)
  // 'data.y' são as distâncias calculadas (metros)
  const data = {
    x: Array.from({ length: distances.length }, (_, i) => i),
    y: distances,
  }

  // Esta é a função que o LM tentará "fittar"
  // Ela calcula a distância euclidiana de um ponto (posX, posY)
  // até o sensor na posição `sensorPositions[sensorIndex]`
  function trilaterationModel([posX, posY]) {
    return function (sensorIndex) {
      const pos = sensorPositions[sensorIndex]
      if (!pos) {
        // Verificação de segurança, embora não deva acontecer
        throw new Error(`Sensor position ${sensorIndex} not found.`)
      }
      return Math.sqrt(Math.pow(posX - pos.x, 2) + Math.pow(posY - pos.y, 2))
    }
  }

  let initialGuess = null
  // Configurar e Executar o Algoritmo
  // Define o chute inicial. Se nenhum foi fornecido, usa o centro da sala
  // Usar a última posição conhecida (initialGuess) acelera a convergência
  const finalInitialGuess = initialGuess || [width / 2, height / 2]

  const options = {
    ...lmOptions,
    initialValues: finalInitialGuess,
  }

  console.log(
    `[TRILATERATION] Running LM with kick start: [${finalInitialGuess
      .map((v) => v.toFixed(2))
      .join(', ')}]`
  )

  // Executa o cálculo com a funcao 'levenbergMarquardt'
  const fit = levenbergMarquardt(data, trilaterationModel, options)
  const [x, y] = fit.parameterValues

  console.log(
    `[TRILATERATION] Calculated position: [${x.toFixed(2)}, ${y.toFixed(2)}]`
  )

  // Retorna um objeto limpo com a posição e os dados usados no cálculo
  return {
    x,
    y,
    used: activeEsps.map((esp, i) => ({
      espID: esp.espID,
      rssi: esp.rssi,
      estimated_distance: distances[i], // Distância que foi usada no cálculo
    })),
  }
}
