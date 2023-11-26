import React, { Fragment , useState ,useEffect} from 'react'
import MetaData from '../Layout/MetaData'
import { useParams, useNavigate } from 'react-router-dom'
import { Carousel } from 'react-bootstrap'
import { toast } from 'react-toastify';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTypography,
  } from "mdb-react-ui-kit";
const Cart = ({ addItemToCart, cartItems, removeItemFromCart }) => {
  
    const navigate = useNavigate()
    const [selectedItems, setSelectedItems] = useState([]);
  
    const increaseQty = (id, quantity, stock) => {
        const newQty = quantity + 1;
        if (newQty > stock) return;
        addItemToCart(id, newQty);
    }

    
    const decreaseQty = (id, quantity) => {
        const newQty = quantity - 1;
        if (newQty <= 0) return;
        addItemToCart(id, newQty);
    }

    const removeCartItemHandler = (id) => {
      removeItemFromCart(id)
    }
    // const checkoutHandler = () => {
    //     navigate('/login?redirect=shipping')
    // }

    const toggleItemSelection = (id) => {
      const isSelected = selectedItems.includes(id);
      if (isSelected) {
          setSelectedItems(selectedItems.filter((selectedId) => selectedId !== id));
      } else {
          setSelectedItems([...selectedItems, id]);
      }
  };

  const checkoutHandler = () => {
    if (selectedItems.length > 0) {
      const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.photocard));
      const updatedCartItems = cartItems.filter(item => !selectedItems.includes(item.photocard));
  
      localStorage.setItem('cartItems', JSON.stringify(selectedCartItems));
  
      console.log(updatedCartItems); // Log updatedCartItems to the console
      console.log(selectedItems);
      navigate('/login?redirect=shipping');
    } else {
      toast.error('PLEASE SELECT ITEMS BEFORE CHECKOUT', {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  };
  
  
  
  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);
  

    localStorage.setItem('cartItems', JSON.stringify(cartItems))

    return (

      <section className="h-100 h-custom" style={{ backgroundColor: "#eee" }}>
         <MetaData title={'PHOTOCART'} />
  <MDBContainer className="py-5 h-100">
    <MDBRow className="justify-content-center align-items-center h-100">
      <MDBCol size="12">
        <MDBCard className="card-registration card-registration-2" style={{ borderRadius: "15px" }}>
          <MDBCardBody className="p-0">
            <MDBRow className="g-0">
              <MDBCol lg="8">
                <div className="p-5">
                  <div className="d-flex justify-content-between align-items-center mb-5">
                    <MDBTypography tag="h1" className="fw-bold mb-0 text-black">
                      PHOTOCART
                    </MDBTypography>
                    <MDBTypography className="mb-0 text-muted">
                     
                    </MDBTypography>
                  </div>

                  <hr className="my-4" />
                  {cartItems.length === 0 ? <h2 className="mt-5">Your Cart is Empty</h2> : (
                    <Fragment>
                      {cartItems.map(item => (
                        <Fragment>
                           
                  <MDBRow className="mb-4 d-flex justify-content-between align-items-center">

                            <MDBCol md="1" lg="1" xl="1">
                            <div>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.photocard)}
                                    onChange={() => toggleItemSelection(item.photocard)}
                                />
                            </div>
                        </MDBCol>

                    <MDBCol md="2" lg="2" xl="2">
                      {/* <MDBCardImage> */}
                        <Carousel pause='hover'>
                            {item.images && item.images.map(image => (
                                <Carousel.Item key={image.public_id}>
                                    <img className="d-block w-100" src={image.url} alt={item.name} />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                      {/* </MDBCardImage> */}
                    </MDBCol>
                    <MDBCol md="3" lg="3" xl="3">
                      <MDBTypography tag="h6" className="text-muted">
                        {item.Mname}
                      </MDBTypography>
                      <MDBTypography tag="h4" className="text-black mb-0">
                      {item.Pname}
                      </MDBTypography>
                    </MDBCol>

                   
                         <MDBCol md="3" lg="3" xl="3" className="d-flex align-items-center">
                
                      <button class="btn btn-link px-2"
                        onClick={() => decreaseQty(item.photocard, item.quantity)}>
                        <i class="fas fa-minus"></i>
                      </button>
                      <input id="form1" min="0" name="quantity" value={item.quantity} type="number"
                        class="form-control form-control-sm" />
                   
                      <button class="btn btn-link px-2"
                        onClick={() => increaseQty(item.photocard, item.quantity, item.stock)}>
                        <i class="fas fa-plus"></i>
                      </button>
                  
                  



                    </MDBCol>
                    <MDBCol md="3" lg="2" xl="2" className="text-end">
                      <MDBTypography tag="h6" className="mb-0">
                        ₱ {item.price}
                      </MDBTypography>
                    </MDBCol>
                    <MDBCol md="1" lg="1" xl="1" className="text-end">
                    <i id="delete_cart_item" onClick={() => removeCartItemHandler(item.photocard)} >
                            <MDBIcon fas icon="times" />
                    </i>
                    </MDBCol>
                  </MDBRow>

                  </Fragment>
                            ))}    
                            </Fragment>
                            )}
 
                  <hr className="my-4" />

                  
                </div>
              </MDBCol>
              <MDBCol lg="4" className="bg-grey">
                <div className="p-5">
                  <MDBTypography tag="h3" className="fw-bold mb-5 mt-2 pt-1">
                    Summary
                  </MDBTypography>
 

                  <div className="d-flex justify-content-between mb-4">
                    <MDBTypography tag="h5" className="text-uppercase">
                      ITEM COUNT:
                    </MDBTypography>
                    <MDBTypography tag="h5">{cartItems.reduce((acc, item) => (acc + Number(item.quantity)), 0)} ITEMS</MDBTypography>
                  </div>

                

                 

                  <hr className="my-4" />

                  <div className="d-flex justify-content-between mb-5">
                    <MDBTypography tag="h5" className="text-uppercase">
                      SUBTOTAL:
                    </MDBTypography>
                    <MDBTypography tag="h5">${cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)}</MDBTypography>
                  </div>

                
                  <button type="button" class="btn btn-dark btn-block btn-lg" onClick={checkoutHandler} data-mdb-ripple-color="dark">CHECKOUT</button>

                </div>
              </MDBCol>
              
            </MDBRow>
            
          </MDBCardBody>
        </MDBCard>
        
      </MDBCol>
    </MDBRow>
  </MDBContainer>
</section>
);
}
 
     export default Cart