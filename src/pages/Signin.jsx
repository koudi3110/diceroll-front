import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthImage from "/images/background.jpg";
import Logo from "/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  login,
  replaceCurrentUser,
  replaceIsLoggedIn,
  visitor,
} from "../slices/auth";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import TextInput from "../components/TextInput";
import ModalAlert from "./modals/ModalAlert";
import moment from "moment/moment";
import Loading from "../components/Loading";
import { showError } from "../components/Toasts";

function Signin() {
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Nom d'utilisateur requis").trim(),
  });

  const { isLoggedIn } = useSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [showIsexist, setShowIsExist] = useState(false);
  const [message, setMessage] = useState("");
  const [me, setMe] = useState();
  const [load, setLoad] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });
  const navigate = useNavigate();
  // addLocaleData([...locale_en, ...locale_de]);

  const dispatch = useDispatch();

  const itsMe = () => {
    dispatch(replaceCurrentUser(me));
    dispatch(replaceIsLoggedIn(true));
    localStorage.setItem("user", JSON.stringify(me));
    navigate("/home");
  };

  const onFormSubmit = (data) => {
    setLoad(true);
    dispatch(login(data))
      .unwrap()
      .then((data) => {
        setLoad(false);
        console.log(data.is_exist);
        if (data.is_exist) {
          setMe(data.data);
          const msg = `${data?.data?.username} c'est connecté le ${moment(
            data?.data
          ).format("DD/MM/YYYY")}. Est ce bien vous ?`;
          setShowIsExist(true);
          setMessage(msg);
        } else {
          dispatch(replaceCurrentUser(data.data));
          dispatch(replaceIsLoggedIn(true));
          localStorage.setItem("user", JSON.stringify(data.data));
          navigate("/home");
        }
      })
      .catch((err) => {
        setLoad(false);
        showError("Une erreur c'est produit");
      });
  };

  const start_visitor = () => {
    setLoad(true);
    dispatch(visitor())
      .unwrap()
      .then(() => {
        setLoad(false);
        navigate("/home");
      })
      .catch((err) => {
        setLoad(false);
        showError("Une erreur c'est produit");
      });
  };

  const onErrors = (errors) => console.error(errors);

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <main className="bg-white">
      <Loading load={load} />
      <ModalAlert
        open={showIsexist}
        setOpen={setShowIsExist}
        message={message}
        action={() => itsMe()}
      />

      <div className="relative md:flex">
        {/* Image */}
        <div className="hidden md:block md:w-1/2" aria-hidden="true">
          <img
            className="object-cover object-center w-full h-full"
            src={AuthImage}
            width="760"
            height="1024"
            alt="Authentication"
          />
        </div>

        {/* Content */}
        <div className="md:w-1/2">
          <div
            className="h-full flex flex-col after:flex-1"
            style={{ minHeight: window.innerHeight }}
          >
            {/* Header */}
            <div className="flex-1">
              <div className="flex items-center justify-between h-16  px-4 sm:px-6 lg:px-8 ">
                {/* Logo */}
                <img className="h-12 rounded-full" src={Logo} />
              </div>
            </div>

            <div className="max-w-xl w-full px-16 mx-auto block text-base font-normal">
              <div className="flex flex-col items-center">
                <img className="h-48" src={Logo} alt="" />
                <h1 className="text-3xl text-slate-800 font-bold mb-6">
                  Connexion
                </h1>
              </div>
              {/* Form */}
              <form onSubmit={handleSubmit(onFormSubmit, onErrors)}>
                <div className="space-y-1">
                  <div>
                    <TextInput
                      className={`form-input w-full focus:border-primary-500 box-border focus:font-semibold
                        font-semibold py-2 px-5 mb-2 border-1 ${
                          errors.username
                            ? "border-l-4 border-r-1 border-y-1 border-red-500"
                            : "focus:border-l-4 focus:border-indigo-500"
                        }`}
                      name={"username"}
                      placeholder={"Nom d'utilisateur"}
                      onChange={(e) => {
                        setValue("username", e);
                        setUsername(e);
                      }}
                      register={{ ...register("username") }}
                      value={username}
                    />
                    <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                      {errors.pseudo?.message}
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="btn bg-black w-full hover:bg-primary-500 text-white"
                    to="/"
                  >
                    Se connecter
                  </button>
                </div>
              </form>
              {/* Footer */}
              <div className="pt-5 mt-6 border-t border-slate-200">
                <div className="text-sm">
                  Cotinuer en tant que:{" "}
                  <button
                    href="#"
                    className="font-medium text-primary-500 hover:text-primary-600"
                    onClick={() => start_visitor()}
                  >
                    visiter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Signin;
