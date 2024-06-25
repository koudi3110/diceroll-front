import React, { useEffect, useState } from "react";
import avatar from "/images/avatar.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ModalAction from "../../components/ModalAction";
import sourire from "/images/win.png";
import triste from "/images/lose.png";

const ModalRecapGame = ({ open, setOpen, game, classement }) => {
  const { socket, currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [scoreRange, setScoreRage] = useState({});

  const rangeScore = () => {
    const range = {};
    for (const player of game.players) {
      for (let tower of game.towers) {
        for (let key in tower) {
          if (key == player.player.username) {
            range[key] = !range[key]
              ? [tower[key]]
              : [...range[key], tower[key]];
          }
        }
      }
    }
    setScoreRage(range);
  };

  const getTotalScore = (label) => {
    let result = 0;
    for (const tower of scoreRange[label]) {
      for (const score of tower) {
        result += score;
      }
    }

    return result;
  };
  useEffect(() => {
    rangeScore();
  }, []);

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
            <span className="text-lg md:text-2xl font-bold">Récapitulatif</span>
          </div>
          <div className="flex items-center space-x-5">
            <span>{"Gragnant"}:</span>
            <div className="flex items-center space-x-2">
              <img src={avatar} alt="user" className="h-5 md:h-16" />
              <span>{game?.winner?.username}</span>
            </div>
          </div>
          <div className="flex items-center space-x-5 pb-3 border-b">
            <span>Participant(s):</span>
          </div>

          <div className="h-[200px] overflow-y-auto space-y-2">
            {Object.entries(scoreRange).map(([key, value]) => (
              <div
                className={`rounded p-2 ${
                  game?.winner?.username == key
                    ? "bg-primary-50"
                    : "bg-gray-100"
                } flex justify-between`}
              >
                <div>
                  <div className="font-bold">
                    {key == currentUser?.username ? "Moi" : key}
                  </div>
                  <div className="pt-2 w-full">
                    {value.map((scores, i) => (
                      <div className="flex space-x-2 items-center">
                        <span>{i + 1}.</span>
                        {scores.map((e) => (
                          <img
                            src={`/images/${e}.png`}
                            alt=""
                            className="h-5"
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="font-bold text-lg">{getTotalScore(key)}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-5">
            <button
              className="btn bg-primary-500 text-white w-2/5 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
            >
              Fermer
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
export default ModalRecapGame;
