import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import redis from '../lib/cache';

const prisma = new PrismaClient();

export default class UserController {
	//Consulta normal
	static async find(req: Request, res: Response) {
		try {
			console.time('Find Users');

			const users = await prisma.user.findMany();

			console.timeEnd('Find Users');
			return res.json(users);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Erro ao buscar usuário' });
		}
	}

	//Consulta utilizando cache (Redis)
	static async findCache(req: Request, res: Response) {
		try {
			console.time('Find Users');
			//Se houver cache, utiliza o cache
			const cacheKey = 'users:all';
			const cachedUsers = await redis.get(cacheKey);

			if (cachedUsers) {
				return res.json(JSON.parse(cachedUsers));
			}

			//Se não houver cache, busca no banco de dados

			const users = await prisma.user.findMany();

			//Salva o resultado no cache
			await redis.set(cacheKey, JSON.stringify(users));
			console.timeEnd('Find Users');
			return res.json(users);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Erro ao buscar usuário' });
		}
	}
}
