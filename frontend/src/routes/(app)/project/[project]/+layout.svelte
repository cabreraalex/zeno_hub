<script lang="ts">
	import {
		columns,
		folders,
		metrics,
		models,
		projectConfig,
		rowsPerPage,
		slices,
		tags
	} from '$lib/stores';
	import { getEndpoint } from '$lib/util/util';
	import { OpenAPI as zenoAPI } from '$lib/zenoapi';

	export let data;

	$: {
		projectConfig.set(data.projectConfig);
		rowsPerPage.set(data.projectConfig.numItems ?? 5);
		slices.set(data.slices);
		columns.set(data.columns);
		models.set(data.models);
		metrics.set(data.metrics);
		folders.set(data.folders);
		tags.set(data.tags);
		zenoAPI.BASE = `${getEndpoint()}/api`;
		zenoAPI.HEADERS = {
			Authorization: 'Bearer ' + data.cognitoUser.accessToken
		};
	}
</script>

<div class="w-full h-full flex">
	<slot />
</div>
