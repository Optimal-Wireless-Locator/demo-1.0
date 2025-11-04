import { Router } from 'express'
import { createReading } from '../modules/readings/create.js' // Lembre do .js

const router = Router()

/**
 * @swagger
 * /readings:
 *   post:
 *     tags: [Readings]
 *     summary: Cria uma nova leitura de RSSI enviada por um ESP32
 *     description: Recebe uma leitura contendo MAC address da tag, RSSI e ID do ESP32. Valida os dados, verifica se o dispositivo existe e salva no banco.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               m:
 *                 type: string
 *                 example: "aa:bb:cc:11:22:33"
 *               r:
 *                 type: string
 *                 example: "-70"
 *               espID:
 *                 type: string
 *                 example: "ESP32_1"
 *               t:
 *                 type: string
 *                 example: "14:27:53"
 *             required:
 *               - m
 *               - r
 *               - espID
 *     responses:
 *       201:
 *         description: Leitura criada.
 *       400:
 *         description: Dados inválidos (ZodError) ou RSSI inválido.
 *       404:
 *         description: "Device not found."
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/readings', createReading)

export const readingsRoutes = router
