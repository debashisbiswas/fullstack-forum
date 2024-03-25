<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const { form, errors, constraints, message, enhance } = superForm(data.form);
</script>

<h1>Create an account</h1>

<form method="post" use:enhance>
	<label for="username">Username</label>
	<input
		type="text"
		name="username"
		id="username"
		aria-invalid={$errors.username ? true : undefined}
		bind:value={$form.username}
		{...$constraints.username}
	/>
	{#if $errors.username}<span>{$errors.username}</span>{/if}

	<br />

	<label for="password">Password</label>
	<input
		type="password"
		name="password"
		id="password"
		aria-invalid={$errors.password ? true : undefined}
		bind:value={$form.password}
		{...$constraints.password}
	/>
	{#if $errors.password}<span>{$errors.password}</span>{/if}

	<br />

	<button>Create account</button>
	{#if $message}<p>{$message}</p>{/if}
</form>

<a href="/login">Log in</a>
