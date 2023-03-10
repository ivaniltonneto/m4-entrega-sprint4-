import bcrypt from 'bcrypt';

import AppDataSource from '../../data-source';
import { User } from '../../entities/user.entity';
import { IUserRequest } from '../../interfaces/users';

const userCreateService = async ({
  name,
  email,
  password,
  isAdm,
}: IUserRequest): Promise<User> => {
  const userRepository = AppDataSource.getRepository(User);
  const users = await userRepository.findOneBy({ email });

  if (users) {
    throw new Error('Email already exists');
  }

  const user = new User();
  user.name = name;
  user.email = email;
  user.password = bcrypt.hashSync(password, 10);
  user.isAdm = isAdm;

  userRepository.create(user);
  await userRepository.save(user);

  const { password: pass, ...rest } = user;
  return rest;
};

export default userCreateService;
