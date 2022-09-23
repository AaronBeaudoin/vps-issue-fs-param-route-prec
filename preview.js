const express = require("express");
const sirv = require("sirv");
const chalk = require("chalk");
const resolveConfig = require("vite").resolveConfig;
const renderPage = require("vite-plugin-ssr").renderPage;

resolveConfig({}, "serve").then(async viteConfig => {
  const app = express();
  const assets = sirv(`${__dirname}/dist/client`);

  app.use((request, response, next) => {
    next();

    response.once("finish", _ => {
      const message = `${response.statusCode} ${request.originalUrl}`;
      if (response.locals.fallback) console.log(`${chalk.red('server')} ${message}`);
      else if (response.locals.render) console.log(`${chalk.blue('render')} ${message}`);
      else console.log(`${chalk.magenta('static')} ${message}`);
    });
  });

  if (process.argv[2] === "render") {
    app.use(async (request, response) => {
      const pageContext = await renderPage({ url: request.originalUrl });
      const renderResponse = pageContext.httpResponse;

      if (!renderResponse || renderResponse.statusCode === 404) {
        assets(request, response, _ => response.locals.miss = true);
        if (!response.locals.miss) return;
      }
      
      if (!renderResponse) {
        response.locals.fallback = true;
        return response.sendStatus(404);
      }
      
      response.locals.render = true;
      response.statusCode = renderResponse.statusCode;
      response.contentType(renderResponse.contentType);
      response.send(renderResponse.body);
    });
  }
  
  if (process.argv[2] === "static") {
    app.use((request, response) => {
      assets(request, response, _ => {

        const fallback = _ => {
          response.locals.fallback = true;
          response.sendStatus(404);
        };

        response.statusCode = 404;
        response.contentType("text/html");
        response.sendFile(`${__dirname}/${viteConfig.build.outDir}/client/404.html`, fallback);
      });
    });
  }

  const host = typeof viteConfig.server.host === "string" ? viteConfig.server.host : "0.0.0.0";
  const port = viteConfig.server.port || 3000;

  app.listen(port, host);
  console.log(`${chalk.green('server')} http://${host}:${port}...`);
  console.log(`${chalk.green('server')} mode=${process.argv[2]}`);
});
