import type { VegaLiteSpec } from 'svelte-vega';

export function nominalVegaSpec(metricRange: [number, number]) {
	const countSpec = {
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
		data: {
			name: 'table'
		},
		view: {
			stroke: 'transparent'
		},
		width: 300,
		height: 40,
		background: '#fbfbfa',
		layer: [
			{
				params: [{ name: 'select', select: { type: 'point', encodings: ['x'] } }],
				mark: {
					type: 'bar',
					binSpacing: 0,
					opacity: 0.5,
					fill: '#ddd',
					cursor: 'pointer'
				},
				encoding: {
					x: {
						field: 'bucket',
						axis: {
							title: '',
							grid: false,
							tickCount: 2,
							labelColor: 'rgba(0, 0, 0, 0.6)'
						}
					},
					y: {
						field: 'count',
						type: 'quantitative',
						axis: { title: '', tickCount: 2, labelColor: 'rgba(0, 0, 0, 0.6)' }
					},
					tooltip: [
						{ field: 'count', type: 'quantitative', title: 'Count' },
						{
							field: 'metric',
							type: 'quantitative',
							title: 'Metric',
							format: '.2f'
						}
					]
				}
			},
			{
				mark: {
					type: 'bar',
					binSpacing: 0,
					cursor: 'pointer',
					stroke: '#b18bd3'
				},
				encoding: {
					x: {
						field: 'bucket'
					},
					y: {
						field: 'filteredCount',
						type: 'quantitative'
					},
					tooltip: [
						{
							field: 'filteredCount',
							type: 'quantitative',
							title: 'Filtered Count'
						},
						{
							field: 'metric',
							type: 'quantitative',
							title: 'Metric',
							format: '.2f'
						}
					],
					strokeWidth: {
						condition: [
							{
								param: 'select',
								empty: false,
								value: 2
							}
						],
						value: 0
					}
				}
			}
		]
	} as VegaLiteSpec;

	if ('layer' in countSpec) {
		const topLayerBars = countSpec['layer'][1];
		if (topLayerBars['encoding'] !== undefined) {
			if (metricRange[0] !== Infinity) {
				topLayerBars.encoding.color = {
					field: 'metric',
					type: 'quantitative',
					scale: {
						domainMin: metricRange[0],
						domainMax: metricRange[1],
						range: ['#decbe9', '#6a1b9a']
					},
					legend: null
				};
			} else {
				topLayerBars.encoding.color = {
					value: '#6a1b9a'
				};
			}
		}
	}

	return countSpec;
}

export function continuousVegaSpec(metricRange: [number, number]) {
	const histogramSpec = {
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
		data: {
			name: 'table'
		},
		view: {
			stroke: 'transparent'
		},
		width: 300,
		height: 40,
		background: '#fbfbfa',
		layer: [
			{
				params: [
					{
						name: 'brush',
						select: { type: 'interval', encodings: ['x'] }
					}
				],
				mark: {
					type: 'bar',
					opacity: 0.5,
					cursor: 'col-resize',
					binSpacing: 0
				},
				encoding: {
					x: {
						field: 'bucket',
						bin: { binned: true }
					},
					x2: { field: 'bucketEnd' },
					y: {
						field: 'count',
						type: 'quantitative'
					},
					color: { value: '#ddd' },
					tooltip: [
						{ field: 'count', type: 'quantitative', title: 'Count' },
						{
							field: 'metric',
							type: 'quantitative',
							title: 'Metric',
							format: '.2f'
						}
					]
				}
			},
			{
				mark: {
					type: 'bar',
					binSpacing: 0,
					cursor: 'col-resize'
				},
				encoding: {
					size: {
						legend: null
					},
					x: {
						field: 'bucket',
						bin: { binned: true },
						title: '',
						axis: { title: '', labelColor: 'rgba(0, 0, 0, 0.6)' }
					},
					x2: { field: 'bucketEnd' },
					y: {
						field: 'filteredCount',
						type: 'quantitative',
						title: 'count',
						axis: {
							title: '',
							tickCount: 2,
							labelColor: 'rgba(0, 0, 0, 0.6)'
						}
					},
					tooltip: [
						{
							field: 'filteredCount',
							type: 'quantitative',
							title: 'Filtered Count'
						},
						{
							field: 'metric',
							type: 'quantitative',
							title: 'Metric',
							format: '.2f'
						}
					]
				}
			}
		]
	} as VegaLiteSpec;

	if ('layer' in histogramSpec) {
		const topLayerBars = histogramSpec['layer'][1];
		if (topLayerBars.encoding !== undefined) {
			if (metricRange[0] !== Infinity) {
				topLayerBars.encoding.color = {
					field: 'metric',
					type: 'quantitative',
					scale: {
						domainMin: metricRange[0],
						domainMax: metricRange[1],
						range: ['#decbe9', '#6a1b9a']
					},
					legend: null
				};
			} else {
				topLayerBars.encoding.color = {
					value: '#6a1b9a'
				};
			}
		}
	}

	return histogramSpec;
}
