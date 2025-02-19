import React, { useState } from 'react';
import { FormGroup, Label, Button } from 'reactstrap';
import banner01 from '../assets/images/auth/banner01.png';
import banner02 from '../assets/images/auth/banner02.png';
import eye from '../assets/images/auth/eye.svg';
import crossEye from '../assets/images/auth/cross-eye.svg';
import apple from '../assets/images/auth/Apple.svg';
import google from '../assets/images/auth/google.svg';
import logoTitle from '../assets/images/auth/logoTitle.svg';
import { Link } from 'react-router-dom';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { showToast } from "../helper/alerts/index";
import axiosInstance from '../services/Interceptor'
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUserEmail,setOTPStatus,setAuth,setUserData} from '../redux/action';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
function SignIn() {
  const [isViewPassword, setIsViewPassword] = useState(false);
 const [btnLoader, setBtnLoader] = useState(false);
 const navigate = useNavigate();
 const dispatch = useDispatch();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Please enter a valid email.')
      .required('Email is required.'),
    password: Yup.string()
      .required('Password is required.')
      .min(8, 'Password must be at least 8 characters.')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .matches(/\d/, 'Password must contain at least one number.')
      .matches(/[@$!%*?&#]/, 'Password must contain at least one special character.'),
  });
 
  const initialValues = {
    email: '',
    password: '',
  };

  const handleSignIn = async (values) => {
    try {
        setBtnLoader(true)
        const result = await axiosInstance.post('/auth/login', { email: values.email, password: values.password });
        if (result.status === 200) {
          // showToast(result?.data?.message, "success", "top-end");
          localStorage.setItem('token', result?.data?.accessToken)
          dispatch(setUserData(result?.data?.user));
          dispatch(setUserEmail(values.email));
          dispatch(setAuth(true));
          dispatch(setOTPStatus("login"));
          navigate("/");
          setBtnLoader(false)
        } else {
          setBtnLoader(false)
  
        }
      } catch (error) {
        setBtnLoader(false)
      }
  };
  const handleGoogleLogin = async (response) => {
    const { credential } = response;
    console.log("response", response)
    try {
      const result = await axiosInstance.post('/auth/google');
      if (result.status === 200) {
        localStorage.setItem('token', result?.data?.accessToken);
        dispatch(setUserData(result?.data?.user));
        dispatch(setUserEmail(result?.data?.user?.email));
        dispatch(setAuth(true));
        navigate("/");
      }
    } catch (error) {
      showToast("Error logging in with Google", "error", "top-end");
    }
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-lg-6 d-none d-lg-block">
          <div className="position-relative d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
              <img src={banner01} alt="banner01" width={400} />
            </div>
            <div className="position-absolute bottom-0 start-0">
              <img src={banner02} alt="banner02" width={200} />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="m-lg-5 border bg-white p-2 p-md-5 my-2 box-shadow-custom">
            <div className="d-block d-lg-none text-center mt-2">
              <img src={logoTitle} alt="icon" />
            </div>
            <h4 className="fs-25 fw-600 mt-3 mt-lg-5 text-center">Welcome Back</h4>
            <p className="text-color fs-14 fw-500 text-center mt-2">
              Welcome back! Please enter your details
            </p>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSignIn}
            >
              {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <FormGroup className="mt-5">
                    <Label className="visually-hidden" htmlFor="email">
                      Email
                    </Label>
                    <Field
                      name="email"
                      id="email"
                      placeholder="Email"
                      className="shadow-none border-0 border-bottom rounded-top rounded-left rounded-right rounded-0 ps-0 form-control"
                      type="email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger fs-12 mt-1"
                    />
                  </FormGroup>

                  <FormGroup className="mt-5">
                    <div className="position-relative border-0 border-bottom">
                      <Field
                        name="password"
                        type={isViewPassword ? 'text' : 'password'}
                        className="form-control mt-2 fw-400 pb-2 shadow-none border-0 ps-0"
                        placeholder="Password"
                      />
                      <div className="position-absolute top-0 end-0 pt-2">
                        <img
                          src={isViewPassword ? crossEye : eye}
                          height={16}
                          width={16}
                          className="cursor-pointer"
                          onClick={() => setIsViewPassword(!isViewPassword)}
                          alt=""
                        />
                      </div>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-danger fs-12 mt-1"
                    />
                  </FormGroup>

                  <div className="d-flex justify-content-between mb-3 mt-2">
                    <FormGroup
                      check
                      inline
                      className="d-flex justify-content-start align-items-center gap-2 ps-0"
                    >
                      <Field type="checkbox" name="rememberMe" />
                      <Label check className="fs-13 fw-500 mt-1">
                        Remember me
                      </Label>
                    </FormGroup>
                    <div>
                      <Link
                        to="/forgot-password"
                        className="text-decoration-none fs-13 fw-500 dark-purple"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <div className="d-grid gap-3">
                    <Button
                      className="fw-500 fs-15 btn-fill-color border-1 border-white py-2"
                      type="submit"
                    >
                         {btnLoader ? (
                        <div
                          className="spinner-border spinner-border-sm fs-12 text-primary"
                          role="status"
                        ></div>
                      ) : (
                        " Sign In"
                      )}
                     
                    </Button>
                    {/* <Button
                      className="fw-500 fs-15 py-2 text-dark btn-fill-light-outline"
                      type="button"
                    >
                      <img
                        src={google}
                        width={20}
                        height={20}
                        alt="icon"
                        className="me-1"
                      />
                      Sign In with Google
                    </Button> */}
                     <GoogleOAuthProvider clientId="634878236977-g5es53f78sd3q3gftk8e9b6aho77mbpr.apps.googleusercontent.com">

<GoogleLogin
  onSuccess={handleGoogleLogin}
  onError={() => showToast("Google Login failed", "error", "top-end")}
  useOneTap
/>
</GoogleOAuthProvider>
                    <Button
                      className="fw-500 fs-15 border-0 py-2"
                      color="dark"
                      type="button"
                    >
                      <img
                        src={apple}
                        width={20}
                        height={20}
                        alt="icon"
                        className="me-1"
                      />
                      Sign In with Apple
                    </Button>
                  </div>

                  <div className="mt-2 text-center mt-3">
                    <p className="fs-12 fw-500 text-color">
                      Don’t have an account?{' '}
                      <Link
                        to="/sign-up"
                        className="text-decoration-none fs-13 fw-600 text-dark"
                      >
                        SIGN UP
                      </Link>
                    </p>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
