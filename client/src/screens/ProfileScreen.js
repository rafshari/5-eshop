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
        <h2>?????????????? ??????????</h2>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {success && (
          <Message variant='success'>?????????????? ?????????????????? ????</Message>
        )}
        {loading && <Loader />}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>?????? ?? ?????? ????????????????</Form.Label>
            <Form.Control
              type='name'
              placeholder='?????? ?? ?????? ???????????????? ?????? ???? ???????? ????????'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='mobile'>
            <Form.Label> ?????????? ?????????? </Form.Label>
            <Form.Control
              type='mobile'
              placeholder='?????????? ?????????? '
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            ></Form.Control>
          </Form.Group>


          <Form.Group controlId='email'>
            <Form.Label>???????? ??????????</Form.Label>
            <Form.Control
              type='email'
              placeholder='?????????? ?????? ????  ???????? ????????'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='password'>
            <Form.Label>??????????</Form.Label>
            <Form.Control
              type='password'
              placeholder='?????????? ?????? ???? ???????? ????????'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='confirmPassword'>
            <Form.Label>?????????? ??????????</Form.Label>
            <Form.Control
              type='password'
              placeholder='?????????? ?????? ???? ???????? ???????? ????????'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary'>
            ??????????
          </Button>
          
        <h2>???????????? ????: {user.balance}</h2>
        <Form.Group controlId='credit'>
            <Form.Label>???????????? ????????????</Form.Label>
            <Form.Control
              type='number'
              placeholder='???????? ????????????'
              value={amount}
              onChange={payHandler}
            ></Form.Control>
          </Form.Group>
        <Button  type='submit' variant='primary'>
          ????????????
        </Button>
      
        </Form>
      </Col>
      <Col md={9}>
        <h2>?????????? ?????? ????:</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant='danger'>{errorOrders}</Message>
        ) : (
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>????</th>
                <th>??????????</th>
                <th>????????  (????????)</th>
                <th>???????????? ??????</th>
                <th>?????????? ??????</th>
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
                        ????????????
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
