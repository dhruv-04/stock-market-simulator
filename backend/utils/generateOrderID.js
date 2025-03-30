const generateOrderId = () => {
    try {
        const timestamp = new Date().getTime(); 
        const randomNumber = Math.floor(Math.random() * 100000); 
        return `ORD${timestamp}${randomNumber}`; 
    } catch (err) {
        console.error(`Error generating the order id : ${err}`);
        throw err;
    } 
};

// console.log(generateOrderId());
module.exports = generateOrderId;