<script lang="ts">
	import { SlicesOrModels, type Chart, type XCParameters } from '$lib/zenoapi';
	import Svelecte from 'svelecte';
	import { EncodingMap } from '../encodingUtil';
	import EncodingSection from './EncodingSection.svelte';
	import MetricsEncodingDropdown from './encoding-components/MetricsEncodingDropdown.svelte';

	export let chart: Chart;

	$: parameters = chart.parameters as XCParameters;

	enum Dimensions {
		x,
		color
	}

	function refreshParams(e: CustomEvent, currentParam: Dimensions) {
		let label = e.detail.label as 'models' | 'slices';
		let paramExcluMap = { slices: SlicesOrModels.MODELS, models: SlicesOrModels.SLICES };

		if (currentParam === Dimensions.x) {
			parameters.xChannel = e.detail.value;
			parameters.colorChannel = paramExcluMap[label];
		}
		if (currentParam === Dimensions.color) {
			parameters.colorChannel = e.detail.value;
			parameters.xChannel = paramExcluMap[label];
		}

		chart = { ...chart, parameters: { ...parameters } };
	}

	function selected(e: CustomEvent<number[] | string[]>, channel: Dimensions) {
		const channelType = channel === Dimensions.x ? parameters.xChannel : parameters.colorChannel;
		if (channelType === SlicesOrModels.SLICES) {
			const slices = e.detail as number[];
			chart = { ...chart, parameters: { ...parameters, slices: slices } };
		} else {
			const models = e.detail as string[];
			chart = { ...chart, parameters: { ...parameters, models: models } };
		}
	}

	function ySelected(e: CustomEvent<number>) {
		chart = { ...chart, parameters: { ...parameters, metric: e.detail } };
	}

	function xChanged(e: CustomEvent) {
		if (e.detail.value !== parameters.xChannel) {
			refreshParams(e, Dimensions.x);
		}
	}

	function colorChaned(e: CustomEvent) {
		if (e.detail.value !== parameters.colorChannel) {
			refreshParams(e, Dimensions.color);
		}
	}
</script>

<EncodingSection>
	<svelte:fragment slot="parameters">
		<h4>x</h4>
		<Svelecte
			style="width: 280px; height: 30px; flex:none"
			value={parameters.xChannel}
			options={[
				{ label: 'slices', value: SlicesOrModels.SLICES },
				{ label: 'models', value: SlicesOrModels.MODELS }
			]}
			searchable={false}
			on:change={xChanged}
		/>
	</svelte:fragment>
	<svelte:component
		this={EncodingMap[parameters.xChannel].multi}
		on:selected={(e) => selected(e, Dimensions.x)}
		slot="component"
		numberValues={parameters.xChannel === SlicesOrModels.SLICES ? parameters.slices : []}
		stringValues={parameters.xChannel === SlicesOrModels.MODELS ? parameters.models : []}
	/>
</EncodingSection>
<EncodingSection>
	<svelte:fragment slot="parameters">
		<h4>y</h4>
		<MetricsEncodingDropdown on:selected={ySelected} numberValue={parameters.metric} />
	</svelte:fragment>
</EncodingSection>
<EncodingSection>
	<svelte:fragment slot="parameters">
		<h4>color</h4>
		<Svelecte
			style="width: 280px; height: 30px; flex:none"
			value={parameters.colorChannel}
			options={[
				{ label: 'slices', value: SlicesOrModels.SLICES },
				{ label: 'models', value: SlicesOrModels.MODELS }
			]}
			searchable={false}
			on:change={colorChaned}
		/>
	</svelte:fragment>
	<svelte:component
		this={EncodingMap[parameters.colorChannel].multi}
		on:selected={(e) => selected(e, Dimensions.color)}
		numberValues={parameters.colorChannel === SlicesOrModels.SLICES ? parameters.slices : []}
		stringValues={parameters.colorChannel === SlicesOrModels.MODELS ? parameters.models : []}
		slot="component"
	/>
</EncodingSection>
