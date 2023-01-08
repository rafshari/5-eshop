import React, { useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import { Link, useNavigate, useParams} from 'react-router-dom'
import { getOrderDetails, deliverOrder } from '../actions/orderActions'
import Loader from '../components/Loader'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants'
import commaNumber from 'comma-number'
//import { useReactToPrint } from 'react-to-print'
import {Miladi} from 'basic-shamsi'

const OrderScreen = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { orderId } = useParams()


  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  //const {user} = order
  //console.log(user)

  if (!loading) {
    //calculate
    order.itemsPrice = commaNumber(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
  }
  useEffect(() => {
      dispatch(getOrderDetails(orderId))
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
     }, [
    orderId,
    dispatch,
    userLogin,
    navigate,
    successPay,
    successDeliver,
    ])

  const PaymentRequestHandler = async (amount, userId, orderId) => {
    let params = {
      amount: order.totalPrice,
      userId: order.user._id,
      orderId: order._id,
    }
    const { data } = await axios.post('/api/payment', params)
    window.location.href = data
  }
  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }
  //const componentRef = useRef()
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  // })

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <Link to='/' className='btn btn-light my-3'>
        بازگشت
      </Link>
      <h1>سفارش: {order._id} </h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>ارسال به</h2>
              <p>
                {' '}
                <strong>نام و نام خانوادگی: </strong> {order.user.name}{' '}
              </p>
              <p>
                {' '}
                <strong>ایمیل: </strong>{' '}
                <a href={`mailto: ${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>آدرس: </strong>
                {order.shippingAddress.address},{order.shippingAddress.city},
                {order.shippingAddress.postalCode},
                {order.shippingAddress.country},
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  وضعیت: تحویل شد {Miladi.toShamsi(order.deliveredAt)}
                </Message>
              ) : (
                <Message variant='danger'>وضعیت: تحویل نشده </Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>روش پرداخت</h2>
              <p>
                <strong>روش: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>
                  وضعیت: پرداخت شد {Miladi.toShamsi(order.paidAt)}
                </Message>
              ) : (
                <Message variant='danger'> وضعیت: پرداخت نشده</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2> محصولات شما:</h2>
              {order.orderItems.length === 0 ? (
                <Message>سفارش نداشته اید</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} ضرب در {commaNumber(item.price)} ={' '}
                          {commaNumber(item.qty * item.price)}
                          ریال
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>خلاصه سفارش</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>جمع</Col>
                  <Col>{commaNumber(order.itemsPrice)} ریال</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>هزینه ارسال</Col>
                  <Col>{commaNumber(order.shippingPrice)} ریال</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col> 9% مالیات برارزش افزوده </Col>
                  <Col>{commaNumber(order.taxPrice)} ریال</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>جمع کل:</Col>
                  <Col>{commaNumber(order.totalPrice)} ریال </Col>
                </Row>
              </ListGroup.Item>
              {loadingPay && <Loader />}
              {!order.isPaid && (
                <ListGroup.Item>
                  <Button
                    className='btn btn-block'
                    onClick={PaymentRequestHandler}
                    disabled={false}
                  >
                    پرداخت
                  </Button>
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverHandler}
                    >
                      تحویل شد
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
