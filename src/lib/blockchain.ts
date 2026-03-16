/**
 * Real-time Blockchain Monitoring Utility
 * Uses BlockCypher public API for monitoring balances without a backend.
 */

export const checkBitcoinBalance = async (address: string) => {
  try {
    const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`);
    const data = await response.json();
    return data.balance / 100000000; // Convert satoshis to BTC
  } catch (error) {
    console.error('Error checking BTC balance:', error);
    return 0;
  }
};

export const checkEthereumBalance = async (address: string) => {
  try {
    const response = await fetch(`https://api.blockcypher.com/v1/eth/main/addrs/${address}/balance`);
    const data = await response.json();
    return data.balance / 1000000000000000000; // Convert wei to ETH
  } catch (error) {
    console.error('Error checking ETH balance:', error);
    return 0;
  }
};
