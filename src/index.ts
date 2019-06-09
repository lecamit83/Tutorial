import 'dotenv/config';
import  App  from "./app";
import { validateEnvironment } from './utils/validateEnvironment';

validateEnvironment();

const PORT = process.env.PORT || 3000;

const app = new App().getInstance();

app.listen(PORT, () : void => {
    console.log(`Server is running on PORT=${PORT}`);
});