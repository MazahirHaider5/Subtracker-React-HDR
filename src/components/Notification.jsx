import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import bell from "../assets/images/header/bell.svg";
import { useSelector } from "react-redux";
import axiosInstance from "../services/Interceptor";
import moment from "moment";
import avatar from "../assets/images/header/avatar.png";

const Notification = () => {
  const [activities, setActivities] = useState([]);
  const userData = useSelector((state) => state.userData);

  const fetchActivities = async () => {
    try {
      const res = await axiosInstance.get("/activities/getLoggedInUserActivities");
      if (res.data.success) {
        setActivities(res.data.unreadActivities || []);
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const markAsRead = async (activityId) => {
    try {
      await axiosInstance.post(`/activities/markActivityAsRead/${activityId}`);
      setActivities((prev) => prev.filter((item) => item._id !== activityId));
    } catch (error) {
      console.error("Failed to mark activity as read:", error);
    }
  };

  return (
    <Dropdown className="bg-transparent" align="end" offset={[-140, 0]}>
      <Dropdown.Toggle className="border-0 px-0 fw-600 bg-transparent fs-30 text-dark dropdown-arrow-hidden position-relative">
        <img
          src={bell}
          width={40}
          height={40}
          alt="bell-icon"
          className="cursor-pointer ms-md-2"
        />
        {activities.length > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: "10px" }}
          >
            {activities.length}
          </span>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ width: 350 }}>
        <Dropdown.Item className="bg-white">
          <div className="d-flex justify-content-between mb-0">
            <p className="fs-15 fw-600 mb-0">Notifications</p>
            <p className="fs-13 fw-500 text-color-red mb-0">CLEAR ALL</p>
          </div>
        </Dropdown.Item>
        <hr />

        {activities.length === 0 ? (
          <Dropdown.Item className="bg-white">
            <p className="fs-14 fw-400 text-muted text-center mb-0">
              No new notifications
            </p>
          </Dropdown.Item>
        ) : (
          activities.map((activity) => (
            <Dropdown.Item
              className="bg-white"
              key={activity._id}
              onClick={() => markAsRead(activity._id)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex justify-content-start mt-2">
                <img
                  crossOrigin="anonymous"
                  src={userData.photo.startsWith("http") ? avatar : process.env.REACT_APP_BACKEND_URL+"/"+userData.photo}
                  width={40}
                  height={40}
                  alt="User Avatar"
                  className="cursor-pointer rounded-circle ms-md-2"
                />
                <div>
                  <p className="fs-14 fw-600 m-0">{activity.title}</p>
                  <p className="fs-12 fs-500 text-color m-0">
                    {moment(activity.createdAt).format("DD MMM, YYYY hh:mm A")}
                  </p>
                </div>
              </div>
            </Dropdown.Item>
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Notification;
