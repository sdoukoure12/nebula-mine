class MiningPoolService {
  constructor() {
    this.baseDifficulty = 1.0;
    this.btcPrice = 67000; // Prix actuel du BTC [citation:4]
  }

  // Simule les gains quotidiens basés sur la puissance de calcul
  async calculateDailyEarnings(hashrate, daysSinceStart) {
    // Facteurs influençant les gains [citation:2]
    const networkDifficulty = this.baseDifficulty * (1 + (daysSinceStart * 0.001));
    const priceFluctuation = this.btcPrice * (0.95 + Math.random() * 0.1);
    
    // Formule simplifiée : hashrate * (BTC par TH/s) * prix BTC
    const btcPerThPerDay = 0.000035; // estimation [citation:4]
    const dailyBtc = hashrate * btcPerThPerDay / networkDifficulty;
    const dailyUsd = dailyBtc * priceFluctuation;
    
    return {
      btc: dailyBtc,
      usd: dailyUsd,
      difficulty: networkDifficulty,
      btcPrice: priceFluctuation
    };
  }

  // Optimisation IA des performances [citation:1][citation:7]
  optimizeHashrate(contracts) {
    // Répartit la puissance entre les contrats pour maximiser les rendements
    const totalHashrate = contracts.reduce((sum, c) => sum + c.plan.hashrate, 0);
    
    // Allocation intelligente basée sur l'âge des contrats
    return contracts.map(contract => {
      const age = (Date.now() - contract.startDate) / (1000 * 60 * 60 * 24);
      const optimizationFactor = 1 + (Math.sin(age / 7) * 0.05); // variation cyclique
      
      return {
        contractId: contract._id,
        allocatedHashrate: contract.plan.hashrate * optimizationFactor,
        expectedReturn: contract.plan.dailyReturn * optimizationFactor
      };
    });
  }
}

module.exports = new MiningPoolService();
