import express, { json } from "express";
import cors from "cors";
import router from "./routes/routeIndex.js";

const app = express();

app.use(json());
app.use(cors());
app.use(router);

app.listen(4000, () => {
  console.log(`Now listening on http://localhost:4000`);
});
