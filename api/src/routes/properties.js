import { Router } from 'express'
import { db } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

// --- Properties ---
router.get('/', async (req, res) => {
  try {
    const items = await db.property.findMany({ where: { householdId: req.user.householdId }, orderBy: { createdAt: 'asc' } })
    res.json(items)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/', async (req, res) => {
  try {
    const { name, type, address, size, rooms } = req.body
    const item = await db.property.create({
      data: { householdId: req.user.householdId, name, type: type || 'home', address: address || null, size: size ? parseFloat(size) : null, rooms: rooms ? parseInt(rooms) : null }
    })
    res.status(201).json(item)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.patch('/:id', async (req, res) => {
  try {
    const { name, type, address, size, rooms } = req.body
    const item = await db.property.update({
      where: { id: req.params.id, householdId: req.user.householdId },
      data: { name, type, address, size: size ? parseFloat(size) : null, rooms: rooms ? parseInt(rooms) : null }
    })
    res.json(item)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.delete('/:id', async (req, res) => {
  try {
    await db.property.delete({ where: { id: req.params.id, householdId: req.user.householdId } })
    res.status(204).send()
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// --- Vehicles ---
router.get('/vehicles', async (req, res) => {
  try {
    const items = await db.vehicle.findMany({ where: { householdId: req.user.householdId }, include: { owner: true }, orderBy: { createdAt: 'asc' } })
    res.json(items)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/vehicles', async (req, res) => {
  try {
    const { brand, model, plate, ownerId, insuranceEnd } = req.body
    const item = await db.vehicle.create({
      data: { householdId: req.user.householdId, brand, model, plate, ownerId: ownerId || null, insuranceEnd: insuranceEnd ? new Date(insuranceEnd) : null }
    })
    res.status(201).json(item)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.patch('/vehicles/:id', async (req, res) => {
  try {
    const { brand, model, plate, ownerId, insuranceEnd } = req.body
    const item = await db.vehicle.update({
      where: { id: req.params.id, householdId: req.user.householdId },
      data: { brand, model, plate, ownerId: ownerId || null, insuranceEnd: insuranceEnd ? new Date(insuranceEnd) : null }
    })
    res.json(item)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.delete('/vehicles/:id', async (req, res) => {
  try {
    await db.vehicle.delete({ where: { id: req.params.id, householdId: req.user.householdId } })
    res.status(204).send()
  } catch (err) { res.status(500).json({ error: err.message }) }
})

export default router
