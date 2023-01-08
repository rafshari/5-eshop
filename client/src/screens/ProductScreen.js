import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Meta from '../components/Meta'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  ListGroupItem,
  FormLabel,
} from 'react-bootstrap'
import {
  listProductDetails,
  createProductReview,
} from '../actions/productActions'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'
import commaNumber from 'comma-number'

const ProductScreen = () => {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  
  const dispatch = useDispatch()
  const { productId } = useParams()
  const navigate = useNavigate()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productCreateReview = useSelector((state) => state.productCreateReview)
  const { success: successProductReview, error: errorProductReview } =
    productCreateReview

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if(successProductReview){
      alert('با تشکر، دیدگاه شما ثبت شد...')
      setRating(0)
      setComment('')
      dispatch({type: PRODUCT_CREATE_REVIEW_RESET })
    }
      dispatch(listProductDetails(productId))
  }, [dispatch, productId, successProductReview, userInfo])

  const addToCardHandler = () => {
    navigate(`/cart/${productId}?qty=${qty}`)
    // console.log(productId)
    // console.log('اولی', qty)
  }
  const submitHandler = (e)=>{
    e.preventDefault()
    dispatch(createProductReview(productId,{
    
      rating,
      comment
    }))

  }
  return (
    <>
    <Meta title={product.name} />
      <Link to='/' className='btn btn-light my-3'>
        بازگشت
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'> {error} </Message>
      ) : (
        <>
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>{product.name}</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} دیدگاه `}
                  />
                </ListGroup.Item>
                <ListGroup.Item>قیمت: {commaNumber(product.price)}  ریال </ListGroup.Item>
                <ListGroup.Item>
                  توضیحات: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>قیمت:</Col>
                      <Col>
                        <strong> {commaNumber(product.price)} ریال </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>موجودی:</Col>
                      <Col>
                        {product.countInStock > 0 ? 'موجود' : 'موجود نیست'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>تعداد</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      onClick={addToCardHandler}
                      className='btn-block'
                      type='button'
                      disabled={product.countInStock === 0}
                    >
                       اضافه به سبد خرید 
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2>امتیاز و دیدگاه کاربران</h2>
              {product.reviews.length === 0 && <Message>   نظری ثبت نشده است</Message>}
              <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                  <ListGroupItem key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p> {review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroupItem>
                ))}
                <ListGroup.Item>
                  <h2> لطفا نظر دهید</h2>
                  {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId='rating'>
                        <FormLabel> امتیاز</FormLabel>
                        <Form.Control
                          as='select'
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>  یکی از این گزینه ها را انتخای کنید  </option>
                          <option value='1'>1 - ضعیف</option>
                          <option value='2'>2 - متوسط</option>
                          <option value='3'>3 - خوب</option>
                          <option value='3'>4 - خیلی خوب</option>
                          <option value='5'>5 - بسیار عالی</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId='comment'>
                        <Form.Label>دیدگاه</Form.Label>
                        <Form.Control
                          as='textarea'
                          row='3'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button type='submit' variant='primary'> ثبت</Button>
                    </Form>
                  ) : (
                    <Message>
                      لطفا <Link to='/login'> وارد شوید</Link> و نظر دهید
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default ProductScreen
