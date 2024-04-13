import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../Firebase/Firebase';
import { Container, } from 'react-bootstrap'
import { deleteUser, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'

const Profile = () => {
      const navigate = useNavigate()
      const [user] = useAuthState(auth)
      const [Profile, serProfile] = useState({})
      const [userUpdata, setUpdata] = useState(false)
      

      console.log(user);
      const GetInputValue = (e) => {
            const name = e.target.name
            const value = e.target.value
            const data = { ...Profile, [name]: value }

            serProfile(data)

      }
      console.log(Profile);
      const UpdataProfile = async (e) => {
            e.preventDefault()
            const { displayName, photoURL } = Profile
            await updateProfile(auth.currentUser, {
                  displayName: displayName, photoURL: photoURL,
            }).then(res => window.location.reload())
            setUpdata(false)

      }

      const deleteAccount = async (e) => {
            try {
                  await deleteUser(auth.currentUser).then(() => {
                        // User deleted.
                        navigate('/')

                  }).catch((error) => {
                        // An error ocurred
                        // ...
                        console.log(error);
                  });
            } catch (error) {

            }
      }
      return (
            <Container>
                  <div className='d-flex flex-column justify-content-center align-items-center w-100' style={{ height: '100vh' }}>
                        {
                              userUpdata ? <div className='col-12 col-lg-6'>
                                    <form action="" onSubmit={(e) => UpdataProfile(e)}>

                                          <label className='mt-3'>Display Name :</label>
                                          <input type="text" name='displayName' onChange={(e) => GetInputValue(e)} className='w-100 py-2 rounded-3 px-3 my-2' />
                                          <label className='mt-3'>Email :</label>
                                          <input type="text" disabled name='email' onChange={(e) => GetInputValue(e)} className='w-100 py-2 rounded-3 px-3 my-2' value={user?.email} />
                                          <label className='mt-3'>image url :</label>
                                          <input type="url" name='photoURL' onChange={(e) => GetInputValue(e)} className='w-100 py-2 rounded-3 px-3 my-2' />
                                          <button className='btn bg-primary-subtle mt-4' type='submit' >save</button>
                                    </form>
                              </div>
                                    :
                                    <div className='col-12 col-lg-6'>
                                          <div>
                                                <img src={user?.photoURL} style={{ width: '200px', borderRadius: "50%", height: "200px", border: '1px solid black' }} alt="" />
                                          </div>
                                          <label className='mt-3'>Display Name :</label>
                                          <input type="text" name='displayName' className='w-100 py-2 rounded-3 px-3 my-2' disabled value={user?.displayName} />
                                          <label className='mt-3'>Email :</label>
                                          <input type="text" name='email' className='w-100 py-2 rounded-3 px-3 my-2' disabled value={user?.email} />

                                          <div className='d-flex justify-content-between'>
                                                <button className='btn bg-primary-subtle mt-4' onClick={() => setUpdata(true)}>Updata</button>
                                                <button className='btn bg-danger-subtle mt-4' type='submit' onClick={(e) => deleteAccount(e)}>Delete</button>
                                          </div>
                                    </div>
                        }

                  </div>
            </Container >
      )
}

export default Profile