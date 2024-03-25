<script lang="ts">
	import { enhance } from '$app/forms';
	export let data;
</script>

<nav class="container">
	<ul>
		<li><strong>Fullstack Forum</strong></li>
	</ul>
	<ul>
		<li>{data.user.username}</li>
		<form method="post" use:enhance>
			<li>
				<button>Sign out</button>
			</li>
		</form>
	</ul>
</nav>

<a href="/new">Create new post</a>

{#each data.posts as { user, post }}
	<article>
		<h2>{post.title}</h2>
		<p>{user.username}</p>
	</article>
{:else}
	<h2>No posts!</h2>
{/each}
