import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {  Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'
import commaNumber from 'comma-number'


const ProductEditScreen = () => {
  const { productId } = useParams()
  // console.log(productId)

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [uploading, setUploading] = useState(false)

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

  const navigate = useNavigate()

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      navigate('/admin/productlist')
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId))
      } else {
        setName(product.name)
        setPrice(product.price)
        setBrand(product.brand)
        setCategory(product.category)
        setImage(product.image)
        setCountInStock(product.countInStock)
        setDescription(product.description)
      }
    }
  }, [dispatch, navigate, productId, product, successUpdate])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      const { data } = await axios.post('/api/upload', formData, config)
      setImage(data)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }
  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      })
    )
  }

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        بازگشت
      </Link>

      <FormContainer>
        <h1>ویرایش محصول</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label> عنوان محصول</Form.Label>
              <Form.Control
                type='name'
                placeholder='نام محصول را وارد کنید'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='price'>
              <Form.Label>قیمت</Form.Label>

              <Form.Control
                type='number'
                placeholder='قیمت را وارد کنید'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
              <Form.Text>{commaNumber(price)} ریال</Form.Text>
            </Form.Group>
            <Form.Group controlId='brand'>
              <Form.Label>برند</Form.Label>
              <Form.Control
                type='text'
                placeholder='برند را وارد کنید'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>دسته</Form.Label>
              <Form.Control
                type='text'
                placeholder='دسته کالا را وارد کنید'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>تعداد موجود</Form.Label>
              <Form.Control
                type='number'
                placeholder='تعداد موجود را وارد کنید'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>توضیحات کالا</Form.Label>
              <Form.Control
                type='text'
                label='توضیحات'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

      <Form.Group controlId='image'>
              <Form.Group controlId='image' className='mb-3'>
            
                  <Form.Label> بارگزاری تصویر  </Form.Label>
                  <Form.Control type='file' onChange={uploadFileHandler} />
             
                  <Form.Label> آدرس تصویر </Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='آدرس تصویر را وارد کنید'
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  ></Form.Control>
                   </Form.Group>
              {uploading && <Loader />}
            </Form.Group>



      

            <Button type='submit' variant='primary'>
              ذخیره
            </Button >
          </Form>
        )}
      </FormContainer>
    
    </>
  )
}

export default ProductEditScreen
