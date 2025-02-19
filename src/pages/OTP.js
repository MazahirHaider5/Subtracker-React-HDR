import React, { useState, useCallback, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import OTPInput from "react-otp-input";
import otpBanner from '../assets/images/auth/otpBanner.png';
import logoTitle from '../assets/images/auth/logoTitle.svg';
import { showToast } from "../helper/alerts/index";
import { Link } from 'react-router-dom';
import axiosInstance from '../services/Interceptor'
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
function OTP() {
    const navigate = useNavigate();
    const userEmail = useSelector(state => state.userMailID);
    const OTPStatus = useSelector(state => state.OTPStatus);
    const [verificationCode, setVerificationCode] = useState(null);
    const [timer, setTimer] = useState(90);
    const [btnLoader, setBtnLoader] = useState(false);

    const resetTimer = async () => {
        try {
            const result = await axiosInstance.post('/auth/resendOtp', { email: userEmail });
            console.log("resendOtp response", result)
            setTimer(90)
            if (result.status === 200) {
                showToast(result?.data?.message, "success", "top-end");
            } else {
                console.log(result.status)

            }
        } catch (error) {
            console.log(error)

        }
    };
    const timeOutCallback = useCallback(() => {
        if (timer > 0) {
            setTimer((currTimer) => currTimer - 1);
        }
    }, [timer]);

    useEffect(() => {
        const timerId = setTimeout(timeOutCallback, 1000);
        return () => clearTimeout(timerId);
    }, [timeOutCallback]);

    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
        )}:${String(seconds).padStart(2, "0")}`;
    };
    const sendOTP = async () => {
        try {
            setBtnLoader(true)
            const result = await axiosInstance.post('/auth/verifyOtp', { email: userEmail, otp: verificationCode });
            if (result.status === 200) {
                showToast(result?.data?.message, "success", "top-end");
                OTPStatus === "signup" ? navigate("/sign-in") :
                    OTPStatus === "forgot" ? navigate("/reset-password") : console.log("which run for OTP")

            } else {
                setBtnLoader(false)

            }
        } catch (error) {
            setBtnLoader(false)


        }
    }
    return (
        <div className='container'>
            <div className='row'>
                <div className='col-12 col-lg-6 '>
                    <div className=' m-lg-5 border bg-white  p-2 p-md-5 my-2 box-shadow-custom'>
                        <div className='text-center mt-5'>
                            <img src={logoTitle} alt='icon' />
                        </div>
                        <h4 className='fs-25 fw-600 mt-5 text-center'>Check Your Email</h4>
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
                            <div className={`d-grid gap-3 `}>
                                <Button
                                    type='button'
                                    className=' fw-500 fs-15  btn-fill-color border-1 border-white py-2'
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

                </div>
                <div className='col-12 col-lg-6 d-none d-lg-block'>
                    <div className='position-relative d-flex justify-content-center align-items-end vh-100' >
                        <div className='text-center'>
                            <img src={otpBanner} alt='banner01' className='h-75 w-75' />
                        </div>

                    </div>
                </div>


            </div>
        </div>
    );
}

export default OTP;
