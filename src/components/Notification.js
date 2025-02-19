import React, { useState } from 'react';
import { Dropdown } from "react-bootstrap";
import avatar from '../assets/images/header/avatar.png';
import bell from '../assets/images/header/bell.svg'

const Notification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <Dropdown className="bg-transparent" align="end" offset={[-140, 0]}>
        <Dropdown.Toggle className="border-0 px-0 fw-600 bg-transparent fs-30 text-dark  dropdown-arrow-hidden">
          <img
            src={bell}
            width={40}
            height={40}
            alt="User Avatar"
            className="cursor-pointer  ms-md-2"
          />
        </Dropdown.Toggle>

        <Dropdown.Menu style={{width:350}}>
          <Dropdown.Item className=' bg-white'>
            <div className='d-flex justify-content-between mb-0'>
              <p className='fs-15 fw-600 mb-0'>Notifications</p>
              <p className='fs-13 fw-500 text-color-red mb-0' >CLEAR ALL</p>
            </div>
          </Dropdown.Item>
          <hr />
          <Dropdown.Item className=' bg-white'>
            <div className='d-flex justify-content-start mt-2'>
              <img
                src={avatar}
                width={45}
                height={45}
                alt="User Avatar"
                className="cursor-pointer rounded-circle me-2"
              />
              <div>
                <p className='fs-14 fw-600 m-0'>Alex have been  subscribed </p>
                <p className='fs-12 fs-500 text-color m-0'>10 May, 2025 10:20 PM</p>
              </div>
            </div>
          </Dropdown.Item>
          <Dropdown.Item className=' bg-white'>
            <div className='d-flex justify-content-start mt-2'>
              <img
                src={avatar}
                width={45}
                height={45}
                alt="User Avatar"
                className="cursor-pointer rounded-circle me-2"
              />
              <div>
                <p className='fs-14 fw-600 m-0'>Muhammad Ali have been  subscribed </p>
                <p className='fs-12 fs-500 text-color m-0'>10 May, 2025 10:20 PM</p>
              </div>
            </div>
          </Dropdown.Item> <Dropdown.Item className=' bg-white'>
            <div className='d-flex justify-content-start mt-2'>
              <img
                src={avatar}
                width={45}
                height={45}
                alt="User Avatar"
                className="cursor-pointer rounded-circle me-2"
              />
              <div>
                <p className='fs-14 fw-600 m-0'>Abubakar have been  subscribed </p>
                <p className='fs-12 fs-500 text-color m-0'>10 May, 2025 10:20 PM</p>
              </div>
            </div>
          </Dropdown.Item> <Dropdown.Item className=' bg-white'>
            <div className='d-flex justify-content-start mt-2'>
              <img
                src={avatar}
                width={45}
                height={45}
                alt="User Avatar"
                className="cursor-pointer rounded-circle me-2"
              />
              <div>
                <p className='fs-14 fw-600 m-0'>Shahid have been  subscribed </p>
                <p className='fs-12 fs-500 text-color m-0'>10 May, 2025 10:20 PM</p>
              </div>
            </div>
          </Dropdown.Item> <Dropdown.Item className=' bg-white'>
            <div className='d-flex justify-content-start mt-2'>
              <img
                src={avatar}
                width={45}
                height={45}
                alt="User Avatar"
                className="cursor-pointer rounded-circle me-2"
              />
              <div>
                <p className='fs-14 fw-600 m-0'>Zaid have been  subscribed </p>
                <p className='fs-12 fs-500 text-color m-0'>10 May, 2025 10:20 PM</p>
              </div>
            </div>
          </Dropdown.Item>

        </Dropdown.Menu>
      </Dropdown>
    </>

  );
};

export default Notification;
