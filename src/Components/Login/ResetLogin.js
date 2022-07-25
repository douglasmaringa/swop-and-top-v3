import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import db, { auth } from '../../firebase';
import Logo from '../../olx-logo.png';
import './Login.css';

function ResetLogin({ setLoginPopOn }) {
  const [err, setErr] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const phoneRef = useRef(null);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const history = useHistory();


 


  const handleClick = (e) => {
    e.preventDefault()
    const user = auth.currentUser;
    console.log(user)
    console.log(passwordRef.current.value)
    //const newPassword = getPWFromForm();
    user.updatePassword(passwordRef.current.value).then(function() {
        // Update successful.
        alert("password changed")
        history.push("/")
      }).catch(function(error) {
        // An error happened.
        alert("please logout and login again it requires recent authenticated user")
        console.log(error)
      });
  }
  const navigateBack = () => {
    if (isSignUp) {
        history.push('/')
    } else {
      
      history.push('/')
    }
  }

  const loginClose = () => {
    setLoginPopOn(false)
    setIsSignUp(false)
    history.push('/')
  }


  let popUpRef = useRef();
  useEffect(() => { 
      let handler = (event) => {
        if (!popUpRef.current.contains(event.target)) {
          setLoginPopOn(false)
          setIsSignUp(false)
        }
      }
      document.addEventListener("mousedown", handler);
      return () => {
        document.removeEventListener("mousedown", handler)
      }
  })







  return (
    <div className="login">
      <div ref={popUpRef} className="login__contents">
        <div className="login__icons">
          <div onClick={navigateBack} className="back__icon">
            <i className="bi bi-arrow-left"></i>
          </div>
          <div onClick={loginClose} className="close__icon">
            <i className="bi bi-x-lg"></i>
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" style={{"height":"50px"}} className="  text-red-700" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
   
  </svg>
        <h3>{!isSignUp ?
          "Change Password"
          :
          "SignUp"
        }
        </h3>
        <p className="login__error" >{err && ` !!!  ${err}`}</p>
        <form className="login__form">
          <input
            className="input"
            type="email"
            ref={emailRef}
            placeholder="Enter email"
          />
          <input
            className="input"
            type="password"
            ref={passwordRef}
            placeholder="Password"
          />
          {
            isSignUp
            &&
            <input
              className="input"
              type="text"
              name="name"
              // value={username}
              ref={usernameRef}
              placeholder="Enter name"
            // onChange={e => setUsername(e.target.value)}
            />
          }
          {isSignUp &&
            <input
              className="input"
              type="number"
              name="phone"
              // value={phone}
              ref={phoneRef}
              placeholder="Enter mobile no."
            //onChange={e => setPhone(e.target.value)}
            />
          }

          <button onClick={handleClick} className="login__button">
            {
              !isSignUp ?
                "Login"
                :
                "SignUp"
            }
          </button>
        </form>
        <p className="signup__button" onClick={() => setIsSignUp(!isSignUp)}>
          {
            !isSignUp ?
              "New to Swap N Top? Signup"
              :
              "Already a user? Login"
          }
        </p>
      </div>
    </div>
  );
}

export default ResetLogin;
