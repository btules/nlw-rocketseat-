import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository'

class UserController{
    async create(request: Request, response: Response){
        const { name, email } = request.body;

        const usersRepository = getCustomRepository(UserRepository)

        const UserAlredyExists = await usersRepository.findOne({
            email,
        })
        
        if(UserAlredyExists){
            return response.status(400).json({
                error: "User Alredy Exists !",
            })
             
        }
        
        const users = usersRepository.create({
            name, email,
        })

        await usersRepository.save(users)
        

        return response.status(201).json(users)
    }
}

export { UserController };
