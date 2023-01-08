import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import NavbarComponent from './components/NavbarComponent'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import ShippingScreen from './screens/ShippingScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreenn from './screens/OrderScreenn'
import UserListScreen from './screens/UserListScreen'
import UserEditScreen from './screens/UserEditScreen'
import ProductListScreen from './screens/ProductListScreen'
import ProductEditScreen from './screens/ProductEditScreen'
import OrderListScreen from './screens/OrderListScreen'

//import ModalComp from './components/ModalComp'

const App = () => {
  return (
    <Container>
      <Router>
        <NavbarComponent />
        <Routes>
          <Route path='/login' element={<LoginScreen />} />
          <Route path='/register' element={<RegisterScreen />} />
          <Route path='/product/:productId' element={<ProductScreen />} />
          <Route path='/cart' element={<CartScreen />} />
          <Route path='/cart/:productId' element={<CartScreen />} />
          <Route path='/profile' element={<ProfileScreen />} />
          <Route path='/shipping' element={<ShippingScreen />} />
          <Route path='/payment' element={<PaymentScreen />} />
          <Route path='/placeorder' element={<PlaceOrderScreen />} />
          <Route path='/order/:orderId' element={<OrderScreenn />} />
          <Route path='/admin/userlist' element={<UserListScreen />} />
          <Route path='/admin/user/:userId/edit' element={<UserEditScreen />} />
          <Route path='/admin/productlist/:pageNumber' element={<ProductListScreen />}  />
          <Route path='/admin/productlist' element={<ProductListScreen />} exact/>
          <Route path='/admin/orderlist' element={<OrderListScreen />} />
          <Route path='/search/:keyword' element={<HomeScreen />} exact />
          <Route path='/page/:pageNumber' element={<HomeScreen /> } exact />
          <Route path='/search/:keyword/page/:pageNumber' element={<HomeScreen /> } exact />
          <Route path='/' element={<HomeScreen /> } exact />
          <Route
            path='/admin/product/:productId/edit'
            element={<ProductEditScreen />}
          />
        </Routes>
        <Footer />
      </Router>
    </Container>
  )
}

export default App
