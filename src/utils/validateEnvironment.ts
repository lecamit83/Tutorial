import {cleanEnv , str, port } from 'envalid';
export function validateEnvironment() : void {
    cleanEnv(process.env, {
        MONGO_USER : str(),
        MONGO_PASSWORD : str(),
        MONGO_PATH : str(),
        PORT : port(),
        JWT_SECRET : str()
    });
}
