import React, { useState } from "react";
import { BrowserProvider } from "ethers";
import "./App.css";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        setStatus("Wallet connected!");
      } catch (err) {
        setStatus("User rejected wallet connection.");
      }
    } else {
      setStatus("MetaMask not detected!");
    }
  };

  const submitWallet = () => {
    if (!walletAddress) {
      setStatus("Please connect your wallet first.");
      return;
    }

    let submissions = JSON.parse(localStorage.getItem("walletSubmissions")) || [];

    if (!submissions.includes(walletAddress)) {
      submissions.push(walletAddress);
      localStorage.setItem("walletSubmissions", JSON.stringify(submissions));
      setStatus("Wallet address saved successfully!");
    } else {
      setStatus("Wallet already submitted.");
    }
  };

  return (
    <div className="App">
      <h1>ENCRYPT</h1>
      <button onClick={connectWallet}>Connect Wallet</button>

      {walletAddress && (
        <div className="address-box">
          <p><strong>Connected:</strong><br /> {walletAddress}</p>
        </div>
      )}

      <button onClick={submitWallet}>Submit Address</button>
      <p>{status}</p>
    </div>
  );
}

export default App;
