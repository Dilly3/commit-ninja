
import express, { Express, Request, Response } from "express";
import { AppDataSource } from "./db/database";
import {config} from "./config/config"

import bodyParser from "body-parser";
import Cors from 'cors'


const app: Express = express();

app.use(bodyParser.json())

app.use(Cors())

app.get('/', (req:Request, res : Response) => {
  console.log(req.body())
  res.status(200).json({message:'hello World'})

})

AppDataSource.initialize().then(()=> {
  console.log('connected to db')
  app.listen(config.port, ()=> {
  console.log(`listening on port: ${config.port}`)
})
}).catch((err : Error) => {
  console.log('error connecting to db', err.message,err)
})




   