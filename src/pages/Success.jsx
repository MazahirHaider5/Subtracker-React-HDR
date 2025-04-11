import React, { useEffect } from 'react';
import { Button } from 'reactstrap';
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import {  setAuth, setUserData } from '../redux/action';
import { jwtDecode } from "jwt-decode";

const Success = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token); 
        console.log("decodeddecoded",decoded)
        localStorage.setItem('token', decoded?.accessToken)
        dispatch(setUserData(decoded?.user));
        dispatch(setAuth(true));
        navigate("/");
      } catch (error) {
        console.error("Invalid Token", error);
        return null;
      }

      
    } else {
      navigate("/sign-in");
    }

  }, [token])
  return (
    <div>
      <p>Authenticating...</p>
    </div>
  );
};

export default Success;
