import { Router } from 'express'
import { getCurrentLocation } from '../modules/locations/current/location.js'
import { getHistoricLocation } from '../modules/locations/historic/location.js'

const router = Router()

/**
 * @swagger
 * /locations/current:
 *   post:
 *     tags: [Locations]
 *     summary: Calcula e retorna a localização atual de uma tag
 *     description: Executa a trilateração para um dispositivo (tag) em um local (mapa) específico. Salva o resultado no histórico e o retorna.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               macAddress:
 *                 type: string
 *                 example: "aa:bb:cc:11:22:33"
 *               placeName:
 *                 type: string
 *                 example: "Escritório Principal"
 *             required:
 *               - macAddress
 *               - placeName
 *     responses:
 *       200:
 *         description: Localização calculada.
 *       400:
 *         description: Erro de validação (ZodError).
 *       404:
 *         description: Device not found. ou Place not found.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/locations/current', getCurrentLocation)

/**
 * @swagger
 * /locations/historic/{macAddress}:
 *   get:
 *     tags: [Locations]
 *     summary: Busca o histórico de localizações de uma tag
 *     description: Retorna um array com todo o histórico de posições (x, y) de um dispositivo, ordenado por data.
 *     parameters:
 *       - in: path
 *         name: macAddress
 *         required: true
 *         schema:
 *           type: string
 *           example: "aa:bb:cc:11:22:33"
 *         description: O MAC address do dispositivo a ser buscado.
 *     responses:
 *       200:
 *         description: Histórico retornado.
 *       404:
 *         description: "Device not found."
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/locations/historic/:macAddress', getHistoricLocation)

export const locationsRoutes = router
