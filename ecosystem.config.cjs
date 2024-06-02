module.exports = {
  apps: [
    {
      name: "bom-api-server",
      script: "./app.js",
      instances: 1, // 클러스터 모드
      autorestart: false,
      watch: false,
      env: {
        APP_ENV: 'development',
        API_HOST:'http://localhost:8001',
        JWT_ALGORITHM: 'HS256',
        JWT_EXPIRES_IN : 1644850953,
        JWT_ISSUER: 'bfly',
        PASS_SALT: 10,
        DB_HOST: '127.0.0.1',
        DB_PORT: '3306',
        DB_USER: 'root',
        DB_PASSWORD: '',
        DB_DATABASE: 'bandev',
        MAIL_TOKEN: '',
      },
      env_production: {
        APP_ENV: 'production',
        API_HOST:'',
        JWT_ALGORITHM: '',
        JWT_EXPIRES_IN : '',
        JWT_ISSUER: '',
        PASS_SALT: 10,
        DB_HOST: '',
        DB_PORT: '',
        DB_USER: '',
        DB_PASSWORD: '',
        DB_DATABASE: '',
        MAIL_TOKEN: '',
      }
    }]
}
