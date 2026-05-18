// PM2 ecosystem config for ProSWPPP Next.js standalone
// Lives at: /var/www/www2.proswppp.com/ecosystem.config.js on the server
//
// Next.js standalone server.js MUST run from its own directory because it
// resolves chunks/static/public relative to its cwd. Don't change cwd.

module.exports = {
  apps: [
    {
      name: 'proswppp',
      script: 'server.js',
      cwd: '/var/www/www2.proswppp.com/.next/standalone',
      instances: 1,
      exec_mode: 'fork',
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
