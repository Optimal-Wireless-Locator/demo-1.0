import { prisma } from './prisma.js'
import { levenbergMarquardt } from 'ml-levenberg-marquardt'

// Trilateration function
export async function trilateration(placeName, macAddress) {
  console.log(`[TRILATERATION] Starting calculation for MAC: ${macAddress}`)

  // Search the place by name
  const place = await prisma.places.findFirst({
    where: {
      name: placeName,
    },
  })

  if (!place) {
    throw new Error('Place not found.')
  }

  const { width, height, name, one_meter_rssi, propagation_factor } = place

  // RSSI at one meter and Propagation Factor
  const calibrationRssi = {
    // Transmission power (RSSI at 1 meter). Must be calibrated.
    oneMeterRssi: one_meter_rssi,
    // Path-loss exponent. Depends on the environment (walls, etc.)
    propagationFactor: propagation_factor,
  }

  // 'levenbergMarquardt' options from 'ml-levenberg-marquardt' library
  const lmOptions = {
    damping: 1.5,
    gradientDifference: 1e-6,
    maxIterations: 100,
    errorTolerance: 1e-6,
  }

  // Return distance in meters
  function rssiToDistance(rssi) {
    const { oneMeterRssi, propagationFactor } = calibrationRssi

    // Conversion formula
    return Math.pow(10, (oneMeterRssi - rssi) / (10 * propagationFactor))
  }

  console.log(`Place: ${name} - ${width}m x ${height}m`)

  // ESP32 positions definition
  const espPositionsMap = JSON.parse(place.esp_positions)
  const knownEspIds = Object.keys(espPositionsMap)

  // Fetch the latest readings of the specific tag
  const recentReadings = await prisma.readings.findMany({
    where: {
      devicesMac_address: macAddress,
      esp32: { in: knownEspIds }, // Filter only known ESPs
      place_name: placeName,
    },
    orderBy: { read_at: 'desc' },
    take: 50, // Reasonable buffer to ensure latest readings from each ESP
  })

  // Get the most recent RSSI from each ESP
  const latestRssiPerEsp = new Map()
  for (const reading of recentReadings) {
    if (!latestRssiPerEsp.has(reading.esp32)) {
      // The 'Readings' schema defines 'rssi' as Int, no need for parseFloat or trim
      latestRssiPerEsp.set(reading.esp32, reading.rssi)
    }
  }

  // Build list of active sensors
  const activeEsps = []
  for (const [espID, rssi] of latestRssiPerEsp.entries()) {
    activeEsps.push({
      espID,
      rssi,
      position: espPositionsMap[espID],
    })
  }

  // Critical validation: algorithm requires at least 3 points
  if (activeEsps.length < 3) {
    throw new Error(
      `Less than 3 active ESPs detected (detected: ${activeEsps.length}) - Impossible to triangulate.`
    )
  }

  console.log(
    `Active ESPs: ${activeEsps.length} `,
    activeEsps.map((e) => `${e.espID} (RSSI: ${e.rssi})`).join(', ')
  )

  // Prepare data for Levenberg-Marquardt - the algorithm expects data vectors
  const distances = activeEsps.map((esp) => rssiToDistance(esp.rssi))
  const sensorPositions = activeEsps.map((esp) => esp.position)

  // 'data.x' are just indexes (0, 1, 2, ...)
  // 'data.y' are the calculated distances (in meters)
  const data = {
    x: Array.from({ length: distances.length }, (_, i) => i),
    y: distances,
  }

  // Function that LM will try to fit
  // Calculates Euclidean distance from (posX, posY)
  // to sensor at position `sensorPositions[sensorIndex]`
  function trilaterationModel([posX, posY]) {
    return function (sensorIndex) {
      const pos = sensorPositions[sensorIndex]
      if (!pos) {
        // Safety check, should not happen
        throw new Error(`Sensor position ${sensorIndex} not found.`)
      }
      return Math.sqrt(Math.pow(posX - pos.x, 2) + Math.pow(posY - pos.y, 2))
    }
  }

  let initialGuess = null
  // Configure and run the algorithm
  // Define initial guess. If not provided, use the center of the room
  // Using last known position (initialGuess) speeds up convergence
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

  // Run the calculation using 'levenbergMarquardt'
  const fit = levenbergMarquardt(data, trilaterationModel, options)
  const [x, y] = fit.parameterValues

  console.log(
    `[TRILATERATION] Calculated position: [${x.toFixed(2)}, ${y.toFixed(
      2
    )}] - ${placeName}`
  )

  // Return a clean object with position and calculation data
  return {
    x,
    y,
    place: placeName,
    used: activeEsps.map((esp, i) => ({
      espID: esp.espID,
      rssi: esp.rssi,
      estimated_distance: distances[i], // Distance used in calculation
    })),
  }
}
