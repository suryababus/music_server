
module.exports = {
    "type": "postgres",
    "host": process.env.db_ip || "postgres",
    "port": 5432,
    "username": "surya",
    "password": "mysecretpassword",
    "database": "music",
    "synchronize": true,
    "logging": false,
    "entities": [
        "src/entities/**/*.ts"
    ]
}