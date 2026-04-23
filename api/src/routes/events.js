import { Router } from 'express'
import { db } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res) => {
  try {
    const { from, to, category } = req.query
    const where = { householdId: req.user.householdId }
    if (from || to) where.date = {}
    if (from) where.date.gte = new Date(from)
    if (to) where.date.lte = new Date(to)
    if (category) where.category = category
    const items = await db.event.findMany({ where, orderBy: { date: 'asc' } })
    res.json(items)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/', async (req, res) => {
  try {
    const { title, category, amount, date, recurring, autopay, sourceType, sourceId } = req.body
    const item = await db.event.create({
      data: {
        householdId: req.user.householdId,
        title, category: category || 'family',
        amount: amount ? parseFloat(amount) : null,
        date: new Date(date),
        recurring: recurring || null,
        autopay: autopay || false,
        sourceType: sourceType || null,
        sourceId: sourceId || null
      }
    })
    res.status(201).json(item)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.patch('/:id', async (req, res) => {
  try {
    const { title, category, amount, date, recurring, autopay } = req.body
    const item = await db.event.update({
      where: { id: req.params.id, householdId: req.user.householdId },
      data: {
        title, category,
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        date: date ? new Date(date) : undefined,
        recurring, autopay
      }
    })
    res.json(item)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.delete('/:id', async (req, res) => {
  try {
    await db.event.delete({ where: { id: req.params.id, householdId: req.user.householdId } })
    res.status(204).send()
  } catch (err) { res.status(500).json({ error: err.message }) }
})

export default router
