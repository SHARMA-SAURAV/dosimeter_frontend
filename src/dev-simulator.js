import { sendReading } from './services/api';

const deviceIds = ['DOCI_001', 'DOCI_002', 'DOCI_003'];

export const startSimulator = () => {
  setInterval(() => {
    const now = new Date();
    const timestamp = now.toISOString();

    deviceIds.forEach((id) => {
      const cpm = (Math.random() * 1000).toFixed(2); // Now between 0 and 1000
      const battery = Math.floor(Math.random() * 20) + 80; // 80–99%

      sendReading({
        deviceId: id,
        cpm,
        battery,
        timestamp,
      }).catch((err) => console.log('Send failed:', err.message));
    });
  }, 1000); // 1 second interval
};
