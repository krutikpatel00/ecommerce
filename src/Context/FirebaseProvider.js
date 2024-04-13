import React, { createContext, useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../Firebase/Firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'
import CustomLoader from '../Components/CustomLoader/CustomLoader';
import ErrorPage from '../Components/ErrorPage/ErrorPage';
export const FirebaseContext = createContext();

const FirebaseProvider = ({ children }) => {

      const navigation = useNavigate()
      const [accessTokens, setaccessTokens] = useState('')
      const [currentUser, setCurrentUser] = useState(null);
      const [loading, setLoading] = useState(false);
      const [Error, setError] = useState(null)
      const [btnLoding, setBtnLoding] = useState(true)

      useEffect(() => {
            let Token_Id = JSON.parse(sessionStorage.getItem('TOKEN_ID'))
            if (!Token_Id) return;
            setaccessTokens(Token_Id)
            setBtnLoding(false)
            onAuthStateChanged(auth, users => {
                  setCurrentUser(users)
                  if (users) {
                        setBtnLoding(false)
                  } else {
                        setBtnLoding(true)

                  }
            })
      }, [accessTokens, navigation, btnLoding])

      const SignUpEmailAndPassword = async (email, password) => {
            setLoading(true)
            setBtnLoding(false)
            try {
                  await createUserWithEmailAndPassword(auth, email, password).then((user) => {
                        setaccessTokens(user.accessToken)
                        sessionStorage.setItem('TOKEN_ID', JSON.stringify(user.user?.accessToken))
                        setLoading(false)
                        setBtnLoding(false)
                        navigation('/')

                  }).catch((error) => {
                        setError(error.message)
                        setLoading(false)
                        setBtnLoding(true)
                  })
            } catch (error) {
                  setError(error.message)
                  setLoading(false)
                  setBtnLoding(true)
            }
      }

      const loginUpEmailAndPassword = async (email, password) => {
            setLoading(true)
            setBtnLoding(true)
            try {
                  await signInWithEmailAndPassword(auth, email, password).then((user) => {
                        setaccessTokens(user.accessToken)
                        sessionStorage.setItem('TOKEN_ID', JSON.stringify(user.user?.accessToken))
                        navigation('/')
                        setLoading(false)
                        setBtnLoding(false)
                  }).catch((error) => {
                        setLoading(false)
                        setError(error.message)
                  })
            } catch (error) {
                  setError(error.message)
                  setLoading(false)
            }
      }

      const Logout = async () => {
            setBtnLoding(true)
            try {
                  await signOut(auth).then(() => {
                        navigation('/signup')
                        sessionStorage.clear()
                        setBtnLoding(true)
                  }).catch((error) => {
                        // An error happened.
                        setBtnLoding(false)
                        setError(error.message)

                  });
            } catch (error) {
                  setLoading(false)
                  setError(error.message)

            }

      }

      if (loading) {
            return <CustomLoader />
      }
      if (Error) {
            return <ErrorPage error={Error} />
      }
      return (
            <FirebaseContext.Provider value={{ btnLoding, setBtnLoding, accessTokens, currentUser, SignUpEmailAndPassword, loginUpEmailAndPassword, Logout }}>
                  {children}
            </FirebaseContext.Provider>
      )

}


export default FirebaseProvider