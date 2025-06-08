/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as bcrypt from 'bcrypt';

/**
 * Hashes a plain-text password using bcrypt and generates a unique salt.
 * This function is asynchronous as bcrypt operations are computationally intensive.
 *
 * @param password The plain-text password to hash.
 * @returns A Promise that resolves to an object containing the generated password hash and salt.
 * @throws {Error} If there's an error during the hashing process.
 */
export async function generatePasswordHashAndSalt(
  password: string,
): Promise<{ passwordHash: string; salt: string }> {
  // Define the number of salt rounds. A higher number increases security but also computation time.
  // 10 is a good default for most applications.
  const saltRounds = 10;

  // Generate a unique salt for the password.
  // bcrypt.genSalt returns a Promise that resolves with the generated salt.
  const salt = await bcrypt.genSalt(saltRounds);

  // Hash the password using the generated salt.
  // bcrypt.hash returns a Promise that resolves with the hashed password.
  const passwordHash = await bcrypt.hash(password, salt);

  // Return both the hash and the salt so they can be stored with the user record.
  return { passwordHash, salt };
}

/**
 * Verifies a plain-text password against a stored hash.
 * This function is used during login to check if the provided password matches the stored hash.
 *
 * @param password The plain-text password provided by the user.
 * @param storedHash The password hash retrieved from the database.
 * @returns A Promise that resolves to a boolean indicating whether the password matches the hash.
 * @throws {Error} If there's an error during the comparison process.
 */
export async function comparePassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  // Compare the plain-text password with the stored hash.
  // bcrypt.compare handles the salting internally as the salt is part of the hash.
  return await bcrypt.compare(password, storedHash);
}
