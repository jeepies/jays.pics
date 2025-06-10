import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import { createRequestHandler } from '@remix-run/express';
import { installGlobals } from '@remix-run/node';
import * as build from './build/server/index.js';

installGlobals();

const app = express();
const port = process.env.PORT || 3000;
const baseDomain = process.env.BASE_DOMAIN || 'jays.pics';

app.disable('x-powered-by');
app.use(compression());
app.use(build.publicPath, express.static(build.assetsBuildDirectory, { immutable: true, maxAge: '1y' }));
app.use(express.static('public', { maxAge: '1h' }));

app.use((req, res, next) => {
  const host = req.headers.host;
  if (host && host !== baseDomain && !host.endsWith('.' + baseDomain)) {
    return res.redirect(301, `https://${baseDomain}${req.originalUrl}`);
  }
  return next();
});

app.use(morgan('tiny'));
app.all('*', createRequestHandler({ build, mode: process.env.NODE_ENV }));

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});