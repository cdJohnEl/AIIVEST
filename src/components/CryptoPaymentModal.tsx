import { useState } from 'react';
import { 
  Copy, 
  Check, 
  Bitcoin, 
  Shield, 
  Eye, 
  EyeOff,
  Download,
  Upload,
  QrCode,
  Clock,
  AlertCircle,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { checkBitcoinBalance, checkEthereumBalance } from '../lib/blockchain';
import { useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useInvestment } from '../contexts/InvestmentContext';

interface CryptoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdraw';
}

const cryptoOptions = [
  { 
    id: 'btc', 
    name: 'Bitcoin', 
    symbol: 'BTC', 
    icon: '₿',
    color: '#F7931A',
    minDeposit: 0.001,
    minWithdraw: 0.002,
    networkFee: 0.0001,
    processingTime: '10-60 min'
  },
  { 
    id: 'eth', 
    name: 'Ethereum', 
    symbol: 'ETH', 
    icon: 'Ξ',
    color: '#627EEA',
    minDeposit: 0.01,
    minWithdraw: 0.02,
    networkFee: 0.001,
    processingTime: '2-10 min'
  },
  { 
    id: 'usdt', 
    name: 'Tether (USDT)', 
    symbol: 'USDT', 
    icon: '₮',
    color: '#26A17B',
    minDeposit: 10,
    minWithdraw: 20,
    networkFee: 1,
    processingTime: '1-5 min'
  },
  { 
    id: 'usdc', 
    name: 'USD Coin', 
    symbol: 'USDC', 
    icon: 'Ⓤ',
    color: '#2775CA',
    minDeposit: 10,
    minWithdraw: 20,
    networkFee: 1,
    processingTime: '1-5 min'
  },
  { 
    id: 'xmr', 
    name: 'Monero', 
    symbol: 'XMR', 
    icon: 'ɱ',
    color: '#FF6600',
    minDeposit: 0.05,
    minWithdraw: 0.1,
    networkFee: 0.001,
    processingTime: '5-30 min',
    privacy: true
  },
  { 
    id: 'ltc', 
    name: 'Litecoin', 
    symbol: 'LTC', 
    icon: 'Ł',
    color: '#BFBBBB',
    minDeposit: 0.1,
    minWithdraw: 0.2,
    networkFee: 0.001,
    processingTime: '5-30 min'
  },
];

const anonymousProcessors = [
  { id: 'mixbtc', name: 'MixBTC', description: 'Bitcoin mixer with 0.5% fee', privacy: 'High' },
  { id: 'tornadocash', name: 'Tornado Cash', description: 'ZK-proof privacy on Ethereum', privacy: 'Maximum' },
  { id: 'wasabi', name: 'Wasabi Wallet', description: 'CoinJoin implementation', privacy: 'High' },
];

