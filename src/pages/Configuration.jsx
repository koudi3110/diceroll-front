import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import user from "/images/avatar.png";
import { showError, showSucces } from "../components/Toasts";
import { createUpdateConfigs, getConfigs } from "../slices/config";
import Messages from "../components/Messages";
import Loading from "../components/Loading";

const InputView = ({ label, value, onChange }) => (
  <div class="relative h-11 w-full min-w-[200px]">
    <input
      placeholder=""
      value={value}
      class="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
      onChange={(e) => {
        onChange(e.target.value);
      }}
    />
    <label class="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
      {label}
    </label>
  </div>
);

const Configuration = () => {
  const validationSchema = Yup.object().shape({
    nb_partie: Yup.number("entrer un nombre").min(1, "min 1").max(10, "max 10"),
    nb_players: Yup.number("entrer un nombre").min(1, "min 1").max(4, "max 10"),
    timer: Yup.number("entrer un nombre").min(20, "min 20s").max(60, "max 60s"),
    nb_dices: Yup.number("entrer un nombre").min(1, "min 1").max(10, "max 10"),
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [load, setLoad] = useState(false);
  const { currentUser } = useSelector((state) => state.auth);
  const { configs } = useSelector((state) => state.config);

  const dispatch = useDispatch();

  if (!localStorage.getItem("user")) {
    return <Navigate to="/signin" />;
  }

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });
  const watchFields = watch();

  useEffect(() => {
    dispatch(getConfigs(currentUser?._id))
      .unwrap()
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        // showError("Impossible de charger les configurations");
      });
  }, []);

  useEffect(() => {
    setValue("nb_players", configs?.nb_players);
    setValue("nb_partie", configs?.nb_partie);
    setValue("nb_dices", configs?.nb_dices);
    setValue("timer", configs?.timer);
  }, [configs]);

  const createOrUpdateConfig = (data) => {
    const data2 = {
      ...data,
      player: currentUser?._id,
    };

    setLoad(true);
    dispatch(createUpdateConfigs(data2))
      .unwrap()
      .then((data) => {
        setLoad(false);
        showSucces("Informations mis à jour avec success");
        dispatch(getConfigs(currentUser?._id));
      })
      .catch((err) => {
        setLoad(false);
        showError("Une erreur est survenue");
      });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Loading load={load} />
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="h-full relative pt-10">
          <div className="space-y-5">
            <div className="flex flex-col items-center border-b space-y-4 pb-5">
              <div className="h-32 w-32 border-3 rounded-full flex items-center justify-center">
                <img src={user} alt="user" className="h-28" />
              </div>
              <div>
                Configuration par défaut de{" "}
                <span className="font-bold text-xl">
                  {currentUser?.username}
                </span>
              </div>
            </div>
            <div className="max-w-2xl bg-white shadow-lg rounded mx-3 md:m-auto p-5">
              <div className="space-y-5">
                <div>
                  <InputView
                    label={"Nombre de joueurs:"}
                    value={watchFields.nb_players}
                    onChange={(val) => {
                      setValue("nb_players", val);
                    }}
                  />
                  {errors?.nb_players && (
                    <Messages message={errors?.nb_players?.message} />
                  )}
                </div>
                <div>
                  <InputView
                    label={"Nombre de parties:"}
                    value={watchFields.nb_partie}
                    onChange={(val) => {
                      setValue("nb_partie", val);
                    }}
                  />
                  {errors?.nb_partie && (
                    <Messages message={errors?.nb_partie?.message} />
                  )}
                </div>
                <div>
                  <InputView
                    label={"Nombre de dés:"}
                    value={watchFields.nb_dices}
                    onChange={(val) => {
                      setValue("nb_dices", val);
                    }}
                  />
                  {errors?.nb_dices && (
                    <Messages message={errors?.nb_dices?.message} />
                  )}
                </div>
                <div>
                  <InputView
                    label={"Temps par coups:"}
                    value={watchFields.timer}
                    onChange={(val) => {
                      setValue("timer", val);
                    }}
                  />
                  {errors?.timer && (
                    <Messages message={errors?.timer?.message} />
                  )}
                </div>
              </div>

              <div className="flex justify-center pt-5">
                <button
                  className="btn bg-black text-white w-2/3 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleSubmit(createOrUpdateConfig)();
                  }}
                  // disabled={load}
                >
                  Mettre à jour
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Configuration;
