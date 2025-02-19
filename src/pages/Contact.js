import React, { useState } from 'react';
import '../assets/style/globals.css';
import Select from "react-select";
import {
  Button,
  FormGroup,
  Label,
  Input,

} from 'reactstrap';
import { useNavigate } from "react-router-dom";
import { showToast } from "../helper/alerts/index";
import axiosInstance from '../services/Interceptor'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
const Contact = () => {
  const [btnLoader, setBtnLoader] = useState(false);
  const navigate = useNavigate();
  const [issues, setIssues] = useState([
    { value: "Technical Issue", label: "Technical Issue" },
    { value: "Downtime", label: "Downtime" },
    { value: "Billing Issue", label: "Billing Issue" },
    { value: "Account Access", label: "Account Access" },
    { value: "Other", label: "Other" },
    ]);

  const initialValues = {
    issue: null,
    subject: '',
    description: '',
  };

  const validationSchema = Yup.object({
    issue: Yup.object()
      .nullable()
      .required('Issue is required'),
    subject: Yup.string()
      .trim()
      .required('Subject is required'),
    description: Yup.string()
      .trim()
      .required('Description is required'),
  });
  const handleSubmit = async (values) => {
    
      try {
        setBtnLoader(true);
        const  result = await axiosInstance.post(`/complain/createComplaint`, {
          issue: values?.issue?.value,
          subject:values?.subject,
          description:values?.description
          });
          console.log("result",result)
        if (result.status === 200 || result.status === 201) {
          
          setBtnLoader(false);
            showToast(result?.data?.message, "success", "top-end");
            navigate("/otp");
        }
      } catch (error) {
        setBtnLoader(false);
        console.error("Error:", error);
      }
  };
  return (
    <>
      <p className='page-heading fs-20  '>Need help? Contact our friendly support team for assistance <br /> with any inquiries or issues.</p>
      <h2 className='fs-20 fw-600 mt-2'> Generate Ticket</h2>
      <h2 className='fs-16 fw-600 mt-2 dark-purple'> Ticket ID: FAWER123456</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="row mt-2">
              <div className="col-12 col-lg-8">
                <FormGroup>
                  <Label for="issue" className="fs-14 fw-500">
                    Issues
                  </Label>
                  <Select
                    options={issues}
                    placeholder="Select Issue"
                    value={values.issue}
                    onChange={(selected) => setFieldValue('issue', selected)}
                    isSearchable={true}
                  />
                  <ErrorMessage
                    name="issue"
                    component="div"
                    className="text-danger fs-12 mt-1"
                  />
                </FormGroup>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-12 col-lg-8">
                <FormGroup>
                  <Label for="subject" className="fs-14 fw-500">
                    Subject
                  </Label>
                  <Field
                    id="subject"
                    name="subject"
                    placeholder="Enter Subject"
                    type="text"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="subject"
                    component="div"
                    className="text-danger fs-12 mt-1"
                  />
                </FormGroup>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-12 col-lg-8">
                <FormGroup>
                  <Label for="description" className="fs-14 fw-500">
                    Description
                  </Label>
                  <Field
                    id="description"
                    name="description"
                    placeholder="Enter Description"
                    as="textarea"
                    rows="8"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-danger fs-12 mt-1"
                  />
                </FormGroup>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-12 col-lg-8 text-end">
                <Button
                  type="submit"
                  className="fw-500 fs-15 btn-fill-color border-1 border-white py-2 px-5"
                >
                  {btnLoader ? (
                        <div
                          className="spinner-border spinner-border-sm fs-12 text-primary"
                          role="status"
                        ></div>
                      ) : (
                        "Save"
                      )}
                  
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>

    </>
  );
};

export default Contact;
