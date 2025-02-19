import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  FormGroup,
  Button,
  Form,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import avatar from "../assets/images/header/avatar.png";
import axiosInstance from "../services/Interceptor";
import { showToast } from "../helper/alerts/index";

import { useSelector, useDispatch } from 'react-redux';
import { Formik, Field, ErrorMessage } from 'formik';
import { setUserData } from '../redux/action';
import * as Yup from 'yup';

const PersonalData = ({ isOpenPersonalData, setIsOpenPersonalData }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);
  const [btnLoader, setBtnLoader] = useState(false);
  const [isOpenImageModal, setIsOpenImageModal] = useState(false);
  const [oldImg, setOldImg] = useState(userData.photo ? userData?.photo : avatar);
  const [croppedImg, setCroppedImg] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setOldImg(reader.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = useCallback(() => {
    const canvas = document.createElement("canvas");
    const image = new Image();
    image.src = oldImg;

    image.onload = () => {
      const ctx = canvas.getContext("2d");
      const { width, height } = croppedAreaPixels;
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        width,
        height
      );

      const croppedImage = canvas.toDataURL("image/jpeg");
      setCroppedImg(croppedImage);
      // console.log("croppedImage", croppedImage)
      setIsOpenImageModal(false);
    };
  }, [croppedAreaPixels, oldImg, setIsOpenImageModal]);

  function base64ToBlob(base64, mimeType = 'image/jpeg') {
    const byteString = atob(base64.split(',')[1]); // Decode base64
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeType });
  }

  const validationSchema = Yup.object({

    email: Yup.string().email('Invalid email address').required('E-mail address is required'),
    name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
    phone: Yup.string().matches(/^\+?\d{8,12}$/, 'Enter a valid phone number').required('Phone number is required'),

  });

  const initialValues = {
    email: userData?.email,
    name: userData?.name,
    phone: userData?.phone,
  };

  const handlePersonalData = async (values) => {
    try {

      const token = localStorage.getItem("token");
      setBtnLoader(true)
      const formData = new FormData();
      if (croppedImg) {
        const blob = base64ToBlob(croppedImg);
        formData.append('photo', blob, 'cropped-image.jpg');
      } else {
        formData.append('photo', oldImg);
      }
      formData.append('email', userData?.email);
      formData.append('phone', values.phone);
      formData.append('name', values.name);


      const result = await axiosInstance.patch('/users/updateUser', formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (result.status === 200) {
        dispatch(setUserData(result?.data?.user));
        setBtnLoader(false)

        showToast(result?.data?.message, "success", "top-end");
      } else {
        setBtnLoader(false);
      }
    } catch (error) {
      setBtnLoader(false);
      console.error("Error updating user:", error);
    }
  };

  return (
    <>
      <Offcanvas
        isOpen={isOpenPersonalData}
        toggle={() => setIsOpenPersonalData(!isOpenPersonalData)}
        direction="end"
        backdrop={false}
      >
        <OffcanvasHeader
          toggle={() => setIsOpenPersonalData(!isOpenPersonalData)}
          className="border-bottom fs-16"
        >
          Personal Data
        </OffcanvasHeader>
        <OffcanvasBody>
          <div className="text-center">

            <img src={userData.photo ? process.env.REACT_APP_BACKEND_URL + "/" + userData.photo : avatar} width={80} height={80} className='rounded-circle' alt="User Avatar" />

            <p className="fs-16 fw-600 mt-3">{userData?.name}</p>
            <Button
              className="fw-500 fs-15 btn-light-purple-color border-0 py-2 rounded-4"
              type="button"
              onClick={() => setIsOpenImageModal(!isOpenImageModal)}
            >
              Change
            </Button>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values) => handlePersonalData(values)}
            >
              {({ handleSubmit }) => (
                <Form className="text-start" onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <FormGroup>
                    <Label htmlFor="email" className="text-color fs-14 fw-500">
                      E-mail address
                    </Label>
                    <div className="d-flex align-items-center position-relative border rounded-3">
                      <Field
                        name="email"
                        type="email"
                        className="form-control fw-400 fs-12 border-0 ps-4 py-3 shadow-none"
                        id="email"
                        placeholder="Email"
                        disabled={true}
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger fs-12 mt-1"
                    />
                  </FormGroup>

                  {/* Name Field */}
                  <FormGroup>
                    <Label htmlFor="name" className="text-color fs-14 fw-500">
                      Name
                    </Label>
                    <div className="d-flex align-items-center position-relative border rounded-3">
                      <Field
                        name="name"
                        type="text"
                        className="form-control fw-400 fs-12 border-0 ps-4 py-3 shadow-none"
                        id="name"
                        placeholder="Name"
                      />
                    </div>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-danger fs-12 mt-1"
                    />
                  </FormGroup>

                  {/* Phone Field */}
                  <FormGroup>
                    <Label htmlFor="phone" className="text-color fs-14 fw-500">
                      Phone No.
                    </Label>
                    <div className="d-flex align-items-center position-relative border rounded-3">
                      <Field
                        name="phone"
                        type="tel" 
                        className="form-control fw-400 fs-12 border-0 ps-4 py-3 shadow-none"
                        id="phone"
                        placeholder="Phone No."
                        pattern="[0-9+]*" 
                        maxLength={15} 
                      />
                    </div>
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-danger fs-12 mt-1"
                    />
                  </FormGroup>

                  <div className="mt-5 pt-5 text-center">
                    <Button
                      className="fw-500 fs-15 btn-fill-color border-1 border-white py-2 px-5 rounded-4"
                      type="submit"
                    >
                      {btnLoader ? (
                        <div
                          className="spinner-border spinner-border-sm fs-12 text-primary"
                          role="status"
                        ></div>
                      ) : (
                        " Save"
                      )}

                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </OffcanvasBody>
      </Offcanvas>
      <Modal
        isOpen={isOpenImageModal}
        toggle={() => setIsOpenImageModal(!isOpenImageModal)}
      >
        <ModalHeader
          toggle={() => setIsOpenImageModal(!isOpenImageModal)}
          className="border-0"
        ></ModalHeader>
        <ModalBody>
          <h2 className="fs-20 fw-600 text-center mt-0">
            Change Profile Image
          </h2>
          {oldImg ? (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 400,
                background: "#333",
              }}
            >
              <Cropper
                image={oldImg}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
          ) : (
            <p className="text-center">No image selected</p>
          )}
          <div className="text-center mt-3">
            <p
              className="dark-purple cursor-pointer"
              onClick={() => document.getElementById("hiddenFileInput").click()}
            >
              Upload New Image
            </p>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="hiddenFileInput"
              className="d-none"
            />
          </div>
          <div className="text-center mt-4">
            <Button
              type="button"
              onClick={handleSave}
              disabled={!croppedAreaPixels}
              className="fw-500 fs-15 btn-fill-color border-1 border-white py-2 px-5 rounded-4"
            >
              Save
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default PersonalData;
