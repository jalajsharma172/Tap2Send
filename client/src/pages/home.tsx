import { useState, useEffect, useCallback } from "react";
import { readContract, getContract, createThirdwebClient,prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { toWei } from "thirdweb/utils";
import ABI from "../utils/abi.json";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { Example } from "../components/connectwallet";


interface Transaction {
  id: string;
  sender: string;
  receiver: string;
  amount: string;
  isUser: boolean;
  animation: string;
  duration: number;
  verticalPos?: number;
}

const PHONE_NUMBERS = [
  "+1 415 555 0123", "+44 20 7946 0958", "+91 98765 43210", "+81 3 1234 5678",
  "+49 30 12345678", "+33 1 42 86 82 00", "+61 2 9876 5432", "+86 10 1234 5678",
  "+7 495 123 4567", "+55 11 98765 4321", "+82 2 1234 5678", "+39 06 1234 5678",
  "+34 91 123 4567", "+52 55 1234 5678", "+27 21 123 4567", "+971 4 123 4567",
  "+65 6123 4567", "+63 2 1234 5678", "+62 21 1234 5678", "+60 3 1234 5678",
  "+66 2 123 4567", "+84 24 1234 5678", "+92 21 1234 5678", "+20 2 1234 5678",
  "+234 1 234 5678", "+254 20 123 4567", "+94 11 234 5678", "+880 2 1234 5678",
  "+977 1 234 5678", "+94 11 234 5678",
];

const ANIMATIONS = [
  { name: "moveLeftToRight", style: "left" },
  { name: "moveRightToLeft", style: "right" },
  { name: "moveDiagonalTL", style: "diagonal-tl" },
  { name: "moveDiagonalTR", style: "diagonal-tr" },
  { name: "moveDiagonalBL", style: "diagonal-bl" },
  { name: "moveDiagonalBR", style: "diagonal-br" },
];

export const client = createThirdwebClient({
  clientId: "ed4bcdc6d450e0296557ec799c7ab19b",
});

const CONTRACT_ADDRESS = "0x395595376CCEc7C3aC9BC8543F2eF80Bee31F0d9";
function convertToWei(value: string, unit: string) {
  if (!value) return "0";

  if (unit === "ether") return toWei(value);       // ETH → Wei
  if (unit === "wei")   return value;             // Already Wei

  return "0";
}

export default function Home() {
    const account = useActiveAccount(); // ✔ Get connected wallet
  const { mutate: sendTx, isPending } = useSendTransaction();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isKeypadVisible, setIsKeypadVisible] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [lookupResult, setLookupResult] = useState<string>("");
  const [receiverWallet, setReceiverWallet] = useState<string>("WALLETADDRESS");
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [status, setStatus] =
    useState<"idle" | "validating" | "sending" | "success" | "error">("idle");
  const [isSending, setIsSending] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [contract, setContract] = useState<any>(null);
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("ether");  
  // Load Contract
  useEffect(() => {
    async function loadContract() {
      const c = getContract({
        client,
        chain: sepolia,
        address: CONTRACT_ADDRESS,
        abi: ABI,
      });
      setContract(c);
    }
    loadContract();
  }, []);

  // Lookup Wallet from Phone
  async function lookupWallet(rawPhone: string) {
    try {
      if (!contract) throw new Error("Contract not loaded");

      const cleaned = rawPhone.replace(/[+ ]/g, "");
      const phoneUint = BigInt(cleaned);

      const wallet = await readContract({
        contract,
        method: "phonenumberToAddress",
        params: [phoneUint],
      });

      const resolved = wallet || "Not registered";

      console.log("Wallet:", resolved);
      setReceiverWallet(resolved);
      setLookupResult(resolved);
    } catch (err) {
      console.error(err);
      setLookupResult("Error fetching address");
      setReceiverWallet("Not Found");
    }
  }



  useEffect(() => {
  const digits = phoneNumber.replace(/[+ ]/g, "");

  if (digits.length === 10) {
    setIsKeypadVisible(false);   // 🔥 keypad hide
    lookupWallet(digits);
  } else {
    setIsKeypadVisible(true);    // 🔥 keypad show
  }
}, [phoneNumber]);


  // Trigger lookup automatically when user types 10 digits
  useEffect(() => {
    const digits = phoneNumber.replace(/[+ ]/g, "");

    if (digits.length === 10) {
      lookupWallet(digits);
    } else {
      setLookupResult("");
      setReceiverWallet("WALLETADDRESS");
    }
  }, [phoneNumber]);




  // Animation Logic
  const createTransaction = useCallback((isUser: boolean, userPhone?: string, receiverPhone?: string, userAmount?: string) => {
    const animation = ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)];

    const sender = isUser && userPhone ? userPhone : PHONE_NUMBERS[Math.floor(Math.random() * PHONE_NUMBERS.length)];
    const receiver = isUser && receiverPhone ? receiverPhone : PHONE_NUMBERS[Math.floor(Math.random() * PHONE_NUMBERS.length)];
    const amount = isUser && userAmount ? userAmount : `$${(Math.random() * 500 + 10).toFixed(2)}`;
    const duration = isUser ? 12 : Math.random() * 10 + 8;

    const transaction: Transaction = {
      id: `${Date.now()}-${Math.random()}`,
      sender,
      receiver,
      amount,
      isUser,
      animation: animation.name,
      duration,
      verticalPos: animation.style === "left" || animation.style === "right" ? Math.random() * 100 : undefined,
    };

    setTransactions((prev) => [...prev, transaction]);

    setTimeout(() => {
      setTransactions((prev) => prev.filter((t) => t.id !== transaction.id));
    }, duration * 1000);
  }, []);

  // Create fake transactions
  useEffect(() => {
    for (let i = 0; i < 15; i++) {
      setTimeout(() => createTransaction(false), i * 200);
    }

    const interval = setInterval(() => createTransaction(false), 500);
    return () => clearInterval(interval);
  }, [createTransaction]);

 const handleSend = () => {
  const trimmedPhone = phoneNumber.trim();

  if (!trimmedPhone || trimmedPhone.replace(/[+ ]/g, "").length < 10) {
    setStatusMessage({ text: "Please enter a valid phone number", type: "error" });
    return;
  }

  if (receiverWallet === "0x0000000000000000000000000000000000000000" || receiverWallet === "Not registered") {
    setStatusMessage({ text: "Phone number not registered", type: "error" });
    return;
  }

  if (!value) {
    setStatusMessage({ text: "Please enter an amount", type: "error" });
    return;
  }
  if (!account) {
    setErrorMessage("Please connect your wallet first.");
    console.log("Please connect your wallet first.");
    
    setStatus("error");
    return;
  }

  const weiValue = convertToWei(value, unit);
  console.log("Sending Wei:", weiValue);

  setIsSending(true);   

  try {
    const phoneUint = BigInt(trimmedPhone.replace(/[+ ]/g, ""));
      console.log(contract);
      console.log(phoneUint);
      console.log(value);
      
      
    const tx = prepareContractCall({
      contract,
      method: "sendMoneyToPhonenumber",
      params: [phoneUint],
      value: BigInt(weiValue),        // 🔥 REQUIRED FOR PAYABLE
    }); 
    console.log(tx);
    

  sendTx(tx, {
  onSuccess: (receipt) => {
    console.log("TX SUCCESS:", receipt);
    setTxHash(receipt.transactionHash);
    setStatus("success");
  },
  onError: (err) => {
    console.error("TX ERROR:", err);
    setErrorMessage(err.message);
    setStatus("error");
  }
});

  } catch (err: any) {
    console.error(err);
    setErrorMessage(err.message || "Transaction failed");
    setStatus("error");
  } 

  setTimeout(() => {
    setStatusMessage({ text: "Payment sent successfully!", type: "success" });
    setIsSending(false);
    setTimeout(() => createTransaction(true, phoneNumber, receiverWallet), 4000);
  }, 1500);
};


  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value.replace(/[^0-9+]/g, ""));
  };

  return (
    <div className="payphone-container">
      {!account && (
        <div>
          <Example/>
        </div>
      )
   

      }
      <div className="payphone-animated-background">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className={`payphone-moving-transaction ${tx.isUser ? "payphone-user-transaction" : ""}`}
            style={{
              animation: `${tx.animation} ${tx.duration}s linear`,
              top: tx.verticalPos !== undefined ? `${tx.verticalPos}%` : undefined,
            }}
          >
            <span className="payphone-phone-number">{tx.sender}</span>
            <span className="payphone-arrow">→</span>
            <span className="payphone-phone-number">{tx.receiver}</span>
            <span className="payphone-amount">{tx.amount}</span>
          </div>
        ))}
      </div>

      <div className="payphone-card">
        <div className="payphone-header">
          <div className="payphone-logo">📱💸</div>
          <h1 className="payphone-title">PayPhone</h1>
          <p className="payphone-subtitle">Send money with just a phone number</p>
        </div>

        <div className="payphone-receiver-info">
          <div className="payphone-receiver-label">Receiver's Wallet</div>
          <div className="payphone-receiver-address">{receiverWallet}</div>
        </div>

        <div className="payphone-display">
          <input
            type="tel"
            className="payphone-phone-input"
            placeholder="+1 234 567 890"
            maxLength={15}
            value={phoneNumber}
            onChange={handlePhoneInput}
          />
          <div className="payphone-input-hint">Enter phone number with country code</div>
        </div>
        
        {!isKeypadVisible && (
          <button
            className="payphone-btn payphone-btn-show"
            onClick={() => setIsKeypadVisible(true)}
          >
            Show Keypad
          </button>
        )}

      
{isKeypadVisible && (
  <div className="payphone-keypad">
    {['1','2','3','4','5','6','7','8','9','+','0','⌫'].map(key => (
      <button
        key={key}
        className={`payphone-key ${key === '+' || key === '⌫' ? 'payphone-key-special' : ''}`}
        onClick={() => {
          if (key === "⌫") setPhoneNumber(prev => prev.slice(0, -1));
          else setPhoneNumber(prev => prev + key);
        }}
      >
        {key}
      </button>
    ))}
  </div>
)}

