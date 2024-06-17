import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { MdAddCircle, MdRefresh } from "react-icons/md";
import { FaMoneyBill } from "react-icons/fa";
import sourire from "/images/win.png";
import triste from "/images/lose.png";
import { getHistory } from "../slices/game";
import ModalRecapGame from "./modals/ModalRecapGame";
import { showError } from "../components/Toasts";
import Loading from "../components/Loading";
import NumberForm from "../components/NumberForm";
import format_date from "../utils/format_date";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";

const ItemsHistory = ({ e, i, value }) => {
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.auth);
  return (
    <>
      <ModalRecapGame open={open} setOpen={setOpen} entry={e} />
      <a
        className={`flex py-1  space-x-1  md:text-base text-xs items-center ${
          i < value?.length - 1 && "border-b border-b-slate-100"
        }`}
        href="#"
        onClick={(event) => {
          console.log("test");
          event.stopPropagation();
          if (e?.type == "partie") setOpen(true);
        }}
      >
        <div className="w-[7%]">
          {e?.type == "partie" &&
            (e?.party?.winner?.pseudo == currentUser?.pseudo ||
            e?.party?.winner?._id == currentUser?._id ? (
              <img src={sourire} alt="" className="h-5 w-5 lg:w-8 lg:h-8" />
            ) : (
              <img src={triste} alt="" className="h-5 w-5 lg:w-8 lg:h-8" />
            ))}

          {e?.type != "partie" && <FaMoneyBill className="text-2xl" />}
        </div>
        <div className="w-[17%]">
          {format_date(
            e.createdAt,
            "HH:mm:ss",
            localStorage.getItem("@param:lang")
          )}
        </div>
        <div className="w-[48%]">
          {"translate.balance_before"}:{" "}
          <span className="font-bold">
            <NumberForm value={e?.amount} />
          </span>
        </div>
        <div className="w[28%]">
          {e?.type == "partie" &&
            (e?.party?.winner?.pseudo == currentUser?.pseudo ||
            e?.party?.winner?._id == currentUser?._id ? (
              <span className="text-green-500">
                {"translate.won"}:{" "}
                <span className="font-bold">
                  <NumberForm value={e?.credit} />
                </span>
              </span>
            ) : (
              <span className="text-red-500">
                {"translate.lost"}:{" "}
                <span className="font-bold">
                  <NumberForm value={e?.debit} />
                </span>
              </span>
            ))}
          {e?.type == "retrait" && (
            <span className="text-primary-500">
              {"translate.withdrawal"}:{" "}
              <span className="font-bold">
                <NumberForm value={e?.debit} />
              </span>
            </span>
          )}
          {e?.type == "recharge" && (
            <span className="text-green-500">
              recharge:{" "}
              <span className="font-bold">
                <NumberForm value={e?.credit} />
              </span>
            </span>
          )}
        </div>
      </a>
    </>
  );
};

const Score = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [group, setGroup] = useState({});
  const { currentUser } = useSelector((state) => state.auth);
  const { history } = useSelector((state) => state.game);
  const [historyNumber, setHistoryNumber] = useState(20);
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();

  const getDays = (day) => {
    const date = new Date(day);
    const now = new Date();

    if (date.toDateString() == now.toDateString()) {
      return "Aujourd'hui";
    } else if (
      date.getDate() == now.getDate() - 1 &&
      date.getMonth() == now.getMonth() &&
      date.getFullYear() == now.getFullYear()
    ) {
      return "Hier";
    } else {
      const nbdays = Math.abs(date - now) / (1000 * 3600 * 24);
      if (nbdays <= 7)
        return format_date(day, "dddd", localStorage.getItem("@param:lang"));
      else return format_date(day, "ll", localStorage.getItem("@param:lang"));
    }
  };

  const groupBy = (xs, key) => {
    return xs.reduce((rv, x) => {
      (rv[getDays(x[key])] = rv[getDays(x[key])] || []).push(x);
      return rv;
    }, {});
  };

  const loadHistory = () => {
    setLoad(true);
    dispatch(getHistory(20))
      .unwrap()
      .then(() => setLoad(false))
      .catch((e) => {
        setHistoryNumber(20);
        setLoad(false);
        if (e.message?.includes("timeout"))
          showError("Vérifiez votre connexion");
      });
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    let group1 = groupBy(history?.entries || [], "createdAt");
    setGroup(group1);
  }, [history?.entries]);

  if (!localStorage.getItem("user")) {
    return <Navigate to="/signin" />;
  }

  return (
    <div
      className="flex overflow-hidden text-black"
      style={{ height: window.innerHeight }}
    >
      <Loading load={load} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex justify-end absolute bottom-1 left-2 z-20">
        <button
          className="rounded-full bg-[rgba(0,0,0,0.5)] text-white p-2"
          onClick={() => loadHistory()}
        >
          <MdRefresh className="text-3xl" />
        </button>
      </div>
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="h-full relative md:px-10 px-1 pt-16 md:pt-0">
          <div className="space-y-5 mt-3">
            {Object.entries(group)?.map(([key, value]) => (
              <div key={key} className="p-2 bg-white rounded-lg shadow-lg">
                <span className="text-base font-bold">{key}</span>
                <div>
                  {value?.map((e, i) => (
                    <ItemsHistory key={i} e={e} i={i} value={value} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {history?.entries?.length < history?.total && (
            <a
              className="flex items-center justify-center py-3"
              href="#"
              onClick={(e) => {
                setLoad(true);
                console.log(historyNumber);
                dispatch(getHistory(historyNumber + 10))
                  .unwrap()
                  .then(() => {
                    setHistoryNumber(historyNumber + 10);
                    setLoad(false);
                  })
                  .catch((err) => {
                    showError(err);
                    setLoad(false);
                  });
              }}
            >
              {"Voir plus..."} <MdAddCircle />
            </a>
          )}
        </main>
      </div>
    </div>
  );
};

export default Score;
