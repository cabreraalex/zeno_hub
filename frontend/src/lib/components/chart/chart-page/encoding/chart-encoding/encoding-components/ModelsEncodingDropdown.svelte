<script lang="ts">
	import { models } from '$lib/stores';
	import Svelecte from 'svelecte';
	import { createEventDispatcher } from 'svelte';
	import EncodingContainer from './EncodingContainer.svelte';

	export let stringValue: string;

	const dispatch = createEventDispatcher<{
		selected: string;
	}>();

	let options: { value: string; label: string }[] = [];
	let value = stringValue;

	// initial options & values
	$models.forEach((m) => {
		options.push({ value: m, label: m });
	});

	function valueSelected(e: CustomEvent) {
		if (e.detail.value !== stringValue) {
			dispatch('selected', e.detail);
		}
	}
</script>

<EncodingContainer>
	<Svelecte style="width: 280px; flex:none;" bind:value {options} on:change={valueSelected} />
</EncodingContainer>
