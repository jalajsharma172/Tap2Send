import React, { useState, useEffect } from "react";
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { sepolia } from "thirdweb/chains";

import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { Example } from "../components/connectwallet";
// import { client } from "../lib/thirdweb";
import ABI from "../utils/abi.json"
const CONTRACT_ADDRESS = "0x395595376CCEc7C3aC9BC8543F2eF80Bee31F0d9";
import { createThirdwebClient } from "thirdweb";

export const client = createThirdwebClient({
  clientId: "ed4bcdc6d450e0296557ec799c7ab19b", // required
});

export default function RegisterPhonePage() {
  const account = useActiveAccount(); // ✔ Get connected wallet
  const { mutate: sendTx, isPending } = useSendTransaction();

  const [contract, setContract] = useState<any>(null);
  const [phone, setPhone] = useState("");
  const [status, setStatus] =
    useState<"idle" | "validating" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load contract on mountsetErrorMessage
useEffect(() => {
    async function loadContract() {
      const c = getContract({
        client,
        chain: sepolia,
        address: CONTRACT_ADDRESS,
        abi: ABI, // ✔ MUST INCLUDE ABI
      });
      setContract(c);
    }
    loadContract();
  }, []);


  function validatePhone(input: string): boolean {
    const trimmed = input.trim();
    const re = /^\+?[0-9]{7,15}$/;
    return re.test(trimmed);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    setStatus("validating");
    if (!validatePhone(phone)) {
      setErrorMessage("Invalid phone number.");
      setStatus("error");
      return;
    }

    if (!account) {
      setErrorMessage("Please connect your wallet first.");
      setStatus("error");
      return;
    }

    if (!contract) {
      setErrorMessage("Contract not loaded.");
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
            const cleaned = phone.replace(/\+/g, "").trim();
            const phoneUint = BigInt(cleaned);

            const tx = prepareContractCall({
                contract,
                method: "register",
                params: [phoneUint],   // MUST be BigInt for uint256
            });


      sendTx(
        tx,
        {
          onSuccess: () => setStatus("success"),
          onError: (err) => {
            setErrorMessage(err.message);
            setStatus("error");
          },
        }
      );
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Transaction failed");
      setStatus("error");
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 24 }}>
      <h1>Register Phone Number</h1>

      <Example /> {/* Connect Wallet */}

      <p>
        This will call <code>register(string)</code>.
      </p>

      <form onSubmit={handleSubmit}>
        <label>Phone number:</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+919876543210"
        />

        <button type="submit" disabled={isPending || status === "sending"}>
          {isPending || status === "sending" ? "Sending..." : "Register Phone"}
        </button>
      </form>

      {!account && <p style={{ color: "orange" }}>Connect your wallet.</p>}

      {status === "success" && (
        <p style={{ color: "green" }}>Phone registered successfully!</p>
      )}

      {status === "error" && (
        <p style={{ color: "red" }}>{errorMessage}</p>
      )}
    </div>
  );
}
