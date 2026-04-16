import {signInWithEmailAndPassword} from 'firebase/auth'
import { auth } from '../firebase/config'
import { Form, useNavigate } from 'react-router-dom'
import heroImage from '../assets/bathroom1.jpg'

function LoginForm() {
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        const {email, password} = e.target.elements;
        try {
            await signInWithEmailAndPassword(auth, email.value, password.value);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };    
  return (
    <Form onSubmit={handleLogin} className='p-10 flex flex-col gap-4'>
      <input name="Name" placeholder="Name" className='border p-2' />
      <input name="email" placeholder="Email" className='border p-2' />
      <input name="password" type="password" placeholder="Password" />
      <button type="submit" className='bg-blue-600 text-white p-2'>Login</button>
    </Form>
  )
}

export default LoginForm;