import { User } from '../entity/User';
import { Like } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

/**
 * ### getValidName
 * If the name exists in the database, return a displayName with uuid
 * If not, return the original name
 * @param fullName
 * @returns booleans
 */

export async function getValidName(fullName: string): Promise<string> {
  const users = await User.find({
    insensitiveName: Like(`%${fullName.toLowerCase()}%`),
  });

  if (users.length) return `${fullName}${uuidv4()}`;
  return fullName;
}
