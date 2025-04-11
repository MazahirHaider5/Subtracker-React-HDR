import { USEREMAIL,HEADERTITLE, SET_ERROR, CLEAR_ERROR,OTPSTATUS,AUTH,USERDATA,SUBSCRIPTION } from "../action";

const initialState = {
  userMailID: null, 
  errorMessage: null, 
  OTPStatus:null, 
  isAuthenticated: false,
  userData:{},
  selectedSubscription:null,
  headerTitle:null
  
};

export default (state = initialState, action) => {
  switch (action.type) {
    
    case HEADERTITLE:
      return {
        ...state,
        headerTitle: action.payload,
      };

    case SUBSCRIPTION:
      return {
        ...state,
        selectedSubscription: action.payload,
      };
    case USERDATA:
      return {
        ...state,
        userData: action.payload,
      };
    case AUTH:
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    case OTPSTATUS:
      return {
        ...state,
        OTPStatus: action.payload,
      };
    case USEREMAIL:
      return {
        ...state,
        userMailID: action.payload,
      };
    case SET_ERROR:
      return {
        ...state,
        errorMessage: action.payload,  
      };
    case CLEAR_ERROR:
      return {
        ...state,
        errorMessage: null,  
      };
    default:
      return state;
  }
};
