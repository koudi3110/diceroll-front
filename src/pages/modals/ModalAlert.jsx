import React, { useState } from "react";
import { useSelector } from "react-redux";
import warning from "/images/warning.png";
import ModalAction from "../../components/ModalAction";

const ModalAlert = ({ message = "", action, open = false, setOpen }) => {
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
          <img src={warning} width="50" height="50" alt="Announcement" />
        </div>
        <div className="text-lg font-semibold text-slate-800">Attention</div>
      </div>
      {/* Modal content */}
      <div className="text-center">
        <div className="text-sm mb-5">{message}</div>
        {/* CTAs */}
        <div className="space-x-3 flex justify-center items-center">
          <button
            className="btn w-1/3 rounded-full font-medium text-sm text-white bg-black"
            href="#0"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          >
            Non
          </button>
          <button
            className="btn w-1/3 rounded-full bg-primary-500 hover:bg-primary-700 text-white"
            onClick={(e) => {
              e.stopPropagation();
              action();
              setOpen(false);
            }}
          >
            Oui
          </button>
        </div>
      </div>
    </ModalAction>
  );
};

export default ModalAlert;
