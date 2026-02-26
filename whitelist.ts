export default (number : string) : boolean => {
  if (!process.env.FROM_WHITELIST) return;

  return process.env.FROM_WHITELIST.split(',')
    .map(phone => phone.trim())
    .contains(number.trim());
}
