<script lang="ts">
	import type { PageData } from './$types';
	import { getGraphData } from '$lib/get-data';
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale
	} from 'chart.js';
	import { Line } from 'svelte-chartjs';

	export let data: PageData;
	const indexText = data?.indexText;
	const hashes = indexText?.split('\n');

	const resultsJSON = JSON.parse(data?.resultsJsonText);

	const graphData = getGraphData(hashes, resultsJSON).then(async (data) => {
		return data;
	});

	const lastHash = hashes?.at(-1) || '';
	const testResults = resultsJSON[lastHash];
	const {
		'Total tests': totalTests,
		'Total passedTests': totalPassedTests,
		'Total willNotSupportTest': totalWillNotSupportTest
	} = testResults;
	const testCompat = Number(testResults['Tests Compatibility'].replace(/%/g, ''));
	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);
</script>

<svelte:head>
	<title>Are we webpack yet?</title>
</svelte:head>

<section
	class={`after:h-full after:top-0 p-2 relative after:left-0 after:-z-[1] after:bg-primary-foreground border-b-primary-foreground border-b-[1px] after:ease-in-out after:delay-150 shadow after:transition-width  after:content-[''] after:absolute`}
	id="progress-bar"
	style="--after-width:{testCompat}%;"
>
	{totalPassedTests} of {totalTests} tests passing
</section>

<div class="container">
	<section id="verdict" class="text-center my-8">
		{#if testCompat === 100}
			<!-- content here -->
			<h1 class="text-8xl font-bold uppercase">YES</h1>
		{:else}
			<!-- else content here -->
			<h1 class="text-8xl font-bold uppercase">NO</h1>
			<p class="m-4">{testCompat}% of webpack tests are passing though</p>
		{/if}
	</section>

	<section id="graph" class="chart-container">
		{#await graphData}
			<!-- promise is pending -->
			<div class="flex items-center justify-center h-full mb-4 rounded dark:bg-muted" />
		{:then graphValue}
			<Line
				data={graphValue}
				options={{
					responsive: true,
					maintainAspectRatio: false,
					scales: {
						y: {
							beginAtZero: true,
							max: 100,
							ticks: {
								stepSize: 25
							}
						},
						x: {
							ticks: {
								display: false
							}
						}
					}
				}}
			/>
			<!-- promise was fulfilled -->
		{/await}
	</section>
</div>

<style>
	#progress-bar:after {
		width: var(--after-width, 0);
		animation: 1s ease-out 0s 1 slideInFromLeft;
		transition: width 2s;
	}
	@keyframes slideInFromLeft {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(0);
		}
	}
	.chart-container {
		position: relative;
		margin: auto;
		height: 50vh;
	}
</style>
