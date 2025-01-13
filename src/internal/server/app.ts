
import express from "express"

import cors from "cors";
import bodyParser from "body-parser";
import { settingRouter } from "./setting_router";
import { commitRouter } from "./count_router";

export const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/settings", settingRouter)
app.use("/commits", commitRouter)