<script lang="ts">
	export let data;
</script>

{#if data.user}
	<a href="/new" class="variant-filled-primary btn text-center my-4">Create new post</a>
{/if}

{#each data.allPosts as post}
	<article class="card card-hover p-4 mt-4">
		<a href="/read/{post.id}">
			<header class="card-header text-2xl font-bold tracking-tight">{post.title}</header>
			<section class="p-4">{post.username}</section>
		</a>
	</article>
{:else}
	<h2>No posts!</h2>
{/each}
