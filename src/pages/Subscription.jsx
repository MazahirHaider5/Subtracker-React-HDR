import React, { useState, useEffect, useRef } from "react";
import "../assets/style/globals.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Dropdown } from "react-bootstrap";
import { Button, Table } from "reactstrap";
import { showToast } from "../helper/alerts";
import dots from "../assets/images/dots.svg";
import { Link } from "react-router-dom";
import axiosInstance from "../services/Interceptor";
import { showConfirmationAlert } from "../helper/alerts";
import { useDispatch } from "react-redux";
import { setSelectedSubscription } from "../redux/action";
import { useTranslation } from "react-i18next";

const Subscription = () => {
  const { t } = useTranslation("Translate");
  const dispatch = useDispatch();
  const [subscriptions, setSubscriptions] = useState([]);
  const [isFetchSubscriptions, setIsFetchSubscriptions] = useState(false);

  const hasFetched = useRef(false);

  function formatDate(dateString) {
    const date = new Date(dateString);

    // Extract components
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Format as "MM/DD/YYYY HH:mm"
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  }

  // Function to check if subscription is active (end date > current date)
  const isSubscriptionActive = (endDate) => {
    const currentDate = new Date();
    const subscriptionEndDate = new Date(endDate);
    return subscriptionEndDate > currentDate;
  };

  // Function to group subscriptions by category and calculate totals
  const getGroupedCategories = () => {
    const categoryMap = {};

    subscriptions.forEach((subscription) => {
      const category = subscription.subscription_ctg;

      if (!categoryMap[category]) {
        categoryMap[category] = {
          name: category,
          totalSubscriptions: 0,
          activeSubscriptions: 0,
          totalSpendings: 0,
        };
      }

      // Count total subscriptions for this category
      categoryMap[category].totalSubscriptions += 1;

      // Count active subscriptions (end date > current date)
      if (isSubscriptionActive(subscription.subscription_end)) {
        categoryMap[category].activeSubscriptions += 1;
      }

      // Add to total spendings
      if (isSubscriptionActive(subscription.subscription_end)) {
        categoryMap[category].totalSpendings += parseFloat(
          subscription.subscription_price || 0
        );
      }
    });

    // Convert to array for rendering
    return Object.values(categoryMap);
  };

  useEffect(() => {
    if (!hasFetched.current) {
      getSubscriptions();
      dispatch(setSelectedSubscription(null));
      hasFetched.current = true;
    }
  }, []);

  const getSubscriptions = async () => {
    try {
      setIsFetchSubscriptions(true);

      const result = await axiosInstance.get("/subscriptions/mySubscriptions");
      if (result.status === 200) {
        setIsFetchSubscriptions(false);
        setSubscriptions(result?.data?.subscriptions);
      }
    } catch (error) {
      setIsFetchSubscriptions(false);
    }
  };

  const isShowSubscriptionDropdown = (data) => {
    return (
      <Dropdown className="bg-white" align="end" offset={[-140, 0]}>
        <Dropdown.Toggle className=" border-0  bg-white dropdown-arrow-hidden">
          <img
            src={dots}
            alt="Options"
            width={20}
            height={20}
            className="text-center"
          />
        </Dropdown.Toggle>

        <Dropdown.Menu className="p-0">
          <Dropdown.Item
            as={Link}
            to="/new-subscription"
            className="fs-13 fw-400 text-color d-block py-2 ps-3 border-bottom bg-white text-decoration-none"
            onClick={() => {
              dispatch(setSelectedSubscription(data));
            }}
          >
            Edit
          </Dropdown.Item>
          <Dropdown.Item
            className="fs-13 fw-400 text-color d-block py-2 ps-3 border-bottom bg-white text-decoration-none"
            onClick={() => onDeleteSubscription(data)}
          >
            Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const onDeleteSubscription = (data) => {
    confirmationSubscriptionDel(data);
  };

  const confirmationSubscriptionDel = async (data) => {
    const confirm = await showConfirmationAlert(
      "Are you sure you want to delete subscription?",
      "warning"
    );
    if (confirm?.isConfirmed) {
      deleteSubscription(data);
    }
  };

  const deleteSubscription = async (data) => {
    try {
      const result = await axiosInstance.delete(
        `/subscriptions/deleteSubscription/${data?._id}`
      );
      if (result.status === 200) {
        showToast(result?.data.message, "success", "top-end");
        getSubscriptions();
      }
    } catch (error) {}
  };

  const groupedCategories = getGroupedCategories();
  if (subscriptions.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        You have not subscribed to any plans yet.
        <div className="d-flex justify-content-end gap-2 flex-wrap">
          <Link to="/new-subscription">
            <Button
              type="button"
              className="fw-500 fs-15 btn-fill-color border-1 border-white py-2"
            >
              <span className="fw-600 fs-15">+</span> {t("Add Subscription")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <p className="page-heading fs-20">
        {t("Here you can view and manage all your subscriptions")}
      </p>
      <div className="d-flex justify-content-end gap-2 flex-wrap">
        <Link to="/new-subscription">
          <Button
            type="button"
            className="fw-500 fs-15 btn-fill-color border-1 border-white py-2"
          >
            <span className="fw-600 fs-15">+</span> {t("Add Subscription")}
          </Button>
        </Link>
      </div>
      <div className="mt-3 border rounded  ">
        <Table responsive>
          <thead>
            <tr>
              <th className="table-head-bg text-nowrap ps-5">
                {t("SUBSCRIPTION")}
              </th>
              <th className="table-head-bg text-nowrap">{t("START DATE")}</th>
              <th className="table-head-bg text-nowrap">{t("RENEWAL DATE")}</th>
              <th className="table-head-bg text-nowrap">{t("PRICE")}</th>
              <th className="table-head-bg text-nowrap">{t("OPTIONS")}</th>
            </tr>
          </thead>
          <tbody>
            {isFetchSubscriptions ? (
              <tr>
                <td colSpan="5" className="text-center py-3">
                  <div
                    className="spinner-border spinner-border-lg fs-15 text-primary"
                    role="status"
                  ></div>
                </td>
              </tr>
            ) : (
              subscriptions?.map((item, index) => (
                <tr key={index}>
                  <th scope="row" className="py-3 ps-5">
                    <img
                      crossOrigin="anonymous"
                      src={
                        process.env.REACT_APP_BACKEND_URL + "/" + item?.photo
                      }
                      width={20}
                      height={20}
                      alt="icon"
                      className="rounded"
                    />
                    <span className="fs-16 fw-500 ms-2">
                      {item?.subscription_name}
                    </span>
                  </th>
                  <td className="text-muted fs-14 fw-500 py-3">
                    {formatDate(item?.subscription_start)}
                  </td>
                  <td className="text-muted fs-14 fw-500 py-3">
                    {formatDate(item?.subscription_end)}
                  </td>
                  <td className="text-muted fs-14 fw-500 py-3">
                    ${item?.subscription_price}
                  </td>
                  <td className="text-start">
                    {isShowSubscriptionDropdown(item)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
      <h2 className="fs-24 fw-600 my-3">{t("Categories")}</h2>
      <div className="my-2 border rounded">
        <Table responsive>
          <thead>
            <tr>
              <th className="table-head-bg text-nowrap ps-5">{t("NAME")}</th>
              <th className="table-head-bg text-nowrap">
                {t("ACTIVE SUBSCRIPTIONS")}
              </th>
              <th className="table-head-bg text-nowrap">{t("SPENDINGS")}</th>
            </tr>
          </thead>
          <tbody>
            {isFetchSubscriptions ? (
              <tr>
                <td colSpan="3" className="text-center py-3">
                  <div
                    className="spinner-border spinner-border-lg fs-15 text-primary"
                    role="status"
                  ></div>
                </td>
              </tr>
            ) : (
              groupedCategories?.map((category, index) => (
                <tr key={index}>
                  <th scope="row" className="py-3 ps-5">
                    <span className="fs-16 fw-500">{category.name}</span>
                  </th>
                  <td className="text-muted fs-14 fw-500 py-3">
                    {category.activeSubscriptions}
                  </td>
                  <td className="text-muted fs-14 fw-500 py-3">
                    ${category.totalSpendings.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Subscription;
