import { Router } from 'express'
import { db } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res) => {
  try {
    const { period } = req.query
    const where = { householdId: req.user.householdId }
    if (period === 'month') {
      const now = new Date()
      where.date = { gte: new Date(now.getFullYear(), now.getMonth(), 1), lt: new Date(now.getFullYear(), now.getMonth() + 1, 1) }
    }
    const items = await db.transaction.findMany({ where, orderBy: { date: 'desc' } })
    res.json(items)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.get('/summary', async (req, res) => {
  try {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    const items = await db.transaction.findMany({
      where: { householdId: req.user.householdId, date: { gte: start, lt: end } }
    })
    const income = items.filter(t => t.kind === 'income').reduce((s, t) => s + t.amount, 0)
    const outflow = items.filter(t => t.kind === 'outflow').reduce((s, t) => s + t.amount, 0)
    res.json({ income, outflow, balance: income - outflow, count: items.length })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/', async (req, res) => {
  try {
    const { kind, amount, category, note, date, linkedTo } = req.body
    const item = await db.transaction.create({
      data: {
        householdId: req.user.householdId,
        kind, amount: parseFloat(amount),
        category, note: note || null,
        date: new Date(date),
        linkedTo: linkedTo || null
      }
    })
    res.status(201).json(item)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.patch('/:id', async (req, res) => {
  try {
    const { kind, amount, category, note, date } = req.body
    const item = await db.transaction.update({
      where: { id: req.params.id, householdId: req.user.householdId },
      data: { kind, amount: amount ? parseFloat(amount) : undefined, category, note, date: date ? new Date(date) : undefined }
    })
    res.json(item)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.delete('/:id', async (req, res) => {
  try {
    await db.transaction.delete({ where: { id: req.params.id, householdId: req.user.householdId } })
    res.status(204).send()
  } catch (err) { res.status(500).json({ error: err.message }) }
})

export default router
