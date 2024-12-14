import React, { useState, useEffect } from "react";
import Link from "next/link";
export default function HomePage() {
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // Renamed from `loading`
  const [errorMessage, setErrorMessage] = useState("");

  const tokenExpiryTime = 10 * 60 * 1000; // 10 minutes in milliseconds

  // Function to handle verification
  const handleVerification = async () => {
    setIsVerifying(true); // Start verification process
    setErrorMessage(""); // Clear previous errors

    const apiToken = "e5bf7301b4ad442d45481de99fd656a182ec6507";
    const callbackUrl = "https://madhanblast.github.io/Page/"; // Replace with your actual callback URL
    const apiUrl = `https://api.gplinks.com/api?api=${apiToken}&url=${encodeURIComponent(callbackUrl)}`;

    try {
      const response = await fetch(apiUrl);

      // Check if the response is okay
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();

      // Check the result status
      if (result.status === "success" && result.shortenedUrl) {
        // Save token and timestamp to localStorage
        localStorage.setItem("gplinks_token", "valid");
        localStorage.setItem("gplinks_token_timestamp", Date.now().toString());

        // Redirect the user to the shortened URL
        window.location.href = result.shortenedUrl;
      } else {
        throw new Error(result.message || "Failed to generate the verification link.");
      }
    } catch (error) {
      console.error("Error during verification:", error);
      setErrorMessage(error.message || "An error occurred while contacting the server.");
    } finally {
      setIsVerifying(false); // End verification process
    }
  };

  // Check if the user is verified (token logic with expiry check)
  useEffect(() => {
    const token = localStorage.getItem("gplinks_token");
    const tokenTimestamp = localStorage.getItem("gplinks_token_timestamp");

    if (token && tokenTimestamp) {
      const elapsedTime = Date.now() - parseInt(tokenTimestamp, 10);

      if (elapsedTime < tokenExpiryTime) {
        setIsVerified(true);
      } else {
        // Token expired, clear the token
        localStorage.removeItem("gplinks_token");
        localStorage.removeItem("gplinks_token_timestamp");
        setIsVerified(false);
      }
    }
  }, []);

  // Render the dialog if not verified or token expired
  if (!isVerified) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <h1>Please verify your account to access the homepage</h1>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button
          onClick={handleVerification}
          disabled={isVerifying}
          style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        >
          {isVerifying ? "Verifying..." : "Verify GPLink"}
        </button>
      </div>
    );
  }

  // Render the homepage if verified
  return (
    <div>
      <Link href="/index1">
        <span>Visit HomePage</span>
      </Link>
    </div>
  );
}