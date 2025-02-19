import React, { useState, useEffect, useRef } from 'react';
import '../assets/style/globals.css';
import Select from "react-select";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Progress
} from 'reactstrap';
import { showToast } from "../helper/alerts";
import breadcrumbHome from '../assets/images/breadcrumbHome.svg'
import breadcrumbArrowRight from '../assets/images/breadcrumbArrowRight.svg'
import calendar from '../assets/images/calendar.svg'
import bannerImage from '../assets/images/bannerImage.svg'
import edit from '../assets/images/edit.svg'
import deleteIcon from '../assets/images/delete.svg'
import checkbox from '../assets/images/checkbox.svg'
import fileIcon from '../assets/images/fileIcon.svg'
import axiosInstance from '../services/Interceptor'
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { setSelectedSubscription } from '../redux/action';
import { useDispatch } from 'react-redux';
const NewSubscription = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedSubscription = useSelector(state => state.selectedSubscription)
  const [isUploadFileModal, setIsUploadFileModal] = useState(false)
  const [subscriptionName, setSubscriptionName] = useState('')
  const [subscriptionDescription, setSubscriptionDescription] = useState('')
  const [subscriptionPrice, setSubscriptionPrice] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBilling, setSelectedBilling] = useState('')
  const [selectedReminder, setSelectedReminder] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const [renewalDate, setRenewalDate] = useState(new Date())
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showRenewalDateCalendar, setShowRenewalDateCalendar] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const hasFetched = useRef(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [files, setFiles] = useState([]);
  const [reminders, setReminders] = useState([
    { value: "1", label: "One day" },
    { value: "2", label: "Five days" },
    { value: "3", label: "One week" },
    { value: "4", label: "One month" }
  ]);

  const [categories, setCategories] = useState([]);

  const [billingCycles, setBillingCycles] = useState([
    { value: "1", label: "Weekly" },
    { value: "2", label: "Monthly" },
    { value: "3", label: "Semi-Annually" },
    { value: "4", label: "Annually" }
  ]);

  useEffect(() => {
    if (!hasFetched.current) {
      getCategories()
      initializeValues()
      hasFetched.current = true;
    }
  }, [])
  const initializeValues = () => {
    if (selectedSubscription !== null) {
      setSubscriptionName(selectedSubscription?.subscription_name)
      // setSelectedCategory({ value: selectedSubscription?.subscription_ctg, label: selectedSubscription?.subscription_ctg })
      setSubscriptionDescription(selectedSubscription?.subscription_desc);
      setStartDate(new Date(selectedSubscription?.subscription_start))
      setRenewalDate(new Date(selectedSubscription?.subscription_end))
      setSelectedBilling({ value: selectedSubscription?.subscription_billing_cycle, label: selectedSubscription?.subscription_billing_cycle })
      setSubscriptionPrice(selectedSubscription?.subscription_price)
      setSelectedReminder({ value: selectedSubscription?.subscription_reminder, label: selectedSubscription?.subscription_reminder })
      // setFiles(selectedSubscription?.pdf)
      setImage(selectedSubscription?.photo)
      setPreview(process.env.REACT_APP_BACKEND_URL+"/"+selectedSubscription?.photo)
    }
  }
  const handleStartDate = (selectedDate) => {
    setStartDate(selectedDate);
    setShowStartDateCalendar(false); // Close the calendar after selection
  };

  const handleRenewalDate = (selectedDate) => {
    setRenewalDate(selectedDate);
    setShowRenewalDateCalendar(false); // Close the calendar after selection
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {

      if (file.size > 5 * 1024 * 1024) {
        setFileError('File size must be under 5MB.');
        return;
      }

      setFileError('');
      setSelectedFile(file);
    }
  };

  const handleSaveFile = () => {
    if (selectedFile) {
      setFiles((prevFiles) => [...prevFiles, selectedFile]);
      setSelectedFile(null);
      setIsUploadFileModal(false);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories/getCategories');
      if (response.status === 200) {
        const categoriesArray = response.data?.categories?.map((item) => ({
          value: item?._id,
          label: item?.category_name,
        })) || [];

        if (selectedSubscription !== null) {
          const selectedCategory = response.data?.categories?.find(
            (item) => item?._id === selectedSubscription?.subscription_ctg
          );
          if (selectedCategory) {
            setSelectedCategory({
              value: selectedCategory._id,
              label: selectedCategory.category_name,
            });
          }
        }

        setCategories(categoriesArray);
      } else {
        console.error('Failed to fetch categories: Unexpected response status', response.status);
      }
    } catch (error) {
      console.error('An error occurred while fetching categories:', error?.message || error);
    }
  };
  const createSubscription = async () => {
    if (
      subscriptionName &&
      subscriptionDescription &&
      subscriptionPrice &&
      selectedCategory?.value &&
      selectedBilling?.value &&
      selectedReminder?.value &&
      startDate &&
      renewalDate &&
      image
    ) {
      setBtnLoader(true);
      try {
        const formData = new FormData();
        let result = {}
        let array = []
        if (files?.length > 0) {
          files.forEach((file, index) => {
            array.push(file)

          });
        }
        formData.append('subscription_name', subscriptionName);
        formData.append('subscription_ctg', selectedCategory.value);
        formData.append('subscription_desc', subscriptionDescription);
        formData.append('subscription_start', startDate);
        formData.append('subscription_end', renewalDate);
        formData.append('subscription_billing_cycle', selectedBilling.label);
        formData.append('subscription_price', subscriptionPrice);
        formData.append('subscription_reminder', selectedReminder.label);
        formData.append('photo', image);
        if (files?.length > 0) {
          formData.append(`pdf`, array);
        }

        if (selectedSubscription !== null) {
          result = await axiosInstance.patch(`/subscriptions/updateSubscription/${selectedSubscription?._id}`, formData);

        }
        else {
          result = await axiosInstance.post('/subscriptions/createSubscription', formData);

        }

        if (result.status === 200) {
          dispatch(setSelectedSubscription(null));
          navigate("/subscription");
          setBtnLoader(false);
          console.log('Subscription created successfully');
          showToast('Subscription created successfully', 'success', 'top-end');
        }
      } catch (error) {
        setBtnLoader(false);
        console.error('Error creating subscription:', error.response?.data || error.message);
        showToast(error.response?.data?.message || 'Error creating subscription', 'error', 'top-end');
      }
    } else {
      setBtnLoader(false);
      showToast('Please fill all required fields', 'error', 'top-end');
      console.error('Required fields are missing');
    }
  };

  return (
    <div className="container">
      <div className='d-flex justify-content-start gap-2'>
        <img src={breadcrumbHome} width={20} height={20} alt='home' className='cursor-pointer' />
        <img src={breadcrumbArrowRight} width={20} height={20} alt='rightArrow' />
        <p className='fs-14 text-muted fw-500 cursor-pointer'>Subscriptions</p>
        <img src={breadcrumbArrowRight} width={20} height={20} alt='rightArrow' />
        <p className='fs-14 fw-500 dark-purple cursor-pointer'>New Subscription</p>
      </div>

      <div className='d-flex justify-content-end gap-2'>

        <Button type='button' className=' fw-500 fs-15  btn-fill-color border-1 border-white py-2' onClick={() => setIsUploadFileModal(!isUploadFileModal)} ><span className='fw-600 fs-15'>+</span> Add Document</Button>
      </div>
      <Form>
        <div className='d-flex justify-content-center my-4'>
          <div className='text-center border rounded px-5 py-5 bg-light'>
            <div className="image-upload-container">
              <div className="image-upload">
                {preview ? (
                  <div className="image-preview position-relative ">
                    <img src={preview} alt="uploaded" className="uploaded-image" width={100} height={100} />
                    <img src={deleteIcon} alt="uploaded" className="icon-button position-absolute bottom-0 cursor-pointer" width={20} height={20} onClick={handleRemoveImage} />
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <label htmlFor="fileInput" className="icon-button">
                      <div className="upload-placeholder position-relative">
                        <img src={bannerImage} alt="uploaded" className="uploaded-image" width={100} height={100} />
                        <img src={edit} alt="uploaded" className="uploaded-image position-absolute bottom-0 end-0 cursor-pointer" width={20} height={20} />
                        <input
                          type="file"
                          id="fileInput"
                          accept=".png, .jpg, .jpeg, .svg"
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                        />
                      </div>
                    </label>
                    <input
                      type="file"
                      id="fileInput"
                      accept=".png, .jpg, .jpeg, .svg"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </div>
                )}
              </div>
            </div>
            {/* <h2 className='fs-20 fw-600 mt-2'>Name</h2>
            <p className='text-muted fs-14 fw-500'> Pricing</p> */}
          </div>
        </div>

        <div className='row'>
          <div className='col-12 col-md-6'>
            <FormGroup>
              <Label for="name" className='fs-14 fw-500'>
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter Name"
                type="text"
                value={subscriptionName}
                onChange={(e) => setSubscriptionName(e.target.value)}
              />
            </FormGroup>
          </div>
          <div className='col-12 col-md-6'>
            <FormGroup>
              <Label for="name" className='fs-14 fw-500'>
                Category
              </Label>
              <Select
                options={categories}
                placeholder="Select Category"
                value={selectedCategory}
                isSearchable={true}
                onChange={(selected) => {
                  setSelectedCategory(selected)
                }}
              />
            </FormGroup>
          </div>

        </div>
        <div className='row'>
          <div className='col-12'>
            <FormGroup>
              <Label for="description" className='fs-14 fw-500'>
                Description
              </Label>
              <Input
                id="description"
                name="text"
                type="textarea"
                placeholder='Enter Description'
                value={subscriptionDescription}
                onChange={(e) => setSubscriptionDescription(e.target.value)}
              />
            </FormGroup>
          </div>

        </div>
        <div className='row'>
          <div className='col-12 col-md-6'>
            <FormGroup>
              <Label for="startDate" className='fs-14 fw-500'>
                Start Date
              </Label>
              <div className="d-flex align-items-center border pe-1 rounded cursor-pointer">
                <Input
                  type="text"
                  id="startDate"
                  value={startDate.toLocaleDateString()}
                  readOnly
                  className='border-0 cursor-pointer'
                  onClick={() => setShowStartDateCalendar(!showStartDateCalendar)}
                />
                <img src={calendar} alt='icon' onClick={() => setShowStartDateCalendar(!showStartDateCalendar)} />
              </div>
              <div className="position-relative">
                {showStartDateCalendar && (
                  <div className="position-absolute bg-white shadow rounded" style={{ zIndex: 1000 }}>
                    <Calendar
                      onChange={handleStartDate}
                      value={startDate}
                      // maxDate={new Date()}
                      className="shadow-none border-0 outline-0 fs-16 mt-2 py-1 ps-0 fw-500 cursor-pointer my-3"
                      formatShortWeekday={(locale, date) =>
                        ["S", "M", "T", "W", "T", "F", "S"][date.getDay()]
                      }
                      calendarClassName="custom-calendar"
                    />
                  </div>
                )}
              </div>
            </FormGroup>
          </div>
          <div className='col-12 col-md-6'>
            <FormGroup>
              <Label for="renewalDate" className='fs-14 fw-500'>
                Renewal Date
              </Label>
              <div className="d-flex align-items-center border rounded pe-1 cursor-pointer">
                <Input
                  type="text"
                  id="renewalDate"
                  value={renewalDate.toLocaleDateString()}
                  readOnly
                  className='border-0 cursor-pointer'
                  onClick={() => setShowRenewalDateCalendar(!showRenewalDateCalendar)}
                />
                <img src={calendar} alt='icon' onClick={() => setShowRenewalDateCalendar(!showRenewalDateCalendar)} />
              </div>
              <div className="position-relative">
                {showRenewalDateCalendar && (
                  <div className="position-absolute bg-white shadow rounded" style={{ zIndex: 1000 }}>
                    <Calendar
                      onChange={handleRenewalDate}
                      value={renewalDate}
                      // maxDate={new Date()}
                      className="shadow-none border-0 outline-0 fs-16 mt-2 py-1 ps-0 fw-500 cursor-pointer my-3"
                      formatShortWeekday={(locale, date) =>
                        ["S", "M", "T", "W", "T", "F", "S"][date.getDay()]
                      }
                      calendarClassName="custom-calendar"
                    />
                  </div>
                )}
              </div>
            </FormGroup>
          </div>
        </div>
        <div className='row'>
          <div className='col-12 col-md-6'>
            <FormGroup>
              <Label for="name" className='fs-14 fw-500'>
                Billing cycle
              </Label>
              <Select
                options={billingCycles}
                placeholder="Select Cycle"
                value={selectedBilling}
                isSearchable={true}
                onChange={(selected) => {
                  setSelectedBilling(selected)
                }}
              />
            </FormGroup>
          </div>
          <div className='col-12 col-md-6'>
            <FormGroup>
              <Label for="price" className='fs-14 fw-500'>
                Price
              </Label>
              <Input
                id="price"
                name="price"
                placeholder="Enter Price"
                type="number"
                value={subscriptionPrice}
                onChange={(e) => setSubscriptionPrice(e.target.value)}
              />
            </FormGroup>
          </div>

        </div>
        <div className='row'>
          <div className='col-12 col-md-6'>
            <FormGroup>
              <Label for="name" className='fs-14 fw-500'>
                Reminder
              </Label>
              <Select
                options={reminders}
                placeholder="Select Name"
                value={selectedReminder}
                isSearchable={true}
                onChange={(selected) => {
                  setSelectedReminder(selected)
                }}
              />
            </FormGroup>
          </div>
        </div>

      </Form>
      {files?.length > 0 && (<>

        <h2 className='fs-20 fw-600 mt-1'>Documents</h2>
        <div className='row '>
          {files?.length > 0 && (
            <>
              <div className="row">
                {files.map((file, index) => (
                  <>
                    <div className="col-3 col-md-1 text-center text-md-end mt-3">
                      <img src={fileIcon} alt="icon" className="mt-1" width={20} height={20} />
                    </div>
                    <div className="col-6 col-md-4 gx-0 mt-3">
                      <div>
                        <p className="fs-12 text-muted m-0">{file.name}</p>
                        <p className="fs-12 text-muted m-0">{(file.size / 1024).toFixed(2)} KB</p>
                        <Progress className="custom-progress" value={100} height={10} />
                      </div>
                    </div>
                    <div className="col-3 col-md-1 text-end mt-3">
                      <img src={checkbox} alt="icon" />
                    </div>
                  </>
                ))}
              </div>
            </>
          )}
        </div>
      </>)}

      <div className='d-flex justify-content-end gap-2 my-5 flex-wrap'>
        <Button type='button' className='btn-outline-color fw-500 fs-15 py-2 px-5' outline onClick={() => {
          navigate("/subscription")
          dispatch(setSelectedSubscription(null))
        }} >  Cancel</Button>
        <Button type='button' className=' fw-500 fs-15  btn-fill-color border-1 border-white py-2 px-5' onClick={() => createSubscription()}  >
          {btnLoader ? (
            <div
              className="spinner-border spinner-border-sm fs-12 text-primary"
              role="status"
            ></div>
          ) : (
            "Save"
          )}</Button>
      </div>
      <Modal isOpen={isUploadFileModal} toggle={() => setIsUploadFileModal(!isUploadFileModal)} >
        <ModalHeader toggle={() => setIsUploadFileModal(!isUploadFileModal)} className="border-0"></ModalHeader>
        <ModalBody>
          <div className="file-upload-container">
            <form className="text-center mb-3">
              <label htmlFor="file-upload" className="file-icon-label">
                <strong className="file-icon cursor-pointer">Upload File</strong>
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="file-input"
                hidden
              />
            </form>

            {fileError && <p className="file-error">{fileError}</p>}

            {selectedFile && (
              <div className="file-info">
                <p><strong>File Name:</strong> {selectedFile.name}</p>
                <p><strong>File Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>

                <div className="text-center mt-3">
                  <Button
                    onClick={handleSaveFile}
                    type="button"
                    className="fw-500 fs-15 btn-fill-color border-1 border-white py-2 px-5 text-center"
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ModalBody>
      </Modal>


    </div>
  );
};

export default NewSubscription;
