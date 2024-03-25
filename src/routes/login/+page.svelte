<script lang="ts">
	import { enhance } from '$app/forms';

	export let form;
</script>

<h1>Log in</h1>

<form method="post" use:enhance>
	<label for="username">Username</label>
	<input type="text" name="username" id="username" />

	<br />

	<label for="password">Password</label>
	<input type="password" name="password" id="password" />

	<br />

	<button>Continue</button>
	<p>{form?.message ?? ''}</p>
</form>

<a href="/signup">Create an account</a>
