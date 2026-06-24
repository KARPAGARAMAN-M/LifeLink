/**
 * Blood Donation Eligibility Calculator
 * Rules:
 * - Minimum 56 days (8 weeks) between whole blood donations
 * - Minimum age: 18, Maximum age: 65
 * - Minimum weight: 50 kg
 */

export function checkEligibility(lastDonationDate) {
  if (!lastDonationDate) return { eligible: true, message: 'You are eligible to donate!', daysRemaining: 0 };

  const lastDate = new Date(lastDonationDate);
  const today = new Date();
  const diffTime = today - lastDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const minDays = 56;

  if (diffDays >= minDays) {
    return {
      eligible: true,
      message: 'You are eligible to donate blood!',
      daysSinceLast: diffDays,
      daysRemaining: 0,
    };
  }

  const remaining = minDays - diffDays;
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + minDays);

  return {
    eligible: false,
    message: `You need to wait ${remaining} more day(s) before donating again.`,
    daysSinceLast: diffDays,
    daysRemaining: remaining,
    nextEligibleDate: nextDate.toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric',
    }),
  };
}

export function getEligibilityColor(eligible) {
  return eligible ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400';
}
