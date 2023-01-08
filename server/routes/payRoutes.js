import express from 'express'
import { callback, zarinpal } from '../controllers/payController.js'
const router = express.Router()



router.route('/').post(zarinpal)
router.route('/callback').get(callback)

export default router
