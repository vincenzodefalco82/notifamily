import { Router } from 'express'
import { db } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res) => {
  try {
    const hh = await db.household.findUnique({
      where: { id: req.user.householdId },
      include: { tenant: true }
    })
    res.json(hh)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.patch('/', async (req, res) => {
  try {
    const { name } = req.body
    const hh = await db.household.update({ where: { id: req.user.householdId }, data: { name } })
    res.json(hh)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

export default router
