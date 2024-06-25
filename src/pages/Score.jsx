import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { MdAddCircle, MdRefresh } from "react-icons/md";
import sourire from "/images/win.png";
import triste from "/images/lose.png";
import { getHistory } from "../slices/game";
import ModalRecapGame from "./modals/ModalRecapGame";
import { showError } from "../components/Toasts";
import Loading from "../components/Loading";
import format_date from "../utils/format_date";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";

const ItemsHistory = ({ e, i, value }) => {
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.auth);
  const [score, setScore] = useState();
  const [classement, setClassement] = useState(
    e.players?.map((e) => ({
      username: e.player.username,
      value: 0,
    }))
  );

  const getScore = () => {
    const towers = e?.towers || [];
    let sc = 0;

    for (let tower of towers) {
      for (let key in tower) {
        if (currentUser?.username == key) {
          tower[key].forEach((e) => {
            sc += e;
          });
        }
      }
    }
    setScore(sc);
  };

  const getClassement = () => {
    const towers = e?.towers || [];
    const change = e?.players?.map((e) => ({
      username: e.player.username,
      value: 0,
    }));

    for (let tower of towers) {
      for (let key in tower) {
        for (let change1 of change) {
          if (change1.username == key) {
            tower[key].forEach((e) => {
              change1.value += e;
            });
          }
        }
      }
    }

    setClassement([...change]);
  };

  useEffect(() => {
    getScore();
    getClassement();
  }, [currentUser]);

  return (
    <>
      <ModalRecapGame
        open={open}
        setOpen={setOpen}
        game={e}
        classement={classement}
      />
      <a
        className={`flex py-1  space-x-1  md:text-base text-xs items-center ${
          i < value?.length - 1 && "border-b border-b-slate-100"
        }`}
        href="#"
        onClick={(event) => {
          event.stopPropagation();
          setOpen(true);
        }}
      >
        <div className="w-[7%]">
          {e?.winner?.username == currentUser?.username ||
          e?.winner?._id == currentUser?._id ? (
            <img src={sourire} alt="" className="h-5 w-5 lg:w-8 lg:h-8" />
          ) : (
            <img src={triste} alt="" className="h-5 w-5 lg:w-8 lg:h-8" />
          )}
        </div>
        <div className="w-[17%]">
          {format_date(
            e.createdAt,
            "HH:mm:ss",
            localStorage.getItem("@param:lang")
          )}
        </div>
        <div className="w-[48%]">
          Score: <span className="font-bold">{score}</span>
        </div>
        <div className="w[28%]">
          Status:{" "}
          <span className="">
            {e?.winner?.username == currentUser?.username ||
            e?.winner?._id == currentUser?._id ? (
              <span className="font-bold text-green-500">gagné</span>
            ) : (
              <span className="font-bold text-red-500">perdu</span>
            )}
          </span>
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
    let group1 = groupBy(history.datas || [], "createdAt");
    setGroup(group1);
  }, [history.datas]);

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
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="h-full relative md:px-10 px-1">
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
          {history?.datas?.length < history?.total && (
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
