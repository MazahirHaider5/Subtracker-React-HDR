import React, { useState, useMemo, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import rightArrow from "../assets/images/rightArrow.svg";
import leftArrow from "../assets/images/leftArrow.svg";
import icon from "../assets/images/renewal01.svg";
import lockIcon from "../assets/images/renewal02.svg";
import ptarp from "../assets/images/ptrap.svg";
import axiosInstance from "../services/Interceptor";
import { useTranslation } from "react-i18next";

const PaymentScheduleCalendar = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [dataSubscription, setDataSubscription] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().month());
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const { t } = useTranslation("Translate");

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const yearsNames = Array.from({ length: 10 }, (_, index) => 2022 + index);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const result = await axiosInstance.get("/subscriptions/mySubscriptions");
      if (result.status === 200) {
        const mappedEvents = result?.data?.subscriptions?.map((item) => {
          const cleanPath = item?.photo?.replace(/\\/g, "/"); // Normalize slashes
          const imageUrl = cleanPath
            ? `${process.env.REACT_APP_BACKEND_URL}/${cleanPath}`
            : null;

          return {
            id: item?._id,
            title: item?.subscription_name,
            start: new Date(item?.subscription_end),
            end: new Date(item?.subscription_end),
            imageUrl,
          };
        });

        setDataSubscription(result?.data?.subscriptions);
        setSubscriptions(mappedEvents);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const localizer = useMemo(() => momentLocalizer(moment), []);

  const handleCalendarNavigate = (date) => {
    setSelectedMonth(date.getMonth());
    setSelectedYear(date.getFullYear());
  };

  const CustomToolbar = ({ label, onNavigate }) => (
    <div className="custom-toolbar d-flex justify-content-between align-items-center mt-2 mb-4 px-4">
      <h3 className="dark-purple">
        {label}{" "}
        <sub
          className="text-color fs-14 fw-400 cursor-pointer"
          onClick={() => onNavigate("TODAY")}
        >
          Today
        </sub>{" "}
      </h3>
      <div>
        <img
          src={leftArrow}
          alt=""
          width={30}
          height={25}
          onClick={() => onNavigate("PREV")}
          className="cursor-pointer"
        />
        <img
          src={rightArrow}
          alt=""
          width={30}
          height={25}
          onClick={() => onNavigate("NEXT")}
          className="cursor-pointer"
        />
      </div>
    </div>
  );

  const eventStyleGetter = () => ({
    style: {
      backgroundColor: "transparent",
      border: "none",
    },
  });

  const CustomEvent = ({ event }) => {
    const [imgError, setImgError] = useState(false);

    return (
      <div className="calendar-event-img" style={{ textAlign: "center" }}>
        <img
          crossOrigin="anonymous"
          src={imgError || !event.imageUrl ? icon : event.imageUrl}
          alt="Subscription"
          width={40}
          height={40}
          onError={() => setImgError(true)}
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            width: 40,
            height: 40,
            display: "inline-block",
          }}
        />
      </div>
    );
  };

const today = moment().startOf("day");

  const expiringToday = dataSubscription.filter((item) =>
    moment(item.subscription_end).isSame(today, "day")
  );
  const upcomingBill = expiringToday.reduce(
    (sum, item) => sum + (item.subscription_price || 0),
    0
  );

  return (
    <div className="container">
      <p className="page-heading fs-20">
        {t(
          "Stay on track with our subscription scheduling feature, ensuring timely"
        )}{" "}
        <br /> {t("payments and effortless management.")}
      </p>

      <div className="d-flex justify-content-end mb-3 mb-md-4 gap-2">
        <select
          className="form-select w-auto"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        >
          {monthNames.map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>
        <select
          className="form-select w-auto"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {yearsNames.map((year) => (
            <option key={year} value={year}>
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
            views={["month"]}
            date={new Date(selectedYear, selectedMonth)}
            components={{
              toolbar: CustomToolbar,
              event: CustomEvent,
            }}
            eventPropGetter={eventStyleGetter}
          />
        </div>
      </div>

      {dataSubscription?.length > 0 && (
        <div className="d-flex justify-content-between mt-5">
          <h2 className="fs-30 fw-600 mt-1 mb-4">
            {today.format("D MMMM, YYYY")}
          </h2>
          <div className="text-end">
            {expiringToday.length > 0 ? (
              <>
                <h2 className="fs-30 fw-600 mt-1 mb-0">
                  ${(upcomingBill / 100).toFixed(2)}
                </h2>
                <p className="fs-18 fw-400 text-color-light m-0">
                  in upcoming bills
                </p>
              </>
            ) : (
              <p className="fs-18 fw-400 text-color-light m-0">
                No subscriptions expiring today
              </p>
            )}
          </div>
        </div>
      )}

      <div className="row mb-5 mt-4 mt-md-0">
        {expiringToday.length > 0 ? (
          expiringToday.map((item, index) => (
            <div
              className="col-12 col-md-3 col-lg-2 text-center text-md-start"
              key={item._id}
            >
              <div className="ps-2 py-3 calendar-card rounded-4 mt-3">
                <img
                crossOrigin="anonymous"
                  src={
                        process.env.REACT_APP_BACKEND_URL + "/" + item?.photo
                      }
                  alt="icon"
                  width={40}
                  height={40}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
                <p className="fs-16 fw-400 mt-4 mt-md-5 mb-1">
                  {item.subscription_name}
                </p>
                <h2 className="fs-20 fw-600">
                  ${(item.subscription_price / 100).toFixed(2)}
                </h2>
              </div>
            </div>
          ))
        ) : (
          <p className="fs-18 fw-400 text-color-light m-0">
            No subscriptions expiring today.
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentScheduleCalendar;
