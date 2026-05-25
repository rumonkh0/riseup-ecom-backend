import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'yaml';
import swaggerUi from 'swagger-ui-express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const specPath = path.resolve(__dirname, '../../docs/openapi.yaml');

const loadOpenApiSpec = () => {
  const file = fs.readFileSync(specPath, 'utf8');
  return yaml.parse(file);
};

export const swaggerServe = swaggerUi.serve;
export const swaggerSetup = swaggerUi.setup(loadOpenApiSpec(), {
  customSiteTitle: 'Riseup Ecom API Docs',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
  },
});

export const openApiSpec = loadOpenApiSpec;
