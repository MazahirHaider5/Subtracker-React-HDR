import React, { useState } from 'react';
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
} from 'reactstrap';

import breadcrumbHome from '../assets/images/breadcrumbHome.svg'
import breadcrumbArrowRight from '../assets/images/breadcrumbArrowRight.svg'
import calendar from '../assets/images/calendar.svg'
import checkbox from '../assets/images/checkbox.svg'
import fileIcon from '../assets/images/fileIcon.svg'
import subscriptionIcon from '../assets/images/renewal01.svg'
import documentDelete from '../assets/images/documentDelete.svg'
import editPencil from '../assets/images/editPencil.svg'
import deleteIcon from '../assets/images/deleteIcon.svg'


const SpotifySubscription = () => {
  const [isUploadFileModal, setIsUploadFileModal] = useState(false)
  const [selectedName, setSelectedName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBilling, setSelectedBilling] = useState('')
  const [selectedReminder, setSelectedReminder] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const [renewalDate, setRenewalDate] = useState(new Date())
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showRenewalDateCalendar, setShowRenewalDateCalendar] = useState(false);



  const [reminders, setReminders] = useState([
    { value: "1", label: "Reminder-01" },
    { value: "2", label: "Reminder-02" },
    { value: "3", label: "Reminder-03" },
    { value: "4", label: "Reminder-04" }]);


  const [names, setNames] = useState([
    { value: "1", label: "Name-01" },
    { value: "2", label: "Name-02" },
    { value: "3", label: "Name-03" },
    { value: "4", label: "Name-04" }]);

  const [categories, setCategories] = useState([
    { value: "1", label: "category-01" },
    { value: "2", label: "category-02" },
    { value: "3", label: "category-03" },
    { value: "4", label: "category-04" }]);

  const [billings, setBillings] = useState([
    { value: "1", label: "Billing-01" },
    { value: "2", label: "Billing-02" },
    { value: "3", label: "Billing-03" },
    { value: "4", label: "Billing-04" }]);

  const handleStartDate = (selectedDate) => {
    setStartDate(selectedDate);
    setShowStartDateCalendar(false); 
  };

  const handleRenewalDate = (selectedDate) => {
    setRenewalDate(selectedDate);
    setShowRenewalDateCalendar(false); 
  };
  return (
    <div className='container'>
      <div className='d-flex justify-content-start gap-2'>
        <img src={breadcrumbHome} width={20} height={20} alt='home' className='cursor-pointer' />
        <img src={breadcrumbArrowRight} width={20} height={20} alt='rightArrow' />
        <p className='fs-14   fw-500 text-muted cursor-pointer'>Subscriptions</p>
        <img src={breadcrumbArrowRight} width={20} height={20} alt='rightArrow' />
        <p className='fs-14  fw-500  dark-purple cursor-pointer'>New Subscription</p>
      </div>

      <div className='d-flex justify-content-end gap-2'>
        {/* onClick={() => setIsUploadFileModal(!isUploadFileModal)}  */}
        <img src={deleteIcon} alt="delete" className="cursor-pointer" />
        <Button type='button' className='btn-outline-color fw-500 fs-15 px-4 py-1' outline  >  <img src={editPencil} alt="icon" width={15} height={15} className="me-1"/> Edit</Button>
        <Button type='button' className=' fw-500 fs-15  btn-fill-color border-1 border-white py-2 px-4'  ><span className='fw-600 fs-15'>+</span> Add Document</Button>
      </div>
      <Form>
        <div className='d-flex justify-content-center my-4'>
          <div className='text-center border rounded px-5 py-4 bg-light'>
            <img src={subscriptionIcon} alt='icon' width={70} height={70} />
            <h2 className='fs-20 fw-600 mt-2'>SignNTrack</h2>
            <p className='text-color-light fs-14 fw-500'> $5.99/month</p>
          </div>
        </div>

        <div className='row'>
          <div className='col-12 col-md-6'>
            <FormGroup>
              <Label for="name" className='fs-14 fw-500'>
                Name
              </Label>
              <Select
                options={names}
                placeholder="Select Name"
                value={selectedName}
                isSearchable={true}
                onChange={(selected) => {
                  setSelectedName(selected)
                }}
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
                      maxDate={new Date()}
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
                      maxDate={new Date()}
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
                options={billings}
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
      <h2 className='fs-20 fw-600 mt-1'>Documents</h2>
      <div className='row mt-4 '>
        <div className='col-12  col-md-6'>
          <div className='row border rounded p-2 mb-4 mx-1 bg-white'>
            <div className='col-3 col-md-3 col-lg-2 text-start text-sm-center text-md-center text-lg-center mt-md-0 mt-3'>
              <img src={fileIcon} alt='icon' className='mt-1' width={22} height={22} />
            </div>
            <div className='col-6 col-md-6 col-lg-8 gx-0 mt-md-0 mt-3'>
              <div>
                <p className='fs-12 text-muted m-0'>Tech design requirements.pdf</p>
                <p className='fs-12 text-muted m-0'>200 KB</p>
              </div>
            </div>
            <div className='col-3 col-md-3 col-lg-2 text-end mt-md-0 mt-3'>
              <img src={documentDelete} alt='icon' />
            </div>
          </div>
        </div>
        <div className='col-12  col-md-6'>
          <div className='row border rounded p-2 mb-4 mx-1 bg-white'>
            <div className='col-3 col-md-3 col-lg-2 text-start text-sm-center text-md-center text-lg-center mt-md-0 mt-3'>
              <img src={fileIcon} alt='icon' className='mt-1' width={22} height={22} />
            </div>
            <div className='col-6 col-md-6 col-lg-8 gx-0 mt-md-0 mt-3'>
              <div>
                <p className='fs-12 text-muted m-0'>Tech design requirements.pdf</p>
                <p className='fs-12 text-muted m-0'>200 KB</p>
              </div>
            </div>
            <div className='col-3 col-md-3 col-lg-2 text-end mt-md-0 mt-3'>
              <img src={documentDelete} alt='icon' />
            </div>
          </div>
        </div>
      </div>
      <div className='row mt-4 '>
        <div className='col-12  col-md-6'>
          <div className='row border rounded p-2 mb-4 mx-1 bg-white' >
            <div className='col-3 col-md-3 col-lg-2 text-start text-sm-center text-md-center text-lg-center mt-md-0 mt-3'>
              <img src={fileIcon} alt='icon' className='mt-1' width={22} height={22} />
            </div>
            <div className='col-6 col-md-6 col-lg-8 gx-0 mt-md-0 mt-3'>
              <div>
                <p className='fs-12 text-muted m-0'>Tech design requirements.pdf</p>
                <p className='fs-12 text-muted m-0'>200 KB</p>
              </div>
            </div>
            <div className='col-3 col-md-3 col-lg-2 text-end mt-md-0 mt-3'>
              <img src={documentDelete} alt='icon' />
            </div>
          </div>
        </div>
        <div className='col-12  col-md-6'>
          <div className='row border rounded p-2 mb-4 mx-1 bg-white'>
            <div className='col-3 col-md-3 col-lg-2 text-start text-sm-center text-md-center text-lg-center mt-md-0 mt-3'>
              <img src={fileIcon} alt='icon' className='mt-1' width={22} height={22} />
            </div>
            <div className='col-6 col-md-6 col-lg-8 gx-0 mt-md-0 mt-3'>
              <div>
                <p className='fs-12 text-muted m-0'>Tech design requirements.pdf</p>
                <p className='fs-12 text-muted m-0'>200 KB</p>
              </div>
            </div>
            <div className='col-3 col-md-3 col-lg-2 text-end mt-md-0 mt-3'>
              <img src={documentDelete} alt='icon' />
            </div>
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-end gap-2 my-5 flex-wrap'>
        <Button type='button' className='btn-outline-color fw-500 fs-15 py-2 px-5' outline  >  Cancel</Button>
        <Button type='button' className=' fw-500 fs-15  btn-fill-color border-1 border-white py-2 px-5'  > Save</Button>
      </div>

      <Modal isOpen={isUploadFileModal} toggle={() => setIsUploadFileModal(!isUploadFileModal)} >
        <ModalHeader toggle={() => setIsUploadFileModal(!isUploadFileModal)} className='border-0'></ModalHeader>
        <ModalBody>
          <h2 className='fs-20 fw-600 text-center  mt-0'> Add Document</h2>

        </ModalBody>

      </Modal>
    </div >
  );
};

export default SpotifySubscription;
