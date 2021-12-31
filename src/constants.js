const TWITTER_HANDLE = 'karnei';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;


const CONTRACT_ADDRESS = '0x58b35288A95651118E1578A31660A9bE826fa233';

const transformCharacterData = (characterData)=>{
    return {
        name: characterData.name,
        imageURI: characterData.imageURI,
        hp: characterData.hp.toNumber(),
        maxHp: characterData.maxHp.toNumber(),
        attackDamage: characterData.attackDamage.toNumber(),
    };
};

export {TWITTER_HANDLE, TWITTER_LINK, CONTRACT_ADDRESS, transformCharacterData };