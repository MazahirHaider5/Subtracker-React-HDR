import React, { useState, useEffect } from 'react';
import { Dropdown } from "react-bootstrap";
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  FormGroup,
  Input,

} from "reactstrap";

import arrowDown from '../assets/images/header/arrowDown.svg';
import avatar from '../assets/images/header/avatar.png';
import setting from '../assets/images/header/setting.svg';
import logout from '../assets/images/header/logout.svg';
import profile from '../assets/images/header/profile.svg';
import arrowRight from '../assets/images/header/arrowRight.svg'
import language from '../assets/images/header/language.svg';
import BA from '../assets/images/header/BA.svg';
import TFA from '../assets/images/header/2FA.svg';
import currency from '../assets/images/header/currency.svg';
import email from '../assets/images/header/email.svg';
import key from '../assets/images/header/key.svg';
import delAccount from '../assets/images/header/delete.svg'
import { showConfirmationAlert, showToast } from "../helper/alerts";
import axiosInstance from '../services/Interceptor'
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from 'react-redux';
import { setAuth,setUserData } from '../redux/action';
import PersonalData from './PersonalData';
import Language from './Language';
import Currency from './Currency';
import ChangePassword from './ChangePassword';
import { persistor } from '../redux/configureStore'; 

const Profile = () => {
 
  const userData = useSelector(state => state.userData);
  const [isOpenAccountSetting, setIsOpenAccountSetting] = useState(false);
  const [isOpenPersonalData, setIsOpenPersonalData] = useState(false);
  const [isOpenLanguage, setIsOpenLanguage] = useState(false);
  const [isOpenCurrency, setIsOpenCurrency] = useState(false);
  const [isOpenPassword, setIsOpenPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    const layoutElement = document.getElementById('layout');
    if (isOpenAccountSetting || isOpenPassword || isOpenPersonalData || isOpenLanguage || isOpenCurrency) {
      layoutElement.style.filter = 'blur(3px)';
    } else {
      layoutElement.style.filter = 'none';
    }
  }, [isOpenAccountSetting, isOpenPassword, isOpenPersonalData, isOpenLanguage, isOpenCurrency])
  const confirmationAccountDel = async () => {
    const confirm = await showConfirmationAlert(
      "Are you sure you want to delete your account? All your information will be permanently deleted",
      "warning"
    );
    if (confirm?.isConfirmed) {
      deleteAccount()

    }
  }
  const deleteAccount = async () => {
    try {
      const result = await axiosInstance.delete('/users/deleteAccount');
      if (result.status === 200) {
        showToast(result?.data?.message, "success", "top-end");
        dispatch(setAuth(false));
       await persistor.flush();
       persistor.purge();
        navigate("/sign-in");

      }
    } catch (error) {
    }
  };
  const LogoutUser = async () => {
    try {
      const result = await axiosInstance.post('/auth/logout');
      if (result.status === 200) {
        dispatch(setAuth(false));
       await persistor.flush();
         persistor.purge();
        navigate("/sign-in");
        localStorage.clear();

      }
    } catch (error) {
    }
  };
  const handleBiometricAuth = async (e) => {
    
    try {
      // setBtnLoader(true)
      const result = await axiosInstance.patch('/users/updateSpecificDetails', { is_biomatric: e.target.checked });
      if (result.status === 200) {
         dispatch(setUserData(result?.data?.user));
       showToast("Update Successfully", "success", "top-end");
      } else {

      }
    } catch (error) {
    }
  };
  const handleEmail = async (e) => {
    
    try {
      // setBtnLoader(true)
      const result = await axiosInstance.patch('/users/updateSpecificDetails', { is_email_notification: e.target.checked });
      if (result.status === 200) {
         dispatch(setUserData(result?.data?.user));
        showToast("Update Successfully", "success", "top-end");
      } else {

      }
    } catch (error) {
    }
  }; const handleTwoFactor = async (e) => {
    
    try {
      // setBtnLoader(true)
      const result = await axiosInstance.patch('/users/updateSpecificDetails', { is_two_factor: e.target.checked });
      if (result.status === 200) {
         dispatch(setUserData(result?.data?.user));
         showToast("Update Successfully", "success", "top-end");
      } else {

      }
    } catch (error) {
    }
  };


  return (
    <>
      <Dropdown className="bg-transparent" align="end" offset={[-140, 0]}>
        <Dropdown.Toggle
          className="d-flex justify-content-between align-item-center border-0 px-0 fw-600 bg-transparent fs-30 text-dark dropdown-arrow-hidden"
        >
          <p className='fs-15 fw-400 mt-2 pt-0 px-2'>{userData?.name}</p>
          <img
            crossOrigin="anonymous"
            src={userData.photo.startsWith("http") ? avatar : process.env.REACT_APP_BACKEND_URL+"/"+userData.photo}
            width={40}
            height={40}
            alt="User Avatar"
            className="cursor-pointer rounded-circle ms-md-2"
          />
          <img
            src={arrowDown}
            width={18}
            height={18}
            alt="Arrow Icon"
            className="cursor-pointer ms-1 ms-md-2 mt-2"
          />
        </Dropdown.Toggle>

        <Dropdown.Menu >
          <Dropdown.Item className="fs-14 pt-2 mb-0 pe-4 bg-white hover-effect" onClick={() => setIsOpenAccountSetting(!isOpenAccountSetting)}>
            <p className='fs-18 fw-400 text-color my-1'>
              <img
                src={setting}
                width={22}
                height={22}
                className="me-3"
                alt="icon"
              />
              Account Settings
            </p>
          </Dropdown.Item>
          <hr className='mx-4' />
          <Dropdown.Item className="fs-14 mb-0  bg-white hover-effect" onClick={()=>LogoutUser()}>
            <p className='fs-18 fw-400 mb-1 text-color-red'>
              <img
                src={logout}
                width={22}
                height={22}
                className="me-3"
                alt="icon"
              />
              Logout
            </p>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <div>
        <Offcanvas
          isOpen={isOpenAccountSetting}
          toggle={() => setIsOpenAccountSetting(!isOpenAccountSetting)}
          direction="end"
          backdrop={false}
        >
          <OffcanvasHeader className='border-bottom fs-16' toggle={() => setIsOpenAccountSetting(!isOpenAccountSetting)}>
            Account Settings
          </OffcanvasHeader>
          <OffcanvasBody>
            <div className='text-center px-2'>
              <img
               crossOrigin="anonymous"
               src={`${userData?.photo ? `${process.env.REACT_APP_BACKEND_URL}/${userData.photo}` : avatar}`}
                width={80}
                height={80}
                className='rounded-circle'
                alt="User Avatar"
              />
              <p className='fs-16 fw-600 mt-3'>{userData.name}</p>
              <div className='d-flex justify-content-between align-item-center border rounded px-2 mx-3 cursor-pointer hover-effect box-shadow-custom'
                onClick={() => {
                  setIsOpenAccountSetting(!isOpenAccountSetting)
                  setIsOpenPersonalData(!isOpenPersonalData)
                }}
              >
                <p className='mt-3 fs-14 fw-500'>
                  <img
                   crossOrigin="anonymous"
                    src={profile}
                    width={14}
                    height={14}
                    alt="User Avatar"
                    className='ms-2 me-3 mb-1'
                  />
                  Personal Data
                </p>
                <img
                  src={arrowRight}
                  width={15}
                  height={15}
                  alt="icon"
                  className='mt-3'
                />
              </div>
              <div className='d-flex justify-content-between border rounded px-2 mx-3 cursor-pointer mt-2 hover-effect box-shadow-custom'
                onClick={() => {
                  setIsOpenAccountSetting(!isOpenAccountSetting)
                  setIsOpenLanguage(!isOpenLanguage)
                }}
              >
                <p className='mt-3 fs-14 fw-500'>
                  <img
                    src={language}
                    width={17}
                    height={17}
                    alt="icon"
                    className='ms-2 me-3'
                  />
                  Language
                </p>
                <img
                  src={arrowRight}
                  width={15}
                  height={15}
                  alt="arrow"
                  className='mt-3'
                />
              </div>
              <div className='d-flex justify-content-between border rounded px-2 mx-3 cursor-pointer mt-2 hover-effect box-shadow-custom'
                onClick={() => {
                  setIsOpenAccountSetting(!isOpenAccountSetting)
                  setIsOpenCurrency(!isOpenCurrency)
                }}
              >
                <p className='mt-3 fs-14 fw-500'>
                  <img
                    src={currency}
                    width={15}
                    height={15}
                    alt="icon"
                 className='ms-2 me-3'
                  />


                  Currency
                </p>
                <img
                  src={arrowRight}
                  width={15}
                  height={15}
                  alt="arrow"
                  className='mt-3'
                />
              </div>
              <div className='d-flex justify-content-between border rounded px-2 mx-3 cursor-pointer mt-2 hover-effect box-shadow-custom'
                onClick={() => {
                  setIsOpenAccountSetting(!isOpenAccountSetting)
                  setIsOpenPassword(!isOpenPassword)
                 
                }}
              >
                <p className='mt-3 fs-14 fw-500'>
                  <img
                    src={key}
                    width={17}
                    height={17}
                    alt="icon"
                     className='ms-2 me-3'
                  />
                  Change Password
                </p>
                <img
                  src={arrowRight}
                  width={15}
                  height={15}
                  alt="arrow"
                  className='mt-3'
                />
              </div>
              <div className='d-flex justify-content-between border rounded px-2 mx-3 cursor-pointer mt-2 hover-effect box-shadow-custom'>
                <p className='mt-3 fs-14 fw-500'>
                  <img
                    src={BA}
                    width={17}
                    height={17}
                    alt="icon"
                      className='ms-2 me-3'
                  />


                  Biometric Auth
                </p>
                <FormGroup switch >
                  <Input
                    type="switch"
                    checked={userData?.is_biomatric}
                    onChange={handleBiometricAuth}
                    className='mt-3'
                    style={{ width: '2.6rem', height: '1.4rem' }}
                  />

                </FormGroup>
              </div>
              <div className='d-flex justify-content-between border rounded px-2 mx-3 cursor-pointer mt-2 hover-effect box-shadow-custom'>
                <p className='mt-3 fs-14 fw-500'>
                  <img
                    src={TFA}
                    width={17}
                    height={17}
                    alt="icon"
                     className='ms-2 me-3'
                  />


                  Two Factor Auth
                </p>
                <FormGroup switch >
                  <Input
                    type="switch"
                    checked={userData?.is_two_factor}
                    onChange={handleTwoFactor}
                    className='mt-3'
                    style={{ width: '2.6rem', height: '1.4rem' }}
                  />

                </FormGroup>

              </div>
              <div className='d-flex justify-content-between border rounded px-2 mx-3 cursor-pointer mt-2 hover-effect box-shadow-custom'>
                <p className='mt-3 fs-14 fw-500'>
                  <img
                    src={email}
                    width={17}
                    height={17}
                    alt="icon"
                      className='ms-2 me-3'
                  />


                  Email Notification
                </p>


                <FormGroup switch >
                  <Input
                    type="switch"
                    checked={userData?.is_email_notification}
                    onChange={handleEmail}
                    className='mt-3'
                    style={{ width: '2.6rem', height: '1.4rem' }}
                  />

                </FormGroup>
              </div>
              <div className='d-flex justify-content-between border rounded px-2 mx-3 cursor-pointer mt-2 hover-effect box-shadow-custom'>
                <p className='mt-3 fs-14 fw-500 text-color-red' onClick={() => confirmationAccountDel()}>
                  <img
                    src={delAccount}
                    width={17}
                    height={17}
                    alt="icon"
                     className='ms-2 me-3'
                  />
                  Delete Account
                </p>

              </div>

            </div>
          </OffcanvasBody>
        </Offcanvas>
        {/* main canvas for Personal Data */}
       <PersonalData isOpenPersonalData={isOpenPersonalData} setIsOpenPersonalData={setIsOpenPersonalData}/>
        {/* main canvas for Language */}
        <Language isOpenLanguage={isOpenLanguage} setIsOpenLanguage={setIsOpenLanguage} />
        {/* main canvas for Currency */}
       <Currency isOpenCurrency={isOpenCurrency} setIsOpenCurrency={setIsOpenCurrency}/>
        {/* main canvas for Change password */}
      <ChangePassword isOpenPassword={isOpenPassword} setIsOpenPassword={setIsOpenPassword}/>
      </div>
      
    </>
  );
};

export default Profile;
