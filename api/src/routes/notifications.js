import { Router } from 'express'
import { db } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res) => {
  try {
    const items = await db.notification.findMany({
      where: { householdId: req.user.householdId },
      orderBy: { at: 'desc' },
      take: 50
    })
    res.json(items)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/:id/read', async (req, res) => {
  try {
    await db.notification.update({ where: { id: req.params.id, householdId: req.user.householdId }, data: { unread: false } })
    res.status(204).send()
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/read-all', async (req, res) => {
  try {
    await db.notification.updateMany({ where: { householdId: req.user.householdId }, data: { unread: false } })
    res.status(204).send()
  } catch (err) { res.status(500).json({ error: err.message }) }
})

export default router
