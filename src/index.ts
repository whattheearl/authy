import { RunDatabaseMigrations, StartServer } from './server';

await RunDatabaseMigrations();
StartServer();
