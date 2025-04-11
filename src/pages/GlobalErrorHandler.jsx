import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearError } from '../redux/action';
import { showToast } from "../helper/alerts/index";
import { setAuth } from '../redux/action';
import { persistor } from '../redux/configureStore';


const GlobalError = () => {
  const errorMessage = useSelector((state) => state.errorMessage);
  const dispatch = useDispatch();

  const expireToken = async () => {
    try {
      dispatch(setAuth(false));
      await persistor.flush();
      persistor.purge();

      localStorage.clear();

    } catch (error) {
    }
  };
  useEffect(() => {
    console.log("errorMessage",errorMessage)
    if (errorMessage) {
      if (errorMessage === 401) {
        expireToken()
      }
      else {
        showToast(errorMessage, "error", "top-end");
        const timer = setTimeout(() => {
          dispatch(clearError());
        }, 3000);

        return () => clearTimeout(timer);
      }

    }
  }, [errorMessage, dispatch]);


  return null;
};

export default GlobalError;
