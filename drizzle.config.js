/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://AI-Interview-Platform_owner:4SYCUBbX3qHE@ep-empty-queen-a1g65rh8.ap-southeast-1.aws.neon.tech/AI-Interview-Platform?sslmode=require'
  }
};