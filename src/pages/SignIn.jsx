import React, { useState } from 'react';
import { FormGroup, Label, Button } from 'reactstrap';
import banner01 from '../assets/images/auth/banner01.png';
import banner02 from '../assets/images/auth/banner02.png';
import eye from '../assets/images/auth/eye.svg';
import crossEye from '../assets/images/auth/cross-eye.svg';
import apple from '../assets/images/auth/Apple.svg';
import google from '../assets/images/auth/google.svg';
import logoTitle from '../assets/images/auth/logoTitle.png';
import { Link } from 'react-router-dom';
import {getLanguageCode} from '../helper/GetLanguageType'
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { showToast } from "../helper/alerts/index";
import axiosInstance from '../services/Interceptor'
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUserEmail, setOTPStatus, setAuth, setUserData,setHeaderTitle } from '../redux/action';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useParams } from "react-router-dom";
function SignIn() {
  const { t, i18n } = useTranslation('Translate')
  const paramData = useParams();
  const [isViewPassword, setIsViewPassword] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log('paramData', paramData)
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
         i18n.changeLanguage(getLanguageCode(result?.data?.user?.language));
        dispatch(setUserData(result?.data?.user));
        dispatch(setUserEmail(values.email));
        dispatch(setAuth(true));
        dispatch(setHeaderTitle('Dashboard'));
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
  const handleGoogleLogin = async () => {
    try {

      const response = await axiosInstance.get('/auth/google');

      if (response) {
        console.log("response", response)

      } else {
        console.error("No redirect URL found in the response");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-lg-6 d-none d-lg-block">
          <div className="position-relative d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
              <img src={banner01} alt="banner01" width={280} />
            </div>
            <div className="position-absolute bottom-0 start-0">
              <img src={banner02} alt="banner02" width={300} />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6 p-4 p-lg-0">
          <div className="m-lg-5 border bg-white p-2 p-md-5 my-2 box-shadow-custom">
            <div className='mx-5'>
            
            <div className="d-block d-lg-none text-center mt-2">
              <img src={logoTitle} alt="icon" width={200} height={100} />
            </div>
            <h4 className="fs-33 fw-400 heading-color mt-3 mt-lg-5 text-center">Welcome Back</h4>
            <p className=" fs-13 fw-lighter text-center mt-2 sub-heading-color">
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
                    <div className=" border-0 border-bottom ">
                    <Field
                      name="email"
                      id="email"
                      placeholder="Email"
                      className="shadow-none border-0 fw-300 ps-0 rounded-top rounded-left rounded-right form-control"
                      type="email"
                    />
                      </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger fs-12 mt-1"
                    />
                  
                  </FormGroup>

                  <FormGroup className="mt-4">
                    <div className="position-relative border-0 border-bottom ">
                      <Field
                        name="password"
                        type={isViewPassword ? 'text' : 'password'}
                        className="form-control mt-2 fw-300 pb-2 shadow-none border-0 ps-0"
                        placeholder="Password"
                      />
                      <div className="position-absolute top-0 end-0 pt-2 pe-0">
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
                      <Label check className="fs-13 fw-500">
                        Remember me
                      </Label>
                    </FormGroup>
                    <div>
                      <Link
                        to="/forgot-password"
                        className="text-decoration-none fs-11 fw-400 dark-purple"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <div className="d-grid gap-3">
                    <Button
                      className="fw-400 fs-15 btn-fill-color border-1 border-white py-2"
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
                    <Button
                      className="fw-500 fs-15 py-2 text-dark btn-fill-light-outline"
                      type="button"
                      onClick={handleGoogleLogin}
                    >
                      <img
                        src={google}
                        width={20}
                        height={20}
                        alt="icon"
                        className="me-1"
                      />
                      Sign In with Google
                    </Button>
                    {/* <GoogleOAuthProvider clientId="634878236977-g5es53f78sd3q3gftk8e9b6aho77mbpr.apps.googleusercontent.com">

<GoogleLogin
  onSuccess={handleGoogleLogin}
  onError={() => showToast("Google Login failed", "error", "top-end")}
  useOneTap
/>
</GoogleOAuthProvider> */}
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
                        className="text-decoration-none fs-13 fw-600 dark-purple"
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
    </div>
  );
}

export default SignIn;
