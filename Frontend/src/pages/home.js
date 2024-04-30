import React from 'react';

export default function Home() {
  return (
    <div className="signup-login">
      <Link to="/signup" className="button">Sign Up</Link>
      <Link to="/login" className="button">Log In</Link>
    </div>
  );
}