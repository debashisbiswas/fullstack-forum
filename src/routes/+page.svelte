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
			<li>
				<a href="/signup">Create account</a>
			</li>
			<li>
				<a href="/login">Log in</a>
			</li>
		{/if}
	</ul>
</nav>

{#if data.user}
	<a href="/new">Create new post</a>
{/if}

{#each data.allPosts as post}
	<article>
		<h2>{post.title}</h2>
		<p>{post.username}</p>
		<a href="/read/{post.id}">Read</a>
	</article>
{:else}
	<h2>No posts!</h2>
{/each}
