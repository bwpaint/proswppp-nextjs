module.exports = {
  apps: [
    {
      name: 'proswppp',
      script: './node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/www2.proswppp.com',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