{!isKeypadVisible && (
  <div style={{ marginBottom: "20px" }}>
    <label style={{ fontSize: "14px", fontWeight: "bold" }}>Value</label>

    <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
      {/* Amount Input */}
      <input
        type="number"
        placeholder="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          flex: 2,
          padding: "10px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #444",
          background: "#1a1a1a",
          color: "white",
        }}
      />

      {/* Unit Dropdown */}
      <select
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        style={{
          flex: 1,
          padding: "10px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #444",
          background: "#1a1a1a",
          color: "white",
        }}
      >
        <option value="wei">Wei</option>
        <option value="ether">Ether</option>
      </select>
    </div>

{txHash && (
  <a
    href={`https://sepolia.etherscan.io/tx/${txHash}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "inline-block",
      marginTop: "12px",
      padding: "10px 16px",
      background: "#2d7dff",
      color: "white",
      borderRadius: "8px",
      textDecoration: "none",
      fontWeight: "bold",
      textAlign: "center"
    }}
  >
    View Transaction on Etherscan
  </a>
)}
  </div>
)}
        <div className="payphone-action-buttons">
          <button className="payphone-btn payphone-btn-clear" onClick={() => setPhoneNumber("")}>
            Clear
          </button>
          <button className="payphone-btn payphone-btn-send" onClick={handleSend} disabled={isSending}>
            {isSending ? "Sending..." : "Send Money"}
          </button>
        </div>

        {statusMessage && <div className={`payphone-status-${statusMessage.type}`}>{statusMessage.text}</div>}
      </div>
    </div>
  );
}
