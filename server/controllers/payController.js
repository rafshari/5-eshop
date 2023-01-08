import Payment from '../models/paymentModel.js'
import User from '../models/userModel.js'
import Order from '../models/orderModel.js'
import asyncHandler from 'express-async-handler'
import axios from 'axios'

// @desc    Payment for OrderId by zarinpal
// @route   POST /api/payment
// @access  private
const zarinpal = asyncHandler(async (req, res) => {
  //////////////////////////1- intent /////////////////////////
  let params = {
    merchant_id: process.env.ZARIN_PAL_MERCHANT_ID,
    amount: req.body.amount,
    callback_url:
      'https://eshopclient-eshop.apps.ir-thr-ba1.arvanpaas.ir/api/payment/callback',
    description: 'افزایش اعتبار حساب کاربری ',
    metadata: [{ orderId: req.body.orderId }],
    order_id: req.body.orderId,
  }
  const response = await axios.post(
    'https://api.zarinpal.com/pg/v4/payment/request.json',
    params
  )
  //console.log(params.metadata)
  //console.log(response.data.data.code)
  /////////////////////////////////////////////2-get Authority ///////////////////////////////
  if (response.data.data.code === 100) {
    const payment = await Payment.create({
      user: req.body.userId,
      amount: req.body.amount,
      orderId: req.body.orderId,
      resnumber: response.data.data.authority,
    })
    /////////////////////////3- start  redirect user to IPG //////////////////////////////////////////////////////////
    res.send(
      `https://www.zarinpal.com/pg/StartPay/${response.data.data.authority}`
    )
  } else {
    res.status(404)
    throw new Error('قطع است')
  }
})
//////////////////////////////////4- call callback by zarinpal ///////////////////////
const callback = async (req, res, next) => {
  console.log('2:', req.query)
  try {
    let payment = await Payment.findOne({ resnumber: req.query.Authority })
    console.log('3:', payment)
    if (!payment) return res.send('همچین تراکنشی وجود ندارد')
    if (req.query.Status && req.query.Status !== 'OK') {
      return res.redirect(
        `https://eshopclient-eshop.apps.ir-thr-ba1.arvanpaas.ir/order/${payment.orderId}`
      )
    }
    /////////////  5- verification ///////////////////////////////////////////
    let params = {
      merchant_id: process.env.ZARIN_PAL_MERCHANT_ID,
      amount: payment.amount,
      authority: req.query.Authority,
    }
    console.log('4:', params)
    const receipt = await axios.post(
      'https://api.zarinpal.com/pg/v4/payment/verify.json',
      params
    )
    console.log('5:', receipt)
    ///////////////////////////  6- Update dataBase about Payment Done ////////////
    if (receipt.status === 200) {
      let balance = payment.amount
      let user = await User.findById(payment.user)
      if (user.balance) {
        balance += user.balance
      }
      user.balance = balance
      payment.payment = true
      const updatedPayment = await payment.save()
      const updatedUser = await user.save()
      console.log('6:', payment)
      //   //////////////////////////////// update orderToPaid////////////////////////////
      let order = await Order.findById(payment.orderId)
      if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
          code: receipt.data.data.code,
          ref_id: receipt.data.data.ref_id,
        }
        const updatedOrder = await order.save()
        //////////////// redirect user ///////////////////////////////////
        res.redirect(
          `https://eshopclient-eshop.apps.ir-thr-ba1.arvanpaas.ir/order/${payment.orderId}`
        )
        console.log('7:', payment.orderId)
        console.log('8:', updatedOrder)
        console.log('9:', order.paymentResult)
      }
    } else {
      res.send('تراکنش ناموفق')
      res.redirect(
        `https://eshopclient-eshop.apps.ir-thr-ba1.arvanpaas.ir/order/${payment.orderId}`
      )
    }
  } catch (err) {
    next(err)
  }
}
// @desc    Payment for ewallet by zarinpal
// @route   POST /api/ewalletpay
// @access  private
const payReqByZarinpal = asyncHandler(async (req, res) => {
  //////////////////////////1- intent /////////////////////////
  let params = {
    merchant_id: process.env.ZARIN_PAL_MERCHANT_ID,
    amount: req.body.amount,
    userId: req.body.userId,

    callback_url:
      'https://eshopclient-eshop.apps.ir-thr-ba1.arvanpaas.ir/api/payment/callback',
    description: 'افزایش اعتبار حساب کاربری ',
    metadata: [{ userId }],
  }
  const response = await axios.post(
    'https://api.zarinpal.com/pg/v4/payment/request.json',
    params
  )
  //console.log(params.metadata)
  //console.log(response.data.data.code)
  /////////////////////////////////////////////2-get Authority ///////////////////////////////
  if (response.data.data.code === 100) {
    const payment = await Payment.create({
      user: req.body.userId,
      amount: req.body.amount,
      orderId: req.body.orderId,
      resnumber: response.data.data.authority,
    })
    /////////////////////////3- start  redirect user to IPG //////////////////////////////////////////////////////////
    res.send(
      `https://www.zarinpal.com/pg/StartPay/${response.data.data.authority}`
    )
  } else {
    res.status(404)
    throw new Error('قطع است')
  }
})
//////////////////////////////////4- call callback by zarinpal ///////////////////////
const callbackZarinpal = async (req, res, next) => {
  console.log('2:', req.query)
  try {
    let payment = await Payment.findOne({ resnumber: req.query.Authority })
    console.log('3:', payment)
    if (!payment) return res.send('همچین تراکنشی وجود ندارد')
    if (req.query.Status && req.query.Status !== 'OK') {
      return res.redirect(
        `https://eshopclient-eshop.apps.ir-thr-ba1.arvanpaas.ir/pay/${userId}`
      )
    }
    /////////////  5- verification ///////////////////////////////////////////
    let params = {
      merchant_id: process.env.ZARIN_PAL_MERCHANT_ID,
      amount: payment.amount,
      authority: req.query.Authority,
    }
    console.log('4:', params)
    const receipt = await axios.post(
      'https://api.zarinpal.com/pg/v4/payment/verify.json',
      params
    )
    console.log('5:', receipt)
    ///////////////////////////  6- Update dataBase about Payment Done ////////////
    if (receipt.status === 200) {
      let balance = payment.amount
      let user = await User.findById(payment.user)
      if (user.balance) {
        balance += user.balance
      }
      user.balance = balance
      payment.payment = true
      const updatedPayment = await payment.save()
      const updatedUser = await user.save()
      console.log('6:', payment)
      //   //////////////////////////////// update orderToPaid////////////////////////////
      let order = await Order.findById(payment.orderId)
      if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
          code: receipt.data.data.code,
          ref_id: receipt.data.data.ref_id,
        }
        const updatedOrder = await order.save()
        //////////////// redirect user ///////////////////////////////////
        res.redirect(
          `https://eshopclient-eshop.apps.ir-thr-ba1.arvanpaas.ir/order/${payment.orderId}`
        )
        console.log('7:', payment.orderId)
        console.log('8:', updatedOrder)
        console.log('9:', order.paymentResult)
      }
    } else {
      res.send('تراکنش ناموفق')
      res.redirect(
        `https://eshopclient-eshop.apps.ir-thr-ba1.arvanpaas.ir/order/${payment.orderId}`
      )
    }
  } catch (err) {
    next(err)
  }
}

export { zarinpal, callback, payReqByZarinpal, callbackZarinpal }
