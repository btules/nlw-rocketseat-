import  createConnection  from "../database"
import request from 'supertest'
import { app } from '../app'

describe("Survey", () =>{
    beforeAll(async () =>{
        const connection = await createConnection();
        await connection.runMigrations();
    })

    it('Should be able to create a new servey', async() =>{
        const response = await request(app).post("/surveys").send({
            title:" Avaliação do atendimento",
            description:" Informe a nota do atendimento",
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
    })

    it('Should be able to get all surveys', async()=>{
        await request(app).post("/surveys").send({
            title:" Avaliação do atendimento",
            description:" Informe a nota do atendimento",
        })

        const response = await request(app).get("/surveys")
        

        expect(response.body.length).toBe(2)
    })
})