const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: {
    name: String,
    hashrate: Number, // en TH/s
    price: Number,    // en USD
    duration: Number, // en jours
    dailyReturn: Number, // estimation en USD
  },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  totalPaid: Number,
  lastPayout: Date,
  createdAt: { type: Date, default: Date.now }
});

ContractSchema.pre('save', function(next) {
  if (this.isNew) {
    this.endDate = new Date(this.startDate.getTime() + this.plan.duration * 24 * 60 * 60 * 1000);
  }
  next();
});

module.exports = mongoose.model('Contract', ContractSchema);
