module.exports = {
  apps: [
    {
      name: 'proswppp',
      script: 'server.js',
      cwd: '/var/www/www2.proswppp.com/.next/standalone',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
    },
  ],
};
