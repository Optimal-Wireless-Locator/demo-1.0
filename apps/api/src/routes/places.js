import { Router } from 'express'
import { createPlace } from '../modules/places/create.js'
import { deletePlace } from '../modules/places/delete.js'
import { getPlace } from '../modules/places/get.js'
import { getAllPlaces } from '../modules/places/getAll.js'
import { updatePlace } from '../modules/places/update.js'

const router = Router()

/**
 * @swagger
 * /places:
 *   post:
 *     tags: [Places]
 *     summary: Cria um novo local (mapa)
 *     description: Adiciona um novo local, calcula e armazena as posições dos ESP32 automaticamente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Escritório Principal"
 *               width:
 *                 type: number
 *                 format: float
 *                 example: 20.5
 *               height:
 *                 type: number
 *                 format: float
 *                 example: 15.0
 *               one_meter_rssi:
 *                 type: number
 *                 format: float
 *                 example: -45.5
 *               propagation_factor:
 *                 type: number
 *                 format: float
 *                 example: 2.1
 *             required:
 *               - name
 *               - width
 *               - height
 *               - one_meter_rssi
 *               - propagation_factor
 *     responses:
 *       201:
 *         description: Retorna o objeto do local.
 *       400:
 *         description: Erro de validação (ZodError) ou A place with this name already exists.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/places', createPlace)

/**
 * @swagger
 * /places:
 *   get:
 *     tags: [Places]
 *     summary: Lista todos os locais (mapas)
 *     description: Retorna um array com todos os locais cadastrados.
 *     responses:
 *       200:
 *         description: Lista de locais retornada com sucesso.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/places', getAllPlaces)

/**
 * @swagger
 * /places/{name}:
 *   get:
 *     tags: [Places]
 *     summary: Busca um local (mapa) único
 *     description: Retorna um local específico com base no seu nome (que é único).
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *           example: "Escritório Principal"
 *         description: O nome do local a ser buscado.
 *     responses:
 *       200:
 *         description: Local encontrado e retornado.
 *       404:
 *         description: "Place not found."
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/places/:name', getPlace)

/**
 * @swagger
 * /places/{name}:
 *   patch:
 *     tags: [Places]
 *     summary: Atualiza um local (mapa)
 *     description: Atualiza os dados de um local. Pelo menos um campo deve ser fornecido. (Não atualiza largura/altura para evitar recálculo de ESPs).
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *           example: "Escritório Principal"
 *         description: O nome do local a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Escritório Andar 2"
 *               one_meter_rssi:
 *                 type: number
 *                 format: float
 *                 example: -46.0
 *               propagation_factor:
 *                 type: number
 *                 format: float
 *                 example: 2.2
 *     responses:
 *       200:
 *         description: Retorna o objeto atualizado.
 *       400:
 *         description: Erro de validação (ZodError) ou Fill in at least one field.
 *       404:
 *         description: "Place not found."
 *       500:
 *         description: Erro interno do servidor.
 */
router.patch('/places/:name', updatePlace)

/**
 * @swagger
 * /places/{name}:
 *   delete:
 *     tags: [Places]
 *     summary: Remove um local (mapa)
 *     description: Deleta um local do banco de dados com base no seu nome.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *           example: "Escritório Principal"
 *         description: O nome do local a ser deletado.
 *     responses:
 *       204:
 *         description: Local removido.
 *       404:
 *         description: "Place not found."
 *       500:
 *         description: Erro ao remover o local.
 */
router.delete('/places/:name', deletePlace)

export const placesRoutes = router
