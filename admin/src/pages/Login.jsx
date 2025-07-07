import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAtoken, backendUrl } = useContext(AdminContext);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === "Admin") {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("atoken", data.token);
          setAtoken(data.token);
          toast.success("Login Successful");
        }
      } else {
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[80vh] flex items-center justify-center bg-gray-50"
    >
      <div className="flex flex-col items-start gap-5 m-auto p-10 min-w-[340px] sm:min-w-96 bg-white border-none rounded-2xl text-[#5E5E5E] text-base shadow-2xl">
        <p className="text-3xl m-auto font-bold mb-2">
          <span className="text-[#5f6fff]">{state}</span> Login
        </p>
        <div className="w-full">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="border border-[#dadada] rounded-lg w-full p-2 mt-1 focus:outline-none focus:border-[#5f6fff] transition"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="w-full">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="border border-[#dadada] rounded-lg w-full p-2 mt-1 focus:outline-none focus:border-[#5f6fff] transition"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button
          className="w-full mt-4 bg-[#5f6fff] text-white py-2 rounded-lg font-semibold shadow hover:bg-[#4053d6] transition"
          type="submit"
        >
          Login
        </button>
        {state === "Admin" ? (
          <p>
            Doctor Login:{" "}
            <span
              className="underline text-[#5f6fff] cursor-pointer"
              onClick={() => setState("Doctor")}
            >
              Click Here
            </span>
          </p>
        ) : (
          <p>
            Admin Login:{" "}
            <span
              className="underline text-[#5f6fff] cursor-pointer"
              onClick={() => setState("Admin")}
            >
              Click Here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
