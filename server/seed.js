import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pothole from './models/Pothole.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI;

const seedData = [
  // Delhi NCR
  { lat: 28.6139, lng: 77.2090, city: 'New Delhi' },
  { lat: 28.5355, lng: 77.3910, city: 'Noida' },
  { lat: 28.4595, lng: 77.0266, city: 'Gurugram' },
  // Mumbai
  { lat: 19.0760, lng: 72.8777, city: 'Mumbai' },
  { lat: 19.2183, lng: 72.9781, city: 'Thane' },
  // Bengaluru
  { lat: 12.9716, lng: 77.5946, city: 'Bengaluru' },
  // Chennai
  { lat: 13.0827, lng: 80.2707, city: 'Chennai' },
  // Kolkata
  { lat: 22.5726, lng: 88.3639, city: 'Kolkata' },
  // Hyderabad
  { lat: 17.3850, lng: 78.4867, city: 'Hyderabad' },
  // Ahmedabad
  { lat: 23.0225, lng: 72.5714, city: 'Ahmedabad' },
  // Pune
  { lat: 18.5204, lng: 73.8567, city: 'Pune' },
];

const generateDummyPotholes = () => {
  const potholes = [];
  const severities = ['low', 'medium', 'high'];
  const statuses = ['reported', 'under_repair', 'fixed'];

  // Generate 50 dummy potholes
  for (let i = 0; i < 50; i++) {
    // Pick a random base location
    const baseLocation = seedData[Math.floor(Math.random() * seedData.length)];
    
    // Add random offsets (approx 0 to 10km)
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;
    
    // Add random date within last 30 days
    const dateOffset = Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
    const date = new Date(Date.now() - dateOffset);

    // Random status and severity
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    // Add some logic to bias toward 'reported' and 'medium'
    const severity = Math.random() > 0.6 ? 'high' : (Math.random() > 0.2 ? 'medium' : 'low');

    potholes.push({
      latitude: baseLocation.lat + latOffset,
      longitude: baseLocation.lng + lngOffset,
      severityLevel: severity,
      detectionConfidence: 0.6 + Math.random() * 0.4, // 0.6 - 1.0
      imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800',
      description: `Pothole detected near ${baseLocation.city}. Needs attention.`,
      status: status,
      detectedAt: date,
      updatedAt: new Date(date.getTime() + Math.random() * 10000000)
    });
  }

  return potholes;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing existing potholes...');
    await Pothole.deleteMany({});

    console.log('Inserting dummy data...');
    const dummyData = generateDummyPotholes();
    await Pothole.insertMany(dummyData);

    console.log('Successfully seeded database with 50 potholes.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

seedDatabase();
