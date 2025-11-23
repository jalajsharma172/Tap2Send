import { useState, useEffect, useCallback } from 'react';

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
  '+1 415 555 0123', '+44 20 7946 0958', '+91 98765 43210', '+81 3 1234 5678',
  '+49 30 12345678', '+33 1 42 86 82 00', '+61 2 9876 5432', '+86 10 1234 5678',
  '+7 495 123 4567', '+55 11 98765 4321', '+82 2 1234 5678', '+39 06 1234 5678',
  '+34 91 123 4567', '+52 55 1234 5678', '+27 21 123 4567', '+971 4 123 4567',
  '+65 6123 4567', '+63 2 1234 5678', '+62 21 1234 5678', '+60 3 1234 5678',
  '+66 2 123 4567', '+84 24 1234 5678', '+92 21 1234 5678', '+20 2 1234 5678',
  '+234 1 234 5678', '+254 20 123 4567', '+94 11 234 5678', '+880 2 1234 5678',
  '+977 1 234 5678', '+94 11 234 5678'
];

const ANIMATIONS = [
  { name: 'moveLeftToRight', style: 'left' },
  { name: 'moveRightToLeft', style: 'right' },
  { name: 'moveDiagonalTL', style: 'diagonal-tl' },
  { name: 'moveDiagonalTR', style: 'diagonal-tr' },
  { name: 'moveDiagonalBL', style: 'diagonal-bl' },
  { name: 'moveDiagonalBR', style: 'diagonal-br' }
];

const RECEIVER_WALLET = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed';

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const createTransaction = useCallback((isUser: boolean, userPhone?: string, receiverPhone?: string, userAmount?: string) => {
    const animation = ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)];
    const sender = isUser && userPhone ? userPhone : PHONE_NUMBERS[Math.floor(Math.random() * PHONE_NUMBERS.length)];
    const receiver = isUser && receiverPhone ? receiverPhone : PHONE_NUMBERS[Math.floor(Math.random() * PHONE_NUMBERS.length)];
    const amount = isUser && userAmount ? userAmount : (isUser ? `$${(Math.random() * 500 + 50).toFixed(2)}` : `$${(Math.random() * 500 + 10).toFixed(2)}`);
    const duration = isUser ? 12 : Math.random() * 10 + 8;
    const verticalPos = (animation.style === 'left' || animation.style === 'right') ? Math.random() * 100 : undefined;

    const transaction: Transaction = {
      id: `${Date.now()}-${Math.random()}`,
      sender,
      receiver,
      amount,
      isUser,
      animation: animation.name,
      duration,
      verticalPos
    };

    setTransactions(prev => [...prev, transaction]);

    setTimeout(() => {
      setTransactions(prev => prev.filter(t => t.id !== transaction.id));
    }, duration * 1000);
  }, []);

  useEffect(() => {
    for (let i = 0; i < 15; i++) {
      setTimeout(() => createTransaction(false), i * 200);
    }

    const interval = setInterval(() => createTransaction(false), 500);
    return () => clearInterval(interval);
  }, [createTransaction]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        addDigit(e.key);
      } else if (e.key === '+' || (e.shiftKey && e.key === '=')) {
        e.preventDefault();
        addDigit('+');
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Delete') {
        e.preventDefault();
        handleClear();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [phoneNumber]);

  const addDigit = (digit: string) => {
    if (phoneNumber.length < 15) {
      setPhoneNumber(prev => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPhoneNumber('');
    setStatusMessage(null);
  };

  const showStatus = (text: string, type: 'success' | 'error') => {
    setStatusMessage({ text, type });
  };

  const handleSend = () => {
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedPhone) {
      showStatus('Please enter a phone number', 'error');
      return;
    }

    if (!trimmedPhone.startsWith('+')) {
      showStatus('Phone number must start with country code (+)', 'error');
      return;
    }

    if (trimmedPhone.length < 10) {
      showStatus('Please enter a valid phone number', 'error');
      return;
    }

    setIsSending(true);

    setTimeout(() => {
      showStatus('Payment sent successfully!', 'success');
      setIsSending(false);

      setTimeout(() => createTransaction(true, trimmedPhone, RECEIVER_WALLET), 500);
      setTimeout(() => createTransaction(true, trimmedPhone, RECEIVER_WALLET), 2000);
      setTimeout(() => createTransaction(true, trimmedPhone, RECEIVER_WALLET), 4000);

      setTimeout(() => {
        handleClear();
      }, 3000);
    }, 1500);
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9+]/g, '');
    setPhoneNumber(value);
  };

  return (
    <div className="payphone-container">
      <div className="payphone-animated-background">
        {transactions.map(tx => (
          <div
            key={tx.id}
            className={`payphone-moving-transaction ${tx.isUser ? 'payphone-user-transaction' : ''}`}
            style={{
              animation: `${tx.animation} ${tx.duration}s linear`,
              top: tx.verticalPos !== undefined ? `${tx.verticalPos}%` : undefined
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
          <div className="payphone-receiver-address" data-testid="text-receiver-address">
            {RECEIVER_WALLET}
          </div>
        </div>

        <div className="payphone-display">
          <input
            type="tel"
            className="payphone-phone-input"
            placeholder="+1 234 567 890"
            maxLength={15}
            value={phoneNumber}
            onChange={handlePhoneInput}
            data-testid="input-phone-number"
          />
          <div className="payphone-input-hint">Enter phone number with country code</div>
        </div>

        <div className="payphone-keypad">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '0', '⌫'].map((key) => (
            <button
              key={key}
              className={`payphone-key ${key === '+' || key === '⌫' ? 'payphone-key-special' : ''}`}
              onClick={() => {
                if (key === '⌫') handleBackspace();
                else addDigit(key);
              }}
              data-testid={`button-key-${key === '⌫' ? 'backspace' : key === '+' ? 'plus' : key}`}
            >
              {key}
            </button>
          ))}
        </div>

        <div className="payphone-action-buttons">
          <button
            className="payphone-btn payphone-btn-clear"
            onClick={handleClear}
            data-testid="button-clear"
          >
            Clear
          </button>
          <button
            className="payphone-btn payphone-btn-send"
            onClick={handleSend}
            disabled={isSending}
            data-testid="button-send"
          >
            {isSending ? 'Sending...' : 'Send Money'}
          </button>
        </div>

        {statusMessage && (
          <div
            className={`payphone-status-message payphone-status-${statusMessage.type}`}
            data-testid={`status-${statusMessage.type}`}
          >
            {statusMessage.text}
          </div>
        )}
      </div>
    </div>
  );
}
