<script lang="ts">
	import { doesModelDependOnPredicates } from '$lib/api/slice';
	import { comparisonModel, model, projectConfig, selections, slices } from '$lib/stores';
	import { clickOutside } from '$lib/util/clickOutside';
	import { Join, ZenoService, type Slice } from '$lib/zenoapi';
	import { mdiDotsHorizontal } from '@mdi/js';
	import Button, { Label } from '@smui/button';
	import Dialog, { Actions, Content, InitialFocus, Title } from '@smui/dialog';
	import IconButton, { Icon } from '@smui/icon-button';
	import Paper from '@smui/paper';
	import SliceDetails from '../../general/SliceDetails.svelte';
	import SlicePopup from '../../popups/SlicePopup.svelte';
	import SliceCellResult from './SliceCellResult.svelte';
	import { selectSliceCell } from './sliceCellUtil';

	export let slice: Slice;
	export let compare: boolean;

	let confirmDelete = false;
	let showTooltip = false;
	let hovering = false;
	let showOptions = false;
	let editing = false;

	let compareButton = slice
		? doesModelDependOnPredicates(slice.filterPredicates.predicates)
		: false;

	$: selected = $selections.slices.includes(slice.id);
	$: transferData =
		$selections.slices.length > 0 && $selections.slices.includes(slice.id)
			? $selections.slices.join(',')
			: [slice.id].join(',');

	function removeSlice() {
		confirmDelete = false;
		selections.update((m) => {
			for (let key in m.metadata) {
				m.metadata[key] = { predicates: [], join: Join.AND };
			}
			return { slices: [], metadata: { ...m.metadata }, tags: [] };
		});
		ZenoService.deleteSlice(slice).then(() => {
			if ($projectConfig) {
				ZenoService.getSlices($projectConfig.uuid).then((fetchedSlices) =>
					slices.set(fetchedSlices)
				);
			}
		});
	}

	function setSelected(e: MouseEvent) {
		if (compare && compareButton) {
			return;
		}
		selectSliceCell(e, slice);
	}

	function dragStart(e: DragEvent) {
		if (e.dataTransfer !== null) {
			e.dataTransfer.setData('text/plain', transferData);
			e.dataTransfer.dropEffect = 'copy';
		}
	}

	function dragEnd(e: DragEvent) {
		if (e.dataTransfer !== null) {
			// If dragged out of a folder, remove from the folder it was in.
			if (e.dataTransfer.dropEffect === 'none' && $projectConfig) {
				const data = transferData.split(',');
				data.forEach((element) => {
					const slice = $slices.find((slice) => slice.id === parseInt(element));
					if (slice && $projectConfig) {
						ZenoService.updateSlice($projectConfig.uuid, { ...slice, folderId: undefined }).then(
							() => {
								ZenoService.getSlices($projectConfig ? $projectConfig.uuid : '').then(
									(fetchedSlices) => slices.set(fetchedSlices)
								);
							}
						);
					}
				});
			}
		}
	}
</script>

{#if editing}
	<SlicePopup on:close={() => (editing = false)} sliceToEdit={slice} />
{/if}
<button
	class="overflow-auto border border-grey-lighter rounded mt-1 flex h-9 items-center w-full px-2.5 justify-between text-grey overflow-visible relative
	{selected ? ' bg-primary-light' : ''} 
	{compare ? ' py-1' : ''}"
	on:click={(e) => setSelected(e)}
	draggable="true"
	on:mouseover={() => (hovering = true)}
	on:focus={() => (hovering = true)}
	on:mouseleave={() => (hovering = false)}
	on:blur={() => (hovering = false)}
	on:dragstart={dragStart}
	on:dragend={dragEnd}
>
	{#if showTooltip}
		<div
			class="bg-background absolute w-fit z-10 left-0 top-full p-2 rounded border border-grey-lighter shadow-xl"
		>
			<SliceDetails predicateGroup={slice.filterPredicates} />
		</div>
	{/if}
	<div class="flex items-center w-full justify-between">
		<span
			on:mouseover={() => (showTooltip = true)}
			on:mouseout={() => (showTooltip = false)}
			on:focus={() => (showTooltip = true)}
			on:blur={() => (showTooltip = false)}
		>
			{slice.sliceName}
		</span>
		<div
			class="flex items-center"
			use:clickOutside={() => {
				showOptions = false;
			}}
		>
			{#if showOptions}
				<div class="top-0 right-0 absolute mt-9 hover:bg-grey-lighter z-30">
					<Paper style="padding: 3px 0px;" elevation={7}>
						<Content>
							<button
								class="flex items-center w-20 py px-2"
								on:click={(e) => {
									e.stopPropagation();
									showOptions = false;
									editing = true;
								}}
							>
								<Icon style="font-size: 18px;" class="material-icons">edit</Icon>&nbsp;
								<span class="text-xs">Edit</span>
							</button>
							<button
								class="flex items-center w-20 py px-2 hover:bg-grey-lighter"
								on:click={(e) => {
									e.stopPropagation();
									showOptions = false;
									removeSlice();
								}}
							>
								<Icon style="font-size: 18px;" class="material-icons">delete_outline</Icon>&nbsp;
								<span class="text-xs">Remove</span>
							</button>
						</Content>
					</Paper>
				</div>
			{/if}
			<SliceCellResult {compare} {slice} sliceModel={$model ?? ''} />
			{#if compare}
				<SliceCellResult {compare} {slice} sliceModel={$comparisonModel ?? ''} />
			{/if}
			<div
				style:width="36px"
				use:clickOutside={() => {
					hovering = false;
				}}
			>
				{#if hovering}
					<IconButton
						size="button"
						style="padding: 0px"
						on:click={(e) => {
							e.stopPropagation();
							showOptions = !showOptions;
						}}
					>
						<Icon tag="svg" viewBox="0 0 24 24">
							<path fill="black" d={mdiDotsHorizontal} />
						</Icon>
					</IconButton>
				{/if}
			</div>
		</div>
	</div>
</button>

<Dialog
	bind:open={confirmDelete}
	scrimClickAction=""
	escapeKeyAction=""
	aria-labelledby="delete-slice"
	aria-describedby="delete-slice"
>
	<Title id="simple-title">Delete Slice</Title>
	<Content id="simple-content">Do you really want to delete this slice?</Content>
	<Actions>
		<Button on:click={() => (confirmDelete = false)}>
			<Label>No</Label>
		</Button>
		<Button use={[InitialFocus]} on:click={() => removeSlice()}>
			<Label>Yes</Label>
		</Button>
	</Actions>
</Dialog>
