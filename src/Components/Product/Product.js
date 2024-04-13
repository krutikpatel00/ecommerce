import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../Firebase/Firebase';
import CustomLoader from '../CustomLoader/CustomLoader';
import ErrorPage from '../ErrorPage/ErrorPage';
import { apiUrl } from '../../process.env';
import { FirebaseContext } from '../../Context/FirebaseProvider';
const Product = () => {

      const { productName } = useParams();
      const { btnLoding } = useContext(FirebaseContext)
      const [ProductData, setProductData] = useState([])
      const [BrandData, setBrandData] = useState([])
      const [brandName, setBrandName] = useState([])
      const [Search, setSearch] = useState('')
      // User is currently on this page
      const [currentPage, setCurrentPage] = useState(1);
      const [recordsPerPage] = useState(6);
      const [btnPage, setBtnPage] = useState([])
      const [SortingData, setSortingData] = useState('');
      const [loading, setLoading] = useState(true);
      const [Error, setError] = useState(null)

      useEffect(() => {
            axios.get(`${apiUrl}/product/?subcategory_name=${productName}`).then((res) => {
                  let data = res.data;
                  data = res.data.filter((pro, i) => {
                        return pro.product_title.toLowerCase().match(Search.toLowerCase())
                  })

                  if (brandName.length !== 0) {
                        data = data.filter(product =>
                              brandName.includes(product.brand_name)
                        );
                  } else if (SortingData === 'low') {
                        data.sort((a, b) => a.product_old_price - b.product_old_price)
                  } else if (SortingData === 'high') {
                        data.sort((a, b) => b.product_old_price - a.product_old_price)

                  } else {
                        setLoading(false)
                        setProductData(data);

                  }

                  const indexOfLastRecord = currentPage * recordsPerPage;
                  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
                  const nPages = Math.ceil(data.length / recordsPerPage)

                  let pageAry = []
                  for (let i = 1; i <= nPages; i++) {
                        pageAry.push(i)
                  }
                  setBtnPage(pageAry)

                  const currentRecords = data.slice(indexOfFirstRecord,
                        indexOfLastRecord);
                  setProductData(currentRecords)
            }).catch((error) => {
                  setError(error.message)
            })
            axios.get(`${apiUrl}/brand/?subcategory_name=${productName}`).then((res) => {
                  setBrandData(res.data)
                  setLoading(false)

            }).catch((error) => setError(error.message))
      }, [productName, setProductData, recordsPerPage, SortingData, brandName, currentPage, setSearch, Search, setBtnPage])


      const GetInputData = (e) => {
            const name = e.target.name
            const value = e.target.value
            if (name === 'brand_name') {
                  let data = e.target.checked ? [...brandName, value] : brandName.filter(items => items !== value)
                  setBrandName(data)
            }

      }

      if (loading) {
            return <CustomLoader />
      }
      if (Error) {
            return <ErrorPage error={Error} />
      }
      return (
            <div className='py-5'>
                  <Container>

                        <h2 className='my-4'>{productName}</h2>

                        <div>
                              <input type="text" name='search' placeholder='search' onChange={(e) => setSearch(e.target.value)} className='px-4 my-3 rounded-2  py-2 w-100' />
                        </div>
                        <Row>
                              <Col className='col-12 col-lg-3'>
                                    <div className='border border-1 my-3 p-3 rounded-3 '>
                                          <div className='pb-3'>
                                                <h5 className='my-2'>Brand</h5>
                                                {
                                                      BrandData.map((items, pos) => {
                                                            return (
                                                                  <div key={pos}>
                                                                        <input type="checkbox" id={`brand${pos}`} value={items.brand_name} name='brand_name' onChange={(e) => GetInputData(e)} />
                                                                        <label htmlFor={`brand${pos}`} className='ms-2'>{items.brand_name}</label>
                                                                  </div>
                                                            )
                                                      })
                                                }

                                          </div>
                                          <div>
                                                <h5 className='my-2'>PRICE</h5>
                                                <select name="ProductSort" className='me-2 w-100 py-2 rounded-2 px-2' onChange={(e) => setSortingData(e.target.value)}>
                                                      <option disabled selected key={'select'} value={""}>SELECT PRICE</option>
                                                      <option value="low" key={'low'}>Low Price</option>
                                                      <option value="high" key={'high'}>High Price</option>
                                                </select>
                                          </div>
                                    </div>
                              </Col>
                              <Col className='col-12 col-lg-9'>
                                    <div className='border border-1 p-2 rounded-3'>
                                          <Row>
                                                {
                                                      ProductData.map((product, pos) => {
                                                            return (
                                                                  <Col className='col-12 col-md-6 col-lg-4' key={pos}>
                                                                        <div className='p-2 rounded-3 border border-1 my-2'>
                                                                              <div className='p-2'>
                                                                                    <img src={product.product_image} className='w-100 object-fit-contain ' height={'300px'} alt="" />
                                                                              </div>
                                                                              <h5 className='mt-4'>{product.product_title.slice(0, 40)}...</h5>
                                                                              <div className='d-flex align-items-center my-2'>
                                                                                    <h4 className='me-4'>₹{Number(product.product_price).toLocaleString()} </h4>
                                                                                    <h4 className='fs-5 text-decoration-line-through text-secondary'>₹{Number(product.product_old_price).toLocaleString()}</h4>
                                                                              </div>
                                                                              {btnLoding ?
                                                                                    <Link to={`/signup`} className='btn bg-primary-subtle ' >
                                                                                          View
                                                                                    </Link> :
                                                                                    <Link className='btn bg-primary-subtle ' to={`/productDetails/${product.id}`}>
                                                                                          View
                                                                                    </Link>
                                                                              }

                                                                        </div>
                                                                  </Col>
                                                            )
                                                      })
                                                }

                                          </Row>
                                          <div className='text-center my-4'>
                                                {
                                                      btnPage.map((items, index) => {
                                                            return (
                                                                  <button key={index} className='pagination-btn' onClick={() => setCurrentPage(items)}>{items}</button>
                                                            )
                                                      })
                                                }

                                          </div>
                                    </div>
                              </Col >
                        </Row >

                  </Container >
            </div >
      )
}

export default Product