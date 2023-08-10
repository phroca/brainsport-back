const mysql = require('mysql');
const readLine = require('readline');
const dotenv = require('dotenv');
dotenv.config();

var connection = mysql.createPool({
    connectionLimit: 100,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});


const connect = () => {
    setTimeout(() => connection.getConnection((err, connection) => {
        if (err)
            throw err;
        console.log('Database connected successfully');
        connection.release();
    }), 1000);
}

connection.on('connected', () => {
    console.log('connected to ' + connection.config.host);
});

connection.on('error', err => {
    console.log('error: ' + err);
    return connect();
});

connection.on('disconnected', () => {
    console.log('disconnected');
});

if (process.platform === 'win32') {
    const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on('SIGINT', () => {
        process.emit("SIGINT");
    });
}

const gracefulShutdown = (msg, callback) => {
    connection.end(() => {
        console.log(`Mysql disconnected through ${msg}`);
        callback();
    });
};

process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});
process.on('SIGTERM', () => {
    gracefulShutdown('app shutdown', () => {
        process.exit(0);
    });
});

connect();

module.exports = {
    connection
}