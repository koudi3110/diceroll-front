import React, { useState } from "react";
import avatar from "/images/avatar.png";
import { useEffect } from "react";
import { FaDice, FaGamepad, FaUser } from "react-icons/fa";
import { RiGroup2Fill, RiTimerLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getGameStatus } from "../slices/game";
import { showError, showSucces } from "./Toasts";
import Loading from "./Loading";
import ModalJoin from "../pages/modals/ModalJoin";

const ItemGame = ({ item }) => {
  const { socket, currentUser } = useSelector((state) => state.auth);
  const [joinOpen, setJoinOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [load, setLoad] = useState(false);

  const { waiting } = useSelector((state) => state.game);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      item?.creator?.username == currentUser?.username &&
      item?.status == "init"
    ) {
      setJoinOpen(true);
    }
  }, []);

  const joinAfterOut = () => {
    dispatch(getGameStatus(item._id))
      .unwrap()
      .then((data) => {
        console.log(data);
        const decrptData = decryptAndDecompressData(data);
        navigate("/game", { state: { data: decrptData }, replace: true });
      })
      .catch(() => showError(e));
  };

  return (
    <>
      <Loading load={load} />
      <ModalJoin open={joinOpen} setOpen={setJoinOpen} game={item} />
      {/* <ModalInfo
        open={infoOpen}
        setOpen={setInfoOpen}
        message={translate.would_you_spectator}
        action={viewGame}
      />
      <ModalInfo
        open={problemGameOpen}
        setOpen={setProblemGameOpen}
        message={translate.you_will_declare_problem}
        action={problemInGame}
      />
      <ModalInfo
        open={joinAgainOpen}
        setOpen={setJoinAgainOpen}
        message={translate.rejoin_message}
        action={joinAfterOut}
      /> */}
      <a
        href="#"
        className="flex relative items-center bg-white rounded-lg shadow-lg w-full lg:w-[600px] md:w-[500px] mx-5 mb-5 text-sm md:text-base text-black"
        onClick={(e) => {
          e.stopPropagation();
          if (item?.status == "init") setJoinOpen(true);
        }}
      >
        <img src={avatar} className="h-20 md:h-24 p-3 rounded-full" />

        <div className="flex flex-col w-full pr-5">
          <div className="flex items-center font-bold text-lg md:text-xl space-x-2">
            <span>{item?.creator?.username}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-5">
              <div className="text-primary-500 flex items-center">
                <FaGamepad />
                <div className="text-lg">{item?.nb_parties}</div>
              </div>
              <div className="flex items-center">
                <RiTimerLine />
                <span>{item?.timer} s</span>
              </div>
              <div className="flex items-center">
                <FaUser />
                <span>{item?.nb_players}</span>
              </div>
              <div className="flex items-center">
                <FaDice />
                <span>{item?.nb_dices}</span>
              </div>
            </div>
            <div className={`flex items-center space-x-3`}>
              <RiGroup2Fill className="text-green-400" />
            </div>
          </div>
        </div>
      </a>
    </>
  );
};

export default ItemGame;
