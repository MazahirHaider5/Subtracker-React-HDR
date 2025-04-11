import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import banner01 from '../assets/images/auth/banner01.png';
import banner02 from '../assets/images/auth/banner02.png';
import eye from '../assets/images/auth/eye.svg';
import crossEye from '../assets/images/auth/cross-eye.svg';
import apple from '../assets/images/auth/Apple.svg';
import google from '../assets/images/auth/google.svg';
import logoTitle from '../assets/images/auth/logoTitle.png';
import { Link } from 'react-router-dom';
import axiosInstance from '../services/Interceptor'
import { useDispatch } from 'react-redux';
import { setUserEmail,setOTPStatus } from '../redux/action';
import { showToast } from "../helper/alerts/index";
import { useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isViewPassword, setIsViewPassword] = useState(false);
  const [isViewConfirmPassword, setIsViewConfirmPassword] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [isChecked, setIsChecked] = useState(true);


  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Please enter a valid email address.')
      .required('Email is required.'),
    password: Yup.string()
      .required('Password is required.')
      .matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must be at least 8 characters, include one uppercase letter, one number, and one special character.'
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Password and Confirm Password do not match.')
      .required('Confirm Password is required.'),
  });

  const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  const registerUser = async (values) => {
    try {
      setBtnLoader(true)
      const result = await axiosInstance.post('/auth/signUp', { email: values.email, password: values.password });
      if (result.status === 201) {
        showToast(result?.data?.message, "success", "top-end");
        dispatch(setUserEmail(values.email));
        dispatch(setOTPStatus("signup"));
        navigate("/otp");
        console.log('Registration successful!');

      } else {
        console.log('Registration failed. Please try again.');
        setBtnLoader(false)

      }
    } catch (error) {
      setBtnLoader(false)
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
              <img src={banner02} alt="banner02" width={290} />
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6 p-4 p-lg-0">
          <div className="m-lg-5 border bg-white p-2 p-md-5 my-2 box-shadow-custom">
            <div className="d-block d-lg-none text-center mt-2">
            <img src={logoTitle} alt="icon" width={200} height={100} />
            </div>
            <h4 className="fs-33 fw-400 mt-3 heading-color mt-lg-5 text-center">Create an Account</h4>
            <p className="text-color fs-13 fw-lighter sub-heading-color text-center mt-2">Welcome! Please enter your details</p>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values) => registerUser(values)}
            >
              {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit} className='mx-5'>
                  <FormGroup>
                    <Label className="visually-hidden" for="email">
                      Email
                    </Label>
                    <Field
                      name="email"
                      id="email"
                      placeholder="Email"
                      className="shadow-none border-0 border-bottom rounded-top rounded-left rounded-right rounded-0 ps-0 form-control"
                      type="email"
                    />
                    <ErrorMessage name="email" component="div" className="text-danger fs-12 mt-1" />
                  </FormGroup>

                  <FormGroup>
                    <div className="position-relative border-0 border-bottom">
                      <Field
                        name="password"
                        type={isViewPassword ? 'text' : 'password'}
                        placeholder="Password"
                        className="form-control mt-2 fw-400 pb-2 shadow-none border-0 ps-0 rounded-top rounded-left rounded-right rounded-0"
                      />
                      <div className="position-absolute top-0 end-0 pt-2">
                        <img
                          src={isViewPassword ? crossEye : eye}
                          height={20}
                          width={20}
                          className="cursor-pointer"
                          onClick={() => setIsViewPassword(!isViewPassword)}
                          alt=""
                        />
                      </div>
                    </div>
                    <ErrorMessage name="password" component="div" className="text-danger fs-12 mt-1" />
                  </FormGroup>

                  <FormGroup>
                    <div className="position-relative border-0 border-bottom">
                      <Field
                        name="confirmPassword"
                        type={isViewConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        className="form-control mt-2 fw-400 pb-2 shadow-none border-0 ps-0 rounded-top rounded-left rounded-right rounded-0"
                      />
                      <div className="position-absolute top-0 end-0 pt-2">
                        <img
                          src={isViewConfirmPassword ? crossEye : eye}
                          height={20}
                          width={20}
                          className="cursor-pointer"
                          onClick={() => setIsViewConfirmPassword(!isViewConfirmPassword)}
                          alt=""
                        />
                      </div>
                    </div>
                    <ErrorMessage name="confirmPassword" component="div" className="text-danger fs-12 mt-1" />
                  </FormGroup>

                  <FormGroup check inline className="mt-3 mb-2">
                    <Input type="checkbox" onChange={(e) => setIsChecked(!e.target.checked)} />
                    <Label check className="fs-11 fw-400 mb-2 ">
                      By proceeding, you agree to our <Link to="/public-privacy-policy" className="dark-purple">Privacy Policy</Link> and <Link to="/public-term-of-services" className="dark-purple">Term of Use.</Link>
                    </Label>
                  </FormGroup>

                  <div className="d-grid gap-3">
                    <Button
                      disabled={isChecked}
                      type="submit"
                      className="fw-500 fs-15 btn-fill-color border-1 border-white py-2"
                    >
                      {btnLoader ? (
                        <div
                          className="spinner-border spinner-border-sm fs-12 text-primary"
                          role="status"
                        ></div>
                      ) : (
                        "Sign Up"
                      )}

                    </Button>
                    <Button type="button" className="fw-500 fs-15 py-2 text-dark btn-fill-light-outline">
                      <img src={google} width={20} height={20} alt="icon" className="me-2" />
                      Sign In with Google
                    </Button>
                    <Button type="button" className="fw-500 fs-15 border-0 py-2" color="dark">
                      <img src={apple} width={20} height={20} alt="icon" className="me-2" />
                      Sign In with Apple
                    </Button>
                  </div>

                  <div className="mt-2 text-center mt-3">
                    <p className="fs-12 fw-500 text-color">
                      Already have an account? <Link to="/sign-in" className="text-decoration-none fs-13 fw-600 text-dark">SIGN IN</Link>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
