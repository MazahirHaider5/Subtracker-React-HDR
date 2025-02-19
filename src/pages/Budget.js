import React, { useState, useRef, useEffect } from 'react';
import '../assets/style/globals.css';
import '../assets/style/dashboard.css';

import Select from "react-select";
import {
  Card,
  CardBody,
  Progress,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label
} from "reactstrap"
import {  Doughnut } from 'react-chartjs-2';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import addIcon from '../assets/images/Add.png'
import carIcon from '../assets/images/car.png'
import fingerIcon from '../assets/images/finger.png'
import starsIcon from '../assets/images/stars.png'
import darkCheck from '../assets/images/subscriptionCheckDark.svg'
import exportIcon from '../assets/images/export.svg'
import { useNavigate } from "react-router-dom";
import axiosInstance from '../services/Interceptor'
import { showToast } from "../helper/alerts/index";
import ReactApexChart from "react-apexcharts";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

const customDonutTrackPlugin = {
  id: 'doughnutCutoutTrack',
  beforeDraw(chart) {
    const { ctx } = chart;
    const { top, bottom, left, right } = chart.chartArea;

    // Get center coordinates and radii
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;
    const outerRadius = Math.min(right - left, bottom - top) / 2;
    const cutoutRadiusPercentage = parseFloat(chart.options.cutout) / 100;
    const cutoutRadius = outerRadius * cutoutRadiusPercentage;

    // Draw the track area between cutout and outer radius
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.arc(centerX, centerY, cutoutRadius, Math.PI * 2, 0, true); // Reverse direction
    ctx.fillStyle = chart.options.plugins.doughnutCutoutTrack.color || '#ddd';
    ctx.fill();
    ctx.restore();
  },
};
// Register the plugin
ChartJS.register(ArcElement, Tooltip, Legend, customDonutTrackPlugin);

