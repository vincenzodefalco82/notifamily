import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { db } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const storage = multer.diskStorage({
  destination: '/uploads',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
})
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } })

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res) => {
  try {
    const items = await db.document.findMany({ where: { householdId: req.user.householdId }, orderBy: { uploadedAt: 'desc' } })
    res.json(items)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { type, linkedTo } = req.body
    const name = req.file?.originalname || req.body.name || 'documento'
    const size = req.file?.size || 0
    const item = await db.document.create({
      data: {
        householdId: req.user.householdId,
        name, type: type || 'contract',
        size, linkedTo: linkedTo || null
      }
    })
    res.status(201).json(item)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.delete('/:id', async (req, res) => {
  try {
    await db.document.delete({ where: { id: req.params.id, householdId: req.user.householdId } })
    res.status(204).send()
  } catch (err) { res.status(500).json({ error: err.message }) }
})

export default router
