<script>
	let { data } = $props();
</script>

<svelte:head>
	<title>Dashboard - GOONOLOGY</title>
</svelte:head>

<main>
	<div class="dashboard">
		<h1>Dashboard</h1>

		<div class="user-info">
			<p>Welcome, <strong>{data.user.username}</strong></p>
			<p class="role">Role: <span class="{data.user.role}">{data.user.role}</span></p>
		</div>

		<form method="POST" action="?/logout">
			<button type="submit" class="logout">Logout</button>
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

	.dashboard {
		background: #1a1a2e;
		padding: 2.5rem;
		border-radius: 8px;
		border: 1px solid #333;
		width: 100%;
		max-width: 400px;
		text-align: center;
	}

	h1 {
		color: #00ff88;
		margin-bottom: 2rem;
	}

	.user-info {
		background: #0a0a0a;
		padding: 1.5rem;
		border-radius: 4px;
		margin-bottom: 2rem;
	}

	.user-info p {
		margin-bottom: 0.5rem;
		color: #aaa;
	}

	.user-info strong {
		color: #fff;
		font-size: 1.2rem;
	}

	.role {
		font-size: 0.9rem;
	}

	.role span {
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
		font-weight: 600;
		text-transform: uppercase;
	}

	.role span.admin {
		background: #ff6b6b;
		color: #0a0a0a;
	}

	.role span.mod {
		background: #ffd93d;
		color: #0a0a0a;
	}

	.role span.member {
		background: #6bcb77;
		color: #0a0a0a;
	}

	.logout {
		padding: 0.75rem 2rem;
		background: transparent;
		border: 2px solid #ff6b6b;
		border-radius: 4px;
		color: #ff6b6b;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.logout:hover {
		background: #ff6b6b;
		color: #0a0a0a;
	}

	.back {
		display: block;
		margin-top: 1.5rem;
		color: #666;
		text-decoration: none;
	}

	.back:hover {
		color: #00ff88;
	}
</style>