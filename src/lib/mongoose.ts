import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "";

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectMongo() {
    if (!MONGODB_URI || MONGODB_URI.includes('username:password') || MONGODB_URI.includes('mock_uri')) {
        console.warn('MongoDB URI not configured. Running in demo mode.');
        return null;
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectMongo;
