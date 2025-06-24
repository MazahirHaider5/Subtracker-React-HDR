import React, { useState } from "react";
import { Button, FormGroup, Label } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { showToast } from "../helper/alerts";
import axiosInstance from "../services/Interceptor";

const CheckEmail = () => {
  const { t } = useTranslation("Translate");
  const [btnLoader, setBtnLoader] = useState(false);

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("Enter a valid email"))
      .required(t("Email is required")),
  });

  const handleSubmit = async (values) => {
    try {
      setBtnLoader(true);
      const result = await axiosInstance.post(`/users/check-email`, {
        email: values.email,
      });

      if (result.status === 200) {
        showToast(result.data.message, "success", "top-end");
      }
    } catch (error) {
      console.error("Error:", error);
      const msg = error?.response?.data?.message || "Something went wrong";
      showToast(msg, "error", "top-end");
    } finally {
      setBtnLoader(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="bg-white p-4 p-md-5 shadow rounded"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h2 className="fs-20 fw-600 text-center mb-4">
          {t("Check Email Existence")}
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <FormGroup>
                <Label htmlFor="email" className="fs-15 fw-500">
                  {t("Email")}
                </Label>
                <Field
                  id="email"
                  name="email"
                  placeholder={t("Enter your email")}
                  type="email"
                  className="form-control shadow-none"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-danger fs-12 mt-1"
                />
              </FormGroup>

              <div className="text-end mt-4">
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
                    t("Check")
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CheckEmail;
