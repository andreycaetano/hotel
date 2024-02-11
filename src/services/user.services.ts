import { injectable } from 'tsyringe';
import { prisma } from '../database';
import bcrypt, { hash } from 'bcrypt';
import { AppError } from '../errors/appError.erros';
import { IUser, TLogin } from '../interface/user.interface';
import jwt from 'jsonwebtoken';

@injectable()
export class UserServices {
  async create(data: IUser) {
    const findUser = await prisma.users.findFirst({
      where: {
        username: data.username,
      },
    });
    if (findUser) {
      throw new AppError(404, 'Already registered user.');
    }
    data.password = await hash(data.password, 7);
    const create = prisma.users.create({
      data: {
        ...data,
      },
    });
    return create;
  }

  async login(data: TLogin) {
    const findUser = await prisma.users.findFirst({
      where: {
        email: data.email,
      },
    });
    if (!findUser) {
      throw new AppError(
        401,
        'Access denied due to lack of valid authentication credentials for the target resource. Please make sure to include the proper authentication.',
      );
    }
    const match = await bcrypt.compare(data.password, findUser.password);
    if (!match) {
      throw new AppError(
        401,
        'Access denied due to lack of valid authentication credentials for the target resource. Please make sure to include the proper authentication.',
      );
    }
    const token = jwt.sign({ id: findUser.id }, process.env.SECRET_KEY_TOKEN!, {
      expiresIn: '2h',
    });
    const user = {
      user: findUser.username,
      token: token,
      role: findUser.role,
    };
    return user;
  }

  async delete(id: number) {
    const user = await prisma.users.findFirst({ where: { id: id } });
    if (!user) {
      throw new AppError(404, 'User not found.');
    }
    await prisma.users.delete({
      where: {
        id: id,
      },
    });
  }

  async get() {
    const users = await prisma.users.findMany();
    return users;
  }

  async update(id: number, data: IUser) {
    const findUser = await prisma.users.findFirst({ where: { id: id } });
    if (!findUser) throw new AppError(404, 'User not found');
    const updated = await prisma.users.update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
    });
    return updated;
  }
}
