import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJob extends Document {
    title: string;
    company: string;
    location: string;
    type: string;
    salaryRange?: string;
    description: string;
    skills: string[];
    postedAt: Date;
    source: string;
    url: string;
}

const JobSchema: Schema<IJob> = new Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true }, // e.g., 'Full-time', 'Contract', 'Remote'
    salaryRange: { type: String },
    description: { type: String, required: true },
    skills: { type: [String], required: true },
    postedAt: { type: Date, default: Date.now },
    source: { type: String, required: true }, // e.g., 'LinkedIn', 'Greenhouse'
    url: { type: String, required: true },
}, { timestamps: true });

export const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);
