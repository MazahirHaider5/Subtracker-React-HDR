import React, { useState } from 'react';
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Button,
} from "reactstrap";
import axiosInstance from '../services/Interceptor'
import english from '../assets/images/header/english.svg'
import iron from '../assets/images/header/IR.svg'
import pak from '../assets/images/header/PK.svg'
import ps from '../assets/images/header/PS.svg'
import { showToast } from "../helper/alerts/index";
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../redux/action';
const Language = ({ isOpenLanguage, setIsOpenLanguage }) => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.userData);
  const [selectedLanguage, setSelectedLanguage] = useState(userData?.language);
  const [btnLoader, setBtnLoader] = useState(false);
  const languageData = [
    { imgSrc: english, language: 'English', nativeName: 'English', locale: '(English)' },
    { imgSrc: iron, language: 'Iran', nativeName: 'فارسی', locale: '(فارسی)' },
    { imgSrc: pak, language: 'Pakistan', nativeName: 'اردو', locale: '(اردو)' },
    { imgSrc: ps, language: 'Palestine', nativeName: 'فارسی', locale: '(فارسی)' },
  ];
  const handleLanguage = async () => {
    try {
      setBtnLoader(true)
      const result = await axiosInstance.patch('/users/updateSpecificDetails', { language: selectedLanguage })
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
      {/* main canvas for Language */}
      <Offcanvas
        isOpen={isOpenLanguage}
        toggle={() => setIsOpenLanguage(!isOpenLanguage)}
        direction="end"
        backdrop={false}
      >
        <OffcanvasHeader className='border-bottom fs-16' toggle={() => setIsOpenLanguage(!isOpenLanguage)}>
          Language
        </OffcanvasHeader>
        <OffcanvasBody>
          {languageData.map((item, index) => (
            <div
              onClick={() => setSelectedLanguage(item?.language)}
              key={index}
              className={`d-flex justify-content-between align-item-center header-badges header-badges-heading rounded px-2 mx-3 cursor-pointer mt-2 ${item.language === selectedLanguage ? "selected-header-badge" : ""}`}
            >
              <p className="pt-3 fs-13 fw-500">
                <img
                  src={item.imgSrc}
                  width={18}
                  height={18}
                  alt="User Avatar"
                  className="me-2"
                />
                {item.language}
              </p>
              <p className="pt-3 fs-11 ">{item.locale}</p>
            </div>
          ))}

          <div className='text-center mt-5'>
            <Button onClick={() => handleLanguage()} type='button' className=' fw-500 fs-15  btn-fill-color border-1 border-white py-2 px-5 rounded-4'  >
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

export default Language;
//