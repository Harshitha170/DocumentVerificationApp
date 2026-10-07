import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
    id: { type: String, required: true },
    seq: { type: Number, default: 100 } // Starting sequence (e.g., starts at 100 for ENWEB100)
});

export const Counter = mongoose.model('Counter', counterSchema);