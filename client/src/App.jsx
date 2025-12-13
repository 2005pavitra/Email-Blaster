import { useState } from "react";
import {useGoogleLogin} from '@react-oauth/google';
import axios from 'axios'
import './App.css';

function App(){
  const [targetEmail, setTargetEmail] = useState('');
  const[subjext, setSubject] = useState('Important Complaint');
  const [status, setStatus] = useState('');

  const blastEmail = async(authCode) =>{
    setStatus('Sending...');
    try{
      const response = await axios.post('http://localhost:5000/api/send-email', {
        code:authCode,
        targetEmail: targetEmail,
        subject: subject,
        message: `<h3>Hello Sir/Ma'am,</h3><p>This is a formal complaint regarding the issue...</p><p>Sent via Student Voice App.</p>`      });
        if(response.data.success){
          setStatus('Email sent successfully');
        }
    }
    catch(error){
      console.error('Error sending email:', error);
      setStatus('Failed to send email');
    }
  };

  //google handler
  const login = useGoogleLogin({
    onSuccess:(codeResponse) => blastEmail(codeResponse.code),
    onError: (error) => console.error('Login failed:', error),
    flow:'auth-code', 
    scope: 
      'https://www.googleapis.com/auth/gmail.send',
    

  })

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial' }}>
      <h1>Student Email Blaster</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Target HOD Email: </label>
        <input 
          type="email" 
          value={targetEmail} 
          onChange={(e) => setTargetEmail(e.target.value)} 
          placeholder="hod@college.edu"
          style={{ padding: '8px', width: '300px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Subject Line: </label>
        <input 
          type="text" 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)}
          style={{ padding: '8px', width: '300px' }} 
        />
      </div>

      <button 
        onClick={() => login()} 
        style={{ padding: '15px 30px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '5px' }}>
        Sign in & Blast Email
      </button>

      <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{status}</p>
    </div>
  );
}

export default App;