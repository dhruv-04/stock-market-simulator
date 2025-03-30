const transactionID = () => {
    try {
        const timestamp = new Date().getTime(); 
        const randomNumber = Math.floor(Math.random() * 100000); 
        return `TXN${timestamp}${randomNumber}`; 
    } catch (err) {
        console.error(`Error generating the transaction id : ${err}`);
        throw err;
    } 
}

// console.log(transactionID());

module.exports = transactionID;