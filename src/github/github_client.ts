
import dotenv from "dotenv";
import { GithubHttp } from "./github_http";


// initialize dotenv
dotenv.config();
export class GithubClient extends GithubHttp {
  constructor(
    startDate : string = process.env.START_DATE ?? "",
    owner : string = process.env.OWNER ?? "",
    repo : string = process.env.REPO ?? "",
    baseUrl : string = process.env.BASE_URL ?? "",
    token : string = process.env.GITHUB_TOKEN ?? "",
    
  ) {
    super(startDate,baseUrl,owner,repo,token)
  
  }
}
