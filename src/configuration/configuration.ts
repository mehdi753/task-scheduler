export default () => ({
  port: parseInt(process.env.PORT, 10) || 3500,
  env: process.env.ENV || 'development',
  database: {
    host: process.env.DATABASE_HOST || 'task-scheduler_postgres',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME || 'user',
    password: process.env.DATABASE_PASSWORD || 'changeme',
    name: process.env.DATABASE_NAME || 'task-scheduler',
  },
});
