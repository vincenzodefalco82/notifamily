import { Router } from 'express'
import { db } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res) => {
  try {
    const items = await db.worker.findMany({
      where: { householdId: req.user.householdId },
      include: { property: true },
      orderBy: { createdAt: 'asc' }
    })
    res.json(items)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, role, hoursWeek, hourlyGross, monthlyNet, inpsMonthly, tfrAccrual, nextSalaryDue, nextInpsDue, startDate, propertyId } = req.body
    const item = await db.worker.create({
      data: {
        householdId: req.user.householdId,
        firstName, lastName, role: role || 'colf',
        hoursWeek: parseInt(hoursWeek) || 20,
        hourlyGross: parseFloat(hourlyGross),
        monthlyNet: parseFloat(monthlyNet),
        inpsMonthly: parseFloat(inpsMonthly),
        tfrAccrual: parseFloat(tfrAccrual) || 0,
        nextSalaryDue: new Date(nextSalaryDue),
        nextInpsDue: new Date(nextInpsDue),
        startDate: new Date(startDate),
        propertyId: propertyId || null
      }
    })
    res.status(201).json(item)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.patch('/:id', async (req, res) => {
  try {
    const { firstName, lastName, role, hoursWeek, hourlyGross, monthlyNet, inpsMonthly, tfrAccrual, nextSalaryDue, nextInpsDue, startDate, propertyId } = req.body
    const item = await db.worker.update({
      where: { id: req.params.id, householdId: req.user.householdId },
      data: {
        firstName, lastName, role,
        hoursWeek: hoursWeek ? parseInt(hoursWeek) : undefined,
        hourlyGross: hourlyGross ? parseFloat(hourlyGross) : undefined,
        monthlyNet: monthlyNet ? parseFloat(monthlyNet) : undefined,
        inpsMonthly: inpsMonthly ? parseFloat(inpsMonthly) : undefined,
        tfrAccrual: tfrAccrual ? parseFloat(tfrAccrual) : undefined,
        nextSalaryDue: nextSalaryDue ? new Date(nextSalaryDue) : undefined,
        nextInpsDue: nextInpsDue ? new Date(nextInpsDue) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        propertyId: propertyId || null
      }
    })
    res.json(item)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.delete('/:id', async (req, res) => {
  try {
    await db.worker.delete({ where: { id: req.params.id, householdId: req.user.householdId } })
    res.status(204).send()
  } catch (err) { res.status(500).json({ error: err.message }) }
})

export default router
