import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { getAuth , createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail} from "firebase/auth";
import app from './firebase.init';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
const auth = getAuth(app);
function App() {
  const [email,setEmail]= useState('');
  const [pass,setPass]=useState('')
  const [validated, setValidated] = useState(false);
  const [error,setError]=useState('')
  const [registered,setRegistered]=useState(false)
  const [reset,setReset]=useState(false)
  const handleRegisteredChange=event=>{
    console.log(event.target.checked)
    setRegistered(event.target.checked)
  }
  const handleEmailblur=event=>{
setEmail(event.target.value)
  }
  const handlePassblur=event=>{
setPass(event.target.value)
  }
  const handleSubmitbutton=event=>{
    const form = event.currentTarget;
    event.preventDefault()
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return
    }
    if(!/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(pass)){
      setError('password should contain one number, one uppercase letter, one lowercase letter, one special character and minimum length is 6')
      return
    }
    setValidated(true);
    setError('')
    if(registered){
      console.log(email)
      signInWithEmailAndPassword(auth, email, pass)
  .then((result) => {
    // Signed in 
    const user = result.user;
    console.log(user)
    // ...
  })
  .catch((error) => {
    setError(error.message)
    console.log(error)
  });
    }
    else{
    console.log('form submitted',email,pass)
    createUserWithEmailAndPassword(auth, email, pass)
    .then(result=>{
      console.log(result.user)
      setEmail('')
      setPass('')
      verifyEmail()
    })
    .catch(error=>{
      console.log(error)
      setError(error.message)
    })}
      }
      const verifyEmail=()=>{
        sendEmailVerification(auth.currentUser)
  .then(() => {
    console.log('email verified')
  });
      }
  const handleReset=()=>{
    sendPasswordResetEmail(auth, email)
  .then(() => {
    setReset(true)
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    setError(errorCode)
    // ..
  });
  }
  return (
    <div >
    <div className='mx-auto w-50'>
      <h1 >Milestone 10 Day 2</h1></div>
      <div className='register w-50 mx-auto mt-2 border rounded p-5'>
      <h2 className='text-primary'>Sign {!registered?'up':'in'}</h2>
      <Form noValidate validated={validated}  onSubmit={handleSubmitbutton}>
  <Form.Group className="mb-3" controlId="formBasicEmail">
    <Form.Label>Email address</Form.Label>
    <Form.Control onBlur={handleEmailblur} type="email" placeholder="Enter email" required/>
    <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
    <Form.Text className="text-muted">
      We'll never share your email with anyone else.
    </Form.Text>

  </Form.Group>

  <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control onBlur={handlePassblur} type="password" placeholder="Password" required/>
    <Form.Control.Feedback type="invalid">
            Please provide a valid password.
    </Form.Control.Feedback>
    <Form.Group className="mb-3" controlId="formBasicCheckbox">
    <Form.Check onChange={handleRegisteredChange} type="checkbox" label="Already have an account" />
  </Form.Group>
    <p className='text-danger'>{error}</p>
  </Form.Group>
  <Button onClick={handleReset} variant="link">Forgot password</Button><br/>
  <p>{reset?'reset email sent':{error}}</p>
  <Button variant="primary" type="submit">
    {registered?'Login':'Sign up'}
  </Button>
</Form>
      </div>
    </div>
  );
}

export default App;
