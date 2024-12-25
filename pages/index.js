import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const tokenExpiryTime = 60 * 60 * 1000;

  const handleVerification = async () => {
    setIsVerifying(true);
    setErrorMessage("");

    const apiToken = "e5bf7301b4ad442d45481de99fd656a182ec6507";
    const callbackUrl = "https://madhanblast.github.io/Page/";
    const apiUrl = `https://api.gplinks.com/api?api=${apiToken}&url=${encodeURIComponent(callbackUrl)}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      const result = await response.json();
      if (result.status === "success" && result.shortenedUrl) {
        localStorage.setItem("gplinks_token", "valid");
        localStorage.setItem("gplinks_token_timestamp", Date.now().toString());
        window.location.href = result.shortenedUrl;
      } else throw new Error(result.message || "Verification failed.");
    } catch (error) {
      setErrorMessage(error.message || "An error occurred.");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("gplinks_token");
    const tokenTimestamp = localStorage.getItem("gplinks_token_timestamp");

    if (token && tokenTimestamp) {
      const elapsedTime = Date.now() - parseInt(tokenTimestamp, 10);
      if (elapsedTime < tokenExpiryTime) setIsVerified(true);
      else {
        localStorage.removeItem("gplinks_token");
        localStorage.removeItem("gplinks_token_timestamp");
        setIsVerified(false);
      }
    }
  }, []);

  if (!isVerified) {
    return (
      <div className="verificationContainer-7">
        <div className="verificationBox-7">
          <div className="logo-7">
            <h2>Cinema Talkiez</h2><p></p>
            <p>100% Telugu Entertainment</p>
          </div>
          <div className="yellow-text">
          <p>Your Token has expired, Verify yourself to get Token</p>
       
          </div>
          {errorMessage && <p className="error-7">{errorMessage}</p>}
          <button
            onClick={handleVerification}
            disabled={isVerifying}
            className="verifyButton-7"
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </button>
          <div className="description-6">
          <p>Token Timeout:  1 week</p>
          </div>
          <p> </p>
          <p className="description-7">
            Watch & download Telugu movies and Animes in excellent quality. Exclusively
            designed for smartphones.
          </p>
          
        </div>
       
      </div>
    );
  }

  return (
    <div className="centered-link">
       
    <Link href="/index1">
      <span>Visit HomePage</span>
    </Link>
  </div>
  );
}
