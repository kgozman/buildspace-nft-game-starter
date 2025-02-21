import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import {ethers} from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import MyEpicGame from '../../utils/MyEpicGame.json';
import { isCommunityResource } from '@ethersproject/providers';
import LoadingIndicator from '../LoadingIndicator';


const SelectCharacter = ( { setCharacterNFT } ) => {
    const [characters, setCharacters] = useState([]);
    const [gameContract, setGameContract] = useState(null);
    const [mintingCharacter, setMintingCharacter] = useState(false);


    const mintCharacterNFTAction = (characterId) => async () => {
        try {
            if(gameContract){
                console.log('Minting character in progress...');
                const mintTxn = await gameContract.mintCharacterNFT(characterId);
                await mintTxn.wait();
                console.log('mintTxn:', mintTxn);
                setMintingCharacter(false)
            }
        } catch (error){
            console.warn('MintCharacterAction Error:', error);
            setMintingCharacter(false)
        }
    }

    useEffect( () => {
        const { ethereum } = window;

        if(ethereum){
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                MyEpicGame.abi,
                signer
            );
            setGameContract(gameContract);
        }else{
            console.log("Ethereum object not found")
        }
    }, []);

    useEffect( () => {
        const getCharacters = async () => {
            try {
                console.log('Getting contract characters to mint');

                // get all mintable characters
                const charactersTxn = await gameContract.getAllDefaultCharacters();
                console.log('characterTxn:', charactersTxn);

                //get all characters and transform
                const characters = charactersTxn.map( (characterData) => 
                    transformCharacterData(characterData)
                );

                // set all characters in account
                setCharacters(characters)
            }catch (error){
                console.lerror('Something went wrong fetching characters:', error)
            }
        };

        const onCharacterMint = async (sender, tokenId, characterIndex) => {
            console.log(
                `CharacterNFTMinted - sender ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
            )
            alert(`Your NFT is all done -- see it here: https://testnets.opensea.io/assets/${gameContract}/${tokenId.toNumber()}`)



            /* 
             * 
             */
            if(gameContract){
                const characterNFT = await gameContract.checkIfUserHasNFT();
                console.log('CharacterNFT:', characterNFT);
                setCharacterNFT(transformCharacterData(characterNFT));
            }
        }

        if(gameContract){
            getCharacters();
            /*
             * setup NFT minted listener
             */
            gameContract.on('CharacterNFTMinted', onCharacterMint);
        }

        return () => {
            /*
             * component unmount listener cleanup
             */
            if(gameContract){
                gameContract.off('CharacterNFTMinted', onCharacterMint)
            }
        };
    },[gameContract])

    const renderCharacters = () => {
        console.log("renderCharacters")
        console.log(characters)
        const charList = characters.map( (character, index) => {
            console.log("mapping"+character.name);
            return(
                <div className="character-item" key={character.name}>
                <div className="name-container">
                    <p>{character.name}</p>
                </div>
                <img src={character.imageURI} alt={character.name}/>
                <button 
                    type='button'
                    className='character-mint-button'
                    onClick={mintCharacterNFTAction(index)}
                    >{`Mint ${character.name}`}</button>
                </div>
            )
        })
        return charList;
    }

    return (
        <div className="select-character-container">
            <h2>Mint Your Donut Hero. Choose them wisely.</h2>
            {/* If characters exist show them */}
            {characters.length > 0 && (

                <div className="character-grid">:{renderCharacters()}</div>
            )}
            {mintingCharacter && (
                <div className='loading'>*********
                    <div className='indicator'>
                        <LoadingIndicator/>
                        <p>Minting is in progress...</p>
                        <img
                            src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
                            alt="Minting loading indicator"
                            />
                    </div>
                </div>
            )}
            {characters.length === 0 && (
                <div className='character-grid'>No characters or your internet connection might be down.</div>
            )}
        </div>
    );
}

export default SelectCharacter;
