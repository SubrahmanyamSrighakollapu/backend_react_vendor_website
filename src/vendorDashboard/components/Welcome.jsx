import React from "react";

const Welcome = () => {
  const firmName = localStorage.getItem("firmName");

  return (
    <div className="welcomeSection">
      <div className="landingImage"></div>
    </div>
  );
};

export default Welcome;
