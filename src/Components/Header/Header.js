import React, { useContext, useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FirebaseContext } from '../../Context/FirebaseProvider';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../Firebase/Firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { CARDCOUNT } from '../../Redux/Action/CardAction';
import { apiUrl } from '../../process.env';

const Header = () => {

      const { Logout, btnLoding, currentUser } = useContext(FirebaseContext)
      const cardCount = useSelector((state) => state.CardReducer.CardData);
      const [Category, setCategory] = useState([])
      const [SubCategory, setSubCategory] = useState([])
      const [user] = useAuthState(auth);
      const dispatch = useDispatch()
      useEffect(() => {
            GetCardCount()
            GetCategoryData()
            GetSubCategory()
      }, [setCategory, setSubCategory, currentUser, btnLoding])

      const GetCategoryData = () => {
            axios.get(`${apiUrl}/category`).then((res) => {
                  setCategory(res.data)
            })
      }
      const GetSubCategory = () => {
            axios.get(`${apiUrl}/subcategory`).then((res) => {
                  setSubCategory(res.data)
            })
      }
      const GetCardCount = () => {
            axios.get(`${apiUrl}/AddCard/?userId=${user?.uid}`).then((res) => {
                  dispatch({ type: CARDCOUNT, payload: res.data.length })

            })
      }

      return (
            <Navbar expand="lg" className="bg-white shadow-lg py-2 py-lg-0   text-black p-0">
                  <Container >
                        <Navbar.Brand href="#" className='text-black pe-5'>E-Com</Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                              <Nav
                                    className="me-auto my-2 my-lg-0 align-items-center justify-content-between "
                                    style={{ maxHeight: '100px' }}
                                    navbarScroll
                              >
                                    <Link to='/' className='text-black me-2'>Home</Link>
                                    {
                                          Category.map((category, pos) => {
                                                return (
                                                      <NavDropdown title={category.category_name} className='text-black py-2' id="navbarScrollingDropdown">
                                                            {
                                                                  SubCategory.filter(subcategory => {
                                                                        return subcategory.category_name === category.category_name
                                                                  }).map((subcategory, pos) => {
                                                                        return (
                                                                              <NavDropdown.Item className='bg-white' >   <Link className='text-black' to={`/product/${subcategory.subcategory_name}`}>{subcategory.subcategory_name}</Link></NavDropdown.Item>
                                                                        )
                                                                  })
                                                            }
                                                      </NavDropdown>
                                                )
                                          })
                                    }


                              </Nav>
                              {
                                    btnLoding ? <>
                                          <Link to='/login' className=' me-2 btn bg-body-secondary ' variant="outline-success" >Login</Link>
                                          <Link to='signup' className=' btn bg-body-secondary' variant="outline-success">SingUp</Link></> :
                                          <>

                                                <Link to='/user' className='me-2  text-black fs-4 text-decoration-none position-relative '><i class="ri-user-3-fill"></i></Link>

                                                <Link to='/card' className='me-2 text-black fs-4 text-decoration-none position-relative '><i class="ri-shopping-bag-4-line"></i><span className='position-absolute shop-header'>{cardCount}</span></Link>
                                                <Link className='me-2 ms-3 text-black  fs-4 text-decoration-none' onClick={() => Logout()}><i class="ri-logout-box-r-line"></i></Link>
                                          </>
                              }

                        </Navbar.Collapse>
                  </Container>
                  <ToastContainer />
            </Navbar>
      )
}

export default Header