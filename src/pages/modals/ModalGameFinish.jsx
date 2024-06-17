import React, { useEffect, useState } from "react";
import avatar from "/images/avatar.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ModalAction from "../../components/ModalAction";
import sourire from "/images/win.png";
import triste from "/images/lose.png";

const ModalGameFinish = ({ open, setOpen, game, classement }) => {
  const { socket, currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [bestScrore, setBestScore] = useState();

  useEffect(() => {
    console.log("winner", game?.winner);
  }, [game]);

  useEffect(() => {
    let best = classement[0];
    for (let elt of classement) {
      if (elt.value > best.value) {
        best = elt;
      }
    }

    setBestScore(best);
  }, [classement]);

  return (
    <ModalAction id="ModalGameFinish" modalOpen={open} setModalOpen={setOpen}>
      <div className="px-2 md:px-4 text-sm md:text-base">
        <div className="space-y-1 md:space-y-3">
          <div className="flex flex-col items-center">
            <img
              src={
                game?.winner?.username == currentUser?.username
                  ? sourire
                  : triste
              }
              alt="sourire"
              className="h-16 md:h-24 "
            />
            <span className="text-lg md:text-2xl font-bold">
              Fin de la partie
            </span>
          </div>
          <div className="flex items-center space-x-5">
            <span>{"Gragnant"}:</span>
            <div className="flex items-center space-x-2">
              <img src={avatar} alt="user" className="h-12 md:h-16" />
              <span>{game?.winner?.username}</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <span>Score:</span>
            <span className="text-primary-500">{bestScrore?.value}</span>
          </div>
          <div className="flex justify-between pt-5">
            <button
              className="btn bg-primary-500 text-white w-2/5 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                navigate("/");
              }}
            >
              Quitter
            </button>

            <button
              className="btn bg-black text-white w-2/5 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
            >
              Revoir
            </button>
          </div>
        </div>
      </div>
    </ModalAction>
  );
};
export default ModalGameFinish;
