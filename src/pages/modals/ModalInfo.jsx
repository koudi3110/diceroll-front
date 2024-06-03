import React, { useState } from "react";
import { useSelector } from "react-redux";
import logo from "/images/logo.png";
import ModalAction from "../../components/ModalAction";

const ModalInfo = ({
  message = "",
  action,
  open = false,
  setOpen,
  type = "warning",
}) => {
  return (
    <ModalAction
      id="announcement-modal"
      modalOpen={open}
      setModalOpen={setOpen}
    >
      {/* Modal header */}
      <div className="mb-2 text-center">
        {/* Icon */}
        <div className="inline-flex mb-2">
          <img src={logo} width="50" height="50" alt="Announcement" />
        </div>
      </div>
      {/* Modal content */}
      <div className="text-center">
        <div className="mb-5 text-black">{message}</div>
        {/* CTAs */}
        <div className="space-x-3 flex justify-center items-center">
          <button
            className="btn w-1/3 rounded-full font-medium text-sm text-white bg-primary-500 hover:bg-primary-700"
            href="#0"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          >
            Non
          </button>
          <button
            className="btn w-1/3 rounded-full bg-black text-white"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              action();
            }}
          >
            Oui
          </button>
        </div>
      </div>
    </ModalAction>
  );
};

export default ModalInfo;
