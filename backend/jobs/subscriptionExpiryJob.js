
// const cron = require("node-cron");
// const { updateExpiredSubscriptions } = require("../services/subscriptionExpiryService");

// const startSubscriptionExpiryJob = async () => {
//   await updateExpiredSubscriptions();

//   cron.schedule("0 * * * *", async () => {
//     console.log("Running scheduled subscription expiry check...");
//     await updateExpiredSubscriptions();
//   });

//   console.log("Subscription expiry job started");
// };

// module.exports = {
//   startSubscriptionExpiryJob
// };

const cron = require("node-cron");
const {
  updateExpiredSubscriptions
} = require("../services/subscriptionExpiryService");

const startSubscriptionExpiryJob = async () => {

  // Run once when server starts
  await updateExpiredSubscriptions();

  // Run every day at 9:00 AM
  cron.schedule("0 9 * * *", async () => {

    console.log(
      "Running scheduled subscription expiry check..."
    );

    await updateExpiredSubscriptions();

  });

  console.log(
    "Subscription expiry job started"
  );
};

module.exports = {
  startSubscriptionExpiryJob
};