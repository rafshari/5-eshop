import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import LoginScreen from '../screens/LoginScreen';

const ModalComp = () => {
  const [show, setShow] = useState(true);

 // const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  
  return (
    <>
   <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
    </Modal.Header>
    <Modal.Body>
      <LoginScreen />
    </Modal.Body>

    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
      <Button variant="primary" onClick={handleClose}>
        Save Changes
      </Button>
    </Modal.Footer>
  </Modal>
    </>
  )
}

export default ModalComp
