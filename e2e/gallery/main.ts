import { Hono } from 'hono';
import { serveStatic } from 'hono/deno';
import { html } from 'hono/html';

const app = new Hono();

const chartTypes = [
	'BarChart',
	'BarChart Extras',
	'BarChartStacked',
	'BarChartStacked Extras',
	'LineChart',
	'LineChart Extras',
	'PieChart',
	'PieChart Extras',
	'DonutChart',
	'DonutChart Extras'
];

const buildLinks = (pkg: string) => html`${chartTypes.map(cType => {
	const fullName = `${pkg} ${cType}`;
	return html`<div><a href="./out/${fullName.toLowerCase().replace(/\s/g, '')}.html">${fullName}</a></div>`
})}`;

app.use('/out/*', serveStatic({ root: './' }));
app.get('/', (c) => {

	return c.html(html`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>JGMC Unit Test Gallery</title>
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

		a,
		a:visited {
			color: cyan;
		}

		.chart-pkg-group {
			display: flex;
			flex-direction: column;
			.chart-links-cont {
				flex-grow: 1;
			}
		}
	</style>
</head>

<body>

	<div class="chart-pkg-group">
		<h2>Vanilla Charts</h2>
		<div class="chart-links-cont">
			${buildLinks('Vanilla')}
		</div>
	</div>

	<div class="chart-pkg-group">
		<h2>React Charts</h2>
		<div class="chart-links-cont">
			${buildLinks('React')}
		</div>
	</div>

	<br />
	<a href="./out/tinker.html"> Tinker </a>
</body>
</html>`);
});

Deno.serve(app.fetch);
