import React, { useState } from 'react';
import '../assets/style/globals.css';
import {Button} from 'reactstrap'
import { Link } from 'react-router-dom';
import checkDark from '../assets/images/subscriptionCheckDark.svg'
import checkLight from '../assets/images/subscriptionCheckLight.svg'
import subscriptionArrowRight from '../assets/images/subscriptionArrowRight.svg'
import subscriptionArrowRightWhite from '../assets/images/subscriptionArrowRightWhite.svg'




const SubscriptionPlan = () => {
  return (
    < div className='container'>
      <p className='page-heading fs-20   mb-4'>Choose the Plan That Fits Your Subscription Needs</p>
      <div className="row bg-white border rounded mb-5">
        <div className="col-12 col-lg-5 px-0 mx-0">
          <p className="dark-purple-bg text-white w-50 ps-5 py-2 mt-4">Free For 1 Month</p>
          <div className="px-lg-5 px-md-4 px-3 py-0 py-md-4 pb-3 pb-0">
            <h5 className='fs-20 fw-600'>Monthly Plan</h5>
            <h3 className='fw-700'>29.95CHF <span className="fs-6 fw-400 text-color">/ MONTH</span></h3>
            <div className="">
              <div className="d-flex gap-2 pt-3">
                <span className=""><img src={checkLight} className="img-fluid me-2" width="24" alt="" /></span>
                <p className='fs-15 fw-500'>Advanced Subscription <br /> Management</p>
              </div>
              <div className="d-flex gap-2">
                <span className=""><img src={checkLight} className="img-fluid me-2" width="24" alt="" /></span>
                <p className='fs-15 fw-500'>Customizable Alerts and <br />Notifications</p>
              </div>
              <div className="d-flex gap-2">
                <span className=""><img src={checkLight} className="img-fluid me-2" width="24" alt="" /></span>
                <p className='fs-15 fw-500'>Comprehensive financial <br /> Reporting</p>
              </div>
              <div className="d-flex gap-2 mb-4">
                <span><img src={checkLight} className="img-fluid me-2" alt="" /></span>
                <p className="mt-1 fs-15 fw-500">Priority Support</p>
              </div>
              <Link className='text-decoration-none text-color fs-15 fw-500'>Get Started <img src={subscriptionArrowRight} width={20} height={20} alt="" /></Link>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-7 px-0 mx-0 mt-3 mt-lg-0 subscriptionBgImg rounded">
          <div className="px-lg-5 px-md-4 px-3 pt-3 pt-md-5 pb-0 mt-5 mt-md-0">
            <h5 className="text-light pt-lg-5 pt-md-5fs-20 fw-600">Yearly Plan <span className="fs-6 fw-light ps-4 dark-purple">Save 20%</span></h5>
            <h3 className="text-light fw-700">299.95CHF <span className=" fs-6 fw-400">/YEAR</span></h3>
            <div className="d-flex flex-column justify-content-between">
              <div className="d-flex gap-2 pt-4">
                <span className=""><img src={checkDark} className="img-fluid me-2" width="24" alt="" /></span>
                <p className='fs-15 fw-500 text-white'>Advanced Subscription Management</p>
              </div>
              <div className="d-flex gap-2">
                <span className=""><img src={checkDark} className="img-fluid me-2" width="24" alt="" /></span>
                <p className='fs-15 fw-500 text-white'>Customizable Alerts and Notifications</p>
              </div>
              <div className="d-flex gap-2">
                <span className=""><img src={checkDark} className="img-fluid me-2" width="24" alt="" /></span>
                <p className='fs-15 fw-500 text-white'>Comprehensive financial Reporting</p>
              </div>
              <div className="d-flex gap-2">
                <span><img src={checkDark} className="img-fluid me-2" width="24" alt="" /></span>
                <p className='fs-15 fw-500 text-white'>Priority Support</p>
              </div>
              <div className='my-3'>
              <Button type='button' className='border border-white  text-white fw-500 fs-15 py-2' outline  >  Get Started <img src={subscriptionArrowRightWhite} width={20} height={20} alt='' /></Button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlan;
