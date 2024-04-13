import { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Import css files
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom'
import { apiUrl } from '../../process.env';
const Home = () => {
  const navigation = useNavigate()
  const [index, setIndex] = useState(0);
  const [Product, setProduct] = useState([])
  const [Caregory, setCategory] = useState([])

  useEffect(() => {
    axios.get(`${apiUrl}/category`).then((res) => {
      setCategory(res.data)
    }).catch((err) => {
      setCategory(err)
    })
    axios.get(`${apiUrl}/product`).then((res) => {
      setProduct(res.data)
    }).catch((err) => {
      setProduct(err)
    })
  }, [])

  // Slider Banner
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  // Slider Product
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }]

  };
  return (
    <div>
      {/* Slider Banner */}
      <Carousel activeIndex={index} onSelect={handleSelect} >
        <Carousel.Item>
          <img src="https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/624e4aafb54b3d5b.jpg?q=20" alt="banner" className='w-100 object-fit-cover' />
        </Carousel.Item>
        <Carousel.Item >
          <img src="https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/694664f460d0ce84.png?q=20" alt="banner" className='w-100 object-fit-cover' />

        </Carousel.Item>
        <Carousel.Item >
          <img src="https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/d3a2f1f5dfa35719.png?q=20" alt="banner" className='w-100 object-fit-cover' />
        </Carousel.Item>
      </Carousel>

      {/* Slider Product */}
      <div>
        <Container>
          {
            Caregory.map((caregory, pos) => {
              return (
                <div key={pos} className='my-5'>
                  <h4 className='py-4 fw-bold fs-1 text-center'>{caregory.category_name}</h4>
                  <div className='product-slider'>
                    <Slider {...settings}>
                      {
                        Product.filter(items => {
                          return items.category_name === caregory.category_name
                        }).map((product, index) => {
                          return (
                            <div key={index} onClick={() => navigation(`/product/${product.subcategory_name}`)} className='text-center p-3  border'>
                              <img src={product.product_image} className='w-100 object-fit-contain ' height={'300px'} alt="" />
                              <h5 className='mt-3'>{product.subcategory_name}</h5>
                              <p >{product.brand_name}</p>
                              <h5 className='mt-2'>₹{Number(product.product_price).toLocaleString()}</h5>
                            </div>
                          )
                        })
                      }
                    </Slider>
                  </div>
                </div>
              )
            })
          }

        </Container>

      </div>
      <ToastContainer />
    </div>
  )
}

export default Home