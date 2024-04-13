import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthState } from 'react-firebase-hooks/auth'
import axios from "axios";
import { CARDCOUNT } from "../../Redux/Action/CardAction";
import { auth } from "../../Firebase/Firebase";
import CustomLoader from "../CustomLoader/CustomLoader";
import ErrorPage from "../ErrorPage/ErrorPage";
import { Percentage } from "../../Custom/Custom";
import { apiUrl } from "../../process.env";


const ProductDetails = () => {
      const { id } = useParams();
      const [user] = useAuthState(auth)
      const [quantity, setquantity] = useState(1);
      const [productDetails, setProductData] = useState({});
      const dispatch = useDispatch();
      const [loading, setLoading] = useState(true);
      const [Error, setError] = useState(null)

      useEffect(() => {
            axios
                  .get(`${apiUrl}/product/${id}`)
                  .then((res) => {
                        setProductData(res.data);
                        setLoading(false)
                  })
                  .catch((error) => {
                        setLoading(false)
                        setError(error.message)
                  });
      }, [id, dispatch]);

      const addToCard = (e, items) => {
            e.preventDefault();

            const { uid } = user
            const obj = {
                  'productPrice': items.product_price,
                  'quantity': quantity,
                  'userId': uid,
                  'id': items.id
            }
            axios.get(`${apiUrl}/AddCard/?id=${items.id}&userId=${uid}`)
                  .then((res) => {
                        if (res.data.length === 0) {
                              axios.post(`${apiUrl}/AddCard`, obj)
                                    .then((res) => {
                                          axios.get(`${apiUrl}/AddCard/?userId=${uid}`).then((res) => {
                                                dispatch({ type: CARDCOUNT, payload: res.data.length })
                                          })
                                    })
                                    .catch((error) => {
                                          setError(error.message)
                                    });
                        } else {
                              toast.error("alerting add card");
                        }

                  })
                  .catch((error) => {
                        setError(error.message)
                  });
      };
      if (loading) {
            return <CustomLoader />
      }
      if (Error) {
            return <ErrorPage error={Error} />
      }
      return (

            <div className="py-5">
                  <Container>
                        <Row className="align-items-center">
                              <Col className="col-12 col-lg-5">
                                    <div className="w-100" >
                                          <img
                                                src={productDetails.product_image}
                                                alt="img"
                                                style={{ width: "100%", maxHeight: "400px", objectFit: "contain" }}
                                          />
                                    </div>
                              </Col>
                              <Col className="col-12 col-lg-7">
                                    <div className="mx-2 my-5 my-lg-0">
                                          <h2>{productDetails.product_title}</h2>
                                          <p className="my-3">{productDetails.product_description?.slice(0, 200)}</p>
                                          <div className="d-flex ">
                                                <div className='py-2'>
                                                      <span className='fs-5 fw-bold'>₹{Number(productDetails.product_price).toLocaleString()}</span>
                                                      <span className='ms-3 text-decoration-line-through text-secondary'>₹{Number(productDetails.product_old_price).toLocaleString()}</span>
                                                      <span className='ms-3 text-success fw-bold'>{Percentage(productDetails.product_old_price, productDetails.product_price)}% Off</span>
                                                </div>
                                          </div>
                                          <form
                                                action=""
                                                method="post"
                                                onSubmit={(e) => addToCard(e, productDetails)}
                                          >
                                                <input
                                                      type="number"
                                                      className="w-25 my-4"
                                                      defaultValue={1}
                                                      min={1}
                                                      max={9}
                                                      onChange={(e) => {
                                                            setquantity(e.target.value);
                                                      }}
                                                />
                                                <button className="btn d-block btn bg-primary-subtle " type="submit" >Add Card</button>
                                          </form>
                                    </div>
                              </Col>
                        </Row>
                        <ToastContainer />
                  </Container>
            </div>
      );
};

export default ProductDetails;
