'use client'
import { useState } from 'react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/send-verification-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(`Verification email sent to ${email}`);
    } else {
      setMessage(`Failed to send verification email: ${data.message}`);
    }
  };

  return (
    <div>
      <h1>Email Verification</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleChange}
          required
        />
        <button type="submit">Send Verification Email</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}