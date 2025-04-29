import React, { useState } from "react";
import { API_URL } from "../../data/apiPath";
import { ThreeCircles } from "react-loader-spinner";

const Register = ({ showLoginHandler }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Set loading to false initially
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the request starts
    try {
      const response = await fetch(`${API_URL}/vendor/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setUsername("");
        setEmail("");
        setPassword("");
        alert("Vendor registered successfully");
        showLoginHandler();
      } else {
        setError(data.error);
        alert("Registration Failed, Contact Admin");
      }
    } catch (error) {
      console.error("Registration failed", error);
      alert("Registration failed");
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
          <p className="text-lg mt-4">Hi, your registration is in process</p>
        </div>
      ) : (
        <form
          className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 flex flex-col gap-4"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <h3 className="text-2xl font-semibold text-center text-green-600">
            Vendor Register
          </h3>

          <label className="text-sm font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            placeholder="Enter your password"
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />

          <span
            className="text-sm text-green-600 cursor-pointer self-end"
            onClick={handleShowPassword}
          >
            {showPassword ? "Hide" : "Show"}
          </span>

          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default Register;
