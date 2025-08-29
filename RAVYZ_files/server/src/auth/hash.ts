import bcrypt from "bcrypt";

export async function hashPassword(raw: string) {
  const saltRounds = 10;
  return bcrypt.hash(raw, saltRounds);
}

export async function checkPassword(raw: string, hashed: string) {
  return bcrypt.compare(raw, hashed);
}
