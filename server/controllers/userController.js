import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import axios from 'axios'

// @desc    Auth user get token
// @route   POST /api/users/login
// @access  public

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      balance:user.balance,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('ایمیل یا رمز عبور درست نیست')
  }
})
// @desc   otp
// @route   POST /api/users/otp
// @access  public

////////// ارسال موبایل برای دریافت کد تایید
const otpUser = asyncHandler(async (req, res) => {
  const { mobile } = req.body
  const user = await User.findOne({ mobile })
 

  const params = JSON.stringify({
    Mobile: mobile,
    Footer: 'دیجی',
  })
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic cmFmc2hhcmk6cGFzc3dvcmRA',
    },
  }
  const response = await axios.post(
    'http://smspanel.trez.ir/api/smsAPI/SendAutoCode',
    params,
    config
  )
  console.log(response.status)
  if (!user) {
    res.redirect('لطفا ابتدا ثبت نام کنید')
  }else {
   if (!response.status === 200){
      res.status(404)
    throw new Error('لطفا مجدد تلاش کنید')
    }
  else {
    res.send(true)
   }
  }
})

//////      چک کردن کد دریافتی
const authUserOtp = asyncHandler(async (req, res) => {
  const { mobile, code } = req.body
  const user = await User.findOne({ mobile })
  console.log('1:', mobile, code)
  var data = JSON.stringify({
    Mobile: mobile,
    code: code,
  })
  var config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic cmFmc2hhcmk6cGFzc3dvcmRA',
    },
  }
  let result = await axios.post(
    'http://smspanel.trez.ir/api/smsAPI/CheckSendCode',
    data,
    config
  )
  console.log('2:', result.data)
  console.log('3:', user)
  if (result.data) {
    res.json({
      _id: user._id,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      balance: user.balance,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
    console.log(
      '4:',
      `Code ${code} for this number ${mobile} is valid and verified.`
    )
  } else {
    res.status(404)
    throw new Error('کد مربوطه درست نیست')
    console.log('6:', 'کد مربوط به این شماره درست نیست')
  }
})

// @desc    Get user profile
// @route   GET /users/profile
// @access  private

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      balance: user.balance,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('پسورد یا ایمیل درست نیست')
  }
})
// @desc    Update user profile
// @route   PUT api/users/profile
// @access  private

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    user.name = req.body.name || user.name
    user.mobile = req.body.mobile || user.mobile
    user.email = req.body.email || user.email

    if (req.body.password) {
      user.password = req.body.password
    }
    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      mobile: updatedUser.mobile,
      email: updatedUser.email,
      balance: user.balance,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  public

const registerUser = asyncHandler(async (req, res) => {
  const { name, mobile, email, password } = req.body
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('این ایمیل قبلا موجود است')
  }
  const user = await User.create({
    name,
    mobile,
    email,
    password,
     })
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      balance: user.balance,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('اطلاعات کاربر درست نیست')
  }
})
// @desc    Get all users
// @route   GET /api/users
// @access  private/Admin

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})
// @desc    Delete  user
// @route   DELETE /api/users/:id
// @access  private/Admin

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    await user.remove(res.json({ message: 'User removed' }))
  } else {
    res.status(404)
    throw new Error('کاربر یافت نشد')
  }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  private/Admin

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  console.log(user)
  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('کاربر یافت نشد')
  }
})

// @desc    Update user
// @route   PUT /users/:id
// @access  private/admin

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    user.name = req.body.name || user.name
    user.mobile = req.body.mobile || user.mobile
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      mobile: updatedUser.mobile,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('کاربر یافت نشد')
  }
})

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  otpUser,
  authUserOtp,
}
