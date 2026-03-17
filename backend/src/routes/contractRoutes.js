const express = require('express');
const router = express.Router();
const Contract = require('../models/Contract');
const paymentService = require('../services/paymentService');
const { protect } = require('../middleware/auth');

// Plans disponibles [citation:1][citation:4]
const PLANS = [
  { name: 'Starter', hashrate: 10, price: 100, duration: 180, dailyReturn: 0.50 },
  { name: 'Growth', hashrate: 50, price: 500, duration: 365, dailyReturn: 2.50 },
  { name: 'Advanced', hashrate: 200, price: 1000, duration: 365, dailyReturn: 10.00 },
  { name: 'Flagship', hashrate: 1000, price: 5000, duration: 365, dailyReturn: 50.00 }
];

// Obtenir les plans disponibles
router.get('/plans', (req, res) => {
  res.json(PLANS);
});

// Créer un nouveau contrat
router.post('/create', protect, async (req, res) => {
  try {
    const { planName } = req.body;
    const plan = PLANS.find(p => p.name === planName);
    
    if (!plan) {
      return res.status(400).json({ message: 'Plan invalide' });
    }
    
    // Créer session de paiement Stripe
    const session = await paymentService.createCheckoutSession(req.user._id, plan);
    
    res.json({ checkoutUrl: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Webhook Stripe pour confirmer le paiement
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, plan } = session.metadata;
    
    // Créer le contrat dans la base de données
    const newContract = new Contract({
      userId,
      plan: JSON.parse(plan),
      totalPaid: session.amount_total / 100
    });
    
    await newContract.save();
  }
  
  res.json({ received: true });
});

// Obtenir les contrats de l'utilisateur
router.get('/my-contracts', protect, async (req, res) => {
  const contracts = await Contract.find({ userId: req.user._id });
  res.json(contracts);
});

module.exports = router;
