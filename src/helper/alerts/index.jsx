import Swal from "sweetalert2";

export const showAlert = (message, showIcon, cancelBtn, title) => {
   return Swal.fire({
      title: title ? title : false,
      text: message,
      icon: showIcon,
      // timer: 5000,
      confirmButtonColor: "#ca2d2c",
      confirmButtonText: "Ok",
      showCancelButton: cancelBtn ? true : false,
   });
};
export const showToast = (message, showIcon, position) => {
   const Toast = Swal.mixin({
      toast: true,
      width: 500,
      position: position,
      showConfirmButton: false,
      timer: 2500,
      customClass: {
         container: "custom-toast-container",
      },
      timerProgressBar: true,
      didOpen: (toast) => {
         toast.addEventListener("mouseenter", Swal.stopTimer);
         toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
   });

   Toast.fire({
      icon: showIcon,
      title: message,
   });
};
export const showConfirmationAlert = async (
   message,
   showIcon,
   confirmBtnText,
   rejectBtnText,
   rejection
) => {
   return await Swal.fire({
      html: rejection
         ? `<div class="text-start"><b>Reason for rejection:</b> ${message}</div>`
         : message,
      icon: showIcon,
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#7e8299",
      cancelButtonText: rejectBtnText ? rejectBtnText : "Cancel",
      confirmButtonText: confirmBtnText ? confirmBtnText : "Yes",
      reverseButtons: true,
      allowOutsideClick: false,
      showClass: {
         popup: "swal2-noanimation",
         backdrop: "swal2-noanimation",
         icon: "swal2-noanimation",
      },
      hideClass: {
         popup: "",
         backdrop: "",
         icon: "",
      },
   });
};
export const showConfirmationModal = async (
   message,
   showIcon,
   confirmBtnText,
   rejectBtnText,
   reason,
   deactivatedBy
) => {
   return await Swal.fire({
      html: reason
         ? `<div class="text-start" > ${message}</div><div class="my-2 text-start" ><b>Reason:</b>  ${
              reason ?? "N/A"
           }</div> ${
              deactivatedBy == "Shadi.Pk"
                 ? ` <div class="text-start">
              You are given warning, next time follow the company policies and terms of service. Otherwise your account will be permanently deactivated/deleted.
                 </div>`
                 : ""
           } <div class="text-start mt-2 pt-1"> Would you like to reactivate it now?</div>`
         : message,
      icon: showIcon,
      showCancelButton: true,
      confirmButtonColor: "#ca2d2c",
      cancelButtonColor: "#7e8299",
      cancelButtonText: rejectBtnText ? rejectBtnText : "Cancel",
      confirmButtonText: confirmBtnText ? confirmBtnText : "Yes",
      reverseButtons: true,
      allowOutsideClick: false,
      showClass: {
         popup: "swal2-noanimation",
         backdrop: "swal2-noanimation",
         icon: "swal2-noanimation",
      },
      hideClass: {
         popup: "",
         backdrop: "",
         icon: "",
      },
   });
};
