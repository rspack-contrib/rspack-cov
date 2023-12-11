import type { ChartData, Point } from 'chart.js';
export async function getGraphData(
	hashes: string[],
	resultsJSON: Record<string, any>
): Promise<ChartData<'line', (number | Point)[], unknown>> {
	return new Promise((resolve) => {
		const testCompatData = hashes.map((hash: string) => ({
			...resultsJSON[hash],
			testCompat: Number(resultsJSON[hash]['Tests Compatibility'].replace(/%/g, ''))
		}));
		const graphData = {
			labels: hashes,
			datasets: [
				{
					label: 'Coverage',
					fill: true,
					lineTension: 0.3,
					backgroundColor: 'hsl(47.9 95.8% 53.1%)',
					borderColor: 'hsl(47.9 95.8% 53.1%)',
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: 'hsl(47.9 95.8% 53.1%)',
					pointBackgroundColor: 'hsl(47.9 95.8% 53.1%)',
					pointBorderWidth: 2,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: 'rgb(0, 0, 0)',
					pointHoverBorderColor: 'hsl(47.9 95.8% 53.1%)',
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: testCompatData.map((data) => data.testCompat)
				}
			],
			options: {
				legend: {
					display: false
				},
				responsive: true,
				scales: {
					y: {
						beginAtZero: true,
						max: 100
					},
					x: {
						ticks: {
							display: false
						}
					}
				}
			}
		};

		resolve(graphData);
	});
}
