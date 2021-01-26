/*global ethereum, MetamaskOnboarding */

/*
The `piggybankContract` is compiled from:

  pragma solidity ^0.4.0;
  contract PiggyBank {

      uint private balance;
      address public owner;

      function PiggyBank() public {
          owner = msg.sender;
          balance = 0;
      }

      function deposit() public payable returns (uint) {
          balance += msg.value;
          return balance;
      }

      function withdraw(uint withdrawAmount) public returns (uint remainingBal) {
          require(msg.sender == owner);
          balance -= withdrawAmount;

          msg.sender.transfer(withdrawAmount);

          return balance;
      }
  }
*/

const forwarderOrigin = 'http://localhost:9010'

const initialize = () => {
  // Basic actions section
  const onboardButton = document.getElementById('connectButton');
  const getAccountsButton = document.getElementById('getAccounts');
  const getAccountsResult = document.getElementById('getAccountsResult');

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    // check for eth binding of window object
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask)
  };

  const onClickInstall = () => {
    onboardButton.innerText = 'Onboarding in progress';
    onboardButton.disabled = true;
    // Workaround, open new tab to MetaMask chrome extension page
    window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn', '_blank');
  };

  const onClickConnect = async () => {
    try {
      // Open MetaMask
      await ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error(error);
    }
  };

  const MetamaskClientCheck = () => {
    // Check if MetaMask is installed
    if(!isMetaMaskInstalled()){
      // If not installed, prompt to install
      onboardButton.innerText = 'Click to install MetaMask'
      // Call function on click
      onboardButton.onclick = onClickInstall;
      // The button is now disabled
      onboardButton.disabled = false;
    } else {
      // If installed update button
      onboardButton.innerText = 'Connect';
      // call function on click
      onboardButton.onclick = onClickConnect;
      // Disable button
      onboardButton.disabled = false;
    } 
  };

  getAccountsButton.addEventListener('click', async () => {
    // Get eth accounts array
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    // Take first address of array and display it
    getAccountsResult.innerHTML = accounts[0] || 'Not able to get eth address';
  });

  MetamaskClientCheck();
}
window.addEventListener('DOMContentLoaded', initialize)
