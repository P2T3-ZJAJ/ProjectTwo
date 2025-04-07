import { User } from '../models/index.js';

export const seedUsers = async () => {
  // delete existing users to avoid duplicates
  await User.destroy({ where: {} });

  // create users with properly hashed passwords
  const users = [
    { username: 'JollyGuru', email: 'jolly@guru.com', password: 'password' },
    { username: 'SunnyScribe', email: 'sunny@scribe.com', password: 'password' },
    { username: 'RadiantComet', email: 'radiant@comet.com', password: 'password' },
  ];

  for (const user of users) {
    await User.create(user);
    console.log(`Created user: ${user.username}`);
  }

  console.log('All users seeded successfully');
};