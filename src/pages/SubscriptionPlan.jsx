import React, { useState } from 'react';
import '../assets/style/globals.css';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import checkDark from '../assets/images/subscriptionCheckDark.svg';
import checkLight from '../assets/images/subscriptionCheckLight.svg';
import subscriptionArrowRight from '../assets/images/subscriptionArrowRight.svg';
import subscriptionArrowRightWhite from '../assets/images/subscriptionArrowRightWhite.svg';
import { loadStripe } from "@stripe/stripe-js";
import axiosInstance from '../services/Interceptor';
import { useTranslation } from 'react-i18next';
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx"); // Replace with your Stripe public key

const SubscriptionPlan = () => {
 const { t } = useTranslation('Translate')
  const [isMonthlyProcessing, setIsMonthlyProcessing] = useState(false);
  const [isYearlyProcessing, setIsYearlyProcessing] = useState(false);

  const handleCheckout = async (selectedPlan) => {

    setIsMonthlyProcessing(selectedPlan === "monthly" ? true : false)
    setIsYearlyProcessing(selectedPlan === "yearly" ? true : false)
    const amount = selectedPlan === "monthly" ? 2995 : 29995;

    try {
      const result = await axiosInstance.post('/appSubscriptions/checkout',{
          "membershipName":selectedPlan,
          "price":amount,
          "successUrl":`http://localhost:3000/payment-success`,
          "cancelUrl":`http://localhost:3000/payment-cancel`
      }
        );
      if (result.status === !200) {

        console.error("Error creating checkout session");
        setIsMonthlyProcessing(false);
        setIsYearlyProcessing(false);
        return;
      }

      const stripe = await stripePromise;

      const { error } = await stripe.redirectToCheckout({ sessionId: result.id });

      if (error) {
        console.error("Error during Stripe Checkout redirect:", error);
      }
      setIsMonthlyProcessing(false);
      setIsYearlyProcessing(false);

    }
    catch (error) {
      console.error("Error", error);
      setIsMonthlyProcessing(false);
      setIsYearlyProcessing(false);

    }

  };

  return (
    <div className='container'>
      <p className='page-heading fs-18 mb-4 '>{t("Choose the Plan That Fits Your Subscription Needs")}</p>
      <div className="row bg-white box-shadow-custom rounded mb-5 ">
        <div className="col-12 col-lg-5 px-0 mx-0">
          <p className="dark-purple-bg text-white w-50 ps-5 py-2 mt-4">{t("Free For 1 Month")}</p>
          <div className="px-lg-5 px-md-4 px-4 py-0 py-md-4 pb-4 ">
            <h5 className='fs-25 fw-400 ps-2'>{t("Monthly Plan")}</h5>
            <h3 className='fw-600 fs-35 ps-2 align-item-center d-flex'>29.95CHF <span className="fs-18 fw-500 text-color pt-1 mt-2 ps-1"> / {t("MONTH")}</span></h3>
            <div className="ps-2">
              <div className="d-flex  gap-2 pt-3">
                <span className=""><img src={checkLight} className="img-fluid me-2 mt-2 pt-1" width="24" alt="" /></span>
                <p className='fs-17  fw-400'>{t("Advanced Subscription")} <br /> {t("Management")}</p>
              </div>
              <div className="d-flex gap-2">
                <span className=""><img src={checkLight} className="img-fluid me-2 mt-2 pt-1" width="24" alt="" /></span>
                <p className='fs-17 fw-400'>{t("Customizable Alerts and")} <br />{t("Notifications")}</p>
              </div>
              <div className="d-flex gap-2">
                <span className=""><img src={checkLight} className="img-fluid me-2 mt-2 pt-1" width="24" alt="" /></span>
                <p className='fs-17 fw-400'>{t("Comprehensive Financial")} <br /> {t("Reporting")}</p>
              </div>
              <div className="d-flex gap-2 mb-4">
                <span><img src={checkLight} className="img-fluid me-2 " alt="" /></span>
                <p className="mt-1 fs-17 fw-400">{t("Priority Support")}</p>
              </div>

              <Link
                className='text-decoration-none text-color fs-15 fw-400'
                onClick={() => handleCheckout("monthly")}
              >
                {isMonthlyProcessing ? "Processing..." : t("Get Started")} <img src={subscriptionArrowRight} width={20} height={20} alt="" />
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7 px-0 mx-0 mt-3 mt-lg-0 subscriptionBgImg rounded-4">
          <div className="px-lg-5 px-md-4 px-3 pt-3 pt-md-5 pb-0 mt-5 mt-md-0">
            <h5 className="text-light ps-3 pt-md-5 fs-25 fw-400">{t("Yearly Plan")} <span className="fs-6 fw-500 ps-4 dark-purple">Save 20%</span></h5>
            <h3 className="text-light ps-3 fw-600 fs-35 align-item-center d-flex ">299.95CHF <span className="fs-18 fw-500 pt-1 mt-2 ps-1">/ {t("YEAR")}</span></h3>
            <div className="d-flex flex-column justify-content-between ps-3">
              <div className="d-flex gap-2 pt-4">
                <span className=""><img src={checkDark} className="img-fluid me-2" width="24" alt="" /></span>
                <p className='fs-17  fw-400 text-white'>{t("Advanced Subscription Management")}</p>
              </div>
              <div className="d-flex gap-2">
                <span className=""><img src={checkDark} className="img-fluid me-2" width="24" alt="" /></span>
                <p className='fs-17  fw-400 text-white'>{t("Customizable Alerts and Notifications")}</p>
              </div>
              <div className="d-flex gap-2">
                <span className=""><img src={checkDark} className="img-fluid me-2" width="24" alt="" /></span>
                <p className='fs-17  fw-400 text-white'>{t("Comprehensive Financial Reporting")}</p>
              </div>
              <div className="d-flex gap-2">
                <span><img src={checkDark} className="img-fluid me-2" width="24" alt="" /></span>
                <p className='fs-17  fw-400 text-white'>{t("Priority Support")}</p>
              </div>
              <div className='mt-3 mb-5 mb-lg-3'>
                <Button
                  type='button'
                  className='border border-white text-white fs-15 fw-400 py-3 px-5'
                  outline
                  onClick={() => handleCheckout("yearly")}
                  disabled={isYearlyProcessing}
                >
                  {isYearlyProcessing ? "Processing..." : t("Get Started")}  <img src={subscriptionArrowRightWhite} width={20} height={20} alt='' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlan;
