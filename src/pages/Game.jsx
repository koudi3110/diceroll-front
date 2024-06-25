import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import ModalNewGame from "./modals/ModalNewGame";
import { RiAddCircleFill, RiLogoutBoxRLine } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import avatar from "/images/avatar.png";
import { MdBackHand, MdHistory } from "react-icons/md";
import ModalAlert from "./modals/ModalAlert";
import { showError } from "../components/Toasts";
import { sessionStatus } from "../slices/game";
import { date } from "yup";
import gameService from "../services/game.service";
import ModalGameFinish from "./modals/ModalGameFinish";

const Hand = () => (
  <div className="h-5 w-5 text-sm bg-green-600 text-black rounded-full flex items-center justify-center">
    <MdBackHand />
  </div>
);

function Game() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location?.state || {};
  const [game, setGame] = useState(data);
  const [classement, setClassement] = useState(
    game.players?.map((e) => ({
      username: e.player.username,
      value: 0,
    }))
  );
  const { currentUser, socket } = useSelector((state) => state.auth);
  const [openNewGame, setOpenNewGame] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [modalFinish, setModalFinish] = useState(false);
  const [isLaunch, setIsLaunch] = useState(false);
  const [dices, setDices] = useState([]);
  const [closeOpen, setCloseOpen] = useState(false);

  const [indexCurrentUser, setIndexCurrentUser] = useState(-1);
  const [indexUser2, setIndexUser2] = useState(-1);
  const [indexUser3, setIndexUser3] = useState(-1);
  const [indexUser4, setIndexUser4] = useState(-1);

  const gameTimer = game?.timer || 0;
  let time = gameTimer;
  let minuterId = null;
  const [minuter, setMinuter] = useState(time);

  const minuterLaunch = () => {
    minuterId = setInterval(() => {
      time--;
      if (time <= 0) {
        time = 0;
        clearInterval(minuterId);
        minuterId = null;
      }
      setMinuter(time);
    }, 1000);
  };

  useEffect(() => {
    getClassement();
  }, [game]);

  const getClassement = () => {
    const towers = game?.towers || [];
    const change = game.players?.map((e) => ({
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

    console.log("ggvchdhhcds", change);

    setClassement([...change]);
  };

  useEffect(() => {
    localStorage.setItem("soundplay", "false");
    history.pushState(null, null, location.href);

    window.onpopstate = function () {
      history.go(1);
    };
    // window.history.forward()

    const lastUpdate = new Date(data?.lastUpdate).getTime();
    const now = new Date().getTime();
    const distance = now - lastUpdate;
    let val = data?.timer - Math.floor((distance % (1000 * 60)) / 1000);
    time = isNaN(val) || val >= game?.time ? game?.time : val;

    console.log("=====", time);
    minuterLaunch();
  }, []);

  useEffect(() => {
    let index1 = game?.players?.findIndex(
      (e) => e?.player?._id == currentUser?._id
    );

    const tab = Array.from({ length: data?.nb_dices }, (_, i) => 1);
    setDices(tab);

    if (!index1 || index1 == -1) index1 = 0;

    let index2 = (index1 + 1) % game?.players?.length;
    let index3 = (index1 + 2) % game?.players?.length;
    let index4 = (index1 + 3) % game?.players?.length;

    if (game?.players?.length == 2) {
      index3 = index2;
    }

    if (game?.players?.length == 3) {
      index4 = index3;
    }

    setIndexCurrentUser(index1);
    setIndexUser2(index2);
    setIndexUser3(index3);
    setIndexUser4(index4);
  }, []);

  useEffect(() => {
    setGame(data);

    socket?.on(`session:play:${game?._id}`, (data) => {
      setTimeout(() => {
        setIsLaunch(false);
      }, 400);

      console.log(data);
      setGame(data);
      time = gameTimer;

      if (data?.status == "end") {
        setTimeout(() => {
          setModalFinish(true);
        }, 1000);
        clearInterval(minuterId);
        minuterId = null;
      } else {
        if (!minuterId) {
          minuterLaunch();
        }
      }
    });

    socket?.on(`dice:roll:${game?._id}`, (data) => {
      setDices(data);
      console.log("dices==========", data);
    });

    socket?.on("connect", () => {
      dispatch(sessionStatus(game?._id))
        .unwrap()
        .then((data1) => {
          const myGame = data1;
          const lastUpdate = new Date(myGame?.lastUpdate).getTime();
          const now = new Date().getTime();
          const distance = now - lastUpdate;
          time = myGame?.timer - Math.floor((distance % (1000 * 60)) / 1000);
          setGame(myGame);

          if (myGame?.status == "end") {
            setTimeout(() => {
              setModalFinish(true);
            }, 1000);
            clearInterval(minuterId);
            minuterId = null;
          } else {
            if (!minuterId) {
              minuterLaunch();
            }
          }
        })
        .catch((e) => {
          showError(e);
        });
    });

    socket?.on(`dice:launch:${game._id}`, () => {
      setIsLaunch(true);
    });

    return () => {
      socket?.off(`session:play:${game?._id}`);
      socket?.off(`session:abandon:${game?._id}}`);
      socket?.off(`dice:roll:${game?._id}}`);
      socket?.emit(`dice:launch`, { _id: game._id });
    };
  }, []);

  const abandonGame = () => {
    if (currentUser?.username == game?.hand) {
      const param = {
        player: currentUser?._id,
        session: game?._id,
      };

      socket.emit("party:abandon", param, (err) => {
        if (err?.error) showError(err?.error);
        navigate("/");
      });
    } else if (game?.isFinish) {
      navigate("/");
    } else {
      showError("Vous n'avez pas la main");
    }
  };

  const launch = () => {
    if (game?.status != "end") {
      // setIsLaunch(true);
      socket?.emit(`dice:launch`, { _id: game._id });
      gameService
        .launch({ id: game._id, data: { player: currentUser._id } })
        .then((res) => {
          setTimeout(() => {
            // setIsLaunch(false);
          }, 500);
        })
        .catch((err) => {
          setIsLaunch(false);
        });
    } else {
      showError("La partie est terminée");
    }
  };

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ModalNewGame
        open={openNewGame}
        setOpen={setOpenNewGame}
        setGame={setGame}
        setJoinOpen={setJoinOpen}
      />

      <ModalAlert
        open={closeOpen}
        setOpen={setCloseOpen}
        message={"Voullez-vous vraiment quitte la partie"}
        action={() => {
          if (game?.isFinish == false) abandonGame();
          else navigate("/");
        }}
      />

      <ModalGameFinish
        open={modalFinish}
        setOpen={setModalFinish}
        classement={classement}
        game={game}
      />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main className="h-screen relative">
          <div className="bg-white h-[60px] shadow-lg rounded flex justify-between items-center px-10">
            <div>
              <div>
                Total tours:{" "}
                <span className="font-bold">{game?.nb_parties}</span>
              </div>
              <div>
                Tour:{" "}
                <span className="font-bold">{game?.currentTower + 1}</span>
              </div>
            </div>
            <div
              className={`${
                minuter <= 10 ? "text-red-500" : "text-green-400"
              } text-2xl font-bold`}
            >
              00:{minuter < 10 ? `0${minuter}` : minuter}
            </div>

            <div className="flex items-center ">
              <FaUserAlt /> {game?.players?.length || 0}
            </div>
          </div>
          <div
            className="flex flex-col items-center max-w-4xl m-auto justify-between pt-5"
            style={{ height: window.screen.height - 220 }}
          >
            <div>
              {(game?.players?.length == 2 || game?.players?.length == 4) && (
                <div className="flex items-center">
                  {game?.hand ==
                    game?.players[indexUser3]?.player?.username && <Hand />}
                  <div className="space-y-1 flex flex-col items-center">
                    <div
                      className={`py-[0.5px] px-4 px shadow-lg rounded-lg ${
                        game?.players[indexUser3]?.status == "in"
                          ? "bg-gray-800 text-white"
                          : "bg-red-600 text-black border border-black"
                      }`}
                    >
                      {game?.players[indexUser3]?.player?.username}
                    </div>
                    <img src={avatar} className="h-12" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center w-full px-5">
              <div>
                {(game?.players?.length == 3 || game?.players?.length == 4) && (
                  <div className="flex items-center rotate-90">
                    <div className="space-y-1 flex flex-col items-center">
                      <img src={avatar} className="h-12" />
                      <div
                        className={`py-[0.5px] px-4 px shadow-lg rounded-lg ${
                          game?.players[indexUser4]?.status == "in"
                            ? "bg-gray-800 text-white"
                            : "bg-red-600 text-black border border-black"
                        }`}
                      >
                        {game?.players[indexUser4]?.player?.username}
                      </div>
                    </div>
                    {game?.hand ==
                      game?.players[indexUser4]?.player?.username && <Hand />}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-center max-w-md">
                {dices.map((e) =>
                  isLaunch ? (
                    <img
                      src="/images/animation.gif"
                      id="dice"
                      alt=""
                      class="h-24"
                    />
                  ) : (
                    <img
                      src={`/images/${e}.png`}
                      id="dice"
                      alt=""
                      class="h-24"
                    />
                  )
                )}
              </div>
              <div>
                {(game?.players?.length == 3 || game?.players?.length == 4) && (
                  <div className="flex items-center -rotate-90">
                    <div className="space-y-1 flex flex-col items-center">
                      <img src={avatar} className="h-12" />
                      <div
                        className={`py-[0.5px] px-4 px shadow-lg rounded-lg ${
                          game?.players[indexUser2]?.status == "in"
                            ? "bg-gray-800 text-white"
                            : "bg-red-600 text-black border border-black"
                        }`}
                      >
                        {game?.players[indexUser2]?.player?.username}
                      </div>
                    </div>
                    {game?.hand ==
                      game?.players[indexUser2]?.player?.username && <Hand />}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1 flex flex-col items-center">
              <div className="flex items-center space-x-1">
                <img src={avatar} className="h-12" />
                {game?.hand ==
                  game?.players[indexCurrentUser]?.player?.username && <Hand />}
              </div>
              <div
                className={`py-[0.5px] px-4 px shadow-lg rounded-lg ${
                  game?.players[indexCurrentUser]?.status == "in"
                    ? "bg-gray-800 text-white"
                    : "bg-red-600 text-black border border-black"
                }`}
              >
                {game?.players[indexCurrentUser]?.player?.username}
              </div>
              <button
                type="button"
                id="launch"
                class={`btn text-white ${
                  game?.hand ==
                    game?.players[indexCurrentUser]?.player?.username &&
                  game?.status != "end"
                    ? "bg-primary-700 hover:bg-primary-400"
                    : "bg-gray-400"
                } `}
                onClick={(e) => {
                  e.stopPropagation();
                  launch();
                }}
                disabled={
                  !(
                    game?.hand ==
                    game?.players[indexCurrentUser]?.player?.username
                  )
                }
              >
                Lancer le dé
              </button>
            </div>
          </div>

          <div className="absolute top-[70px] left-2 md:left-5 rounded shadow-xl h-[200px] w-[140px] md:w-[160px] pt-3">
            <div className="py-1 bg-gray-100">Scores:</div>
            <div className="space-y-2 overflow-y h-[160px] px-2 pt-2">
              {classement?.map((e, i) => (
                <div className="flex items-center space-x-2 text-xs">
                  <img src={avatar} className="h-6" />
                  <div>{e?.username} :</div>
                  <div>{e?.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute right-10 bottom-5">
            <button
              className="btn bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                setCloseOpen(true);
              }}
            >
              <RiLogoutBoxRLine className="text-3xl font-bold text-red-500" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Game;
