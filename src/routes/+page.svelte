<script>
	let { data } = $props();
</script>

<svelte:head>
	<title>GOONOLOGY -by s2 (2010 batch)</title>
</svelte:head>

<main>
	<div class="hero">
		<h1>GOONOLOGY</h1>
		<p class="subtitle">by s2 (2010 batch)</p>

		<div class="links">
			<a href="/login" class="btn">Login</a>
			<a href="/dashboard" class="btn">Dashboard</a>
		</div>
	</div>
</main>

<style>
	main {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	}

	.hero {
		text-align: center;
		padding: 2rem;
	}

	h1 {
		font-size: 4rem;
		font-weight: 700;
		color: #00ff88;
		text-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
		margin-bottom: 0.5rem;
		letter-spacing: 4px;
	}

	.subtitle {
		font-size: 1.5rem;
		color: #888;
		margin-bottom: 3rem;
	}

	.links {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	.btn {
		padding: 1rem 2.5rem;
		background: transparent;
		border: 2px solid #00ff88;
		color: #00ff88;
		text-decoration: none;
		font-size: 1rem;
		font-weight: 600;
		transition: all 0.3s ease;
		border-radius: 4px;
	}

	.btn:hover {
		background: #00ff88;
		color: #0a0a0a;
		box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
	}
</style>