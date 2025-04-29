import React, { useState } from "react";
import { API_URL } from "../../data/apiPath";
import { ThreeCircles } from "react-loader-spinner";

const Login = ({ showWelcomeHandler }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/vendor/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Login success");
        setEmail("");
        setPassword("");
        localStorage.setItem("loginToken", data.token);
        showWelcomeHandler();
      }
      const vendorId = data.vendorId;
      console.log("checking for VendorId:", vendorId);
      const vendorResponse = await fetch(
        `${API_URL}/vendor/single-vendor/${vendorId}`
      );
      window.location.reload();
      const vendorData = await vendorResponse.json();
      if (vendorResponse.ok) {
        const vendorFirmId = vendorData.vendorFirmId;
        const vendorFirmName = vendorData.vendor.firm[0].firmName;
        localStorage.setItem("firmId", vendorFirmId);
        localStorage.setItem("firmName", vendorFirmName);
      }
    } catch (error) {
      alert("login fail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100 flex justify-center items-center min-h-screen px-4 md:ml-24 lg:ml-80 mb-120">
      {loading ? (
        <div className="loaderSection">
          <ThreeCircles
            visible={loading}
            height={100}
            width={100}
            color="#4fa94d"
            ariaLabel="three-circles-loading"
          />
          <p className="text-lg mt-4">Login in process... Please wait</p>
        </div>
      ) : (
        <form
          className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 flex flex-col gap-4"
          onSubmit={loginHandler}
          autoComplete="off"
        >
          <h3 className="text-2xl font-semibold text-center text-blue-600">
            Vendor Login
          </h3>

          <label className="text-sm font-medium">Email</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />

          <label className="text-sm font-medium">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />

          <span
            className="text-sm text-blue-600 cursor-pointer self-end"
            onClick={handleShowPassword}
          >
            {showPassword ? "Hide" : "Show"}
          </span>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
