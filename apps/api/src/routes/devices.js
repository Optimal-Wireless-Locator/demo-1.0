import { Router } from 'express'
import { createDevice } from '../modules/devices/create.js'
import { deleteDevice } from '../modules/devices/delete.js'
import { getDevice } from '../modules/devices/get.js'
import { getAllDevices } from '../modules/devices/getAll.js'
import { updateDevice } from '../modules/devices/update.js'

const router = Router()

/**
 * @swagger
 * /devices:
 *   post:
 *     tags: [Devices]
 *     summary: Cria um novo dispositivo (tag)
 *     description: Adiciona um novo dispositivo (tag) ao sistema com base no MAC address e nome.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mac_address:
 *                 type: string
 *                 example: "aa:bb:cc:11:22:33"
 *               name:
 *                 type: string
 *                 example: "Tag de Teste 1"
 *             required:
 *               - mac_address
 *               - name
 *     responses:
 *       '201':
 *         description: Retorna o objeto do dispositivo.
 *       '400':
 *         description: Erro de validação (ZodError) ou A device with this MAC Adress already exists.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.post('/devices', createDevice)

/**
 * @swagger
 * /devices:
 *   get:
 *     tags: [Devices]
 *     summary: Lista todos os dispositivos (tags)
 *     description: Retorna um array com todos os dispositivos cadastrados.
 *     responses:
 *       200:
 *         description: Lista de dispositivos retornada.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/devices', getAllDevices)

/**
 * @swagger
 * /devices/{macAddress}:
 *   get:
 *     tags: [Devices]
 *     summary: Busca um dispositivo único
 *     description: Retorna um dispositivo específico com base no seu MAC address.
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
 *         description: Dispositivo encontrado e retornado.
 *       404:
 *         description: Device not found.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/devices/:macAddress', getDevice)

/**
 * @swagger
 * /devices/{macAddress}:
 *   patch:
 *     tags: [Devices]
 *     summary: Atualiza um dispositivo (tag)
 *     description: Atualiza o nome e/ou o MAC address de um dispositivo existente. Pelo menos um campo deve ser fornecido.
 *     parameters:
 *       - in: path
 *         name: macAddress
 *         required: true
 *         schema:
 *           type: string
 *           example: "aa:bb:cc:11:22:33"
 *         description: O MAC address do dispositivo a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mac_address:
 *                 type: string
 *                 example: "aa:bb:cc:11:22:33"
 *               name:
 *                 type: string
 *                 example: "Tag Sala de Reunião"
 *     responses:
 *       200:
 *         description: Retorna o objeto atualizado.
 *       400:
 *         description: Erro de validação (ZodError) ou Fill in at least one field.
 *       404:
 *         description: Device not found.
 *       500:
 *         description: Erro interno do servidor.
 */
router.patch('/devices/:macAddress', updateDevice)

/**
 * @swagger
 * /devices/{macAddress}:
 *   delete:
 *     tags: [Devices]
 *     summary: Remove um dispositivo (tag)
 *     description: Deleta um dispositivo do banco de dados com base no seu MAC address.
 *     parameters:
 *       - in: path
 *         name: macAddress
 *         required: true
 *         schema:
 *           type: string
 *           example: "aa:bb:cc:11:22:33"
 *         description: O MAC address do dispositivo a ser deletado.
 *     responses:
 *       204:
 *         description: Dispositivo removido.
 *       404:
 *         description: Device not found.
 *       500:
 *         description: Erro ao remover dispositivo.
 */
router.delete('/devices/:macAddress', deleteDevice)

export const devicesRoutes = router
