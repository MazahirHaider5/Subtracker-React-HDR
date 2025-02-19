import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearError } from '../redux/action';  
import { showToast } from "../helper/alerts/index";

const GlobalError = () => {
  const errorMessage = useSelector((state) => state.errorMessage);  
  const dispatch = useDispatch();

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, "error", "top-end");
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 3000); 
     
      return () => clearTimeout(timer);
    }
  }, [errorMessage, dispatch]);

  
  return null;
};

export default GlobalError;
