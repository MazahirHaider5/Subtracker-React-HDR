import React,{useState} from 'react';
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Button,
 
} from "reactstrap";


import english from '../assets/images/header/english.svg'
import pak from '../assets/images/header/PK.svg'
import sw from '../assets/images/header/sw.svg'
import { showToast } from "../helper/alerts/index";
import axiosInstance from '../services/Interceptor'
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../redux/action';
const Currency = ({ isOpenCurrency, setIsOpenCurrency }) => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.userData);
  const [selectedCurrency, setSelectedCurrency] = useState(userData?.currency);
  const [btnLoader, setBtnLoader] = useState(false);
  const currencyData = [
    { imgSrc: english, country: 'English (UK)', currency: 'GBP' },
    { imgSrc: sw, country: 'Switzerland', currency: 'CHF' },
    { imgSrc: pak, country: 'Pakistan', currency: 'PKR' },
    { imgSrc: sw, country: 'Switzerland', currency: 'CHF' },
  ];
  const handleCurrency = async () => {
    try {
      setBtnLoader(true)
      const result = await axiosInstance.patch('/users/updateSpecificDetails', { currency: selectedCurrency, });
      if (result.status === 200) {
         dispatch(setUserData(result?.data?.user));
         setBtnLoader(false)
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
        <Offcanvas
          isOpen={isOpenCurrency}
          toggle={() => setIsOpenCurrency(!isOpenCurrency)}
          direction="end"
          backdrop={false}
        >
          <OffcanvasHeader className='border-bottom fs-16' toggle={() => setIsOpenCurrency(!isOpenCurrency)}>
            Currency
          </OffcanvasHeader>
          <OffcanvasBody>
          {currencyData.map((item, index) => (
        <div
        onClick={() => setSelectedCurrency(item?.currency)}
          key={index}
          className={`d-flex justify-content-between align-item-center header-badges header-badges-heading rounded px-2 mx-3 cursor-pointer mt-2 ${item.currency === selectedCurrency ? "selected-header-badge" : ""}`}
        >
          <p className="pt-3 fs-13 fw-500">
            <img
              src={item.imgSrc}
              width={18}
              height={18}
              alt="User Avatar"
              className="me-2"
            />
            {item.country}
          </p>
          <p className="pt-3 fs-11 ">{item.currency}</p>
        </div>
      ))}
            <div className='text-center mt-5'>
              <Button 
             onClick={() => handleCurrency()}
              type='button'
               className=' fw-500 fs-15  btn-fill-color border-1 border-white py-2 px-5 rounded-4'  >
              {btnLoader ? (
                <div
                  className="spinner-border spinner-border-sm fs-12 text-primary"
                  role="status"
                ></div>
              ) : (
                " Save"
              )}
                 </Button>
            </div>
          </OffcanvasBody>
        </Offcanvas>
    </>
  );
};

export default Currency;
//
//
//