import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import '../assets/style/sidebar.scss';
import { useDispatch } from 'react-redux';
import { setAuth,setHeaderTitle } from '../redux/action';
import { persistor } from '../redux/configureStore'; 
import axiosInstance from '../services/Interceptor'
import { useNavigate } from "react-router-dom";
import Icon from '../assets/images/sidebar/logo.svg';
import sidebarClose from '../assets/images/sidebar/sidebarClose.svg';
import sidebarOpen from '../assets/images/sidebar/sidebarOpen.svg';
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
import documents from '../assets/images/sidebar/document.svg';
import documentsActive from '../assets/images/sidebar/documentActive.svg';
import FAQs from '../assets/images/sidebar/faq.svg';
import FAQsActive from '../assets/images/sidebar/faqActive.svg';
import headPhone from '../assets/images/sidebar/headPhone.svg';
import headPhoneActive from '../assets/images/sidebar/headPhoneActive.svg';
import services from '../assets/images/sidebar/services.svg';
import servicesActive from '../assets/images/sidebar/servicesActive.svg';
import privacy from '../assets/images/sidebar/privacy.svg';
import privacyActive from '../assets/images/sidebar/privacyActive.svg';
import logout from '../assets/images/sidebar/logout.svg';
import sidebarBanner from '../assets/images/sidebar/sidebarBanner.png';

const Sidebar = ({ isCloseSidebar }) => {
      const navigate = useNavigate();
  const dispatch = useDispatch();
    const location = useLocation();  // Get the current location (pathname)
    const [closeMenu, setCloseMenu] = useState(false);
    const handleCloseMenu = () => {
        const newState = !closeMenu;
        setCloseMenu(newState);
        if (isCloseSidebar) {
            isCloseSidebar(newState);
        }
    };
   
    const renderMenuItem = (path, iconActive, iconInactive, label) => {
        const isActive = location.pathname === path;
    
        const handleLogoutClick = async (e) => {
            if (label === "Logout") {
                // e.preventDefault(); 
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
            }
        };
    
        return (
            <li className={classNames({ active: isActive })}>
                <Link 
                    to={label === "Logout" ? "#" : path} 
                    className="d-flex align-items-center" 
                    onClick={(e) => {
                        handleLogoutClick(e);
                        dispatch(setHeaderTitle(label));
                    }}
                >
                    <img src={isActive ? iconActive : iconInactive} alt={label} />
                    <span className={`sidebar-text fs-20 fw-400 ${label === "Logout" ? "text-color-red" : ""}`}>
                        {label}
                    </span>
                </Link>
            </li>
        );
    };
    useEffect(() => {
        const handleResize = () => {
            setCloseMenu(window.innerWidth <= 991);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <>
            <div className={` cursor-pointer sidebar-toggleIcon text-end`} onClick={handleCloseMenu}>
                <img src={closeMenu ? sidebarOpen : sidebarClose} width={35} height={35} alt={closeMenu ? "open" : "close"} />
            </div>

            <div className={classNames("sidebar box-shadow-custom", { active: closeMenu })}>
                <div className={classNames("logoContainer my-4", { active: closeMenu })}>
                    <img src={Icon} alt="icon" className="logo" width={60} height={60} />
                    <h2 className="title  ">SubTracker</h2>
                </div>
                <div className={classNames("contentsContainer", { active: closeMenu })}>
                    <ul>
                        {renderMenuItem("/", DashboardActive, Dashboard, "Dashboard")}
                        <hr className="w-100 " />
                        {!closeMenu && <p className="ms-4 my-2  fw-500 text-color fs-18 ">Subscription Management</p>}
                        {renderMenuItem("/subscription", subscriptionActive, subscription, "Subscriptions")}
                        {renderMenuItem("/subscription-plan", subscriptionPlanActive, subscriptionPlan, "Subscription Plans")}
                        <hr className="w-100 " />
                        {!closeMenu && <p className="ms-4 my-2  fw-500 text-color fs-18">Tracking & Analytics</p>}

                        {renderMenuItem("/budget-spending", spendingActive, spending, "Budget & Spending")}
                        {renderMenuItem("/calendar", calendarActive, calendar, "Calendar")}
                        <hr className="w-100 " />
                        {/* {!closeMenu && <p className="ms-4 my-2  fw-500 text-color fs-18">My Subtracker Plan</p>}
                        {renderMenuItem("/manage-payment", paymentActive, payment, "Manage Payment")} */}
                        {renderMenuItem("/FAQs", FAQsActive, FAQs, "FAQs")}
                        {renderMenuItem("/contactUs", headPhoneActive, headPhone, "Contact & Support")}
                        {renderMenuItem("/term-of-services", servicesActive, services, "Terms of Service")}
                        {renderMenuItem("/privacy-policy", privacyActive, privacy, "Privacy Policy")}
                        <div >
                            {!closeMenu && <img src={sidebarBanner} alt="" width={"80%"} className="ms-4 my-3" />}
                        </div>
                        {renderMenuItem("/", logout, logout, "Logout")}
                    </ul>
                </div>
            </div>
        </>

    );
};

export default Sidebar;


