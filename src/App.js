import 'remixicon/fonts/remixicon.css';
import { BrowserRouter, Routes, Route,  } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Components/Header/Header';
import Home from './Components/Home/Home';
import Product from './Components/Product/Product';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import FirebaseProvider, { FirebaseContext } from './Context/FirebaseProvider';
import ProductDetails from './Components/Product/ProductDetails';
import Card from './Components/Card/Card';
import { Provider } from 'react-redux'
import Store from './Redux/Store/Store';
import { useContext } from 'react';
import Profile from './Components/Profile/Profile';
function App() {
  return (
    <BrowserRouter>
      <Provider store={Store}>
        <FirebaseProvider>
          <Header></Header>
          <AppendApp />
        </FirebaseProvider>
      </Provider>
    </BrowserRouter>
  );
}

function AppendApp() {

  const { btnLoding } = useContext(FirebaseContext)

  if (btnLoding) {
    return (
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/product/:productName' element={<Product />}></Route>
        <Route path='/productDetails/:id' element={<ProductDetails />}></Route>
        <Route path='/card' element={<Card />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/login' element={< Login />}></Route >
      </Routes>
    )
  } else {

    return (
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/product/:productName' element={<Product />}></Route>
        <Route path='/productDetails/:id' element={<ProductDetails />}></Route>
        <Route path='/card' element={<Card />}></Route>
        <Route path='/user' element={<Profile />}></Route>
      </Routes>
    )
  }
}

export default App;
