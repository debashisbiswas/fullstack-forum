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

{#each data.allPosts as { user, post }}
	<article>
		<h2>{post.title}</h2>
		<p>{user.username}</p>
	</article>
{:else}
	<h2>No posts!</h2>
{/each}
