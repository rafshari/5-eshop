import mongoose from 'mongoose'
import colors from 'colors'


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.skexl.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`
    , {
      useUnifiedTopology: true,
      useNewUrlParser: true ,
      autoIndex: true,
    })
    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline)
  } catch (error) {
    console.error(`Error:${error.message}`.red.underline.bold)
    process.exit(1)
  }
}

export default connectDB
