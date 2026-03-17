import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const plans = [
  { name: 'Starter', hashrate: 10, price: 100, duration: 180, dailyReturn: 0.50, color: 'blue' },
  { name: 'Growth', hashrate: 50, price: 500, duration: 365, dailyReturn: 2.50, color: 'green' },
  { name: 'Advanced', hashrate: 200, price: 1000, duration: 365, dailyReturn: 10.00, color: 'purple' },
  { name: 'Flagship', hashrate: 1000, price: 5000, duration: 365, dailyReturn: 50.00, color: 'gold' }
];

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState({});

  const handlePurchase = async (plan) => {
    setLoading({ ...loading, [plan.name]: true });
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/contracts/create', 
        { planName: plan.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Rediriger vers Stripe Checkout
      window.location.href = res.data.checkoutUrl;
    } catch (err) {
      alert('Erreur lors de l\'achat. Veuillez vous connecter.');
      navigate('/login');
    }
    setLoading({ ...loading, [plan.name]: false });
  };

  return (
    <div className="container">
      <h1>NEBULA MINE</h1>
      <p className="subtitle">L'extraction de crypto-monnaies rendue accessible à tous</p>
      
      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.name} className={`plan-card ${plan.color}`}>
            <h2>{plan.name}</h2>
            <div className="hashrate">{plan.hashrate} TH/s</div>
            <div className="price">${plan.price}</div>
            <ul className="features">
              <li>⏱️ {plan.duration} jours</li>
              <li>💰 ~${plan.dailyReturn}/jour estimé</li>
              <li>🤖 Optimisation IA incluse</li>
              <li>📊 Paiements quotidiens</li>
            </ul>
            <button 
              onClick={() => handlePurchase(plan)}
              disabled={loading[plan.name]}
            >
              {loading[plan.name] ? 'Chargement...' : 'Acheter maintenant'}
            </button>
          </div>
        ))}
      </div>
      
      <div className="bonus-section">
        <h3>🎁 Bonus d'inscription : $100 offerts !</h3>
        <p>Inscrivez-vous maintenant et recevez $100 pour tester nos services [citation:7][citation:9]</p>
        <button onClick={() => navigate('/register')}>Créer un compte</button>
      </div>
    </div>
  );
};

export default Home;
