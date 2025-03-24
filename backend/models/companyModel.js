const { db } = require('../config/firebaseConfig');

const pushComapnyData = async(companyData) => {
    try {
        await db.collection('companies').doc(companyData.companyName).set(companyData);
        console.log('Company data added successfully at timestamp', new Date().toISOString());
    } catch (error) {
        console.error('Error adding company data:', error, ' at timestamp ', new Date().toISOString());
    }
};

const push = async(companyData) => {
    for (let company of companyData) {
        await pushComapnyData(company);
    }
        console.log('All company data pushed successfully at timestamp', new Date().toISOString());
};

//fetch company data
const fetchCompanyData = async(companyName) => {
    try {
        const companyData = await db.collection('companies').doc(companyName).get();
        if (!companyData.exists) {
            console.log('No such document!');
        } else {
            console.log('Company data:', companyData.data());
        }
    } catch (error) {
        console.error('Error fetching company data:', error);
    }
};

//fetch all company data
//returns an array of all objects of company data
const fetchAllCompanyData = async() => {
    try {
        const companyData = await db.collection('companies').get();
        return companyData.docs.map(doc => doc.data());
        // console.log(companyData.docs.map(doc => doc.data()));
        // for (let company of companyData.docs) {
        //     console.log('Company data:', company.data());
        // }
    } catch (error) {
        console.error('Error fetching company data:', error);
    }
};


module.exports = {
    fetchCompanyData,
    fetchAllCompanyData,
}

// const test = async() => {
//     // push(companyData);
//     // fetchCompanyData('NovaTech Solutions');
//     const allCompanyData = await fetchAllCompanyData();
//     console.log(allCompanyData);
// };

// test();

//object for company data
// const companyData = [
//     {
//         companyName: "NovaTech Solutions",
//         sector: "Technology",
//         stockVolume: 10000000,
//         stockShortForm: "NOVA",
//     },
//     {
//         companyName: "CyberDyne Systems",
//         sector: "Technology",
//         stockVolume: 5000000,
//         stockShortForm: "CYBR",
//     },
//     {
//         companyName: "Medicorp Innovations",
//         sector: "HealthCare",
//         stockVolume: 2000000,
//         stockShortForm: "MCRP",
//     }, 
//     {
//         companyName: "Vitality Pharma",
//         sector: "HealthCare",
//         stockVolume: 1500000,
//         stockShortForm: "VPHM",
//     },
//     {
//         companyName: "Global Trust Investments",
//         sector: "Finance",
//         stockVolume: 3000000,
//         stockShortForm: "GTI",
//     },
//     {
//         companyName: "Sterling Bancorp",
//         sector: "Finance",
//         stockVolume: 2500000,
//         stockShortForm: "STBC",
//     },
//     {
//         companyName: "Edulink Learning",
//         sector: "Education",
//         stockVolume: 1500000,
//         stockShortForm: "EDLK",
//     },
//     {
//         companyName: "EduCorp International",
//         sector: "Education",
//         stockVolume: 1000000,
//         stockShortForm: "EDCI",
//     }
// ];

// push(companyData);