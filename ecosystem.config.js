// PM2 ecosystem config for ProSWPPP Next.js standalone
// Lives at: /var/www/www2.proswppp.com/ecosystem.config.js on the server

module.exports = {
  apps: [
    {
      name: 'proswppp',
      script: '/var/www/www2.proswppp.com/.next/standalone/server.js',
      cwd: '/var/www/www2.proswppp.com',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
    },
  ],
};
