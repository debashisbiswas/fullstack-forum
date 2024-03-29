<script lang="ts">
	import '../app.pcss';
	import { enhance } from '$app/forms';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';

	export let data;
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase"><a href="/">Fullstack Forum</a></strong>
			</svelte:fragment>

			<svelte:fragment slot="trail">
				{#if data.user}
					<span>Logged in as <span class="font-bold">{data.user.username}</span></span>
					<form method="post" action="/logout" use:enhance>
						<button class="variant-ghost-surface btn btn-sm">Sign out</button>
					</form>
				{:else}
					<a class="variant-ghost-surface btn btn-sm" href="/signup">Create account</a>
					<a class="variant-ghost-surface btn btn-sm" href="/login">Log in</a>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<div class="m-auto mb-16 max-w-screen-md">
		<slot />
	</div>
</AppShell>
