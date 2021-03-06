import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { resolve } from 'path'
import { SurveyRepository } from "../repositories/SurveyRepository";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import SendEmailServices from "../services/SendEmailServices";


class SendEmailController {
    async execute(request: Request, response: Response){
        const { email, survey_id} = request.body

        const userRepository = getCustomRepository(UserRepository)
        const surveyRepository = getCustomRepository(SurveyRepository)
        const surveyUserRepository = getCustomRepository(SurveyUserRepository)

        const userAlreadyExists = await userRepository.findOne({ email })

        if(!userAlreadyExists){
            return response.status(400).json( {
                error: "User does not Already Exists"
            })
        }

        const surveyAlreadyExists = await surveyRepository.findOne({ id: survey_id })

        if(!surveyAlreadyExists){
            return response.status(400).json({
                error: "Survey does not Already Exists"
            })
        }

        //Envio dos dados para email

        const npsPath = resolve(__dirname, "..", "views","email","npsMail.hbs")

        const surveyUserAlreadyExists = await surveyUserRepository.findOne({
            where:{user_id: userAlreadyExists.id, value: null},
            relations: ["user", "survey"],
        })

        const variables = {
            name: userAlreadyExists.name,
            title: surveyAlreadyExists.title,
            description: surveyAlreadyExists.description,
            id: " ",
            link: process.env.URL_MAIL
        }

        if(surveyUserAlreadyExists){
            variables.id = surveyAlreadyExists.id
            await SendEmailServices.execute(email, surveyAlreadyExists.title, variables, npsPath)

            return response.json(surveyUserAlreadyExists)
        }

        //Salvar as informações na tabela surveyUser

        const surveyUser = surveyUserRepository.create({
            user_id: userAlreadyExists.id,
            survey_id
        })

        await surveyUserRepository.save(surveyUser)

        //envio de e-mail
        
        variables.id = surveyUser.id

        await SendEmailServices.execute(email, surveyAlreadyExists.title, variables, npsPath);

        return response.json(surveyUser)
    }
}

export { SendEmailController }