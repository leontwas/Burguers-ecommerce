import sha1 from 'js-sha1';

export default async function checkPasswordPwned(password) {
  if (!password) return 0;

  const hash = sha1(password).toUpperCase();
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  if (!res.ok) throw new Error('Error consultando la API de Have I Been Pwned');

  const text = await res.text();
  const lines = text.split('\n');

  for (const line of lines) {
    const [foundSuffix, count] = line.split(':');
    if (foundSuffix === suffix) {
      return parseInt(count);
    }
  }

  return 0;
}
