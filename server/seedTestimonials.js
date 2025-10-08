import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Testimonial from './models/Testimonial.js';
import connectDB from './db.js';

dotenv.config();

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'Software Engineer',
    company: 'Google',
    testimonial: 'ByteZen helped me build a strong foundation in DSA and web development. The hands-on projects and mentorship were invaluable in landing my dream job!',
    rating: 5,
    order: 1,
    isActive: true
  },
  {
    name: 'Priya Singh',
    role: 'Data Scientist',
    company: 'Microsoft',
    testimonial: 'The AI/ML courses at ByteZen are comprehensive and industry-relevant. I landed my dream job thanks to the skills I learned here.',
    rating: 5,
    order: 2,
    isActive: true
  },
  {
    name: 'Arjun Patel',
    role: 'Full Stack Developer',
    company: 'Amazon',
    testimonial: 'Amazing community and excellent learning resources. ByteZen is the best place to start your tech journey!',
    rating: 5,
    order: 3,
    isActive: true
  },
  {
    name: 'Sneha Gupta',
    role: 'Frontend Developer',
    company: 'Flipkart',
    testimonial: 'The web development bootcamp was exceptional. I learned React, Node.js, and got hands-on experience with real projects.',
    rating: 5,
    order: 4,
    isActive: true
  },
  {
    name: 'Vikram Mehta',
    role: 'Backend Engineer',
    company: 'Paytm',
    testimonial: 'ByteZen\'s focus on practical learning and problem-solving helped me crack multiple technical interviews.',
    rating: 5,
    order: 5,
    isActive: true
  }
];

const seedTestimonials = async () => {
  try {
    await connectDB();
    
    // Clear existing testimonials
    await Testimonial.deleteMany({});
    console.log('Cleared existing testimonials');
    
    // Insert new testimonials
    await Testimonial.insertMany(testimonials);
    console.log('✅ Testimonials seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding testimonials:', error);
    process.exit(1);
  }
};

seedTestimonials();
