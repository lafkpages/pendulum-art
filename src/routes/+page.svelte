<script lang="ts">
	import { degreesToRadians } from '$lib/angles';
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;

	onMount(() => {
		ctx = canvas.getContext('2d');

		if (!ctx) {
			throw new Error('2d context not supported');
		}

		// set canvas size
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// randomise initial values
		randomise();

		// start animation
		requestAnimationFrame(frame);
	});

	let numPoints = 5;
	let length = 100;
	const points: [number, number][] = Array(numPoints)
		.fill(null)
		.map(() => [0, 0]);
	const angles = Array(numPoints).fill(0);
	const angleSpeeds = [1, 2, 3, 4];

	$: if (numPoints - 1 > angleSpeeds.length) {
		angleSpeeds.push(1);
	}
	$: if (numPoints - 1 > points.length) {
		points.push([0, 0]);
	}

	let draw = true;
	let showLines = true;
	let showPoints = true;

	let pointColorHue = 0;
	$: pointColorString = `hsl(${pointColorHue}, 100%, 50%)`;

	let pointSize = 5;

	function drawPoint(x: number, y: number) {
		if (!ctx) {
			return;
		}

		if (!showPoints) {
			return;
		}

		ctx.fillStyle = pointColorString;
		ctx.ellipse(x, y, pointSize, pointSize, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	}

	function frame() {
		if (!canvas || !ctx) {
			return;
		}

		if (!draw) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
		ctx.save();

		// move camera
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.rotate(degreesToRadians(-90));

		// point 0
		drawPoint(0, 0);

		// points 1 and above
		for (let i = 1; i < numPoints; i++) {
			if (!points[i]) {
				continue;
			}

			const lastI = i - 1;

			points[i][0] = points[lastI][0] + Math.cos(angles[lastI]) * length;
			points[i][1] = points[lastI][1] + Math.sin(angles[lastI]) * length;

			if (showLines) {
				ctx.strokeStyle = 'black';
				ctx.beginPath();
				ctx.moveTo(points[lastI][0], points[lastI][1]);
				ctx.lineTo(points[i][0], points[i][1]);
				ctx.stroke();
				ctx.closePath();
			}

			drawPoint(points[i][0], points[i][1]);

			angles[lastI] += degreesToRadians(angleSpeeds[lastI]);
		}

		pointColorHue++;
		if (pointColorHue > 359) {
			pointColorHue = 0;
		}

		ctx.restore();

		requestAnimationFrame(frame);
	}

	function reset() {
		if (ctx && canvas) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			angles.fill(0);
		}
	}

	function randomise() {
		reset();

		numPoints = Math.round(Math.random() * 8) + 2;
		length = Math.round(Math.random() * 100) + 1;

		for (let i = 0; i < numPoints - 1; i++) {
			angleSpeeds[i] = Math.floor(Math.random() * 20) - 10;
		}

		draw = Math.random() > 0.5;

		// either show lines, points or both, but not neither
		const show = Math.floor(Math.random() * 3);
		if (show === 0) {
			showLines = true;
			showPoints = false;
		} else if (show === 1) {
			showLines = false;
			showPoints = true;
		} else {
			showLines = true;
			showPoints = true;
		}

		pointSize = Math.round(Math.random() * 20) + 1;
	}
</script>

<svelte:head>
	<title>Pendulum art</title>
</svelte:head>

<svelte:window
	on:resize={() => {
		if (canvas) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}
	}}
/>

<canvas bind:this={canvas}></canvas>

<div class="overlay controls" on:input={reset}>
	<label for="num-points"># of points</label>
	<input type="range" id="num-points" min={1} max={10} step={1} bind:value={numPoints} />
	<input type="number" min={1} bind:value={numPoints} />

	<label for="length">Pendulum length</label>
	<input type="range" id="length" min={1} max={1000} step={1} bind:value={length} />
	<input type="number" bind:value={length} />

	{#each { length: numPoints - 1 } as _, i}
		<label for="angle-speed-{i}">Angle speed {i}</label>
		<input
			type="range"
			id="angle-speed-{i}"
			min={-10}
			max={10}
			step={1}
			value={angleSpeeds[i]}
			on:input={(e) => {
				angleSpeeds[i] = parseFloat(e.currentTarget.value);
			}}
		/>
		<input
			type="number"
			id="angle-speed-{i}"
			step={1}
			value={angleSpeeds[i]}
			on:input={(e) => {
				angleSpeeds[i] = parseFloat(e.currentTarget.value);
			}}
		/>
	{/each}

	<label for="draw">Draw</label>
	<input type="checkbox" id="draw" bind:checked={draw} />
	<span>{draw}</span>

	<label for="show-lines">Show lines</label>
	<input type="checkbox" id="show-lines" bind:checked={showLines} />
	<span>{showLines}</span>

	<label for="show-points">Show points</label>
	<input type="checkbox" id="show-points" bind:checked={showPoints} />
	<span>{showPoints}</span>

	<label for="point-size">Point size</label>
	<input type="range" id="point-size" min={1} max={20} step={1} bind:value={pointSize} />
	<input type="number" bind:value={pointSize} />

	<button on:click={randomise}>Randomise</button>

	<button on:click={reset}>Reset</button>
</div>

<div class="overlay data">
	<table>
		<thead>
			<tr>
				<th>Point</th>
				<th>X</th>
				<th>Y</th>
				<th>&theta;</th>
			</tr>
		</thead>
		<tbody>
			{#each { length: numPoints } as _, i}
				<tr>
					<td>{i + 1}</td>
					<td>{points[i]?.[0].toFixed(2)}</td>
					<td>{points[i]?.[1].toFixed(2)}</td>
					<td>{i < numPoints - 1 ? angles[i]?.toFixed(2) : 'N/A'}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style lang="scss">
	canvas {
		width: 100%;
		height: 100%;
		display: block;
	}

	.overlay {
		position: absolute;
		top: 8px;
		background-color: #0000007a;
		padding: 8px;
	}

	.controls {
		left: 8px;
		display: grid;
		grid-template-columns: auto auto auto;
		align-items: center;
		gap: 8px;
		width: max-content;
		text-align: center;

		label {
			text-align: right;
		}

		span {
			font-family: 'Courier New', Courier, monospace;
		}

		button {
			grid-column-start: 2;
			grid-column-end: 4;
		}

		label + * {
			width: auto;
		}

		input[type='number'] {
			width: 48px;
		}
	}

	.data {
		right: 8px;

		table {
			&,
			tr,
			td,
			th {
				border: 1px solid white;
				border-collapse: collapse;
			}

			td,
			th {
				padding: 4px;
				text-align: center;
			}

			tr td:first-of-type {
				text-align: right;
			}

			td {
				width: 64px;
			}
		}
	}
</style>