import "module-alias/register";
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import userRoute from "@routes/user.route";
import articleRoute from "@routes/article.route";


const app = express();
app.use(express.json())

app.use(userRoute);
app.use(articleRoute);

const PORT = process.env.PORT ?? 3080

app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
})