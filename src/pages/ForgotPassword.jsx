import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import forgotBanner from '../assets/images/auth/ForgotPasswordBanner.png';
import logoTitle from '../assets/images/auth/logoTitle.png';
import axiosInstance from '../services/Interceptor'
import { showToast } from "../helper/alerts/index";
import { useDispatch } from 'react-redux';
import { setUserEmail,setOTPStatus } from '../redux/action';
import { useNavigate } from "react-router-dom";
const validationSchema = Yup.object({
    email: Yup.string()
        .email('Please enter a valid email address.')
        .required('Email is required.'),
});

function ForgotPassword() {
    const navigate = useNavigate();
    const [btnLoader, setBtnLoader] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async (values) => {
        try {
            setBtnLoader(true)
            const result = await axiosInstance.post('/auth/requestOtp', { email: values.email, });
            if (result.status === 200) {
                showToast(result?.data?.message, "success", "top-end");
                dispatch(setUserEmail(values.email));
                dispatch(setOTPStatus("forgot"));
                
                navigate("/otp");
                
            } else {
              
                setBtnLoader(false)

            }
        } catch (error) {
            setBtnLoader(false)
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-12 col-lg-6 p-4 p-md-0">
                    <div className="m-lg-5 border bg-white p-2 p-lg-5 my-2 box-shadow-custom">
                        <div className="text-center mt-5">
                        <img src={logoTitle} alt="icon" width={150} height={70} className='mt-5'/>
                        </div>
                        <h4 className="fs-30 fw-400 heading-color mt-4 text-center">Forgot Your Password?</h4>
                        <p className="sub-heading-color fs-13 fw-light text-center mb-4 mt-3">We have your Back!</p>

                        {/* Formik Form */}
                        <Formik
                            initialValues={{ email: '' }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ handleSubmit, handleChange, values }) => (
                                <Form onSubmit={handleSubmit} className='mx-5'>
                                    <FormGroup className="mt-4">
                                        <Label className="visually-hidden" for="email">
                                            Email
                                        </Label>
                                        <Field
                                            id="email"
                                            name="email"
                                            placeholder="Email"
                                            className="shadow-none border-0 border-bottom rounded-0 ps-0 form-control"
                                            type="email"
                                            onChange={handleChange}
                                            value={values.email}
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            className="text-danger fs-12 mt-1"
                                        />
                                    </FormGroup>

                                    <div className="mt-2 text-start my-4">
                                        <p className="fs-12 fw-500 text-color">
                                            A link will be sent to your email to reset your password.
                                        </p>
                                    </div>

                                    <div className="d-grid gap-3 pb-5 mb-5">
                                        <Button
                                            type="submit"
                                            className="fw-400 fs-15 btn-fill-color border-1 border-white py-2"
                                        >
                                            {btnLoader ? (
                                                <div
                                                    className="spinner-border spinner-border-sm fs-12 text-primary"
                                                    role="status"
                                                ></div>
                                            ) : (
                                                "Send Recovery Link"
                                            )}

                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>

                <div className="col-12 col-lg-6 d-none d-lg-block">
                    <div className="position-relative d-flex justify-content-center align-items-end vh-100">
                        <div className="text-center">
                            <img src={forgotBanner} alt="banner01" className="h-75 w-100" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
