import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, momentLocalizer, views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import rightArrow from '../assets/images/rightArrow.svg';
import leftArrow from '../assets/images/leftArrow.svg';
import icon from '../assets/images/renewal01.svg';
import lockIcon from '../assets/images/renewal02.svg';
import ptarp from '../assets/images/ptrap.svg';
import axiosInstance from '../services/Interceptor';
import { useTranslation } from 'react-i18next';
const PaymentScheduleCalendar = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [dataSubscription, setDataSubscription] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().month()); 
  const [selectedYear, setSelectedYear] = useState(moment().year());  
 const { t } = useTranslation('Translate')
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const yearsNames = Array.from({ length: 10 }, (_, index) => 2022 + index);


  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const result = await axiosInstance.get('/subscriptions/mySubscriptions');
      if (result.status === 200) {
        const mappedData = result?.data?.subscriptions?.map((item) => ({
          id: item?._id,
          title: item?.subscription_name,
          start: item?.subscription_start,
          end: item?.subscription_end,
        }));
        setDataSubscription(result?.data?.subscriptions);
        setSubscriptions(mappedData);
      }
    } catch (error) {
      console.log("error",error)
    }
  };

  const localizer = useMemo(() => momentLocalizer(moment), []);

  const handleCalendarNavigate = (date) => {
    setSelectedMonth(date.getMonth());
    setSelectedYear(date.getFullYear());
  };

  const handleSelectEvent = (event) => {
    console.log("Event selected:", event);
  };

  const CustomToolbar = ({ label, onNavigate }) => (
    <div className="custom-toolbar d-flex justify-content-between align-items-center mt-2 mb-4 px-4">
      <h3 id="current-date" className="dark-purple">
        {label}{" "}
        <sub className="text-color fs-14 fw-400 cursor-pointer" onClick={() => onNavigate('TODAY')}>
          Today
        </sub>{" "}
      </h3>
      <div>
        <img src={leftArrow} alt="" width={30} height={25} onClick={() => onNavigate('PREV')} className="cursor-pointer" />
        <img src={rightArrow} alt="" width={30} height={25} onClick={() => onNavigate('NEXT')} className="cursor-pointer" />
      </div>
    </div>
  );

  const eventStyleGetter = () => ({
    style: {
      backgroundColor: '#758AFF',
    }
  });

  return (
    <div className="container">
      <p className="page-heading fs-20">
        {t("Stay on track with our subscription scheduling feature, ensuring timely")} <br /> {t("payments and effortless management.")}
      </p>
      <div className="d-flex justify-content-end mb-3 mb-md-4 gap-2">
        <select
          className="form-select w-auto"
          id="month-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {monthNames.map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>
        <select
          className="form-select w-auto"
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {yearsNames.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="row custom_row rounded-4 pt-4 px-2 box-shadow-custom">
        <div className="col-md-12 px-0">
          <Calendar
            localizer={localizer}
            events={subscriptions}
            style={{ height: 480 }}
            onNavigate={handleCalendarNavigate}
            views={['month']} 
            onSelectEvent={handleSelectEvent} 
            date={new Date(selectedYear, selectedMonth)} 
            components={{
              toolbar: CustomToolbar, 
            }}
            eventPropGetter={eventStyleGetter}
          />
        </div>
      </div>

      {dataSubscription?.length > 0 && (
        <div className="d-flex justify-content-between mt-5">
          <h2 className="fs-30 fw-600 mt-1 mb-4">{moment().format('D MMMM, YYYY')}</h2>
          <div className="text-end">
            <h2 className="fs-30 fw-600 mt-1 mb-0">$24.98</h2>
            <p className="fs-18 fw-400 text-color-light m-0"> in upcoming bills</p>
          </div>
        </div>
      )}

      <div className="row mb-5 mt-4 mt-md-0">
        {dataSubscription?.map((item, index) => (
          <div className="col-12 col-md-3 col-lg-2 text-center text-md-start" key={index}>
            <div className="ps-2 py-3 calendar-card rounded-4 mt-3">
              <img src={index === 0 ? lockIcon : index === 1 ? ptarp : index === 2 ? icon : icon} alt="icon" width={40} height={40} />
              <p className="fs-16 fw-400 mt-4 mt-md-5 mb-1">{item?.subscription_name}</p>
              <h2 className="fs-20 fw-600">${item?.subscription_price}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentScheduleCalendar;
