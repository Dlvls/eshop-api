require('dotenv').config();
const Hapi = require('@hapi/hapi');

const authentication = require('./api/authentication');
const Database = require('./conf/Database');
const AuthenticationService = require('./services/mysql/AuthenticationService');
const AuthenticationValidator = require('./validator/authentication');

const init = async () => {
  const database = new Database();
  const AthenticationService = new AuthenticationService(database);

    const server = Hapi.server({
      host: process.env.HOST,
      port: process.env.PORT,
      routes: {
        cors: {
          origin: ['*'],
        },
      },
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: () => ({
          name: 'Rski Mulud Muchamad',
        }),
      });

      // defines external plugin
      await server.register([
        {
          plugin: authentication,
          options: {
            service: AuthenticationService,
            validator: AuthenticationValidator,
          },
        },
      ]);
      
      await server.start();
      console.log(`Server running at ${server.info.uri}`);
  
  };

  init();