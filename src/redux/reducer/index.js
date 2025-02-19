import { USEREMAIL, SET_ERROR, CLEAR_ERROR,OTPSTATUS,AUTH,USERDATA,SUBSCRIPTION } from "../action";

const initialState = {
  userMailID: null, 
  errorMessage: null, 
  OTPStatus:null, 
  isAuthenticated: false,
  userData:{},
  selectedSubscription:null
  
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
 
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

export default reducer;
