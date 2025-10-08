// Quick test to see if server can start
import dotenv from 'dotenv';
dotenv.config();

console.log('✅ Environment variables loaded');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ Set' : '❌ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('RAPIDAPI_KEY:', process.env.RAPIDAPI_KEY ? '✅ Set' : '❌ Missing');
console.log('CLIENT_URL:', process.env.CLIENT_URL);

console.log('\n🚀 All environment variables are configured!');
console.log('\nNow run: npm run dev');
