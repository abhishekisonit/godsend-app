#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { existsSync, writeFileSync, renameSync } from 'fs';
import { join } from 'path';

interface SetupOptions {
    force?: boolean;
    verbose?: boolean;
}

class DatabaseSetup {
    private projectRoot: string;
    private dockerComposePath: string;
    private envPath: string;
    private options: SetupOptions;

    constructor(options: SetupOptions = {}) {
        this.projectRoot = process.cwd();
        this.dockerComposePath = join(this.projectRoot, 'docker-compose.yml');
        this.envPath = join(this.projectRoot, '.env');
        this.options = options;
    }

    private log(message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') {
        const colors = {
            info: '\x1b[36m',    // Cyan
            error: '\x1b[31m',   // Red
            success: '\x1b[32m', // Green
            warning: '\x1b[33m', // Yellow
            reset: '\x1b[0m'     // Reset
        };

        const timestamp = new Date().toLocaleTimeString();
        console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
    }

    private async runCommand(command: string, options: { cwd?: string; env?: NodeJS.ProcessEnv } = {}): Promise<string> {
        return new Promise((resolve, reject) => {
            if (this.options.verbose) {
                this.log(`Running: ${command}`, 'info');
            }

            try {
                const result = execSync(command, {
                    cwd: options.cwd || this.projectRoot,
                    env: { ...process.env, ...options.env },
                    encoding: 'utf-8',
                    stdio: this.options.verbose ? 'inherit' : 'pipe'
                });
                resolve(result);
            } catch (error: any) {
                if (this.options.verbose) {
                    this.log(`Command failed: ${error.message}`, 'error');
                }
                reject(error);
            }
        });
    }

    private async checkDocker(): Promise<boolean> {
        try {
            await this.runCommand('docker --version');
            await this.runCommand('docker-compose --version');
            return true;
        } catch (error) {
            this.log('Docker or Docker Compose not found. Please install Docker Desktop.', 'error');
            return false;
        }
    }

    private async checkDockerComposeFile(): Promise<boolean> {
        if (!existsSync(this.dockerComposePath)) {
            this.log('docker-compose.yml not found in project root.', 'error');
            return false;
        }
        return true;
    }

    private async stopExistingContainers(): Promise<void> {
        try {
            this.log('Stopping existing containers...', 'info');
            await this.runCommand('docker-compose down');
            this.log('Existing containers stopped.', 'success');
        } catch (error) {
            this.log('No existing containers to stop.', 'warning');
        }
    }

    private async startContainers(): Promise<void> {
        this.log('Starting PostgreSQL container...', 'info');

        try {
            await this.runCommand('docker-compose up -d');

            // Wait for containers to be properly running
            await this.waitForContainersToBeReady();
        } catch (error) {
            throw new Error('Failed to start PostgreSQL container');
        }
    }

