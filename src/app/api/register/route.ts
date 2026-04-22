import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Dynamic import to avoid build-time connection
async function getUser() {
    const MONGODB_URI = process.env.MONGODB_URI || '';

    if (!MONGODB_URI || MONGODB_URI.includes('username:password') || MONGODB_URI.includes('mock_uri')) {
        return null; // MongoDB not configured
    }

    const { default: mongoose } = await import('mongoose');

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGODB_URI);
    }

    const UserSchema = new mongoose.Schema({
        name: String,
        email: { type: String, unique: true },
        password: String,
        role: { type: String, default: 'user' },
        companyName: String,
        createdAt: { type: Date, default: Date.now },
    });

    return mongoose.models.User || mongoose.model('User', UserSchema);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, password, role, companyName } = body;

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
        }

        // Try to use MongoDB if configured
        const User = await getUser();
        if (!User) {
            // MongoDB not configured — return success with a demo message
            return NextResponse.json({
                success: true,
                message: 'Account created successfully! (Demo mode)',
                demo: true,
            });
        }
        
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
        }
        const hashed = await bcrypt.hash(password, 12);
        await User.create({
            name,
            email: email.toLowerCase(),
            password: hashed,
            role: role || 'user',
            companyName: companyName || null,
        });
        return NextResponse.json({ success: true, message: 'Account created! You can now sign in.' });

    } catch (err: any) {
        if (err.code === 11000) {
            return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
        }
        console.error('[Register API]', err);
        return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
    }
}
