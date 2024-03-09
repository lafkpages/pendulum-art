import type { PageLoad } from './$types';

export const load = (({ url }) => {
	const numPointsRaw = url.searchParams.get('numPoints');
	const numPoints = numPointsRaw ? parseInt(numPointsRaw) : 5;

	const lengthRaw = url.searchParams.get('length');
	const length = lengthRaw ? parseInt(lengthRaw) : 100;

	const angleSpeedsRaw = url.searchParams.get('angleSpeeds');
	const angleSpeeds = angleSpeedsRaw
		? angleSpeedsRaw.split(',').map((n) => parseInt(n))
		: [1, 2, 3, 4];

	const drawRaw = url.searchParams.get('draw');
	const draw = drawRaw ? !!parseInt(drawRaw) : true;

	const showLinesRaw = url.searchParams.get('showLines');
	const showLines = showLinesRaw ? !!parseInt(showLinesRaw) : true;

	const showPointsRaw = url.searchParams.get('showPoints');
	const showPoints = showPointsRaw ? !!parseInt(showPointsRaw) : true;

	const pointSizeRaw = url.searchParams.get('pointSize');
	const pointSize = pointSizeRaw ? parseInt(pointSizeRaw) : 5;

	const randomise =
		numPointsRaw === null &&
		lengthRaw === null &&
		angleSpeedsRaw === null &&
		drawRaw === null &&
		showLinesRaw === null &&
		showPointsRaw === null &&
		pointSizeRaw === null;

	return {
		numPoints,
		length,
		angleSpeeds,
		draw,
		showLines,
		showPoints,
		pointSize,
		randomise
	};
}) satisfies PageLoad;
