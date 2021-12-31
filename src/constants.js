const TWITTER_HANDLE = 'karnei';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;


const CONTRACT_ADDRESS = '0x84a43F700E0f48731a94C85d19Eb911de9103711';

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