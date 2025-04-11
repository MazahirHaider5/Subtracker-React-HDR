export const USEREMAIL = "USEREMAIL";
export const SET_ERROR = "SET_ERROR";  
export const CLEAR_ERROR = "CLEAR_ERROR";  
export const OTPSTATUS = "OTPSTATUS";  
export const AUTH = "AUTH";
export const USERDATA = "USERDATA";
export const SUBSCRIPTION = "SUBSCRIPTION";
export const HEADERTITLE = "HEADERTITLE";




export const setSelectedSubscription = (data) => {
  return {
    type: SUBSCRIPTION,
    payload: data,  
  };
};
export const setUserData = (data) => {
  return {
    type: USERDATA,
    payload: data,  
  };
};

export const setHeaderTitle = (data) => {
  return {
    type: HEADERTITLE,
    payload: data,  
  };
};

export const setAuth = (data) => {
  return {
    type: AUTH,
    payload: data,  
  };
};
export const setUserEmail = (data) => {
  return {
    type: USEREMAIL,
    payload: data,  
  };
};
export const setOTPStatus = (data) => {
  return {
    type: OTPSTATUS,
    payload: data,  
  };
};


export const setError = (errorMessage) => {
  return {
    type: SET_ERROR,
    payload: errorMessage,
  };
};


export const clearError = () => {
  return {
    type: CLEAR_ERROR, 
  };
};
