export default (number: string): boolean => {
  if (!process.env.FROM_WHITELIST) return true;

  return process.env.FROM_WHITELIST.split(",")
    .map((phone) => phone.trim())
    .includes(number.trim());
};
