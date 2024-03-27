<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const { form, enhance, message } = superForm(data.form);
</script>

<a href="/">Home</a>

<h1>{data.post.title}</h1>

<article>
	<p>{data.post.username}:</p>
	<p>{data.post.content}</p>
</article>

{#each data.replies as reply}
	<article>
		<p>{reply.username}:</p>
		<p>{reply.content}</p>
	</article>
{/each}

{#if data.user}
	<form method="post" use:enhance>
		<textarea name="replycontent" id="replycontent" bind:value={$form.replycontent}></textarea>
		<button>Add reply</button>
		{#if $message}
			<p>{$message}</p>
		{/if}
	</form>
{:else}
	<p>Log in to post a reply!</p>
{/if}
