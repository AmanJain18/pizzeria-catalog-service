//?  1st Approach
// In this approach, we use the config package to load the configuration values from the config/default.json file. The config package allows us to define configuration values in a JSON file and access them using a simple API.

// import config from 'config';

// const environment = process.env.NODE_ENV || 'development';

// // Define interfaces with optional fields for each configuration section
// interface ServerConfig {
//     NODE_ENV?: string;
//     port?: number;
//     host?: string;
// }

// interface DbConfig {
//     host?: string;
//     port?: number;
//     user?: string;
//     password?: string;
//     database?: string;
// }

// interface AuthConfig {
//     jwksUri?: string;
// }

// interface Cors {
//     origin?: string;
//     methods?: string;
//     allowedHeaders?: string;
// }
// interface StorageConfig {
//     projectId?: string;
//     bucketName?: string;
//     region?: string;
//     keyFilename?: string;
//     accessKeyId?: string;
//     secretAccessKey?: string;
// }

// // Retrieve configuration values based on existence
// const dataBaseConfig = config.has('dbConfig')
//     ? config.get<DbConfig>('dbConfig')
//     : undefined;

// const authConfig = config.has('authConfig')
//     ? config.get<AuthConfig>('authConfig')
//     : undefined;

// const serverConfig = config.has('serverConfig')
//     ? config.get<ServerConfig>('serverConfig')
//     : undefined;

// const storageConfig = config.has('storage')
//     ? config.get<StorageConfig>('storage')
//     : undefined;

// const corsConfig = config.has('cors') ? config.get<Cors>('cors') : undefined;

// export {
//     environment,
//     dataBaseConfig,
//     authConfig,
//     serverConfig,
//     storageConfig,
//     corsConfig,
// };

//? 2nd Approach

// import fs from 'fs';
// import path from 'path';
// import yaml from 'js-yaml';

// const env = process.env.NODE_ENV || 'development'; // Default to development if NODE_ENV is not set

// function loadConfig() {
//     try {
//         const configPath = path.resolve(__dirname, `../config/${env}.yaml`);
//         const fileContents = fs.readFileSync(configPath, 'utf8');
//         return yaml.load(fileContents);
//     } catch (e) {
//         console.error(`Error loading YAML file: ${e}`);
//         process.exit(1);
//     }
// }

// export default loadConfig();
