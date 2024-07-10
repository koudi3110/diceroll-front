import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import ModalBasic from "../../components/ModalBasic";
import SelectInput from "../../components/SelectInput";
import TextInput from "../../components/TextInput";
import Messages from "../../components/Messages";
import { useDispatch, useSelector } from "react-redux";
import { createGame, replaceGameData } from "../../slices/game";
import { showError } from "../../components/Toasts";
import Loading from "../../components/Loading";
import { FaDice } from "react-icons/fa";
import { MdGamepad, MdOutlineTimer } from "react-icons/md";

const ModalNewGame = ({ open, setOpen, setGame, setJoinOpen }) => {
  const validationSchema = Yup.object().shape({
    nb_parties: Yup.number()
      .required("Nombre de partie requis")
      .min(1, "min 1")
      .max(10, "max 10"),
    nb_players: Yup.object().required("Nombre de joeurs requis"),
    timer: Yup.number()
      .min(20, "min 20s")
      .max(60, "max 60s")
      .required("temps coup requis"),
    nb_dices: Yup.number()
      .required("Nombre de dé requis")
      .min(1, "min 1")
      .max(10, "max 10"),
  });

  const { currentUser } = useSelector((state) => state.auth);

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });

  const [isOpen, setIsOpen] = useState(true);
  const [load, setLoad] = useState(false);
  const { configs } = useSelector((state) => state.config);

  const nbPlayers = [
    { id: 1, name: "1 joueur", value: 1 },
    { id: 2, name: "2 joueur", value: 2 },
    { id: 3, name: "3 joueur", value: 3 },
    { id: 4, name: "4 joueur", value: 4 },
  ];

  const watchFields = watch();
  const dispatch = useDispatch();

  useEffect(() => {
    if (configs) {
      setValue("timer", configs?.timer);
      setValue("nb_parties", configs?.nb_partie);
      setValue("nb_dices", configs?.nb_dices);

      if (configs?.nb_players) {
        const find = nbPlayers.find((e) => e.value == configs.nb_players);
        setValue("nb_players", find);
      }
    }
  }, [configs]);

  const newGame = (data) => {
    const params = {
      nb_parties: data.nb_parties,
      nb_players: data.nb_players.value,
      nb_dices: data.nb_dices,
      creator: currentUser?._id,
      timer: data.timer,
    };
    console.log(params);
    // localStorage.setItem("@game:init", JSON.stringify(params));
    setLoad(true);
    dispatch(createGame(params))
      .unwrap()
      .then((data) => {
        setLoad(false);
        setOpen(false);
        setGame(data);
        setJoinOpen(true);
        delete params.password;
        delete params.acceptStoppedBall;
        delete params.isOpen;
        dispatch(
          replaceGameData({
            ...params,
          })
        );
      })
      .catch((err) => {
        setLoad(false);
        const error = err.message?.includes("timeout")
          ? "vérifieez votre connexion"
          : err.message;
        showError(error);
      });
  };

  return (
    <ModalBasic
      id="ModalNewGame"
      modalOpen={open}
      setModalOpen={setOpen}
      title={"Nouvelle session"}
    >
      <Loading load={load} />
      <div className="px-5 py-4 text-black">
        <div className="space-y-3">
          <div>
            <SelectInput
              options={nbPlayers}
              placeholder={"Nb joeurs max"}
              order={false}
              onChange={(val) => setValue("nb_players", val)}
              selectedValue={watchFields.nb_players}
              // label="Nbreb joueurs"
            />
            {errors?.nb_players && (
              <Messages message={errors?.nb_players?.message} />
            )}
          </div>

          <div>
            <TextInput
              placeholder={"Nbr parites"}
              value={watchFields.nb_parties}
              onChange={(val) => setValue("nb_parties", val)}
              inputType="number"
              label={"Nbr parites"}
              showLabel
              suffix={<MdGamepad className="text-lg text-black" />}
            />
            {errors?.nb_parties && (
              <Messages message={errors?.nb_parties?.message} />
            )}
          </div>

          <div>
            <TextInput
              placeholder={"Nbr de dé"}
              value={watchFields.nb_dices}
              onChange={(val) => setValue("nb_dices", val)}
              inputType="number"
              label={"Nbr de dé"}
              showLabel
              suffix={<FaDice className="text-lg text-black" />}
            />
            {errors?.nb_dices && (
              <Messages message={errors?.nb_dices?.message} />
            )}
          </div>

          <div>
            <TextInput
              placeholder={"Temps coup"}
              value={watchFields.timer}
              onChange={(val) => setValue("timer", val)}
              inputType="number"
              label={"Temps coup"}
              showLabel
              suffix={<MdOutlineTimer className="text-lg text-black" />}
            />
            {errors?.timer && <Messages message={errors?.timer?.message} />}
          </div>
        </div>
        <div className="flex mt-10 justify-between">
          <button
            className="btn bg-primary-500 text-white w-2/5 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          >
            Annuler
          </button>
          <button
            className="btn bg-black text-white w-2/5 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();

              handleSubmit(newGame)();
            }}
            disabled={load}
          >
            Créer
          </button>
        </div>
      </div>
    </ModalBasic>
  );
};
export default ModalNewGame;
