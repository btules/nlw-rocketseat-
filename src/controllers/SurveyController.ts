import { getCustomRepository } from "typeorm"
import { SurveyRepository } from "../repositories/SurveyRepository"
import { Request, Response } from 'express';


class SurveyController {

    async create (request: Request, response: Response){
        const { title, description } = request.body

        const surveysRepository = getCustomRepository(SurveyRepository);

        const surveys = surveysRepository.create({
            title, description
        })

        await surveysRepository.save(surveys)

        return response.status(201).json(surveys)
    }


    async show (request: Request, response: Response) {
        const surveysRepository = getCustomRepository(SurveyRepository);

            const all = await surveysRepository.find()

            return response.json(all).status(200)
    }
}

export { SurveyController }