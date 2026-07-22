const odds1 = 2.0;
const oddsX = 3.0;
const odds2 = 4.0;
const userOdds = odds2;

const ipUser = 1 / userOdds;

// Calculate specific stake for opponent 1 (Home)
const ipOpp1 = 1 / odds1;
const totalIp1 = ipUser + ipOpp1;
const opp1Pct = (ipOpp1 / totalIp1) * 100;

// Calculate specific stake for opponent 2 (Draw)
const ipOpp2 = 1 / oddsX;
const totalIp2 = ipUser + ipOpp2;
const opp2Pct = (ipOpp2 / totalIp2) * 100;

console.log("Opp 1 (Home) Pct:", opp1Pct, "Stake for 100:", opp1Pct);
console.log("Opp 2 (Draw) Pct:", opp2Pct, "Stake for 100:", opp2Pct);
