import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'karnei';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  const [currentAccount, setCurrentAccount] = useState(null);


  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if ( !ethereum ){
        console.log('Make sure you have MetaMask!');
        return;
      }else{
        console.log('We have the ethereum object', ethereum)
        const accounts = await ethereum.request({method: 'eth_accounts'});

        if(accounts.length !== 0){
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        }else{
          console.log("No authorized account found")
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if( !ethereum ){
        alert('Get MetaMask!');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
    }catch(error){
      console.log(error)
    }
  }

  useEffect( () => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Number Cruncher ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse one Number Battle set at time!</p>
          <div className="connect-wallet-container">
            <img
              src="https://c.tenor.com/uYr_ayFCAroAAAAd/math-raccoon.gif"
              alt="Number Racoon Python Gif"
            />
          </div>
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}>
            Connect Wallet To Get Started
          </button>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
