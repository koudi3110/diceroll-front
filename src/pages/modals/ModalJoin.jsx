import React, { useEffect, useState } from "react";
import avatar from "/images/avatar.png";
import { FaDice, FaGamepad, FaTrash, FaUser } from "react-icons/fa";
import {
  MdAccountBalanceWallet,
  MdLock,
  MdLockOpen,
  MdTimer,
} from "react-icons/md";
import { RiCreativeCommonsByLine, RiGroup2Fill } from "react-icons/ri";
import ModalAlert from "./ModalAlert";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import ModalBasic from "../../components/ModalBasic";
import { useSelector } from "react-redux";
import gameService from "../../services/game.service";
import { show, showError } from "../../components/Toasts";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import NumberForm from "../../components/NumberForm";
// import { decryptAndDecompressData } from "../../utils/decrypt.service";

const ModalJoin = ({ open, setOpen, game }) => {
  const [users, setUsers] = useState([]);
  const [password, setPassWord] = useState(undefined);
  const { socket, currentUser } = useSelector((state) => state.auth);
  const [openAlert, setOpenAlert] = useState(false);
  const [load, setLoad] = useState(false);

  const navigate = useNavigate();

  const gameType = {
    KORAT: "Korat",
    DOUBLE_KORAT: "Double Korat",
    SIMPLE: "Simple",
  };

  useEffect(() => {
    setUsers([...game?.players]);
  }, [game?.players]);

  useEffect(() => {
    socket?.on(`session:join:${game?._id}`, (data) => {
      console.log("userrrrrrrrrrrrrrrrrrrrrrrrrrrrr-", data);
      setUsers([...data]);
    });

    socket?.on(`session:cancel:${game?._id}`, (data) => {
      socket?.off(`session:cancel:${game?._id}`);
      setOpen(false);
    });

    socket?.on(`session:init:${game?._id}`, (data) => {
      setOpen(false);
      console.log("======>", data);

      const find = data?.players?.find(
        (e) => e?.player?._id == currentUser?._id
      );

      console.log(find);
      if (find) {
        navigate("/game", { state: { data }, replace: true });
      }
    });

    socket?.on(`session:remove:${game?._id}:${currentUser?.pseudo}`, (data) => {
      setOpen(false);
      show(`${data?.creator} a supprimer la session`);
    });

    return () => {
      socket?.off(`session:cancel:${game?._id}`);
      socket?.off(`session:init:${game?._id}`);
      socket?.off(`session:join:${game?._id}`);
      socket?.off(`session:remove:${game?._id}:${currentUser?.pseudo}`);
    };
  }, [socket, open]);

  const joinGame = () => {
    setLoad(true);
    gameService
      .join({
        id: game._id,
        data: {
          player: currentUser?._id,
        },
      })
      .then(() => {
        setLoad(false);
      })
      .catch((error) => {
        setLoad(false);
        showError(error);
      });
  };

  const keepOut = () => {
    const find = users.find((e) => e?.player?._id == currentUser?._id);
    console.log(find);

    if (!find) setOpen(false);
    else {
      setLoad(true);
      gameService
        .keepOut({
          id: game._id,
          data: {
            player: currentUser?._id,
          },
        })
        .then(() => {
          setLoad(false);
          setOpen(false);
        })
        .catch((error) => {
          showError(error);
          setLoad(false);
        });
    }
  };

  const cancel = () => {
    setLoad(true);
    gameService
      .deleteGame(game._id)
      .then((data) => {
        setLoad(false);
        socket?.off(`session:init:${game?._id}`);
        show(data.message);
        setOpen(false);
      })
      .catch((error) => {
        showError(error);
        setLoad(false);
      });
  };

  const launch = () => {
    setLoad(true);
    gameService
      .initGame(game?._id)
      .then((data) => setLoad(false))
      .catch((error) => {
        showError(error);
        setLoad(false);
      });
  };

  const removePlayer = (user) => {
    setLoad(true);
    gameService
      .keepOut({
        id: game._id,
        data: {
          player: user?.player?._id,
        },
      })
      .then(() => {
        setLoad(false);
      })
      .catch((error) => {
        showError(error);
        setLoad(false);
      });
  };

  return (
    <ModalBasic
      id={game?._id}
      modalOpen={open}
      setModalOpen={setOpen}
      title={"En attente de joueurs"}
    >
      <Loading load={load} />
      <ModalAlert
        open={openAlert}
        setOpen={setOpenAlert}
        action={cancel}
        message={"Voulez vous vraiment annuler la partie ?"}
      />
      <div className="px-5 py-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MdTimer className="text-2xl" />
              <span>{game?.timer} s</span>
            </div>
            <div className="flex items-center font-bold space-x-2">
              <FaGamepad className="text-2xl" />
              <span>
                <NumberForm value={game?.nb_parties} />
              </span>
            </div>

            <div className="flex items-center font-bold space-x-2">
              <FaDice className="text-2xl" />
              <span>
                <NumberForm value={game?.nb_dices} />
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <FaUser className="text-2xl" />
              <span>{game?.nb_players} max</span>
            </div>
          </div>
          <div className="border-b pb-3 " />
          <div className="pb-5">
            {users.map((e, i) => (
              <div
                key={i}
                className="flex items-center justify-between my-2 px-5 py-1 rounded bg-slate-200 drop-shadow-sm"
              >
                <div className=" flex items-center space-x-2">
                  <div className="border rounded-full h-12 w-12 flex items-center justify-center bg-white border-primary-200">
                    <img src={avatar} className="h-12 " />
                  </div>
                  <span className="text-black">{e?.player?.username}</span>
                </div>
                {game?.creator?.username == currentUser?.username &&
                  e?.player?.username != currentUser?.username && (
                    <a
                      href="#"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        removePlayer(e);
                      }}
                    >
                      <FaTrash className="text-xl" />
                    </a>
                  )}
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            {game?.creator?.username == currentUser?.username ? (
              <button
                className="btn bg-primary-500 text-white w-2/5 rounded-full"
                onClick={(e) => {
                  //   e.preventDefault()
                  e.stopPropagation();

                  setOpenAlert(true);
                }}
              >
                Annuler
              </button>
            ) : (
              <button
                className="btn bg-primary-500 text-white w-2/5 rounded-full"
                onClick={() => {
                  keepOut();
                }}
              >
                {users.find((e) => e?.player?.username == currentUser?.username)
                  ? "Quitter"
                  : "Fermer"}
              </button>
            )}

            {game?.creator?.username == currentUser?.username ? (
              <button
                className="btn bg-black text-white w-2/5 rounded-full"
                onClick={() => {
                  launch();
                }}
              >
                Lancer
              </button>
            ) : (
              !users.find(
                (e) => e?.player?.username == currentUser?.username
              ) && (
                <button
                  className="btn bg-black text-white w-2/5 rounded-full"
                  disabled={load}
                  onClick={(e) => {
                    e.stopPropagation();

                    if (game?.isPrivate) {
                      setOpenPassword(true);
                    } else {
                      joinGame();
                    }
                  }}
                >
                  Rejoindre
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </ModalBasic>
  );
};
export default ModalJoin;
