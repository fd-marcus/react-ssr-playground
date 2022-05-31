import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fs from "fs";
import path from "path";
import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import App from "../src/App";

const server = fastify();

const manifest = fs.readFileSync(
  path.join(__dirname, "static/manifest.json"),
  "utf-8"
);

const assets = JSON.parse(manifest);

const init = async () => {
  server.register(fastifyStatic, {
    root: path.join(__dirname, "static"),
  });

  server.get("/", function (request, reply) {
    let didError = false;
    const stream = renderToPipeableStream(
      <App assets={assets} />,
      {
        bootstrapScripts: [assets["client.js"]],
        onShellReady() {
          reply.statusCode = didError ? 500 : 200;
          reply.type("text/html");
          stream.pipe(reply.raw);
        },
        onError(x) {
          didError = true;
          console.error(x);
        },
      }
    );

    setTimeout(() => stream.abort(), 10000);
  });

  await server.listen(3000);
  console.log(`Server running on http://localhost:3000`);
};

init();
