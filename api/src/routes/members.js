import { Router } from 'express'
import { db } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res) => {
  try {
    const members = await db.member.findMany({ where: { householdId: req.user.householdId }, orderBy: { createdAt: 'asc' } })
    res.json(members)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, birthDate, role, relation, email, color } = req.body
    const member = await db.member.create({
      data: { householdId: req.user.householdId, firstName, lastName, birthDate: birthDate ? new Date(birthDate) : null, role: role || 'dependent', relation: relation || '', email: email || null, color: color ?? 220 }
    })
    res.status(201).json(member)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.patch('/:id', async (req, res) => {
  try {
    const { firstName, lastName, birthDate, role, relation, email, color } = req.body
    const member = await db.member.update({
      where: { id: req.params.id, householdId: req.user.householdId },
      data: { firstName, lastName, birthDate: birthDate ? new Date(birthDate) : null, role, relation, email, color }
    })
    res.json(member)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.delete('/:id', async (req, res) => {
  try {
    await db.member.delete({ where: { id: req.params.id, householdId: req.user.householdId } })
    res.status(204).send()
  } catch (err) { res.status(500).json({ error: err.message }) }
})

export default router
