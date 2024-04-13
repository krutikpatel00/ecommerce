import React, { useContext, useState } from "react";
import { FirebaseContext } from "../../Context/FirebaseProvider";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Signup = () => {
  const { SignUpEmailAndPassword } = useContext(FirebaseContext);
  const [SignUp, setSignUp] = useState({});

  const GetInputValue = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const data = { ...SignUp, [name]: value };
    setSignUp(data);
  };
  const SubmitSignUp = (e) => {
    e.preventDefault();
    const { email, password } = SignUp;
    SignUpEmailAndPassword(email, password);
  };
  return (
    <div
      className="d-flex justify-content-center align-items-center mx-3 mx-lg-0"
      style={{ height: "100vh" }}
    >
      <div className="col-12 col-lg-6  p-5 bg-dark-subtle rounded-5">
        <h2 className="text-center">Sign up</h2>
        <form action="" method="" onSubmit={(e) => SubmitSignUp(e)}>
          <label htmlFor="">Email</label>
          <input
            type="text"
            className="d-block py-2 rounded-2 w-100 my-2 px-2"
            name="email"
            placeholder="Email"
            onChange={(e) => GetInputValue(e)}
          />
          <label htmlFor="">Password</label>
          <input
            type="text"
            className="d-block py-2 rounded-2 w-100 my-2 px-2"
            name="password"
            placeholder="Password"
            onChange={(e) => GetInputValue(e)}
          />
          <button
            type="submit"
            className="py-2 rounded-2 px-4 bg-primary  text-white border-0 my-2 px-5"
          >
            Sign up
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
