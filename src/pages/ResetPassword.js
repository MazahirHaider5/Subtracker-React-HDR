import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import resetBanner from '../assets/images/auth/resetBanner.png';
import logoTitle from '../assets/images/auth/logoTitle.svg';
import eye from '../assets/images/auth/eye.svg'
import crossEye from '../assets/images/auth/cross-eye.svg'
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../services/Interceptor'
import { showToast } from "../helper/alerts/index";
import { useDispatch,useSelector } from 'react-redux';
import { setUserEmail, setOTPStatus } from '../redux/action';
import { useNavigate } from "react-router-dom";
function ResetPassword() {
    const dispatch = useDispatch();
    const [btnLoader, setBtnLoader] = useState(false);
    const navigate = useNavigate();
    const userEmail = useSelector(state => state.userMailID);
    const validationSchema = Yup.object({

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
        password: '',
        confirmPassword: '',
    };
    const handleResetPassword = async (values) => {
        try {
            setBtnLoader(true)
            const result = await axiosInstance.post('/auth/resetPassword', { email: userEmail, newPassword: values.confirmPassword });
            if (result.status === 200) {
                showToast(result?.data?.message, "success", "top-end");
                navigate("/sign-in");

            } else {
                setBtnLoader(false)
            }
        } catch (error) {
            setBtnLoader(false)
        }
        console.log('Form Submitted', values);
    };
    const [isViewPassword, setIsViewPassword] = useState(false);
    const [isViewConfirmPassword, setIsViewConfirmPassword] = useState(false);
    return (
        <div className='container'>
            <div className='row'>
                <div className='col-12 col-lg-6 '>
                    <div className=' m-lg-5 border bg-white  p-2 p-md-5 my-2 box-shadow-custom'>
                        <div className='text-center mt-4'>
                            <img src={logoTitle} alt='icon' />
                        </div>
                        <h4 className='fs-25 fw-600 mt-5 text-center'>Reset Your Password</h4>
                        <p className='text-color fs-14 fw-500 text-center my-4'>Here’s a tip: Use a combination of numbers, uppercase,<br /> lowercase and special characters</p>


                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleResetPassword}
                        >
                            {({ handleSubmit }) => (
                                <form onSubmit={handleSubmit}>
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
                                                    height={16}
                                                    width={16}
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
                                                    height={16}
                                                    width={16}
                                                    className="cursor-pointer"
                                                    onClick={() => setIsViewConfirmPassword(!isViewConfirmPassword)}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <ErrorMessage name="confirmPassword" component="div" className="text-danger fs-12 mt-1" />
                                    </FormGroup>
                                    <div className="d-grid gap-3  my-5">
                                        <Button type='submit' className=' fw-500 fs-15  btn-fill-color border-1 border-white py-2'  >
                                            {btnLoader ? (
                                                <div
                                                    className="spinner-border spinner-border-sm fs-12 text-primary"
                                                    role="status"
                                                ></div>
                                            ) : (
                                                " Send Recovery Link"
                                            )}

                                        </Button>

                                    </div>


                                </form>
                            )}
                        </Formik>
                    </div>

                </div>
                <div className='col-12 col-lg-6 d-none d-lg-block'>
                    <div className='position-relative d-flex justify-content-center align-items-end vh-100' >
                        <div className='text-center'>
                            <img src={resetBanner} alt='banner01' className='h-75 w-75' />
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}

export default ResetPassword;
