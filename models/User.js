const mongoose = require('mongoose');

// Daily Log Schema (Embedded inside User)
const DailyLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  caloriesConsumed: { type: Number, default: 0 },
  proteinConsumed: { type: Number, default: 0 },
  carbsConsumed: { type: Number, default: 0 },
  fatConsumed: { type: Number, default: 0 },
  waterConsumed: { type: Number, default: 0 },
  meals: [{ 
    type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
    name: { type: String },
    calories: { type: Number },
    protein: { type: Number },
    carbs: { type: Number },
    fat: { type: Number }
  }]
  // workout: {
  //   completed: { type: Boolean, default: false },
  //   type: { type: String },
  //   duration: { type: Number }
  // }
});

// User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  feet: { type: Number },
  inches: { type: Number },
  weight: { type: Number },
  month: { type: String },
  day: { type: String },
  year: { type: String },
  dietType: { type: String },
  goal: { type: String, enum: ["gain", "lose", "maintain"] },
  targetWeight: { type: Number },
  weightSpeed: { type: String },
  workoutsPerWeek: { type: String },
  obstacles: [{ type: String }],
  PreviousAppUsed: { type: String },
  life_Goal: [{ type: String }],
  onboardingCompleted: { type: Boolean, default: false },
  dailyLogs: [DailyLogSchema],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
