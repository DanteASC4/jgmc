import { Hono } from 'hono';
import { serveStatic } from 'hono/deno';
import { html } from 'hono/html';

const app = new Hono();

const buildAnchor = (text: string) => html`<a href="./out/${text.toLowerCase().replace(/\s/g, '')}.html">${text}</a>`;

app.use('/out/*', serveStatic({ root: './' }));
app.get('/', (c) => {
  return c.html(html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>TooManyCharts Unit Test Gallery</title>
        <style>
          html,
          body {
            height: 100vh;
            width: 100vw;
            margin: 0;
            overflow: hidden;
            background: #000;
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
          }
          a {
            padding: 0.15rem 0.25rem;
            font-size: 1.5rem;
          }
          a, a:visited {
            color: cyan;
          }
        </style>
      </head>
      <body>
				${buildAnchor("Vanilla BarChart")}
				${buildAnchor("Vanilla BarChart Extras")}
				<br />

				${buildAnchor("Vanilla BarChart Stacked")}

				${buildAnchor("Vanilla BarChart Stacked Extras")}
				<br />

				${buildAnchor("Vanilla Line Chart")}
				${buildAnchor("Vanilla Line Chart Extras")}
				<br />

				${buildAnchor("Vanilla Pie Chart")}
				${buildAnchor("Vanilla Pie Chart Extras")}
				<br />
				${buildAnchor("Vanilla Donut Chart")}
				${buildAnchor("Vanilla Donut Chart Extras")}
				<br />
				<br />

				${buildAnchor("React BarChart")}
				${buildAnchor("React BarChart Extras")}
				<br />
				<a href="./out/tinker.html"> Tinker </a>
      </body>
    </html>`);
});

Deno.serve(app.fetch);
