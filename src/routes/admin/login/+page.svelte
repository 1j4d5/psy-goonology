<script>
	let { form } = $props();
</script>

<svelte:head>
	<title>Admin Login - GOONOLOGY</title>
</svelte:head>

<main>
	<div class="login-box">
		<h1>Admin Login</h1>
		<p class="subtitle">Restricted Access</p>

		{#if form?.error}
			<div class="error">{form.error}</div>
		{/if}

		<form method="POST">
			<div class="field">
				<label for="username">Username</label>
				<input type="text" id="username" name="username" required autocomplete="username" />
			</div>

			<div class="field">
				<label for="password">Password</label>
				<input type="password" id="password" name="password" required autocomplete="current-password" />
			</div>

			<button type="submit">Login</button>
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

	.login-box {
		background: #1a1a2e;
		padding: 2.5rem;
		border-radius: 8px;
		border: 1px solid #333;
		width: 100%;
		max-width: 400px;
	}

	h1 {
		text-align: center;
		color: #ff3366;
		margin-bottom: 0.5rem;
		letter-spacing: 2px;
	}

	.subtitle {
		text-align: center;
		color: #666;
		margin-bottom: 2rem;
		font-size: 0.9rem;
	}

	.error {
		background: #ff3333;
		color: #fff;
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

	input {
		width: 100%;
		padding: 0.75rem;
		background: #0a0a0a;
		border: 1px solid #333;
		border-radius: 4px;
		color: #fff;
		font-size: 1rem;
	}

	input:focus {
		outline: none;
		border-color: #ff3366;
	}

	button {
		width: 100%;
		padding: 0.75rem;
		background: #ff3366;
		border: none;
		border-radius: 4px;
		color: #fff;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	button:hover {
		background: #ff1a53;
		box-shadow: 0 0 20px rgba(255, 51, 102, 0.4);
	}

	.back {
		display: block;
		text-align: center;
		margin-top: 1.5rem;
		color: #666;
		text-decoration: none;
	}

	.back:hover {
		color: #ff3366;
	}
</style>