import React, {
  useState, useCallback,
  useEffect
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  FormGroup,
  Button,
  Form,
  Label,
  Input
} from "reactstrap";
import { Link } from 'react-router-dom';
import OTPInput from "react-otp-input";
import lock from '../assets/images/header/lock.svg'
import openLock from '../assets/images/header/openLock.svg'
import axiosInstance from '../services/Interceptor'
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { showToast } from "../helper/alerts/index";
import { useSelector } from 'react-redux';
const ChangePassword = ({ isOpenPassword, setIsOpenPassword }) => {
   const { t } = useTranslation('Translate')
  const [passwordStrength, setPasswordStrength] = useState([false, false, false, false]);
  const userData = useSelector(state => state.userData);
  const [verificationCode, setVerificationCode] = useState(null);
  const [isViewNewPassword, setIsViewNewPassword] = useState(false);
  const [isViewConfirmPassword, setIsViewConfirmPassword] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [timer, setTimer] = useState(90);
  const [viewStatus, setViewStatus] = useState("email");


  const validationSchemaForPassword = Yup.object({
    newPassword: Yup.string()
      .min(8, 'New password must be at least 8 characters')
      .matches(/[A-Z]/, 'New password must contain at least one uppercase letter')
      .matches(/\d/, 'New password must contain at least one digit')
      .matches(/[@$!%*?&]/, 'New password must contain at least one special character')
      .required('New password is required'),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });
  const checkPasswordStrength = (password) => {
    let strength = [false, false, false, false];

    // Check length
    if (password.length >= 8) strength[0] = true;

    // Check for numeric digit
    if (/\d/.test(password)) strength[1] = true;

    // Check for uppercase letter
    if (/[A-Z]/.test(password)) strength[2] = true;

    // Check for special character
    if (/[@$!%*?&]/.test(password)) strength[3] = true;

    setPasswordStrength(strength); 
  };
  const handlePasswordChange = (e, setFieldValue) => {
    const password = e.target.value;
    checkPasswordStrength(password); 
    setFieldValue('newPassword', password); 
  };
  
  const handleSubmitForm = async (values) => {
    if (passwordStrength.every((item) => item === true)) {
      try {
        const token = localStorage.getItem("token");
        setBtnLoader(true)
        const result = await axiosInstance.post('/auth/resetPassword', { email: userData?.email,newPassword:values?.newPassword },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`, // Include the token
            },
          }
        );
        if (result.status === 200) {
          setBtnLoader(false)
          showToast("Update Successfully", "success", "top-end");
        } else {
          setBtnLoader(false)
  
        }
      } catch (error) {
        setBtnLoader(false)
      }
     
    } 
  };

  const sendOTP = async () => {
    try {
      setBtnLoader(true)
      const result = await axiosInstance.post('/auth/verifyOtp', { email: userData?.email, otp: verificationCode });
      if (result.status === 200) {
        setViewStatus("password")
        setBtnLoader(false)
        showToast('OTP Verified Successfully', "success", "top-end");

      } else {
        setBtnLoader(false)
        setBtnLoader(false)

      }
    } catch (error) {
      setBtnLoader(false)


    }
  }
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };
  const resetTimer = async () => {
    try {
      const result = await axiosInstance.post('/auth/resendOtp', { email: userData?.email });
    
      if (result.status === 200) {
        setTimer(90)
        setBtnLoader(false)
        showToast(result?.data?.message, "success", "top-end");
      } else {
        setBtnLoader(false)
        console.log(result.status)

      }
    } catch (error) {
      setBtnLoader(false)
      console.log(error)

    }
  };
  const timeOutCallback = useCallback(() => {
    if (timer > 0) {
      setTimer((currTimer) => currTimer - 1);
    }
  }, [timer]);
  const handleClick = () => {
    handelSendOTP();
    setTimer(90);
  };

  useEffect(() => {
    const timerId = setTimeout(timeOutCallback, 1000);
    return () => clearTimeout(timerId);
  }, [timer, timeOutCallback]);
  const handelSendOTP = async () => {
    try {
      setBtnLoader(true)
      const result = await axiosInstance.post('/auth/requestOtp', { email: userData?.email, });
      if (result.status === 200) {
        setBtnLoader(false)
        setViewStatus("otp")
        showToast(result?.data?.message, "success", "top-end");

      } else {
        setBtnLoader(false)

      }
    } catch (error) {
      setBtnLoader(false)


    }
  };
  return (
    <>
      {/* main canvas for Change password */}
      <Offcanvas
        isOpen={isOpenPassword}
        toggle={() => setIsOpenPassword(!isOpenPassword)}
        direction="end"
        backdrop={false}
      >
        <OffcanvasHeader className='border-bottom fs-16' toggle={() => setIsOpenPassword(!isOpenPassword)}>
          Change Password
        </OffcanvasHeader>
        <OffcanvasBody>
          {viewStatus === "email" ?
            <div>
              <Form>
                <FormGroup>
                  <Label htmlFor="email" className="text-color fs-14 fw-500">
                  {t('E-mail address')} 
                  </Label>
                  <div className="d-flex align-items-center position-relative border rounded-3">
                    <Input
                      name="email"
                      value={userData?.email}
                      type="email"
                      className="form-control fw-400 fs-12 border-0 ps-4 py-3 shadow-none"
                      id="email"
                      placeholder="Email"
                      disabled={true}
                    />
                  </div>
                </FormGroup>
              </Form>
              <div className={`text-center mt-5 pt-5`}>
                <Button
                  type='button'
                  className=' fw-500 fs-15  btn-fill-color border-1 border-white py-2 mt-5'
                  onClick={() => handleClick()}
                >
                  {btnLoader ? (
                    <div
                      className="spinner-border spinner-border-sm fs-12 text-primary"
                      role="status"
                    ></div>
                  ) : (
                    "Request OTP"
                  )}
                </Button>
              </div>
            </div> : viewStatus === "otp" ?
              <div className='  bg-white  p-2  my-2 '>
                <h4 className='fs-25 fw-600 mt-1 text-center'>Check Your Email</h4>
                <p className='text-color fs-14 fw-500 text-center my-4'>We just sent a recovery code</p>
                <Form>
                  <OTPInput
                    value={verificationCode}
                    className="w-100 flex-grow-1"
                    inputStyle={{
                      borderBottom: "1.5px solid #969494",
                      borderTop: "0px",
                      borderLeft: "0px",
                      borderRight: "0px",
                      width: "100%",
                      fontSize: 30,
                      outline: "none",
                    }}
                    inputClassName="otp-input"
                    containerStyle={{ gap: "10px" }}
                    onChange={(code) => setVerificationCode(code)}
                    numInputs={4}
                    renderInput={(props) => <input {...props} className="otp-input" />}
                  />


                  <div className="mt-5 text-center  ">
                    <small className="text-muted fs-15 fw-400 ">
                      {timer === 0 ? "" : formatTime(timer)}
                    </small>
                  </div>

                  <div className=' text-center mt-4 mb-5 '>
                    <p className='fs-12 fw-500 text-color '>Didn't get a code? {timer !== 0 ? <span className='fw-600 text-muted'>Resend</span> : <Link to="" className='text-decoration-none fw-600 text-dark' onClick={() => resetTimer()}>Resend</Link>}  </p>
                  </div>
                  <div className={`text-center`}>
                    <Button
                      type='button'
                      className=' fw-500 fs-15  btn-fill-color border-1 border-white py-2 mt-5'
                      onClick={() => sendOTP()}
                    >
                      {btnLoader ? (
                        <div
                          className="spinner-border spinner-border-sm fs-12 text-primary"
                          role="status"
                        ></div>
                      ) : (
                        "Verify OTP"
                      )}
                    </Button>
                  </div>
                </Form>
              </div>

              : viewStatus === "password" ?
                <div className='text-center pb-2'>
                  <Formik
                    initialValues={{ newPassword: '', confirmPassword: '' }}
                    validationSchema={validationSchemaForPassword}
                    onSubmit={handleSubmitForm}
                  >
                    {({ handleSubmit, setFieldValue, values }) => (
                      <Form className="text-start" onSubmit={handleSubmit}>
                        <FormGroup>
                          <Label htmlFor="newPassword" className="text-color fs-14 fw-500"> {t("New Password")}</Label>
                          <div className="d-flex align-items-center position-relative border rounded-3">
                            <Field
                              name="newPassword"
                              type={isViewNewPassword ? "text" : "password"}
                              className="form-control fw-400 fs-12 border-0 ps-4 py-3 shadow-none"
                              id="newPassword"
                              placeholder={t("Enter New Password")}
                              value={values.newPassword}
                              onChange={(e) => handlePasswordChange(e, setFieldValue, values)}
                            />
                            <img
                              src={isViewNewPassword ? openLock : lock}
                              height={16}
                              width={16}
                              alt="new password icon"
                              className="position-absolute end-0 me-3 cursor-pointer"
                              onClick={() => setIsViewNewPassword(!isViewNewPassword)}
                            />
                          </div>
                          <ErrorMessage name="newPassword" component="div" className="text-danger fs-12 mt-1" />
                        </FormGroup>

                        <FormGroup>
                          <Label htmlFor="confirmPassword" className="text-color fs-14 fw-500"> {t("Confirm Password")}</Label>
                          <div className="d-flex align-items-center position-relative border rounded-3">
                            <Field
                              name="confirmPassword"
                              type={isViewConfirmPassword ? "text" : "password"}
                              className="form-control fw-400 fs-12 border-0 ps-4 py-3 shadow-none"
                              id="confirmPassword"
                              placeholder={t("Enter Confirm Password")}
                            />
                            <img
                              src={isViewConfirmPassword ? openLock : lock}
                              height={16}
                              width={16}
                              alt="confirm password icon"
                              className="position-absolute end-0 me-3 cursor-pointer"
                              onClick={() => setIsViewConfirmPassword(!isViewConfirmPassword)}
                            />
                          </div>
                          <ErrorMessage name="confirmPassword" component="div" className="text-danger fs-12 mt-1" />
                        </FormGroup>


                        <div className='d-flex justify-content-center align-items-center gap-2 password-strength-indicator mt-4'>
                          <li className={`w-25 ${passwordStrength[0] ? 'bg-success' : ''}`}></li>
                          <li className={`w-25 ${passwordStrength[1] ? 'bg-success' : ''}`}></li>
                          <li className={`w-25 ${passwordStrength[2] ? 'bg-success' : ''}`}></li>
                          <li className={`w-25 ${passwordStrength[3] ? 'bg-success' : ''}`}></li>
                        </div>

                        <div className="mt-5 pt-5 d-flex justify-content-center align-item-end">
                          <Button
                            type="submit"
                            className="fw-500 fs-15 btn-fill-color border-1 border-white py-2 px-5 rounded-4 mt-5"

                          >
                             {btnLoader ? (
                        <div
                          className="spinner-border spinner-border-sm fs-12 text-primary"
                          role="status"
                        ></div>
                      ) : (
                        "Save"
                      )}
                            
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
                : null}




        </OffcanvasBody>
      </Offcanvas>

    </>
  );
};

export default ChangePassword;
