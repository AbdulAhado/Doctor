import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setname] = useState("");

  const { token, setToken, backendUrl } = useContext(AppContext);
  const navigate = useNavigate()
  const onSubmitHandeler = async (e) => {
    e.preventDefault();
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          password,
          email,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("user Created SuccessFully")
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          password,
          email,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("User Loged in")
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (token) {
      navigate( '/')
    }
  }, [token])
  

  return (
    <form onSubmit={onSubmitHandeler} className="min-h-[80vh] flex items-center mx-20">
      <div className="flexd flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96  rounded-xl text-zinc-600 text-sm shadow-xl">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p className="py-2">
          Please {state === "Sign Up" ? "Sign up" : "Login"} to book appointment
        </p>
        {state === "Sign Up" && (
          <div className="w-full">
            <p className="mt-1">Full Name</p>
            <input
              className="border border-zinc-300 outline-0 rounded w-full p-2 mt-1"
              type="text"
              onChange={(e) => setname(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        <div className="w-full">
          <p className="mt-1">Email</p>
          <input
            className="border border-zinc-300 outline-0 rounded w-full p-2 mt-1"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="w-full">
          <p className="mt-1">Password</p>
          <input
            className="border border-zinc-300 outline-0 rounded w-full p-2 mt-1"
            type="text"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <button type="submit" className="primary text-white w-full py-2 rounded-md text-base mt-2">
          {state === "Sign Up" ? "Create Account" : "Login"}{" "}
        </button>
        {state === "Sign Up" ? (
          <p className="mt-2">
            Already have an account?{" "}
            <span
              className="cursor-pointer underline text-primary"
              onClick={() => setState("Login")}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="mt-2">
            Create a new account ?{" "}
            <span
              className="cursor-pointer underline text-primary "
              onClick={() => setState("Sign Up")}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
