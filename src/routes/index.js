
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from './Routes';
import Dashboard from '../pages/Dashboard';
import Contact from '../pages/Contact';
import Layout from '../Layout';
import Subscription from '../pages/Subscription';
import CategoryName from '../pages/CategoryName';
import NewSubscription from '../pages/NewSubscription';
import SpotifySubscription from '../pages/SpotifySubscription';
import FAQs from '../pages/FAQs';
import TermOfServices from '../pages/TermOfServices';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import OTP from '../pages/OTP';
import ResetPassword from '../pages/ResetPassword';
import SubscriptionPlan from '../pages/SubscriptionPlan';
import SubscriptionPlanPayment from '../pages/SubscriptionPlanPayment';
import AddNewPaymentCard from '../pages/AddNewPaymentCard';
import Budget from '../pages/Budget';
import SubscriptionSchedule from '../pages/SubscriptionSchedule';
import PublicPrivacyPolicy from '../pages/PublicPrivacyPolicy';
import PublicTermOfServices from '../pages/PublicTermOfServices';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="sign-in" element={<PublicRoute><SignIn /></PublicRoute>} />
        <Route path="sign-up" element={<PublicRoute><SignUp /></PublicRoute>} />
        <Route path="forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="otp" element={<PublicRoute><OTP /></PublicRoute>} />
        <Route path="public-term-of-services" element={<PublicRoute><PublicTermOfServices /></PublicRoute>} />
        <Route path="public-privacy-policy" element={<PublicRoute><PublicPrivacyPolicy /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="budget-spending" element={<Budget />} />
          <Route path="calendar" element={<SubscriptionSchedule />} />
          <Route path="add-new-payment-card" element={<AddNewPaymentCard />} />
          <Route path="term-of-services" element={<TermOfServices />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="subscription-plan" element={<SubscriptionPlan />} />
          <Route path="manage-payment" element={<SubscriptionPlanPayment />} />
          <Route path="category-name" element={<CategoryName />} />
          <Route path="new-subscription" element={<NewSubscription />} />
          <Route path="spotify-subscription" element={<SpotifySubscription />} />
          <Route path="FAQs" element={<FAQs />} />
          <Route path="contactUs" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

