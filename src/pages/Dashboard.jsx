import React, { useEffect, useState, useRef } from 'react';
import '../assets/style/globals.css';
import '../assets/style/dashboard.css';
import { Card, CardBody } from "reactstrap"
import renewal01 from '../assets/images/renewal01.svg'
import renewal02 from '../assets/images/renewal02.svg'
import { Doughnut } from 'react-chartjs-2';
import axiosInstance from '../services/Interceptor'
import ReactApexChart from "react-apexcharts";
import { useTranslation } from 'react-i18next';
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
const Dashboard = () => {
    const { t } = useTranslation('Translate')
  const [dashboardData, setDashboardData] = useState('')
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
                 text:t("Amount Spent"),
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
               text: t("Month"),
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
             marker: {
              show: false, 
            },
             y: {
               formatter: (y) => {
                 if (y === null || y === undefined) {
                   return "0"; 
                 }
                 return `${y.toFixed(0)} points`;
               },
             },
           },
           
         },
       });
  const hasFetched = useRef(false);
  useEffect(() => {
    // if (!hasFetched.current) {
    getDashboardData()
    getDountTotalData()
    getCategories()
    hasFetched.current = true;
    // }
  }, [])
   const getCategories = async () => {
    try {
      const result = await axiosInstance.get('/categories/getCategories');
      if (result.status === 200) {
  
        const updatedSeries = result?.data?.categories?.map((category) => {
          const monthlyData = category?.monthly_data?.map((item) => item.total_spent);
  
          // Fill missing months with null or 0 if monthlyData has fewer than 12 entries
          const fullMonthlyData = monthlyData.length < 12
            ? [...monthlyData, ...Array(12 - monthlyData.length).fill(null)] // Fills with null for missing months
            : monthlyData;
  
          return {
            name: category?.category_name,
            type: "area",
            data: fullMonthlyData, // Ensure each category has 12 data points
          };
        });
  
        setState((prevState) => ({
          ...prevState,
          series: updatedSeries,
        }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const getDashboardData = async () => {
    try {
      const result = await axiosInstance.get("/dashboard/dashboardData");

      if (result.status === 200) {

        setDashboardData(result?.data?.data);
        const labels = result?.data?.data?.graphData?.map((item) => (
          item?.category_name
        )) || [];
        const data = result?.data?.data?.graphData?.map((item) => (
          item?.data[0]?.spendings
        )) || [];

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
  const getDountTotalData = async () => {
    try {
      const result = await axiosInstance.get("/categories/getCategoriesSum");

      if (result.status === 200) {
        setDountTotalAmount(result?.data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };
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
  return (
    <div className='container'>
      <p className='page-heading fs-20'>"{t('Gain valuable insights into your subscription usage and spending habits')}  <br />{t("with our powerful analytics tool.")}"</p>
      <div className='row mt-4'>
        <div className='col-12 col-md-6 col-xl-4 mb-3 mb-xl-0'>
          <Card className='bg-white box-shadow-custom'>
            <div className='d-flex justify-content-start align-items-center'>
              <div>
                <p className='rounded-circle-number bg-light-purple dark-purple ms-4 me-3 mt-3'>{dashboardData?.totalSubscriptions}</p>
              </div>
              <div className=''>
                <p className='text-color fs-17 fw-500 mb-0 '>{t("Total")}</p>
                <p className='text-color fs-17 fw-500 m-0'>{t("Subscriptions")}</p>
              </div>
            </div>
          </Card>
        </div>
        <div className='col-12 col-md-6 col-xl-4 mb-3 mb-xl-0'>
          <Card
            className='bg-white box-shadow-custom'
          >
            <div className='d-flex justify-content-start align-items-center'>
              <div>
                <p className='rounded-circle-number bg-light-purple dark-purple ms-4 me-3 mt-3'>{dashboardData?.dueSubscriptions}</p>
              </div>
              <div className=''>
                <p className='text-color fs-17 fw-500 mb-0 '>{t("Due")}</p>
                <p className='text-color fs-17 fw-500 m-0'>{t("Subscriptions")}</p>
              </div>
            </div>

          </Card>
        </div>
        <div className='col-12 col-md-6 col-xl-4 mb-3 mb-xl-0'>
          <Card
            className='bg-white box-shadow-custom'
          >
            <div className='d-flex justify-content-start align-items-center'>
              <div>
                <p className='rounded-circle-number bg-light-purple dark-purple ms-4 me-3 mt-3'>{dashboardData?.paidSubscription}</p>
              </div>
              <div className=''>
                <p className='text-color fs-17 fw-500 mb-0 '>{t("Paid")}</p>
                <p className='text-color fs-17 fw-500 m-0'>{t("Subscriptions")}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div className='row  mt-md-3'>
        <div className='col-12 col-lg-4 mb-3 mb-lg-0'>
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
                <div className='fs-15 fw-400 text-color-light text-center'> {t("of")} ${dountTotalAmount?.total_budget} {t("amount paid")} </div>
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
                    height={262}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

        </div>
      </div>
      {dashboardData?.upcomingRenewals?.length > 0 && <h2 className='fs-24 fw-600 my-3'>{t("Upcoming Renewals")}</h2>}
      <div className='container'>
        {dashboardData?.upcomingRenewals?.map((item, index) => (
          <div className='row border rounded px-1 py-2 box-shadow-custom bg-white my-3  '>
            <div className='col-12 col-md-10 d-flex flex-wrap align-items-center text-start  mb-3 mb-md-0'>
              <img src={index === 0 ? renewal01 : renewal02} alt='icon' className='me-1' width={40} height={40} />
              <p className='mx-3  fs-15 fw-600 mb-0'>{item?.subscription_name}</p>
              <p className=' text-color mt-3 ms-4 fs-12'>{t("Due Date")}:{formatDate(item?.subscription_end)}</p>
            </div>
            <div className='col-12 col-md-2 text-end '>
              <p className='mt-2 fs-15 fw-600 mt-3'>$ {item?.subscription_price}</p>
            </div>
          </div>
        ))}

        {/* <div className='row border rounded px-1 py-2 mt-2 mb-4 box-shadow-custom bg-white'>
          <div className='col-12 col-md-10 d-flex flex-wrap align-items-center text-start '>
            <img src={renewal02} alt='icon' className='me-1' />
            <p className='mx-2  fs-15 fw-600 mb-0'>SignNTrack</p>
            <p className='text-color mt-3 ms-4 fs-12'>Due Date:18.04.2024</p>
          </div>
          <div className='col-12 col-md-2 text-end'>
            <p className='mt-2 fs-15 fw-600 mt-3'>$5.99</p>
          </div>
        </div> */}
      </div>

    </div>
  );
};

export default Dashboard;
