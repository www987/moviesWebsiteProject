module.exports = {
    DB_HOST:process.env.DB_HOST || "mysqldb",
    DB_PORT:process.env.DB_PORT || 8080,
    DB_NAME:process.env.DB_NAME,
    DB_USER:process.env.DB_USER,
    DB_PASSWORD:process.env.DB_PASSWORD,
    DB_DATABASE: "moviesBrowser",
    DB_RepetitionLimit: process.env.DB_RepetitionLimit
}
