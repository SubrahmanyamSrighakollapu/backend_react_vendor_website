import React, { useState, useEffect } from "react";
import { API_URL } from "../../data/apiPath";
import { ThreeCircles } from "react-loader-spinner";

const AddFirm = () => {
  const [firmName, setFirmName] = useState("");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState([]);
  const [region, setRegion] = useState([]);
  const [offer, setOffer] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState("");
  const [sentimentScore, setSentimentScore] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleRegionChange = (event) => {
    const value = event.target.value;
    setRegion((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleImageUpload = (event) => {
    const selectedImage = event.target.files[0];
    setFile(selectedImage);
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setAnimationType("");
    setSentimentScore(null);
    setAnimatedScore(0);
  };

  useEffect(() => {
    if (
      showAnimation &&
      sentimentScore !== null &&
      (animationType === "success" || animationType === "rejected")
    ) {
      let start = 0;
      const duration = 1000; // duration in ms
      const increment = sentimentScore / (duration / 20); // steps

      const interval = setInterval(() => {
        start += increment;
        if (start >= sentimentScore) {
          setAnimatedScore(Math.round(sentimentScore));
          clearInterval(interval);
        } else {
          setAnimatedScore(Math.round(start));
        }
      }, 20);

      return () => clearInterval(interval); // cleanup on unmount
    }
  }, [sentimentScore, showAnimation, animationType]);

  const handleFirmSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginToken = localStorage.getItem("loginToken");
      if (!loginToken) {
        alert("Authentication failed. Please login again.");
        return;
      }

      const formData = new FormData();
      formData.append("firmName", firmName);
      formData.append("area", area);
      formData.append("offer", offer);
      formData.append("image", file);
      category.forEach((value) => formData.append("category", value));
      region.forEach((value) => formData.append("region", value));

      const response = await fetch(`${API_URL}/firm/add-firm`, {
        method: "POST",
        headers: { token: `${loginToken}` },
        body: formData,
      });

      const data = await response.json();
      const scoreFromAPI = data.sentimentScore ?? null;
      setSentimentScore(scoreFromAPI);

      if (response.ok) {
        const { firmId, vendorFirmName } = data;

        if (scoreFromAPI > 50) {
          setAnimationType("success");
          setShowAnimation(true);
          setTimeout(() => {
            setShowAnimation(false);
            localStorage.setItem("firmId", firmId);
            localStorage.setItem("firmName", vendorFirmName);
            alert("✅ Firm added successfully!");
            window.location.reload();
          }, 2000);
        } else {
          setAnimationType("rejected");
          setShowAnimation(true);
        }

        setFirmName("");
        setArea("");
        setCategory([]);
        setRegion([]);
        setOffer("");
        setFile(null);
      } else if (response.status === 403) {
        setAnimationType("rejected");
        setSentimentScore(scoreFromAPI);
        setShowAnimation(true);
      } else if (response.status === 400) {
        setAnimationType("no-reviews");
        setShowAnimation(true);
      } else if (data.message === "vendor can have only one firm") {
        alert("⚠️ Firm already exists. Only one firm can be added per vendor.");
      } else {
        alert("❌ Failed to add Firm. Please try again.");
      }
    } catch (error) {
      console.error("Failed to add Firm:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center px-4  md:ml-24 lg:ml-20 mb-50">
      {loading ? (
        <div className="loaderSection">
          <ThreeCircles
            visible={loading}
            height={100}
            width={100}
            color="#4fa94d"
            ariaLabel="three-circles-loading"
          />
        </div>
      ) : (
        <form
          className="w-full lg:max-w-3xl bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-4 border border-gray-200"
          onSubmit={handleFirmSubmit}
          encType="multipart/form-data"
        >
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
            Add Firm
          </h2>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Firm Name</label>
            <input
              type="text"
              name="firmName"
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Area</label>
            <input
              type="text"
              name="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Category</label>
            <div className="flex flex-wrap gap-4">
              {["veg", "non-veg"].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={item}
                    checked={category.includes(item)}
                    onChange={handleCategoryChange}
                    className="accent-blue-600"
                  />
                  {item.toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Offer</label>
            <input
              type="text"
              name="offer"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Region</label>
            <div className="flex flex-wrap gap-4">
              {["south-indian", "north-indian", "chinese", "bakery"].map(
                (item) => (
                  <label key={item} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={item}
                      checked={region.includes(item)}
                      onChange={handleRegionChange}
                      className="accent-blue-600"
                    />
                    {item.replace("-", " ").toUpperCase()}
                  </label>
                )
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Firm Image</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-50 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      {showAnimation && (
        <div className="popupAnimation">
          <div className="popupContent">
            {animationType === "success" && (
              <>
                <h2>🎉 Firm Added!</h2>
                <p>Your restaurant passed the review check!</p>
                {sentimentScore !== null && (
                  <p>Sentiment Score: {animatedScore}%</p>
                )}
              </>
            )}

            {animationType === "rejected" && (
              <>
                <h2>❌ Rejected!</h2>
                <p>Your restaurant failed the review check.</p>
                {sentimentScore !== null && (
                  <p>Sentiment Score: {animatedScore}%</p>
                )}
                <button onClick={handleAnimationComplete}>OK</button>
              </>
            )}

            {animationType === "no-reviews" && (
              <>
                <h2>⚠️ No Reviews Found</h2>
                <p>Contact the website owner to approve your restaurant.</p>
                <button onClick={handleAnimationComplete}>OK</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFirm;
