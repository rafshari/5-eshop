import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { listMyOrders } from '../actions/orderActions'
import {Miladi} from 'basic-shamsi'
import commaNumber from 'comma-number'
import {pay} from '../actions/payActions'



const ProfileScreen = () => {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [amount, setAmount] = useState('')

  
  
  const dispatch = useDispatch()
  
  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails
  
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const { success } = userUpdateProfile
  
  const orderListMy = useSelector((state) => state.orderListMy)
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy
  
  const navigate = useNavigate()
  
  useEffect(() => {
     if (!userInfo) {
      navigate('/login')
    } else {
      if (!user.name) {
        dispatch(getUserDetails('profile'))
        dispatch(listMyOrders(user._id))
      } else {
        setName(user.name)
        setMobile(user.mobile)
        setEmail(user.email)
      }
    }
  }, [navigate, dispatch, userInfo, user, setAmount])

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(updateUserProfile({ id: user._id, name, mobile, email, password }))
    }
  }
  const payHandler = (e) =>{
    e.preventDefault()
    dispatch(pay(amount))
  }
  return (
    <Row>
      <Col md={3}>
        <h2>پروفایل کاربر</h2>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {success && (
          <Message variant='success'>پروفایل بروزرسانی شد</Message>
        )}
        {loading && <Loader />}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>نام و نام خانوادگی</Form.Label>
            <Form.Control
              type='name'
              placeholder='نام و نام خانوادگی خود را وارد کنید'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='mobile'>
            <Form.Label> شماره همراه </Form.Label>
            <Form.Control
              type='mobile'
              placeholder='شماره همراه '
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            ></Form.Control>
          </Form.Group>


          <Form.Group controlId='email'>
            <Form.Label>آدرس ایمیل</Form.Label>
            <Form.Control
              type='email'
              placeholder='ایمیل خود را  وارد کنید'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='password'>
            <Form.Label>پسورد</Form.Label>
            <Form.Control
              type='password'
              placeholder='پسورد خود را وارد کنید'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='confirmPassword'>
            <Form.Label>تایید پسورد</Form.Label>
            <Form.Control
              type='password'
              placeholder='پسورد خود را مجدد وارد کنید'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary'>
            ذخیره
          </Button>
          
        <h2>اعتبار من: {user.balance}</h2>
        <Form.Group controlId='credit'>
            <Form.Label>افزایش اعتبار</Form.Label>
            <Form.Control
              type='number'
              placeholder='مبلغ دلخواه'
              value={amount}
              onChange={payHandler}
            ></Form.Control>
          </Form.Group>
        <Button  type='submit' variant='primary'>
          پرداخت
        </Button>
      
        </Form>
      </Col>
      <Col md={9}>
        <h2>سفارش های من:</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant='danger'>{errorOrders}</Message>
        ) : (
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>کد</th>
                <th>تاریخ</th>
                <th>مبلغ  (ریال)</th>
                <th>پرداخت شده</th>
                <th>تحویل شده</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{Miladi.toShamsi(order.createdAt)}</td>
                  <td>{commaNumber(order.totalPrice)}</td>
                  <td>
                    {order.isPaid ? (
                      Miladi.toShamsi(order.paidAt)
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className='btn-sm' variant='light'>
                        جزئیات
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
     
    </Row>
  )
}

export default ProfileScreen
