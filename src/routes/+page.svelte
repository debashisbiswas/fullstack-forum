<script lang="ts">
	import { enhance } from '$app/forms';
	export let data;
</script>

<nav class="container">
	<ul>
		<li><strong>Fullstack Forum</strong></li>
	</ul>
	<ul>
		{#if data.user}
			<li>{data.user.username}</li>
			<form method="post" use:enhance>
				<li>
					<button>Sign out</button>
				</li>
			</form>
		{:else}
			<a href="/login">Log in</a>
		{/if}
	</ul>
</nav>

{#if data.user}
	<a href="/new">Create new post</a>
{/if}

{#each data.allPosts as { id, title, author }}
	<article>
		<h2>{title}</h2>
		<p>{author}</p>
		<a href="/read/{id}">Read</a>
	</article>
{:else}
	<h2>No posts!</h2>
{/each}
