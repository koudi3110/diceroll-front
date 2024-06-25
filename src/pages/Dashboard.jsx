import React, { useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import ModalNewGame from "./modals/ModalNewGame";
import { RiAddCircleFill, RiExchangeFill } from "react-icons/ri";
import { BsClockHistory } from "react-icons/bs";
import ItemGame from "../components/ItemGame";

const AddButton = ({ openModal, setOpenModal }) => {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.stopPropagation();
        setOpenModal(true);
      }}
      className="flex p-3 bg-primary-500 text-white rounded-full items-center space-x-2 my-2 mx-5"
    >
      <RiAddCircleFill className="text-xl" />
      <span>Nouvelle session</span>
    </a>
  );
};

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.auth);
  const [openNewGame, setOpenNewGame] = useState(false);
  const [game, setGame] = useState();
  const [joinOpen, setJoinOpen] = useState(false);
  const [active, setActive] = useState(1);

  const { waiting, encours } = useSelector((state) => state.game);

  if (!localStorage.getItem("user")) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <ModalNewGame
        open={openNewGame}
        setOpen={setOpenNewGame}
        setGame={setGame}
        setJoinOpen={setJoinOpen}
      />

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="h-full relative pt-12 md:pt-0">
          <div className="fixed top-16 z-20 md:sticky top-0 w-full  w-full">
            <div className="relative bg-white z-20">
              <div
                className="absolute bottom-0 w-full h-px bg-slate-200"
                aria-hidden="true"
              />
              <ul className="relative text-sm justify-center font-medium flex flex-nowrap -mx-4  overflow-x-scroll no-scrollbar pt-3">
                <li className="w-1/2  mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                  <a
                    className={`block pb-3 flex font-bold justify-center items-center ${
                      active == 1
                        ? " text-primary-500  border-b-3 border-primary-500"
                        : "text-black  hover:text-slate-600"
                    }  whitespace-nowrap`}
                    href="#0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActive(1);
                    }}
                  >
                    <BsClockHistory />
                    <p className="">En attente</p>
                  </a>
                </li>
                <li className="w-1/2 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                  <a
                    className={`block pb-3 flex justify-center font-bold items-center ${
                      active == 2
                        ? "text-primary-500  border-b-3 border-primary-500"
                        : "text-black  hover:text-slate-600"
                    }  whitespace-nowrap`}
                    href="#0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActive(2);
                    }}
                  >
                    <RiExchangeFill />
                    <p className="">En cours</p>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex">
            <div
              className="w-full flex flex-col items-center overflow-y-auto overflow-x-hidden p-3 md:p-5 "
              style={{ maxHeight: window.innerHeight - 140 }}
            >
              {active == 1 &&
                waiting?.map((e, i) => <ItemGame item={e} key={e?._id} />)}
              {active == 2 &&
                encours?.map((e, i) => <ItemGame item={e} key={e?._id} />)}
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className=" absolute bottom-0 right-0">
              <AddButton
                setOpenModal={setOpenNewGame}
                openModal={openNewGame}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
