import SwaggerParser from "@apidevtools/swagger-parser";

const swagger = await SwaggerParser.bundle("src/swagger/openapi.yaml");

export default swagger;