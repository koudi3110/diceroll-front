import React from "react";
import { ToastContainer, toast } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';

const toatOPtion = {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

export const showSucces = (message) => {
  toast.success(message, { ...toatOPtion });
};

export const showError = (message) => {
  toast.error(message, toatOPtion);
};

export const showWarning = (message) => {
  toast.warning(message, toatOPtion);
};

export const show = (message) => {
  toast(message, toatOPtion);
};

const Toasts = () => (
  <ToastContainer
   position="bottom-right"
    autoClose={2000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />
);

export default Toasts;
