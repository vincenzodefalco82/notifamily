import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../db.js'

const router = Router()

function makeToken(user) {
  return jwt.sign(
    { userId: user.id, householdId: user.householdId, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  )
}

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, householdName } = req.body
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const exists = await db.user.findUnique({ where: { email } })
    if (exists) return res.status(409).json({ error: 'Email already registered' })

    const passwordHash = await bcrypt.hash(password, 12)

    const tenant = await db.tenant.create({
      data: { name: householdName || `${firstName} ${lastName}` }
    })
    const household = await db.household.create({
      data: { name: householdName || `Famiglia ${lastName}`, tenantId: tenant.id }
    })
    const user = await db.user.create({
      data: { email, passwordHash, firstName, lastName, role: 'owner', householdId: household.id }
    })
    await db.member.create({
      data: {
        householdId: household.id,
        firstName, lastName,
        role: 'owner', relation: 'proprietario',
        email, color: 30
      }
    })

    res.status(201).json({ token: makeToken(user), user: { id: user.id, email, firstName, lastName, role: user.role, householdId: household.id } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await db.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    res.json({ token: makeToken(user), user: { id: user.id, email, firstName: user.firstName, lastName: user.lastName, role: user.role, householdId: user.householdId } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /auth/me
router.get('/me', async (req, res) => {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET)
    const user = await db.user.findUnique({ where: { id: payload.userId }, select: { id: true, email: true, firstName: true, lastName: true, role: true, householdId: true } })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
})

export default router
