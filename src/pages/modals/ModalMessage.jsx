import React, { useState } from "react";
import { useSelector } from "react-redux";
import korat from "../../images/korat/ktk2.png";
import ModalAction from "../../components/ModalAction";
import { playButtonSound } from "../../utils/playSound";

const ModalMessage = ({
  message = "",
  subMessage = "",
  open = false,
  setOpen,
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
          <img src={korat} width="50" height="50" alt="Announcement" />
        </div>
      </div>
      {/* Modal content */}
      <div className="text-center">
        <div className="mb-5 text-black">{message}</div>
        {/* CTAs */}
        <div className="flex justify-center items-center">
          <button
            className="btn w-1/3 rounded-full font-medium text-sm text-white bg-black hover:bg-primary-700"
            onClick={(e) => {
              e.preventDefault();
              playButtonSound();
              setOpen(false);
            }}
          >
            OK
          </button>
        </div>
      </div>
    </ModalAction>
  );
};

export default ModalMessage;
