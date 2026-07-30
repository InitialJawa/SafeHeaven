import * as admin from 'firebase-admin';

// One-time setup script to grant admin privileges to a specific user.
// Run this script locally or from a secure server context, NOT exposed as an API route.
// Usage: ts-node scripts/set_admin_claim.ts <user_uid>

async function setAdminClaim(uid: string) {
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: "ai-studio-safeheaven-feb17918-0b82-4235-b3c1-5e4a8fa033c0" // replace if needed
    });
  }

  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Success! Admin claim set for user: ${uid}`);
    process.exit(0);
  } catch (error) {
    console.error('Error setting custom claim:', error);
    process.exit(1);
  }
}

const targetUid = process.argv[2];
if (!targetUid) {
  console.error('Please provide a user UID: ts-node scripts/set_admin_claim.ts <uid>');
  process.exit(1);
}

setAdminClaim(targetUid);