    private async waitForContainersToBeReady(): Promise<void> {
        this.log('Waiting for containers to be ready...', 'info');

        const maxAttempts = 30;
        const delay = 2000; // 2 seconds

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const psOutput = await this.runCommand('docker-compose ps');

                // Check if postgres_db container is running and healthy
                if (psOutput.includes('postgres_db') &&
                    psOutput.includes('Up') &&
                    (psOutput.includes('healthy') || psOutput.includes('(healthy)'))) {
                    this.log(`Containers are ready! (attempt ${attempt}/${maxAttempts})`, 'success');
                    return;
                }

                if (attempt === maxAttempts) {
                    throw new Error('Containers failed to start properly within expected time');
                }

                if (this.options.verbose) {
                    this.log(`Containers not ready yet... (attempt ${attempt}/${maxAttempts})`, 'warning');
                    this.log(`Current status: ${psOutput.trim()}`, 'info');
                }

                await new Promise(resolve => setTimeout(resolve, delay));
            } catch (error) {
                if (attempt === maxAttempts) {
                    throw new Error('Failed to check container status');
                }
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    private async waitForDatabase(): Promise<void> {
        this.log('Waiting for database to be ready...', 'info');

        const maxAttempts = 30;
        const delay = 2000; // 2 seconds

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                await this.runCommand('docker exec postgres_db pg_isready -U postgres -d postgres');
                this.log(`Database is ready! (attempt ${attempt}/${maxAttempts})`, 'success');
                return;
            } catch (error) {
                if (attempt === maxAttempts) {
                    throw new Error('Database failed to start within expected time');
                }

                if (this.options.verbose) {
                    this.log(`Database not ready yet... (attempt ${attempt}/${maxAttempts})`, 'warning');
                }

                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    private async updateEnvFile(): Promise<void> {

        const dockerEnvContent = 'DATABASE_URL="postgresql://postgres:prisma@postgres_db:5432/postgres?schema=public"';
        const appEnvContent = 'DATABASE_URL="postgresql://postgres:prisma@localhost:5433/postgres?schema=public"';

        // Create .env.docker for Prisma commands
        writeFileSync(join(this.projectRoot, '.env.docker'), dockerEnvContent);

        // Only create .env if it doesn't exist (don't overwrite user's manual changes)
        if (!existsSync(this.envPath)) {
            writeFileSync(this.envPath, appEnvContent);
            this.log('Created .env file for Next.js app.', 'success');
        } else {
            this.log('Using existing .env file (not overwriting).', 'info');
        }

        this.log('Environment files updated.', 'success');
    }

    private async pushSchema(): Promise<void> {
        this.log('Pushing Prisma schema to database...', 'info');

        try {
            // Temporarily rename .env to avoid conflicts
            const envPath = this.envPath;
            const envBackupPath = envPath + '.backup';

            if (existsSync(envPath)) {
                renameSync(envPath, envBackupPath);
                this.log('Temporarily moved .env to .env.backup', 'info');
            }

            const command = `docker run --rm --network prisma-network -e DATABASE_URL=postgresql://postgres:prisma@postgres_db:5432/postgres?schema=public -v ${this.projectRoot}:/app -w /app node:18 npx prisma db push`;
            const env = { NODE_ENV: 'development' as const };

            if (this.options.verbose) {
                this.log(`Running command: ${command}`, 'info');
                this.log(`With environment: DATABASE_URL=postgresql://postgres:prisma@postgres_db:5432/postgres?schema=public`, 'info');
            }

            const result = await this.runCommand(command, { env });

            if (this.options.verbose) {
                this.log(`Command output: ${result}`, 'info');
            }

            // Restore .env file
            if (existsSync(envBackupPath)) {
                renameSync(envBackupPath, envPath);
                this.log('Restored .env file', 'info');
            }

            this.log('Schema pushed successfully!', 'success');
        } catch (error: any) {
            // Restore .env file even if command failed
            const envPath = this.envPath;
            const envBackupPath = envPath + '.backup';
            if (existsSync(envBackupPath)) {
                try {
                    renameSync(envBackupPath, envPath);
                    this.log('Restored .env file after error', 'info');
                } catch (restoreError) {
                    this.log('Failed to restore .env file', 'warning');
                }
            }

            this.log(`Push schema error: ${error.message}`, 'error');
            if (this.options.verbose) {
                this.log(`Full error: ${error}`, 'error');
            }
            throw new Error('Failed to push schema to database');
        }
    }

    private async generatePrismaClient(): Promise<void> {
        this.log('Generating Prisma client...', 'info');

        try {
            await this.runCommand('npx prisma generate');
            this.log('Prisma client generated successfully!', 'success');
        } catch (error) {
            throw new Error('Failed to generate Prisma client');
        }
    }

    private async verifyConnection(): Promise<void> {
        this.log('Verifying database connection...', 'info');

        try {
            const testQuery = await this.runCommand(
                'docker exec postgres_db psql -U postgres -d postgres -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = \'public\';"'
            );

            if (testQuery.includes('count')) {
                this.log('Database connection verified successfully!', 'success');
            } else {
                throw new Error('Database verification failed');
            }
        } catch (error) {
            throw new Error('Failed to verify database connection');
        }
    }

    public async setup(): Promise<void> {
        try {
            this.log('🚀 Starting database setup...', 'info');

            // Check prerequisites
            if (!(await this.checkDocker())) {
                process.exit(1);
            }

            if (!(await this.checkDockerComposeFile())) {
                process.exit(1);
            }

            // Stop existing containers if force flag is set
            if (this.options.force) {
                await this.stopExistingContainers();
            }

            // Start containers
            await this.startContainers();

            // Wait for database to be ready
            await this.waitForDatabase();

            // Update environment files
            await this.updateEnvFile();

            // Push schema
            await this.pushSchema();

            // Generate Prisma client
            await this.generatePrismaClient();

            // Verify connection
            await this.verifyConnection();

            this.log('✅ Database setup completed successfully!', 'success');
            this.log('📝 Next steps:', 'info');
            this.log('   1. Start your Next.js app: npm run dev', 'info');
            this.log('   2. Your app will connect to localhost:5433', 'info');
            this.log('   3. For Prisma commands, use the Docker approach', 'info');

        } catch (error: any) {
            this.log(`❌ Setup failed: ${error.message}`, 'error');
            process.exit(1);
        }
    }

    public async reset(): Promise<void> {
        try {
            this.log('🔄 Resetting database...', 'info');

            await this.runCommand('docker-compose down -v');
            this.log('Containers and volumes removed.', 'success');

            await this.setup();

        } catch (error: any) {
            this.log(`❌ Reset failed: ${error.message}`, 'error');
            process.exit(1);
        }
    }

    public async status(): Promise<void> {
        try {
            this.log('📊 Checking database status...', 'info');

            const containers = await this.runCommand('docker-compose ps');
            console.log(containers);

            const logs = await this.runCommand('docker logs postgres_db --tail 10');
            console.log('\nRecent logs:');
            console.log(logs);

        } catch (error: any) {
            this.log(`❌ Status check failed: ${error.message}`, 'error');
        }
    }
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'setup';
    const options: SetupOptions = {
        force: args.includes('--force') || args.includes('-f'),
        verbose: args.includes('--verbose') || args.includes('-v')
    };

    const setup = new DatabaseSetup(options);

    switch (command) {
        case 'setup':
            await setup.setup();
            break;
        case 'reset':
            await setup.reset();
            break;
        case 'status':
            await setup.status();
            break;
        default:
            console.log(`
Usage: npm run db:setup [command] [options]

Commands:
  setup   Start database and push schema (default)
  reset   Reset database (remove volumes and restart)
  status  Check database status

Options:
  --force, -f     Force restart containers
  --verbose, -v   Show detailed output

Examples:
  npm run db:setup
  npm run db:setup reset --force
  npm run db:setup status --verbose
      `);
            process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

export default DatabaseSetup; 