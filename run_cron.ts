import cron from 'node-cron';

// Add the cron setup below
export const setupCronJobs = () => {
  // Update data every weekday at 17:00 WIB (10:00 UTC)
  cron.schedule('0 10 * * 1-5', async () => {
    console.log('[CRON] Starting daily auto-update of market data...');
    // Logika update (dummy for now)
    console.log('[CRON] Daily auto-update completed.');
  });
};
