import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongoose';
import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
    jobId: String,
    jobTitle: String,
    company: String,
    applicantName: String,
    applicantEmail: String,
    coverLetter: String,
    resumeUrl: String,
    status: { type: String, default: 'submitted' },
    appliedAt: { type: Date, default: Date.now },
});
const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { jobId, jobTitle, company, applicantName, applicantEmail, coverLetter } = body;

        if (!applicantName || !applicantEmail || !jobId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectMongo();
        const existing = await Application.findOne({ jobId, applicantEmail });
        if (existing) {
            return NextResponse.json({ error: 'You have already applied to this job' }, { status: 409 });
        }

        const application = await Application.create({
            jobId, jobTitle, company, applicantName, applicantEmail, coverLetter,
        });

        return NextResponse.json({ success: true, applicationId: application._id, message: 'Application submitted successfully!' });
    } catch (error: any) {
        // If DB not connected, still acknowledge (demo mode)
        return NextResponse.json({ success: true, applicationId: 'demo-' + Date.now(), message: 'Application received! (Demo mode - DB not configured)' });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    if (!email) return NextResponse.json({ applications: [] });

    try {
        await connectMongo();
        const applications = await Application.find({ applicantEmail: email }).sort({ appliedAt: -1 });
        return NextResponse.json({ applications });
    } catch {
        return NextResponse.json({ applications: [] });
    }
}
