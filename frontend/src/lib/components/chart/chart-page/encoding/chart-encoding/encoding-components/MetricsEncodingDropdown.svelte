<script lang="ts">
	import { metrics } from '$lib/stores';
	import Svelecte from 'svelecte';
	import { createEventDispatcher } from 'svelte';
	import EncodingContainer from './EncodingContainer.svelte';

	export let numberValue: number;
	export let container = true;

	const dispatch = createEventDispatcher<{
		selected: number;
	}>();

	let options: { value: number; label: string }[] = [];
	let value = 0;

	$metrics.forEach((m) => {
		options.push({ value: m.id, label: m.name });
	});
	value = numberValue;

	function valueSelected(e: CustomEvent) {
		if (e.detail.value !== numberValue) {
			dispatch('selected', e.detail);
		}
	}
</script>

{#if container}
	<EncodingContainer>
		<Svelecte style="width: 280px; flex:none;" bind:value {options} on:change={valueSelected} />
	</EncodingContainer>
{:else}
	<Svelecte style="width: 280px; flex:none;" bind:value {options} on:change={valueSelected} />
{/if}
