const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const backendDir = path.join(__dirname, 'backend');

if (!fs.existsSync(backendDir)) {
  fs.mkdirSync(backendDir, { recursive: true });
}

process.chdir(backendDir);

// Initialize package.json
if (!fs.existsSync('package.json')) {
  execSync('npm init -y');
}

// Packages to install
const prodDeps = [
  'express',
  'cors',
  'helmet',
  'morgan',
  'dotenv',
  'bcrypt',
  'jsonwebtoken',
  'zod',
  '@prisma/client'
].join(' ');

const devDeps = [
  'typescript',
  'ts-node',
  'nodemon',
  '@types/express',
  '@types/cors',
  '@types/morgan',
  '@types/bcrypt',
  '@types/jsonwebtoken',
  '@types/node',
  'prisma'
].join(' ');

console.log('Installing dependencies...');
execSync(`npm install ${prodDeps}`, { stdio: 'inherit' });
execSync(`npm install -D ${devDeps}`, { stdio: 'inherit' });

// Create tsconfig.json
const tsconfig = {
  compilerOptions: {
    target: "ES2022",
    module: "CommonJS",
    outDir: "./dist",
    rootDir: "./src",
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true
  },
  include: ["src/**/*"]
};
fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));

// Create Folder Structure
const dirs = [
  'src',
  'src/config',
  'src/controllers',
  'src/routes',
  'src/services',
  'src/middlewares',
  'src/validators',
  'src/utils',
  'src/types',
  'prisma'
];

dirs.forEach(dir => fs.mkdirSync(dir, { recursive: true }));

console.log('Backend scaffolding complete.');
