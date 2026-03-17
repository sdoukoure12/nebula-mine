const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Contract = require('../models/Contract');

class PaymentService {
  async createCheckoutSession(userId, plan) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Plan ${plan.name} - ${plan.hashrate} TH/s`,
            description: `${plan.duration} jours de minage avec optimisation IA`,
          },
          unit_amount: plan.price * 100, // en cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: { userId: userId.toString(), plan: JSON.stringify(plan) }
    });
    
    return session;
  }

  async processDailyPayouts() {
    const activeContracts = await Contract.find({ status: 'active' });
    
    for (const contract of activeContracts) {
      const daysActive = Math.floor((Date.now() - contract.startDate) / (1000 * 60 * 60 * 24));
      
      // Calculer les gains du jour
      const earnings = await miningPoolService.calculateDailyEarnings(
        contract.plan.hashrate,
        daysActive
      );
      
      // Enregistrer le paiement
      contract.lastPayout = new Date();
      await contract.save();
      
      // Créer une transaction dans Stripe (ou transférer vers portefeuille interne)
      console.log(`Payout pour contrat ${contract._id}: ${earnings.usd} USD`);
    }
  }
}

module.exports = new PaymentService();
