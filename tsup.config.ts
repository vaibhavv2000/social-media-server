import {defineConfig, Options} from 'tsup';
import "dotenv/config";

const config: Options = {
 entry: ['src/app/index.ts'],
 format: ['cjs'],
 outDir: 'dist',
 minify: true,
 clean: true,
};

if(process.env.NODE_ENV === "dev") {
 config.watch = true;
 config.onSuccess = "nodemon dist/index.js";
};

export default defineConfig(config);