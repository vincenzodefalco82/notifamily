import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import membersRoutes from './routes/members.js'
import propertiesRoutes from './routes/properties.js'
import contractsRoutes from './routes/contracts.js'
import workersRoutes from './routes/workers.js'
import eventsRoutes from './routes/events.js'
import budgetRoutes from './routes/budget.js'
import documentsRoutes from './routes/documents.js'
import notificationsRoutes from './routes/notifications.js'
import householdRoutes from './routes/household.js'

const app = express()
const PORT = process.env.PORT || 3100

app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }))
app.use(express.json())

app.get('/health', (_, res) => res.json({ ok: true, ts: new Date() }))
app.use('/auth', authRoutes)
app.use('/members', membersRoutes)
app.use('/properties', propertiesRoutes)
app.use('/contracts', contractsRoutes)
app.use('/workers', workersRoutes)
app.use('/events', eventsRoutes)
app.use('/budget', budgetRoutes)
app.use('/documents', documentsRoutes)
app.use('/notifications', notificationsRoutes)
app.use('/household', householdRoutes)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => console.log(`Notifamily API :${PORT}`))
