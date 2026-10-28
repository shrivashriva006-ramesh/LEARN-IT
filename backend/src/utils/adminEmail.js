const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const normalizeEmail = (email) => (
  typeof email === 'string' ? email.trim().toLowerCase() : ''
);

const getConfiguredAdminEmail = () => {
  const email = normalizeEmail(process.env.ADMIN_EMAIL);
  return emailPattern.test(email) ? email : '';
};

const isAuthorizedAdminEmail = (email) => {
  const configuredEmail = getConfiguredAdminEmail();
  return Boolean(configuredEmail) && normalizeEmail(email) === configuredEmail;
};

module.exports = {
  getConfiguredAdminEmail,
  isAuthorizedAdminEmail,
  normalizeEmail,
};
