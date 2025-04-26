const fs = require('fs');
const path = require('path');

// Create directories
const directories = [
    'config',
    'controllers',
    'middleware',
    'models',
    'public',
    'public/css',
    'public/js',
    'routes',
    'views',
    'views/auth',
    'views/books',
    'views/students',
    'views/loans',
    'views/partials'
];

directories.forEach(dir => {
    fs.mkdirSync(path.join(process.cwd(), dir), { recursive: true });
    console.log(`Created directory: ${dir}`);
});

// Create .env file
const envContent = `MONGODB_URI=mongodb+srv://ilyassebenharou005:hibahiba2005@bibliodb.r9sear8.mongodb.net/?retryWrites=true&w=majority&appName=bibliodb
PORT=3000
SESSION_SECRET=your_session_secret_here`;

fs.writeFileSync(path.join(process.cwd(), '.env'), envContent);
console.log('Created .env file');

console.log('Project structure setup complete!');