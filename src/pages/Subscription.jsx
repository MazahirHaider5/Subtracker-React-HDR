import React, { useState, useEffect, useRef } from 'react';
import '../assets/style/globals.css';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Dropdown } from "react-bootstrap";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Table,
  FormGroup,
  Label,
  
} from 'reactstrap';
import { showToast } from "../helper/alerts";
import dots from '../assets/images/dots.svg';
import { Link } from 'react-router-dom';
import axiosInstance from '../services/Interceptor'
import { showConfirmationAlert } from "../helper/alerts";
import { useDispatch } from 'react-redux';
import { setSelectedSubscription } from '../redux/action';
import { useTranslation } from 'react-i18next';
const Subscription = () => {
  const { t } = useTranslation('Translate')
  const dispatch = useDispatch();
  const [btnLoader, setBtnLoader] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(false);
  const [isAddCategory, setIsAddCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isFetchCategories, setIsFetchCategories] = useState(false);
  const [isFetchSubscriptions, setIsFetchSubscriptions] = useState(false);


  const hasFetched = useRef(false);
  const validationSchema = Yup.object().shape({
    name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Name can only contain alphabets")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Name is required"),
    budget: Yup.number()
      .min(1, "Budget must be at least 1")
      .required("Budget is required"),
  });

  // Initial values
  const initialValues = {
    name: isEditMode && selectedCategory ? selectedCategory.category_name : "",
    budget: isEditMode && selectedCategory ? selectedCategory.category_budget : "",
  };
  function formatDate(dateString) {
    const date = new Date(dateString);

    // Extract components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Format as "MM/DD/YYYY HH:mm"
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  }
  useEffect(() => {
    if (!hasFetched.current) {
      getCategories()
      getSubscriptions()
      dispatch(setSelectedSubscription(null))
      hasFetched.current = true;
    }
  }, [])
  const getSubscriptions = async () => {
    try {
      setIsFetchSubscriptions(true)

      const result = await axiosInstance.get('/subscriptions/mySubscriptions',
      );
      if (result.status === 200) {
        setIsFetchSubscriptions(false)

        setSubscriptions(result?.data?.subscriptions)
      }
    } catch (error) {
      setIsFetchSubscriptions(false)

    }
  }
  const getCategories = async () => {
    setIsFetchCategories(true)
    try {
      const result = await axiosInstance.get('/categories/getCategories',
      );
      if (result.status === 200) {
        setIsFetchCategories(false)

        setCategories(result?.data?.categories)
      }
    } catch (error) {
      setIsFetchCategories(false)
    }
  }
  const handleSubmit = async (values) => {
    try {
      setBtnLoader(true);
      let result;

      if (isEditMode) {
        // Update category API
        result = await axiosInstance.patch(`/categories/updateCategory/${selectedCategory?._id}`, {
          category_name: values?.name,
          category_budget: values?.budget,
        });
      } else {
        // Add category API
        result = await axiosInstance.post("/categories/createCategory", {
          category_name: values?.name,
          category_budget: values?.budget,
        });
      }

      if (result.status === 200 || result.status === 201) {
        setBtnLoader(false);
        setIsAddCategory(false);
 showToast(result?.data.message, 'success', 'top-end');
        getCategories(); // Refresh categories
      }
    } catch (error) {
      setBtnLoader(false);
      console.error("Error:", error);
    }
  };
  const isShowCategoryDropdown = (data) => {
    return (
      <Dropdown
        className="bg-white ggg"
        align="end"
        autoClose="outside"
        popperConfig={{ modifiers: [{ name: 'preventOverflow', enabled: false }] }}
        container="body" // Render outside the table
      >
        <Dropdown.Toggle className="border-0 bg-white dropdown-arrow-hidden">
          <img src={dots} alt="Options" width={20} height={20} className="text-center" />
        </Dropdown.Toggle>
  
        <Dropdown.Menu className="p-0">
          <Dropdown.Item className="p-0" onClick={() => onEditCategory(data)}>
            <Link
              to="#"
              className="d-block fs-14 py-2 ps-3 hover-effect border-bottom bg-white text-decoration-none"
            >
              <span className="fs-13 fw-400 text-color">Edit</span>
            </Link>
          </Dropdown.Item>
          <Dropdown.Item className="p-0" onClick={() => onDeleteCategory(data)}>
            <Link
              to="#"
              className="d-block fs-14 py-2 ps-3 hover-effect border-bottom bg-white text-decoration-none"
            >
              <span className="fs-13 fw-400 text-color">Delete</span>
            </Link>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };
  const isShowSubscriptionDropdown = (data) => {
    return (
      <Dropdown className="bg-white" align="end" offset={[-140, 0]}>
        <Dropdown.Toggle
          className=" border-0  bg-white dropdown-arrow-hidden"
        >
          <img src={dots} alt='Options' width={20} height={20} className='text-center' />
        </Dropdown.Toggle>

        <Dropdown.Menu className='p-0'>
          <Dropdown.Item className="p-0" onClick={() => {
            dispatch(setSelectedSubscription(data));
          }}>
            <Link
              to="/new-subscription"
              className="d-block fs-14 py-2 ps-3 hover-effect border-bottom bg-white text-decoration-none"
            >
              <span className="fs-13 fw-400 text-color">Edit</span>
            </Link>
          </Dropdown.Item>
          <Dropdown.Item className="p-0" onClick={() => onDeleteSubscription(data)}>
            <Link
              to="#"
              className="d-block fs-14 py-2 ps-3 hover-effect border-bottom bg-white text-decoration-none"
            >
              <span className="fs-13 fw-400 text-color">Delete</span>
            </Link>
          </Dropdown.Item>

        </Dropdown.Menu>
      </Dropdown>
    );
  };
  const onEditCategory = (data) => {
    setSelectedCategory(data)
    setIsEditMode(true)
    setIsAddCategory(true)

  }
  const onDeleteCategory = (data) => {
    confirmationCategoryDel(data)

  }
  const onDeleteSubscription = (data) => {
    confirmationSubscriptionDel(data)

  }
  const confirmationCategoryDel = async (data) => {
    const confirm = await showConfirmationAlert(
      "Are you sure you want to delete category?",
      "warning"
    );
    if (confirm?.isConfirmed) {
      deleteCategory(data)

    }
  }
  const deleteCategory = async (data) => {
    try {
      const result = await axiosInstance.delete(`/categories/deleteCategory/${data?._id}`
      );
      if (result.status === 200) {
        showToast(result?.data.message, 'success', 'top-end');
        getCategories()
      }
    } catch (error) {
    }
  }
  const confirmationSubscriptionDel = async (data) => {
    const confirm = await showConfirmationAlert(
      "Are you sure you want to delete subscription?",
      "warning"
    );
    if (confirm?.isConfirmed) {
      deleteSubscription(data)

    }
  }
  const deleteSubscription = async (data) => {
    try {
      const result = await axiosInstance.delete(`/subscriptions/deleteSubscription/${data?._id}`
      );
      if (result.status === 200) {
        showToast(result?.data.message, 'success', 'top-end');
        getSubscriptions()
      }
    } catch (error) {
    }
  }
  useEffect(() => {
    const layoutElement = document.getElementById('layout');
    if (isAddCategory) {
      layoutElement.style.filter = 'blur(3px)';
    } else {
      layoutElement.style.filter = 'none';
    }
  }, [isAddCategory])
  return (
    <div className='container'>
      <p className='page-heading fs-20'>{t("Here you can view and manage all your subscriptions")}</p>
      <div className='d-flex justify-content-end gap-2 flex-wrap'>
        <Button type='button' className='btn-outline-color fw-500 fs-15 py-2' outline onClick={() => {
          setIsAddCategory(!isAddCategory)
          setIsEditMode(false)
        }
        }>
          <span className='fw-600 fs-15'>+</span> {t("Add Category")}
        </Button>
        <Link to="/new-subscription">
          <Button type='button' className='fw-500 fs-15 btn-fill-color border-1 border-white py-2'>
            <span className='fw-600 fs-15'>+</span> {t("Add Subscription")}
          </Button>
        </Link>
      </div>
      <div className='mt-3 border rounded  '>
        <Table responsive>
          <thead>
            <tr>
              <th className="table-head-bg text-nowrap ps-5">{t("SUBSCRIPTION")}</th>
              <th className="table-head-bg text-nowrap">{t("START DATE")}</th>
              <th className="table-head-bg text-nowrap">{t("RENEWAL DATE")}</th>
              <th className="table-head-bg text-nowrap">{t("PRICE")}</th>
              <th className="table-head-bg text-nowrap">{t("OPTIONS")}</th>
            </tr>
          </thead>
          <tbody>
            {isFetchSubscriptions ?
              <div
                className="spinner-border spinner-border-lg fs-15 text-primary  ms-5 mt-3"
                role="status"
              ></div>
              :
              subscriptions?.map((item, index) => (
                <tr  key={index}>
                  <th scope="row" className='py-3 ps-5'>
                    <img crossOrigin="anonymous" src={process.env.REACT_APP_BACKEND_URL + "/" + item?.photo} width={20} height={20} alt='icon' className='rounded' />
                    <span className='fs-16 fw-500 ms-2'>{item?.subscription_name}</span>
                  </th>
                  <td className='text-muted fs-14 fw-500 py-3'>{formatDate(item?.subscription_start)}</td>
                  <td className='text-muted fs-14 fw-500 py-3'>{formatDate(item?.subscription_end)}</td>
                  <td className='text-muted fs-14 fw-500 py-3'>${item?.subscription_price}</td>
                  <td className='text-start'>{isShowSubscriptionDropdown(item)}</td>
                </tr>
              ))
            }

          </tbody>
        </Table>
      </div>
      <h2 className='fs-24 fw-600 my-3'>{t("Categories")}</h2>
      <div className='my-2 border rounded'>
        <Table responsive>
          <thead>
            <tr>
              <th className="table-head-bg text-nowrap ps-5">{t("NAME")}</th>
              <th className="table-head-bg text-nowrap">{t("CREATION DATE")}</th>
              <th className="table-head-bg text-nowrap">{t("ACTIVE SUBSCRIPTIONS")}</th>
              <th className="table-head-bg text-nowrap">{t("TOTAL BUDGET")}</th>
              <th className="table-head-bg text-nowrap">{t("SPENDINGS")}</th>
              <th className="table-head-bg text-nowrap">{t("OPTIONS")}</th>
            </tr>
          </thead>
          <tbody>
            {isFetchCategories ?
              <div
                className="spinner-border spinner-border-lg fs-15 text-primary ms-5 mt-3"
                role="status"
              ></div>
              :
              categories?.map((item, index) => (
                <tr  key={index}>
                  <th scope="row" className='py-3  ps-5'>
                    <p className='fs-16 fw-500'>{item?.category_name}</p>
                  </th>
                  <td className='text-muted fs-14 fw-500 py-3'>{formatDate(item?.createdAt)}</td>
                  <td className='text-muted fs-14 fw-500 py-3'>{item?.active_subscriptions}</td>
                  <td className='text-muted fs-14 fw-500 py-3'>{item?.total_budget}</td>
                  <td className='text-muted fs-14 fw-500 py-3'>{item?.spendings}</td>
                  <td className='text-start'>{isShowCategoryDropdown(item)}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>

      <Modal centered backdrop={false} isOpen={isAddCategory} toggle={() => setIsAddCategory(!isAddCategory)}>
        <ModalHeader toggle={() => setIsAddCategory(!isAddCategory)} className="border-0 fs-13 fw-300"></ModalHeader>
        <ModalBody>
          <h2 className="fs-25 fw-400 text-center mt-0">
            {isEditMode ? t("Edit Category") : t("Add Category")}
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize // Ensures form updates with new initialValues
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="name" className="fs-14 fw-500">
                     {t('Name')} 
                  </Label>
                  <Field
                    id="name"
                    name="name"
                    placeholder={t('Enter Name')}
                    type="text"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-danger fs-12 mt-1"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="budget" className="fs-14 fw-500">
                   
                  {t('Total Budget')}  
                  </Label>
                  <Field
                    id="budget"
                    name="budget"
                    placeholder= {t('Enter Budget')}
                    type="number"
                    className="form-control"
                    onKeyDown={(e) => {
                      if (["-", "+", "e"].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  <ErrorMessage
                    name="budget"
                    component="div"
                    className="text-danger fs-12 mt-1"
                  />
                </FormGroup>
                <FormGroup className="text-center">
                  <Button
                    type="submit"
                    className="fw-500 fs-15 btn-fill-color border-1 border-white py-2 px-5 text-center"
                  >
                    {btnLoader ? (
                      <div
                        className="spinner-border spinner-border-sm fs-12 text-primary"
                        role="status"
                      ></div>
                    ) : (
                      isEditMode ? "Update" : "Add"
                    )}
                  </Button>
                </FormGroup>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Subscription;
