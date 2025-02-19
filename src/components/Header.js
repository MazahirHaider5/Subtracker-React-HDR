import React, { useEffect, useState } from 'react';
import Notification from './Notification';
import Profile from './Profile';
import { Link, useLocation } from "react-router-dom";
import Icon from '../assets/images/sidebar/logo.svg';
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody
} from 'reactstrap'
import classNames from "classnames";
import { persistor } from '../redux/configureStore'; 
import { setAuth } from '../redux/action';
import axiosInstance from '../services/Interceptor'
import { useDispatch } from 'react-redux';
import openbaricon from '../assets/images/sidebar/baricon.svg';
import DashboardActive from '../assets/images/sidebar/dashboardActive.svg';
import Dashboard from '../assets/images/sidebar/dashboard.svg';
import subscription from '../assets/images/sidebar/subscription.svg';
import subscriptionActive from '../assets/images/sidebar/subscriptionActive.svg';
import spending from '../assets/images/sidebar/spending.svg';
import spendingActive from '../assets/images/sidebar/spendingActive.svg';
import calendar from '../assets/images/sidebar/calendar.svg';
import calendarActive from '../assets/images/sidebar/calendarActive.svg';
import subscriptionPlan from '../assets/images/sidebar/subscriptionPlan.svg';
import subscriptionPlanActive from '../assets/images/sidebar/subscriptionPlanActive.svg';
import payment from '../assets/images/sidebar/payment.svg';
import paymentActive from '../assets/images/sidebar/paymentActive.svg';
import FAQs from '../assets/images/sidebar/faq.svg';
import FAQsActive from '../assets/images/sidebar/faqActive.svg';
import headPhone from '../assets/images/sidebar/headPhone.svg';
import headPhoneActive from '../assets/images/sidebar/headPhoneActive.svg';
import services from '../assets/images/sidebar/services.svg';
import servicesActive from '../assets/images/sidebar/servicesActive.svg';
import privacy from '../assets/images/sidebar/privacy.svg';
import privacyActive from '../assets/images/sidebar/privacyActive.svg';
import logout from '../assets/images/sidebar/logout.svg';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
const Header = ({ title, isShowIcon }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.userData);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const location = useLocation();
  const [headerTitle, setHeaderTitle] = useState('')

  useEffect(() => {
    setHeaderTitle(title)
  }, [title]);

  const renderMenuItem = (path, iconActive, iconInactive, label) => {
    const isActive = location.pathname === path;

    const handleLogoutClick = async (e) => {
      if (label === "Logout") {
          // e.preventDefault(); 
          try {
              const result = await axiosInstance.post('/auth/logout');
              if (result.status === 200) {
                dispatch(setAuth(false));
                persistor.purge(); 
                navigate("/log-in");
                localStorage.clear();
        
              }
            } catch (error) {
            }
      }
  };

    return (
      <li className={classNames({ active: isActive })} >
        <div onClick={(e) => {
          setIsOpenSidebar(!isOpenSidebar)
          setHeaderTitle(label)
          handleLogoutClick(e);
        }}>
          <img src={isActive ? iconActive : iconInactive} alt={label} />
          <Link  to={label === "Logout" ? "#" : path}  className={`text-decoration-none ${label === "Logout" && "text-color-red"}`} >
            {label}
          </Link>
        </div>

      </li>
    );
  };

  return (

    <div className='container-fluid px-0 px-md-1 '>
      <div>

   <div className='d-flex justify-content-between align-item-center mt-4'>
        <div className='d-flex '>
          {isShowIcon && <div className='me-3 mt-2 cursor-pointer'> <img src={openbaricon} width={35} height={35} alt={'icon'} onClick={() => setIsOpenSidebar(!isOpenSidebar)} /> </div>}
          <p className='fs-36 fw-500 d-none d-md-block'>{headerTitle ? headerTitle : `${userData?.name} 👋`} </p>
        </div>
        <div className='d-flex justify-content-between align-item-center gap-2'>
          <Notification />
          <Profile />
        </div>
      </div>

      <div className='d-md-none d-block'>
          
          <p className='fs-40 fw-500 mt-3'>{headerTitle ? headerTitle : "Hello  👋"} </p>
        </div>
      </div>

      <Offcanvas
        isOpen={isOpenSidebar}
        toggle={() => setIsOpenSidebar(!isOpenSidebar)}
        direction="start"
      >
        <OffcanvasHeader className='border-bottom fs-16' toggle={() => setIsOpenSidebar(!isOpenSidebar)}>
          <div className='Brand'>
            <img src={Icon} alt="icon" className="logo" />
            <h2 className="title">SubTrackr</h2>
          </div>
        </OffcanvasHeader>
        <OffcanvasBody>
          <div className={classNames("contentsContainer")}>
            <ul className="links_list">
              {renderMenuItem("/", DashboardActive, Dashboard, "Dashboard")}
              {renderMenuItem("/budget-spending", spendingActive, spending, "Budget & Spending")}
              {renderMenuItem("/calendar", calendarActive, calendar, "Calendar")}
              {renderMenuItem("/subscription", subscriptionActive, subscription, "Subscriptions")}
              {renderMenuItem("/subscription-plan", subscriptionPlanActive, subscriptionPlan, "Subscription Plans")}
              {renderMenuItem("/manage-payment", paymentActive, payment, "Manage Payment")}
              {renderMenuItem("/FAQs", FAQsActive, FAQs, "FAQs")}
              {renderMenuItem("/contactUs", headPhoneActive, headPhone, "Contact & Support")}
              {renderMenuItem("/term-of-services", servicesActive, services, "Terms of Service")}
              {renderMenuItem("/privacy-policy", privacyActive, privacy, "Privacy Policy")}
              {renderMenuItem("/", logout, logout, "Logout")}
            </ul>
          </div>
        </OffcanvasBody>
      </Offcanvas>
    </div>

  );
};

export default Header;
