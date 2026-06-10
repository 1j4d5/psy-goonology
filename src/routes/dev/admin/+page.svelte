<script>
	let { form } = $props();
</script>

<svelte:head>
	<title>Admin - Create User</title>
</svelte:head>

<main>
	<div class="admin-box">
		<h1>Create User</h1>
		<p class="subtitle">Admin Panel</p>

		{#if form?.error}
			<div class="error">{form.error}</div>
		{/if}

		{#if form?.success}
			<div class="success">
				User <strong>{form.user.username}</strong> created with role <strong>{form.user.role}</strong>
			</div>
		{/if}

		<form method="POST">
			<div class="field">
				<label for="username">Username</label>
				<input type="text" id="username" name="username" required />
			</div>

			<div class="field">
				<label for="password">Password</label>
				<input type="password" id="password" name="password" required />
			</div>

			<div class="field">
				<label for="role">Role</label>
				<select id="role" name="role" required>
					<option value="member">Member</option>
					<option value="mod">Moderator</option>
					<option value="admin">Admin</option>
				</select>
			</div>

			<button type="submit">Create User</button>
		</form>

		<a href="/" class="back">← Back to Home</a>
	</div>
</main>

<style>
	main {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
		padding: 1rem;
	}

	.admin-box {
		background: #1a1a2e;
		padding: 2.5rem;
		border-radius: 8px;
		border: 1px solid #333;
		width: 100%;
		max-width: 400px;
	}

	h1 {
		text-align: center;
		color: #00ff88;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		text-align: center;
		color: #666;
		margin-bottom: 2rem;
	}

	.error {
		background: #ff3333;
		color: #fff;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.success {
		background: #00ff88;
		color: #0a0a0a;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.field {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		color: #aaa;
	}

	input, select {
		width: 100%;
		padding: 0.75rem;
		background: #0a0a0a;
		border: 1px solid #333;
		border-radius: 4px;
		color: #fff;
		font-size: 1rem;
	}

	input:focus, select:focus {
		outline: none;
		border-color: #00ff88;
	}

	select {
		cursor: pointer;
	}

	button {
		width: 100%;
		padding: 0.75rem;
		background: #00ff88;
		border: none;
		border-radius: 4px;
		color: #0a0a0a;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	button:hover {
		background: #00cc6a;
		box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
	}

	.back {
		display: block;
		text-align: center;
		margin-top: 1.5rem;
		color: #666;
		text-decoration: none;
	}

	.back:hover {
		color: #00ff88;
	}
</style>