import mongoose from 'mongoose'
const paymentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },

    amount: {
      type: Number,
      required: false,
      default: 0,
    },
    orderId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },

    resnumber: {
      type: String,
      required: false,
    },
    chargeAt: {
      type: Date,
    },
    payment: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const Payment = mongoose.model('Payment', paymentSchema)

export default Payment