export default function CryptoPaymentModal({ isOpen, onClose, type }: CryptoPaymentModalProps) {
  const { user } = useAuth();
  const { portfolio } = useInvestment();
  const { isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();
  
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoOptions[0]);
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [showAddress, setShowAddress] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select');
  const [selectedProcessor, setSelectedProcessor] = useState(anonymousProcessors[0]);
  const [anonymousStep, setAnonymousStep] = useState<'select' | 'setup' | 'action'>('select');
  const [tornadoNote, setTornadoNote] = useState('');
  const [mixerSession, setMixerSession] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const isDeposit = type === 'deposit';

  const generateWalletAddress = () => {
    // Simulate generating a unique wallet address
    const prefixes: Record<string, string> = {
      btc: 'bc1q',
      eth: '0x',
      usdt: '0x',
      usdc: '0x',
      xmr: '4',
      ltc: 'ltc1',
    };
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let address = prefixes[selectedCrypto.id] || '';
    const length = selectedCrypto.id === 'btc' ? 38 : selectedCrypto.id === 'eth' ? 40 : 33;
    for (let i = 0; i < length; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
  };

  const [generatedAddress] = useState(generateWalletAddress());

  useEffect(() => {
    let interval: any;
    if (step === 'select' && isDeposit && showAddress) {
      interval = setInterval(async () => {
        const balance = selectedCrypto.id === 'btc' 
          ? await checkBitcoinBalance(generatedAddress)
          : await checkEthereumBalance(generatedAddress);
          
        if (balance > 0) {
          setAmount(balance.toString());
          setStep('success');
          
          // Log transaction for admin review
          if (user) {
            addDoc(collection(db, 'transactions'), {
              userId: user.id,
              userName: user.name,
              type: 'deposit',
              amount: balance,
              currency: selectedCrypto.symbol,
              status: 'detected',
              toAddress: generatedAddress,
              confirmations: 0,
              createdAt: new Date().toISOString()
            }).catch(err => console.error("Error logging transaction:", err));
          }
          
          clearInterval(interval);
        }
      }, 10000); // Check every 10 seconds
    }
    return () => clearInterval(interval);
  }, [step, isDeposit, showAddress, generatedAddress, selectedCrypto.id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    
    if (!isDeposit && user) {
      try {
        await addDoc(collection(db, 'transactions'), {
          userId: user.id,
          userName: user.name,
          type: 'withdrawal',
          amount: parseFloat(amount),
          currency: selectedCrypto.symbol,
          status: 'pending',
          toAddress: walletAddress,
          confirmations: 0,
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Error logging withdrawal request:", err);
      }
    } else {
      // Simulate API/Contract interaction delay for deposits
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    setStep('success');
    setIsProcessing(false);
  };

  const handleAnonymousSetup = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (selectedProcessor.id === 'tornadocash') {
      const note = `tornado-eth-0.1-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      setTornadoNote(note);
    } else if (selectedProcessor.id === 'mixbtc') {
      setMixerSession(`MIX-${Math.floor(Math.random() * 1000000)}`);
    }
    
    setAnonymousStep('setup');
    setIsProcessing(false);
  };

  const resetAndClose = () => {
    setStep('select');
    setAmount('');
    setWalletAddress('');
    onClose();
  };

  const getUsdEquivalent = () => {
    const prices: Record<string, number> = {
      btc: 43500,
      eth: 2580,
      usdt: 1,
      usdc: 1,
      xmr: 145,
      ltc: 72,
    };
    const cryptoAmount = parseFloat(amount) || 0;
    return (cryptoAmount * prices[selectedCrypto.id]).toFixed(2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="bg-[#0D1220] border-white/10 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#F4F6FF] flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDeposit ? 'bg-[#10B981]/20' : 'bg-[#2D6BFF]/20'
            }`}>
              {isDeposit ? (
                <Download className="w-5 h-5 text-[#10B981]" />
              ) : (
                <Upload className="w-5 h-5 text-[#2D6BFF]" />
              )}
            </div>
            <div>
              <span className="text-xl">{isDeposit ? 'Deposit Funds' : 'Withdraw Funds'}</span>
              <p className="text-sm text-[#A7B1C8] font-normal">
                {isDeposit ? 'Add funds to your account' : 'Withdraw to your wallet'}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {step === 'success' ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-[#10B981]/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-[#10B981]" />
            </div>
            <h3 className="text-2xl font-bold text-[#F4F6FF] mb-2">
              {isDeposit ? 'Deposit Initiated!' : 'Withdrawal Requested!'}
            </h3>
            <p className="text-[#A7B1C8] mb-6">
              {isDeposit 
                ? `Send ${amount || '0'} ${selectedCrypto.symbol} to the provided address. Funds will be credited after network confirmation.`
                : `Your withdrawal of ${amount || '0'} ${selectedCrypto.symbol} will be processed within ${selectedCrypto.processingTime}.`
              }
            </p>
            <div className="glass-card-sm p-4 mb-6 text-left">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#A7B1C8]">Amount</span>
                <span className="text-[#F4F6FF]">{amount} {selectedCrypto.symbol}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#A7B1C8]">Network Fee</span>
                <span className="text-[#F4F6FF]">{selectedCrypto.networkFee} {selectedCrypto.symbol}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#A7B1C8]">Estimated Time</span>
                <span className="text-[#F4F6FF]">{selectedCrypto.processingTime}</span>
              </div>
            </div>
            <Button onClick={resetAndClose} className="btn-primary">
              Done
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="crypto" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-6">
              <TabsTrigger value="crypto" className="data-[state=active]:bg-[#2D6BFF]">
                <Bitcoin className="w-4 h-4 mr-2" />
                Crypto
              </TabsTrigger>
              <TabsTrigger value="anonymous" className="data-[state=active]:bg-[#2D6BFF]">
                <Shield className="w-4 h-4 mr-2" />
                Anonymous
              </TabsTrigger>
            </TabsList>

            <TabsContent value="crypto" className="space-y-6">
              {/* Crypto Selection */}
              <div>
                <label className="text-sm text-[#A7B1C8] mb-3 block">Select Cryptocurrency</label>
                <div className="grid grid-cols-3 gap-2">
                  {cryptoOptions.map((crypto) => (
                    <button
                      key={crypto.id}
                      onClick={() => setSelectedCrypto(crypto)}
                      className={`p-3 rounded-xl border transition-all ${
                        selectedCrypto.id === crypto.id
                          ? 'border-[#2D6BFF] bg-[#2D6BFF]/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
                        style={{ backgroundColor: `${crypto.color}20` }}
                      >
                        <span style={{ color: crypto.color }} className="font-bold">{crypto.icon}</span>
                      </div>
                      <p className="text-xs text-[#F4F6FF]">{crypto.symbol}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="text-sm text-[#A7B1C8] mb-3 block">
                  Amount ({selectedCrypto.symbol})
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Min: ${selectedCrypto.minDeposit}`}
                    className="bg-white/5 border-white/10 text-[#F4F6FF] pr-20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7B1C8] text-sm">
                    {selectedCrypto.symbol}
                  </span>
                </div>
                <p className="text-xs text-[#A7B1C8] mt-2">
                  ≈ ${getUsdEquivalent()} USD
                </p>
                <div className="flex justify-between text-xs text-[#A7B1C8] mt-1">
                  <span>Min: {isDeposit ? selectedCrypto.minDeposit : selectedCrypto.minWithdraw} {selectedCrypto.symbol}</span>
                  <span>Network Fee: {selectedCrypto.networkFee} {selectedCrypto.symbol}</span>
                </div>
              </div>

              {/* Wallet Address (for withdrawal) or Generated Address (for deposit) */}
              {!isDeposit ? (
                <div>
                  <label className="text-sm text-[#A7B1C8] mb-3 block">Your Wallet Address</label>
                  <Input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder={`Enter your ${selectedCrypto.name} address`}
                    className="bg-white/5 border-white/10 text-[#F4F6FF]"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-sm text-[#A7B1C8] mb-3 block">Deposit Address</label>
                  <div className="glass-card-sm p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-[#070A12]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-[#A7B1C8] mb-1">Send only {selectedCrypto.name} to this address</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-[#F4F6FF] bg-white/5 px-2 py-1 rounded flex-1 truncate">
                            {showAddress ? generatedAddress : '••••••••••••••••••••••••••'}
                          </code>
                          <button
                            onClick={() => setShowAddress(!showAddress)}
                            className="p-1.5 rounded-lg hover:bg-white/5"
                          >
                            {showAddress ? <EyeOff className="w-4 h-4 text-[#A7B1C8]" /> : <Eye className="w-4 h-4 text-[#A7B1C8]" />}
                          </button>
                          <button
                            onClick={handleCopy}
                            className="p-1.5 rounded-lg hover:bg-white/5"
                          >
                            {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4 text-[#A7B1C8]" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#A7B1C8]">
                      <Clock className="w-3 h-3" />
                      <span>Expires in 24 hours</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Processing Info */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#2D6BFF]/10">
                <AlertCircle className="w-5 h-5 text-[#2D6BFF] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#F4F6FF]">Processing Time: {selectedCrypto.processingTime}</p>
                  <p className="text-xs text-[#A7B1C8]">
                    Network confirmations required: {selectedCrypto.id === 'btc' ? '3' : '12'}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              {(!isDeposit && parseFloat(getUsdEquivalent()) > (portfolio?.availableBalance || 0)) && (
                <div className="text-red-400 text-sm mb-3 p-2 bg-red-400/10 rounded-lg text-center border border-red-400/20">
                  Insufficient funds. Your balance is ${(portfolio?.availableBalance || 0).toLocaleString()}
                </div>
              )}
              <Button
                onClick={handleConfirm}
                disabled={
                  !amount || 
                  parseFloat(amount) < (isDeposit ? selectedCrypto.minDeposit : selectedCrypto.minWithdraw) || 
                  (!isDeposit && !walletAddress) ||
                  (!isDeposit && parseFloat(getUsdEquivalent()) > (portfolio?.availableBalance || 0))
                }
                className="w-full btn-primary disabled:opacity-50"
              >
                {isDeposit ? 'I\'ve Sent the Funds' : 'Request Withdrawal'}
              </Button>
            </TabsContent>

            <TabsContent value="anonymous" className="space-y-6">
              {anonymousStep === 'select' ? (
                <>
                  {/* Privacy Notice */}
                  <div className="glass-card-sm p-4 border-l-2 border-[#10B981]">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-[#F4F6FF] font-medium mb-1">Privacy-First Payments</p>
                        <p className="text-xs text-[#A7B1C8]">
                          Your transaction history is obfuscated using advanced privacy protocols. 
                          No personal information is stored or linked to your deposits.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Anonymous Processor Selection */}
                  <div>
                    <label className="text-sm text-[#A7B1C8] mb-3 block">Select Privacy Method</label>
                    <div className="space-y-2">
                      {anonymousProcessors.map((processor) => (
                        <button
                          key={processor.id}
                          onClick={() => setSelectedProcessor(processor)}
                          className={`w-full p-4 rounded-xl border text-left transition-all ${
                            selectedProcessor.id === processor.id
                              ? 'border-[#2D6BFF] bg-[#2D6BFF]/10'
                              : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[#F4F6FF] font-medium">{processor.name}</p>
                              <p className="text-xs text-[#A7B1C8]">{processor.description}</p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-[#10B981]/20 text-[#10B981]">
                              {processor.privacy}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Crypto Selection for Anonymous */}
                  <div>
                    <label className="text-sm text-[#A7B1C8] mb-3 block">Select Cryptocurrency</label>
                    <div className="grid grid-cols-3 gap-2">
                      {cryptoOptions.filter(c => c.privacy || c.id === 'xmr' || c.id === 'btc').map((crypto) => (
                        <button
                          key={crypto.id}
                          onClick={() => setSelectedCrypto(crypto)}
                          className={`p-3 rounded-xl border transition-all ${
                            selectedCrypto.id === crypto.id
                              ? 'border-[#2D6BFF] bg-[#2D6BFF]/10'
                              : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
                            style={{ backgroundColor: `${crypto.color}20` }}
                          >
                            <span style={{ color: crypto.color }} className="font-bold">{crypto.icon}</span>
                          </div>
                          <p className="text-xs text-[#F4F6FF]">{crypto.symbol}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleAnonymousSetup}
                    disabled={isProcessing}
                    className="w-full btn-primary"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Shield className="w-4 h-4 mr-2" />}
                    Configure {selectedProcessor.name}
                  </Button>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => setAnonymousStep('select')}
                      className="text-xs text-[#2D6BFF] hover:underline flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3 h-3" /> Back to selection
                    </button>
                    <span className="text-xs text-[#A7B1C8] uppercase font-bold tracking-widest">{selectedProcessor.name} Active</span>
                  </div>

                  {selectedProcessor.id === 'tornadocash' && (
                    <div className="space-y-4">
                      {!isConnected ? (
                        <div className="p-6 rounded-xl bg-[#2D6BFF]/5 border border-dashed border-[#2D6BFF]/30 text-center">
                          <p className="text-sm text-[#A7B1C8] mb-4">Connect your Web3 wallet to interact with Tornado Cash contracts</p>
                          <div className="flex justify-center">
                            <ConnectButton />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="p-4 rounded-xl bg-[#2D6BFF]/10 border border-[#2D6BFF]/20">
                            <p className="text-xs text-[#A7B1C8] mb-2 uppercase font-bold">Your Secret Backup Note</p>
                            <div className="flex items-center gap-2 mb-2">
                              <code className="text-[10px] text-[#F4F6FF] bg-black/40 p-2 rounded flex-1 break-all">
                                {tornadoNote}
                              </code>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(tornadoNote);
                                  setCopied(true);
                                  setTimeout(() => setCopied(false), 2000);
                                }}
                                className="p-2 hover:bg-white/10 rounded-lg shrink-0"
                              >
                                {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4 text-[#A7B1C8]" />}
                              </button>
                            </div>
                            <p className="text-[10px] text-[#E11D48]">
                              ⚠️ SAVE THIS NOTE! It is needed to withdraw or reclaim your funds. AIVEST never sees this note.
                            </p>
                          </div>
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-sm text-[#F4F6FF] mb-2">Deposit to Contract</p>
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-xs text-[#A7B1C8]">Fixed Amount</span>
                              <span className="text-sm font-bold text-[#F4F6FF]">0.1 ETH / 1000 USDT</span>
                            </div>
                            <Button 
                              onClick={() => {
                                sendTransaction({ 
                                  to: '0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc', 
                                  value: parseEther('0.1') 
                                });
                                // Keep simulation for success screen until tx is confirmed
                                handleConfirm();
                              }} 
                              className="w-full btn-primary" 
                              disabled={isProcessing}
                            >
                              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Shield className="w-4 h-4 mr-2" />}
                              Execute Tornado Deposit (0.1 ETH)
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {selectedProcessor.id === 'mixbtc' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-[#F7931A]/10 border border-[#F7931A]/20">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xs text-[#A7B1C8]">Session ID</span>
                          <span className="text-xs font-mono text-[#F7931A]">{mixerSession}</span>
                        </div>
                        <div className="text-center mb-4">
                          <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <QrCode className="w-24 h-24 text-[#0D1220]" />
                          </div>
                          <p className="text-xs text-[#F4F6FF] mb-2">Mixing Address</p>
                          <div className="flex items-center gap-2 bg-black/40 p-2 rounded">
                            <code className="text-[10px] text-[#A7B1C8] flex-1 truncate">
                              bc1qmix{Math.random().toString(36).substring(7)}...
                            </code>
                            <button className="text-[#2D6BFF]"><Copy className="w-3 h-3" /></button>
                          </div>
                        </div>
                        <p className="text-[10px] text-[#A7B1C8] italic">
                          Send any amount. MixBTC will deduct 0.5% and credit your AIVEST account from a unique cold wallet after 3 confirmations.
                        </p>
                      </div>
                      <Button onClick={handleConfirm} className="w-full btn-primary" disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'I Have Sent to Mixer'}
                      </Button>
                    </div>
                  )}

                  {selectedProcessor.id === 'wasabi' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <h4 className="text-sm font-bold text-[#F4F6FF] mb-4">Wasabi Wallet CoinJoin Guide</h4>
                        <ol className="space-y-3 text-[11px] text-[#A7B1C8] list-decimal ml-4">
                          <li>Open your Wasabi Wallet and ensure your BTC is "CoinJoined".</li>
                          <li>Click "Send" and select "Anonymously" in the Wasabi client.</li>
                          <li>Use the dedicated AIVEST deposit address below.</li>
                        </ol>
                        <div className="mt-4 p-3 bg-black/40 rounded flex items-center justify-between">
                          <code className="text-[10px] text-[#F4F6FF]">{generatedAddress}</code>
                          <button className="text-[#2D6BFF]"><Copy className="w-3 h-3" /></button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] bg-[#10B981]/10 p-2 rounded">
                        <span className="text-[#10B981] flex items-center gap-1">
                          <Shield className="w-3 h-3" /> WabiSabi Protocol Verified
                        </span>
                        <span className="text-[#A7B1C8]">0% Extra Fee</span>
                      </div>
                      <Button onClick={handleConfirm} className="w-full btn-primary" disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Verify Wasabi Deposit'}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
