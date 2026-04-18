import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    image?: string;
    role: string;
    skills: string[];
    savedJobs: mongoose.Types.ObjectId[];
    experienceLevel: string;
    careerGoals: string;
}

const UserSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    role: { type: String, default: 'user' },
    skills: { type: [String], default: [] },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    experienceLevel: { type: String, default: 'Intermediate' }, // beginner, intermediate, senior
    careerGoals: { type: String, default: '' },
}, { timestamps: true });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
