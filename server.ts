import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { ventesRoute } from './routes/ventes';
import { wooferRoute } from './routes/woofers';
import { atelierRoute } from './routes/ateliers'; 
import { responsableRoute } from './routes/responsable'; 
import { stockRoute } from './routes/stock';



const app = new Hono();

app.use('*', async (c, next) => {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type");
  if (c.req.method === 'OPTIONS') return c.body(null, 204);
  await next();
});

app.get('/ventes', serveStatic({ path: './public/ventes.html' }));
app.get('/woofers', serveStatic({ path: './public/woofers.html' }));
app.get('/ateliers', serveStatic({ path: './public/ateliers.html' }));
app.get('/stock', serveStatic({ path: './public/stock.html' }));
app.get('/menu', serveStatic({ path: './public/menu.html' }));
app.use('/public/*', serveStatic({ root: './' }));

app.route('/api', ventesRoute);
app.route('/api', wooferRoute);
app.route('/api', atelierRoute);
app.route('/api', responsableRoute); 
app.route('/api', stockRoute);



app.get('/', (c) => c.text('Bienvenue 👋 Visitez /ventes ou /woofers'));

export default {
  port: 3000,
  fetch: app.fetch
};