import { Router } from 'express'
import { db } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res) => {
  try {
    const items = await db.contract.findMany({
      where: { householdId: req.user.householdId },
      include: { property: true, vehicle: true },
      orderBy: { nextDue: 'asc' }
    })
    res.json(items)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/', async (req, res) => {
  try {
    const { type, category, provider, clientCode, amountMonthly, billingCycle, nextDue, autopay, paymentMethod, propertyId, vehicleId } = req.body
    const item = await db.contract.create({
      data: {
        householdId: req.user.householdId,
        type, category: category || 'util', provider,
        clientCode: clientCode || null,
        amountMonthly: parseFloat(amountMonthly),
        billingCycle: billingCycle || 'monthly',
        nextDue: new Date(nextDue),
        autopay: autopay || false,
        paymentMethod: paymentMethod || null,
        propertyId: propertyId || null,
        vehicleId: vehicleId || null
      }
    })
    res.status(201).json(item)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.patch('/:id', async (req, res) => {
  try {
    const { type, category, provider, clientCode, amountMonthly, billingCycle, nextDue, autopay, paymentMethod, propertyId, vehicleId } = req.body
    const item = await db.contract.update({
      where: { id: req.params.id, householdId: req.user.householdId },
      data: {
        type, category, provider, clientCode,
        amountMonthly: amountMonthly ? parseFloat(amountMonthly) : undefined,
        billingCycle, nextDue: nextDue ? new Date(nextDue) : undefined,
        autopay, paymentMethod,
        propertyId: propertyId || null, vehicleId: vehicleId || null
      }
    })
    res.json(item)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.delete('/:id', async (req, res) => {
  try {
    await db.contract.delete({ where: { id: req.params.id, householdId: req.user.householdId } })
    res.status(204).send()
  } catch (err) { res.status(500).json({ error: err.message }) }
})

export default router
