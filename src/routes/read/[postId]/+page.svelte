<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const { form, enhance, message } = superForm(data.form);
</script>

<h1 class="h1">{data.post.title}</h1>

<article class="card m-4">
	<header class="card-header">{data.post.username}</header>
	<section class="p-4 paragraph">{data.post.content}</section>
</article>

{#each data.replies as reply}
	<article class="card m-4">
		<header class="card-header">{reply.username}</header>
		<section class="p-4 paragraph">{reply.content}</section>
	</article>
{/each}

{#if data.user}
	<form class="m-4" method="post" use:enhance>
		<textarea class="textarea" name="replycontent" id="replycontent" bind:value={$form.replycontent}></textarea>
		<button class="btn variant-filled-primary">Add reply</button>
		{#if $message}
			<p>{$message}</p>
		{/if}
	</form>
{:else}
	<p>Log in to post a reply!</p>
{/if}
