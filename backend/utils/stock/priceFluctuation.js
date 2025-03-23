// {
//     "company_sentiment": {
//       "highly_positive": { "min": 3.5, "max": 5.0 },
//       "positive": { "min": 1.5, "max": 3.4 },
//       "neutral": { "min": -1.4, "max": 1.4 },
//       "negative": { "min": -3.4, "max": -1.5 },
//       "highly_negative": { "min": -5.0, "max": -3.5 }
//     },
//     "sector_sentiment": {
//       "highly_positive": { "min": 2.0, "max": 3.0 },
//       "positive": { "min": 1.0, "max": 1.9 },
//       "neutral": { "min": -0.9, "max": 0.9 },
//       "negative": { "min": -1.9, "max": -1.0 },
//       "highly_negative": { "min": -3.0, "max": -2.0 }
//     },
//     "volatility": {
//       "low": { "multiplier": 0.8 },
//       "moderate": { "multiplier": 1.0 },
//       "high": { "multiplier": 1.5 },
//       "extreme": { "multiplier": 2.0 }
//     },
//     "randomness": {
//       "low": { "min": -0.3, "max": 0.3 },
//       "moderate": { "min": -0.6, "max": 0.6 },
//       "high": { "min": -1.0, "max": 1.0 }
//     }
//   }
  
// let CS, SS, R, V, initialPrice, newPrice;

// if(company_sentiment === "highly_positive") {
//     CS = Math.random() * (5.0 - 3.5) + 3.5;
// } else if (company_sentiment === "positive") {
//     CS = Math.random() * (3.4 - 1.5) + 1.5;
// } else if (company_sentiment === "neutral") {
//     CS = Math.random() * (1.4 - -1.4) + -1.4;
// } else if (company_sentiment === "negative") {
//     CS = Math.random() * (-1.5 - -3.4) + -3.4;
// } else if (company_sentiment === "highly_negative") {
//     CS = Math.random() * (-3.5 - -5.0) + -5.0;
// }

// if(sector_sentiment === "highly_positive") {
//     SS = Math.random() * (3.0 - 2.0) + 2.0;
// } else if (sector_sentiment === "positive") {
//     SS = Math.random() * (1.9 - 1.0) + 1.0;
// } else if (sector_sentiment === "neutral") {
//     SS = Math.random() * (0.9 - -0.9) + -0.9;
// } else if (sector_sentiment === "negative") {
//     SS = Math.random() * (-1.0 - -1.9) + -1.9;
// } else if (sector_sentiment === "highly_negative") {
//     SS = Math.random() * (-2.0 - -3.0) + -3.0;
// }

// if(volatility === "low") {
//     V = 0.8;
// } else if (volatility === "moderate") {
//     V = 1.0;
// } else if (volatility === "high") {
//     V = 1.5;
// } else if (volatility === "extreme") {
//     V = 2.0;
// }

// if(randomness === "low") {
//     R = Math.random() * (0.3 - -0.3) + -0.3;
// } else if (randomness === "moderate") {
//     R = Math.random() * (0.6 - -0.6) + -0.6;
// } else if (randomness === "high") {
//     R = Math.random() * (1.0 - -1.0) + -1.0;
// }


// const priceChange = (CS * 0.75) + (SS * 0.20) + (R * 0.05); 
// const finalChange = priceChange * V;
// const finalPrice = initialPrice + finalChange;

const fluctuation = async(initialPrice, company_sentiment, sector_sentiment, volatility, randomness) => {
    let CS, SS, R, V;
    if(company_sentiment === "highly_positive") {
        CS = Math.random() * (5.0 - 3.5) + 3.5;
    } else if (company_sentiment === "positive") {
        CS = Math.random() * (3.4 - 1.5) + 1.5;
    } else if (company_sentiment === "neutral") {
        CS = Math.random() * (1.4 - -1.4) + -1.4;
    } else if (company_sentiment === "negative") {
        CS = Math.random() * (-1.5 - -3.4) + -3.4;
    } else if (company_sentiment === "highly_negative") {
        CS = Math.random() * (-3.5 - -5.0) + -5.0;
    }
    
    if(sector_sentiment === "highly_positive") {
        SS = Math.random() * (3.0 - 2.0) + 2.0;
    } else if (sector_sentiment === "positive") {
        SS = Math.random() * (1.9 - 1.0) + 1.0;
    } else if (sector_sentiment === "neutral") {
        SS = Math.random() * (0.9 - -0.9) + -0.9;
    } else if (sector_sentiment === "negative") {
        SS = Math.random() * (-1.0 - -1.9) + -1.9;
    } else if (sector_sentiment === "highly_negative") {
        SS = Math.random() * (-2.0 - -3.0) + -3.0;
    }
    
    if(volatility === "low") {
        V = 0.8;
    } else if (volatility === "moderate") {
        V = 1.0;
    } else if (volatility === "high") {
        V = 1.5;
    } else if (volatility === "extreme") {
        V = 2.0;
    }
    
    if(randomness === "low") {
        R = Math.random() * (0.3 - -0.3) + -0.3;
    } else if (randomness === "moderate") {
        R = Math.random() * (0.6 - -0.6) + -0.6;
    } else if (randomness === "high") {
        R = Math.random() * (1.0 - -1.0) + -1.0;
    }
    
    
    const priceChange = (CS * 0.75) + (SS * 0.20) + (R * 0.05); 
    const finalChange = priceChange * V;
    const finalPrice = initialPrice + finalChange;
    const percentageChange = (finalChange / initialPrice) * 100;
    return { finalPrice, percentageChange };
}

module.exports = { fluctuation };