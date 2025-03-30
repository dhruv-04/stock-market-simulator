const bcrypt = require('bcrypt');

const generateHash = async(userPassword) => {
    try {
        const saltRounds = 15;
        const hash = await bcrypt.hash(userPassword, saltRounds);
        return hash;
    } catch (err) {
        console.error(`Error generating hash for the user : ${err}`);
        throw err;
    }
};


const verifyHash = async(userPassword, hashPassword) => {
    try {
        const value = await bcrypt.compare(userPassword, hashPassword);
        return value;
    } catch (err) {
        console.error(`Error verifying hash for the user : ${err}`);
        throw err;
    }    
};

module.exports = {
    generateHash,
    verifyHash
}