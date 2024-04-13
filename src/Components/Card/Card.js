import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { auth } from '../../Firebase/Firebase';
import { useAuthState } from 'react-firebase-hooks/auth'
import { Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { CARDCOUNT } from '../../Redux/Action/CardAction';
import ErrorPage from '../ErrorPage/ErrorPage';
import NoPageData from '../NoPageData/NoPageData';
import { Percentage } from '../../Custom/Custom';
import { apiUrl } from '../../process.env';
const Card = () => {
      const [CardProduct, setCardProduct] = useState([])
      const [user] = useAuthState(auth);
      const dispatch = useDispatch()
      const [Error, setError] = useState(null)
      const [Total, setTotal] = useState(0)
      const [offer, setoffer] = useState(0)
      const [payPrice, setPayPrice] = useState(0);
      const [DeliveryCharges, setDeliveryCharges] = useState(40)
      useEffect(() => {
            GetCardCount()
      }, [setCardProduct, user, dispatch, payPrice, offer, Total])

      const GetCardCount = () => {
            // setLoading(true)
            axios.get(`${apiUrl}/AddCard/?userId=${user?.uid}`).then((res) => {
                  let carddata = res.data
                  dispatch({ type: CARDCOUNT, payload: res.data.length })
                  axios.get(`${apiUrl}/product`).then((productRes) => {
                        let product = productRes.data
                        let filteredProducts = carddata.filter(card => {
                              return (product.map(product => {
                                    if (card.id === product.id) {
                                          card.product_image = product.product_image
                                          card.product_title = product.product_title
                                          card.product_old_price = product.product_old_price
                                          card.product_price = product.product_price
                                          return product
                                    } else {
                                          return null
                                    }
                              }))
                        });

                        // price 
                        let total = filteredProducts.reduce((previous, current) => {
                              return previous + Number(current.product_old_price * current.quantity)
                        }, 0)
                        let totalpay = filteredProducts.reduce((previous, current) => {
                              return previous + Number(current.product_price * current.quantity)
                        }, 0)
                        let off = total - totalpay

                        if (total < 1000) {
                              setDeliveryCharges(40)
                              totalpay -= DeliveryCharges
                        } else {
                              setDeliveryCharges(<span className='text-decoration-line-through'>{DeliveryCharges}</span>)
                        }

                        setPayPrice(totalpay)
                        setTotal(total)
                        setoffer(off)
                        setCardProduct(filteredProducts)
                        // setLoading(false)
                  })

            }).catch(error => {
                  // setLoading(false)
                  setError(error.message)
            })
      }

      const RemvoeCard = (id) => {
            // setLoading(true)
            axios.delete(`${apiUrl}/AddCard/${id}`).then((res) => {
                  GetCardCount()
                  // setLoading(false)

            }).catch((error) => {
                  // setLoading(false)
                  setError(error.message)
            })
      }


      const GetInputvalue = (e, id) => {
            const value = e.target.value;

            axios.get(`${apiUrl}/AddCard/${id}`).then((res) => {
                  let data = res.data
                  data.quantity = value
                  axios.put(`${apiUrl}/AddCard/${id}`, data).then((res) => {
                        console.log(res.data);
                        GetCardCount()
                  })
            })
      }

      const ProductBuy = () => {
            alert('product buy')
      }

      if (Error) {
            return <ErrorPage error={Error} />
      }
      if (CardProduct.length === 0) {
            return <NoPageData text={'Missing Cart items? '} />
      }

      return (
            <div>
                  <Container>
                        <Row>
                              <div className='col-12  col-lg-8'>
                                    {
                                          CardProduct.map((items, pos) => {
                                                return (
                                                      <div className='my-4 border p-2 rounded-4 position-relative' key={pos}>
                                                            <Link onClick={(e) => RemvoeCard(items.id)} className='text-black position-absolute fs-4  card-close-btn'><i class="ri-close-large-line"></i></Link>
                                                            <div className='row align-items-center py-4 py-md-0'>
                                                                  <div className='col-12 col-md-4 '>
                                                                        <div className=''>
                                                                              <img src={items.product_image} alt={`img${pos}`} className='w-100 object-fit-contain' style={{ height: '300px' }} />
                                                                        </div>
                                                                  </div>
                                                                  <div className='col-12 col-md-8'>
                                                                        <div className='ms-4 mt-4 mt-md-0'>
                                                                              <h4 >{items.product_title?.slice(0, 40)}</h4>
                                                                              <div className='py-2'>
                                                                                    <span className='fs-5 fw-bold'>₹{Number(items.product_price).toLocaleString()}</span>
                                                                                    <span className='ms-3 text-decoration-line-through text-secondary'>₹{Number(items.product_old_price).toLocaleString()}</span>
                                                                                    <span className='ms-3 text-success fw-bold'>{Percentage(items.product_old_price, items.product_price)}% Off</span>
                                                                              </div>
                                                                              <input type="number" min={1} max={9} onChange={(e) => GetInputvalue(e, items.id)} defaultValue={items.quantity} />
                                                                              <button className='d-block btn btn bg-success-subtle mt-3' onClick={() => ProductBuy()}>Buy</button>
                                                                        </div>
                                                                  </div>

                                                            </div>
                                                      </div>
                                                )
                                          })
                                    }
                              </div>
                              <div className='col-12 col-lg-4'>
                                    <div className='p-4 border my-4 rounded-4 '>
                                          <div className='d-flex justify-content-between my-1 fs-5'> <span>Price</span> <span>₹{Total.toLocaleString()}</span></div>
                                          <div className='d-flex justify-content-between my-1 fs-5'> <span>Discount ({Percentage(Total, payPrice)}% Off)</span> <span>₹{offer.toLocaleString()}</span></div>
                                          <div className='d-flex justify-content-between my-1 fs-5'> <span>Delivery Charges</span>{DeliveryCharges}</div>
                                          <div className='d-flex justify-content-between border-top fs-5 py-1 my-1 fw-bold'> <span>Total Amount</span> <span>₹{payPrice.toLocaleString()}</span></div>
                                          <div> </div>
                                    </div>
                              </div>
                        </Row>
                  </Container>

            </div>
      )
}

export default Card