import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Listen for the "Official" Firebase state change
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Stop loading once we know the truth
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  // 2. While checking, show a spinner (prevents the "flash" of login screen)
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-brown text-white font-bold">
        Loading Session...
      </div>
    );
  }

  // 3. If no user, kick them to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 4. If logged in, let them pass
  return children;
};

export default PrivateRoute;