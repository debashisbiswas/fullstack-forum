<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
</script>

<h1>Welcome {data.user.username}</h1>
<a href="/new">Create new post</a>

{#if data.posts}
	{#each data.posts as post}
		<h2>{post.title}</h2>
		<p>{post.owner}</p>
	{/each}
{:else}
	<h2>No posts!</h2>
{/if}

<form method="post" use:enhance>
	<button>Sign out</button>
</form>
