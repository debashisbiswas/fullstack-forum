<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
</script>

<h1>Welcome {data.user.username}</h1>
<p>id: {data.user.id}</p>

<form method="post" use:enhance>
	<button>Sign out</button>
</form>
