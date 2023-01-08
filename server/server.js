import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
//import colors from 'colors'
import productRoutes from './routes/productsRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRouts.js'
import payRoutes from './routes/payRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import cors from 'cors'
import morgan from 'morgan'

dotenv.config()
connectDB()

const app = express()
if (process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'))
}
app.use(cors())


app.use(express.json())


app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/payment', payRoutes)
app.get('/api/config/zarinpal', (req, res) =>
  res.send(process.env.ZARIN_PAL_MERCHANT_ID)
)


const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.use(notFound)
app.use(errorHandler)


const chosenDriver = 'zarinpal'
app.get('/payorder', async (req, res) => {
  try {
      const driver = getPaymentDriver(chosenDriver, monopayConfiguration[chosenDriver]);

      const paymentInfo = await driver.requestPayment({
          amount: 20000,
          callbackUrl: process.env.APP_URL + '/callback',
      })

      // Store the payment info in a database //

      res.send(`<html>
      <body>
          <h1> We're redirecting you to the payment gateway... </h1>
          <script>${paymentInfo.getScript()}</script>
      </body>
      </html>`)
  } catch (e) {
      console.log(e.message)
  }
})

/**
* The callback URL that was given to `requestPayment` 
*/
app.all('/callback', async (req, res) => {
  try {
      const driver = getPaymentDriver(chosenDriver, monopayConfiguration[chosenDriver])

      // Get the payment info from database //

      const receipt = await driver.verifyPayment({
          amount: 2000, // from database
          referenceId: 1234 // from database
      }, { ...req.query, ...req.body }); // support both GET and POST

      res.json({
          referenceId: receipt.referenceId, // Is probably null if you're using sandbox
          success: true,
      })
  } catch (e) {
      console.log(e.message)
  }
})


const PORT = process.env.PORT || 5000
app.listen(
  PORT,
  console.log(
    `server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
