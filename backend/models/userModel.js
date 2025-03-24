const { db } = require('../config/firebaseConfig');

const pushUserData = async(data) => {
    try {
        const { uid, firstName, lastName, email, phoneNumber, hashedPassword, username } = data;

        await db.collection('users').doc(uid).set({
            firstName,
            lastName,
            email,
            phoneNumber,
            hashedPassword,
            username
        });
        return "User data pushed successfully to firestore";
    } catch (error) {
        throw error;
    }
};

const updateUserData = async(data) => {
    try {
        const { uid, firstName, lastName, email, phoneNumber, hashedPassword, username } = data;

        await db.collection('users').doc(uid).update({
            firstName,
            lastName,
            email,
            phoneNumber,
            hashedPassword,
            username
        });
        return "User data updated successfully in firestore";
    } catch (error) {
        throw error;
    }
};

const getUserData = async(uid) => {
    try {
        const user = await db.collection('users').doc(uid).get(); //output would be a document snapshot
        if(!user.exists) {
            return null;
        }
        return user.data();
    } catch (error) {
        throw error;
    }
};

module.exports = { pushUserData, getUserData, updateUserData };