const Budget = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [isAddCategory, setIsAddCategory] = useState(false)
  const [dountTotalAmount, setDountTotalAmount] = useState('')
  const [donutChartData, setDonutChartData] = useState({
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: ['#03E4E7', '#758AFF', '#DC23FF', "#4E4E61"],
          borderWidth: 20,
        },
      ],
    })
     const [state, setState] = useState({
        series: [],
        options: {
          chart: {
            height: 370,
            type: "line",
            zoom: {
              enabled: false,
            },
          },
          stroke: {
            curve: "smooth",
            width: 1.8,
          },
          fill: {
            type: "solid",
            opacity: [0.05, 0.02, 0.01],
          },
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          markers: {
            size: 0,
          },
          colors: ["#758AFF", "#168DBC", "#DC23FF",],
          yaxis: [
            {
              title: {
                text: "Revenue",
                style: {
                  color: "#475467",
                  fontSize: "14px",
                  fontWeight: 550,
                },
              },
              // min: 0,
              // max: 1000,
              // tickAmount: 5,
              labels: {
                style: {
                  colors: "#475467",
                },
              },
            },
          ],
          xaxis: {
            categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            labels: {
              style: {
                colors: "#475467",
              },
            },
            title: {
              text: "Months",
              style: {
                color: "#475467",
                fontSize: "14px",
                fontWeight: 550,
              },
            },
          },
          legend: {
            show: true,
            position: "top",
            horizontalAlign: "right",
            fontSize: 15,
            fontWeight: 410,
            letterSpace: 8,
            markers: {
              size: 4,
    
            },
            labels: {
              useSeriesColors: false,
              colors: ["#475467", "#475467", "#475467"],
            },
            itemMargin: {
              horizontal: 10,
              vertical: 5,
            },
          },
          tooltip: {
            shared: true,
            intersect: false,
            y: {
              formatter: (y) => (y !== undefined ? `${y.toFixed(0)} points` : y),
            },
          },
        },
      });
  const initialValues = {
    name: '',
    budget: ''
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be less than 50 characters")
      .required("Name is required"),
    budget: Yup.number()
      .min(1, "Budget must be at least 1")
      .required("Budget is required"),
  });

  const handleSubmit = async (values) => {
    try {
      setBtnLoader(true);
      const result = await axiosInstance.post("/categories/createCategory", {
        category_name: values.name,
        category_budget: values.budget,
      });


      if (result.status === 201) {
        showToast(result?.data?.message, "success", "top-end");
        setBtnLoader(false);
        setIsAddCategory(false);
        navigate("/subscription")
      }
    } catch (error) {
      setBtnLoader(false);
      console.error("Error:", error);
    }
  }
  
    const donutChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          enabled: true,
        },
        legend: {
          display: false,
        },
        doughnutCutoutTrack: {
          enabled: true,
          color: "#e7e7e7",
        },
      },
      cutout: '92%', // Defines the size of the cutout area
      rotation: 240,
    };

  useEffect(() => {
    if (!hasFetched.current) {
      getCategories()
      getDonutTotalData()
      getDashboardData()
      hasFetched.current = true;
    }
  }, [])
  const getCategories = async () => {
    try {
      const result = await axiosInstance.get('/categories/getCategories',
      );
      if (result.status === 200) {

        setCategories(result?.data?.categories)
        const updatedSeries = result?.data?.categories?.map((category) => {
          const monthlyData = category?.monthly_data?.map((item) => item.total_spent);
          return {
            name: category?.category_name,
            type: "area", 
            data: monthlyData, 
          };
        });
        setState((prevState) => ({
          ...prevState,
          series: updatedSeries, 
        }));
      
      }
    } catch (error) {
    }
  }
  const calculatePercentage = (categoryBudget, spendings) => {
    const remainingBudget = categoryBudget - spendings;
    const percentageLeft = (remainingBudget / categoryBudget) * 100;
    return percentageLeft
  }
  const getDashboardData = async () => {
    try {
      const result = await axiosInstance.get("/dashboard/dashboardData");

      if (result.status === 200) {

        const labels = result?.data?.data?.graphData?.map((item) => (
          item?.category_name
        )) || [];
        const data = result?.data?.data?.graphData?.map((item) => (
          item?.data[0]?.spendings
        )) || [];
console.log()
        setDonutChartData((prevState) => ({
          ...prevState,
          labels,
          datasets: [
            {
              ...prevState.datasets[0],
              data,
            },
          ],
        }));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };
  const getDonutTotalData = async () => {
    try {
      const result = await axiosInstance.get("/categories/getCategoriesSum");

      if (result.status === 200) {
        setDountTotalAmount(result?.data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };
  return (
    <>
      <p className='page-heading fs-20  '>Take control of your budget with clear insights into your spending habits.</p>
      <div className='d-flex justify-content-between flex-wrap'>
        <div className='d-flex  w-md-50 border ps-2 rounded mb-2'>
          <img src={darkCheck} alt='' width={20} height={20} className='mt-3' />
          <p className='fs-15 ms-2 mt-3 fw-500'>Your budgets are on track</p>
        </div>
        <div>
          <Button type='button' className=' fw-500 fs-15 btn-fill-color border-1 border-white py-2'  ><img src={exportIcon} alt='' className='me-2' /> Export Report</Button>
        </div>
      </div>
      <div className='row mt-3'>
        <div className='col-12 col-lg-4 mb-2 mb-lg-0'>
          <Card className='bg-white box-shadow-custom' >
            <CardBody style={{ height: '310px' }} className='pt-4'>
              <div style={{ position: 'relative', height: '250px' }}>
                <Doughnut
                  data={donutChartData}
                  options={donutChartOptions}
                  height={250}
                  width="100%"
                />
              </div>

              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className='fs-30 fw-700 text-dark text-center'>${dountTotalAmount?.total_spendings}</div>
                <div className='fs-15 fw-400 text-color-light'>of ${dountTotalAmount?.total_budget} budget</div>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className='col-12  col-lg-8 mb-2 mb-lg-0'>

          <Card className='bg-white box-shadow-custom'>
            <CardBody>
              <div className="chart-wrapper">
                <div className="chart-container">
                  <ReactApexChart
                    options={state.options}
                    series={state.series}
                    type="line"
                    height={265}
                  />
                 
                </div>
              </div>
            </CardBody>
          </Card>

        </div>

      </div>
      <h2 className='fs-24 fw-600 my-4'>Categories</h2>
      <div className="row g-3 mb-5">
        <div className=" col-12 col-md-6 col-lg-3 d-flex  " >
          <div className="border rounded text-center px-3 pb-3 pt-5 w-100 box-shadow-custom bg-white cursor-pointer" onClick={() => setIsAddCategory(!isAddCategory)}>
            <div className="budget-icon my-2">
              <img src={addIcon} alt="add icon" className="w-50" />
            </div>
            <h5 className=" fs-18 mt-3">Add new category</h5>
          </div>
        </div>
        {categories?.map((item, index) => (
          index <= 2 ?
            <div className="col-12 col-md-6 col-lg-3 d-flex  ">
              <div className={`border rounded text-center p-3 ${index === 0 ? "transport" : index === 1 ? "entertainment" : index === 2 ? "security" : "transport"} w-100 box-shadow-custom bg-white`}>
                <div className="budget-icon my-2">
                  <img src={index === 0 ? carIcon : index === 1 ? starsIcon : index === 2 ? fingerIcon : carIcon} alt="car" className="w-50" />
                </div>
                <h5 className=" fs-18">{item?.category_name}</h5>
                <p className=" text-color fs-14">${item?.category_budget - item?.spendings} left to spend</p>
                <Progress
                  value={calculatePercentage(item?.category_budget, item?.spendings)}
                />
                <p className=" text-color fs-14 mt-2">${item?.spendings} of ${item?.category_budget}</p>
              </div>
            </div> : null
        ))}
        {/* <div className="col-12 col-md-6 col-lg-3 d-flex ">
          <div className="border rounded text-center p-3 entertainment w-100 box-shadow-custom bg-white">
            <div className="budget-icon my-2">
              <img src={starsIcon} alt="stars" className="w-50" />
            </div>
            <h5 className=" fs-18">Entertainment</h5>
            <p className=" text-color fs-14">$375 left to spend</p>
            <Progress
              value={50}
            />
            <p className=" text-color fs-14 mt-2">$50.99 of $600</p>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3 d-flex ">
          <div className="border rounded text-center p-3 security w-100 box-shadow-custom bg-white">
            <div className="budget-icon my-2">
              <img src={fingerIcon} alt="finger" className="w-50" />
            </div>
            <h5 className=" fs-18">Security</h5>
            <p className=" text-color fs-14">$375 left to spend</p>
            <Progress
              value={50}
            />
            <p className=" text-color fs-14 mt-2">$5.99 of $600</p>
          </div>
        </div> */}
      </div>
      <Modal isOpen={isAddCategory} toggle={() => setIsAddCategory(!isAddCategory)}>
        <ModalHeader toggle={() => setIsAddCategory(!isAddCategory)} className="border-0"></ModalHeader>
        <ModalBody>
          <h2 className="fs-20 fw-600 text-center mt-0">
            Add Category
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="name" className="fs-14 fw-500">
                    Name
                  </Label>
                  <Field
                    id="name"
                    name="name"
                    placeholder="Enter Name"
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
                    Enter Budget
                  </Label>
                  <Field
                    id="budget"
                    name="budget"
                    placeholder="Enter Budget"
                    type="number"
                    className="form-control"
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
                      "Add"
                    )}
                  </Button>
                </FormGroup>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Budget;
