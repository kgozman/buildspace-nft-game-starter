import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { CONTRACT_ADDRESS, TWITTER_HANDLE, TWITTER_LINK, transformCharacterData  } from './constants';
import SelectCharacter from './Components/SelectCharacter';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';



import MyEpicGame from './utils/MyEpicGame.json';

const App = () => {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(null)

  const checkNetwork = async () => {
    try {
      if(window.ethereum.networkVersion !== '4'){
        //alert("Please connect to Rinkeby!")
      }
    }catch (error){
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if ( !ethereum ){
        console.log('Make sure you have MetaMask!');
        setIsLoading(false)
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

    setIsLoading(false);
  }

  const connectWalletAction = async () => {
    console.log("connectWalletAction")
    try {
      const { ethereum } = window;

      if( !ethereum ){
        alert('Get MetaMask!');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })

      console.log("Connected:", accounts[0])
      setCurrentAccount(accounts[0]);
    }catch(error){
      console.log(error)
    }
  }

  useEffect( () => {
    checkNetwork();
    setIsLoading(true);
    checkIfWalletIsConnected();

  }, []);

  useEffect(  () =>  {
    const fetchNFTMetadata = async () => {
       console.log("Checking for Character NFT on address:", currentAccount);

       const provider = new ethers.providers.Web3Provider(window.ethereum);
       const signer = provider.getSigner();
       const gameContract = new ethers.Contract(
         CONTRACT_ADDRESS,
         MyEpicGame.abi,
         signer
       );

       const txn = await gameContract.checkIfUserHasNFT();

       if(txn.name){
         console.log('User has character NFT');
         setCharacterNFT(transformCharacterData(txn));
       } else {
         console.log("No character NFT found");
       }

       setIsLoading(false)
    };

    if(currentAccount){
      console.log('CurrentAccount', currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);


  // Render Methods
  const renderContent = () => {
    if(isLoading){
      return <LoadingIndicator/>;
    }
    /*
    * Scenario 1 - User has not connected wallet 
    */
    if(!currentAccount){
      return (
        <div className='connect-wallet-container'>

          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
            >
            Connect Wallet To Get Started
          </button>
        </div>
      )
    
    /*
     * Scenario 2 - Connected wallet - currentAccount but no charactersNFT
     */
    } else if(currentAccount && !characterNFT) {
      return(
        <div>9999
          <SelectCharacter setCharacterNFT={setCharacterNFT} />;
        </div>
      )
    } else if (currentAccount && characterNFT){
      return(<div>/=/=/=
        <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
       </div>);
    }else{
      return(<div>Ooops</div>)
    };
  }

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Number Cruncher ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse one Number Battle set at time!</p>

          {/* <img
              src="https://c.tenor.com/uYr_ayFCAroAAAAd/math-raccoon.gif"
              alt="Number Racoon Python Gif"
            /> */}

          -{renderContent()}-

          {/* <div className="connect-wallet-container">
            <img
              src="https://c.tenor.com/uYr_ayFCAroAAAAd/math-raccoon.gif"
              alt="Number Racoon Python Gif"
            />
          </div> */}
          {/* <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}>
            Connect Wallet To Get Started
          </button> */}
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
