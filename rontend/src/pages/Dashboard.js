import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [contracts, setContracts] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [totalEarned, setTotalEarned] = useState(0);

  useEffect(() => {
    fetchContracts();
    // Simuler des données de gains quotidiennes
    generateEarningsData();
  }, []);

  const fetchContracts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/contracts/my-contracts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContracts(res.data);
      
      // Calculer total gagné
      const total = res.data.reduce((sum, contract) => {
        const daysActive = Math.floor((Date.now() - new Date(contract.startDate)) / (1000 * 60 * 60 * 24));
        return sum + (daysActive * contract.plan.dailyReturn);
      }, 0);
      setTotalEarned(total);
    } catch (err) {
      console.error(err);
    }
  };

  const generateEarningsData = () => {
    const data = [];
    for (let i = 0; i < 30; i++) {
      data.push({
        day: i + 1,
        amount: Math.random() * 10 + 5
      });
    }
    setEarnings(data);
  };

  return (
    <div className="dashboard">
      <h1>Mon Tableau de Bord</h1>
      
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Contrats actifs</h3>
          <div className="value">{contracts.filter(c => c.status === 'active').length}</div>
        </div>
        <div className="stat-card">
          <h3>Total gagné</h3>
          <div className="value">${totalEarned.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <h3>Puissance totale</h3>
          <div className="value">
            {contracts.reduce((sum, c) => sum + c.plan.hashrate, 0)} TH/s
          </div>
        </div>
      </div>
      
      <div className="chart-container">
        <h2>Gains quotidiens (simulation)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={earnings}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="contracts-list">
        <h2>Mes contrats</h2>
        {contracts.map(contract => (
          <div key={contract._id} className="contract-item">
            <div className="contract-header">
              <span className="plan-name">{contract.plan.name}</span>
              <span className={`status ${contract.status}`}>{contract.status}</span>
            </div>
            <div className="contract-details">
              <span>📊 {contract.plan.hashrate} TH/s</span>
              <span>⏱️ {contract.plan.duration} jours</span>
              <span>💰 ~${contract.plan.dailyReturn}/jour</span>
              <span>📅 Début: {new Date(contract.startDate).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
