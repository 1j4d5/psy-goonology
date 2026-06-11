<script>
	let { data } = $props();
</script>

<svelte:head>
	<title>Dashboard - GOONOLOGY</title>
</svelte:head>

<div class="dashboard">
	<div class="header">
		<h1>Dashboard</h1>
		<div class="glow"></div>
	</div>

	<div class="user-card">
		<div class="avatar">
			{data.user.username.charAt(0).toUpperCase()}
		</div>
		<div class="user-details">
			<h2>{data.user.username}</h2>
			<span class="role-badge {data.user.role}">{data.user.role}</span>
		</div>
	</div>

	<div class="stats">
		<div class="stat-box">
			<span class="stat-value">01</span>
			<span class="stat-label">Status</span>
		</div>
		<div class="stat-box">
			<span class="stat-value">{data.user.role === 'admin' ? '★' : '○'}</span>
			<span class="stat-label">Access</span>
		</div>
	</div>

	<div class="actions">
		<form method="POST" action="/dashboard?/logout">
			<button type="submit" class="btn-logout">
				<span class="btn-text">Logout</span>
				<span class="btn-glitch"></span>
			</button>
		</form>
	</div>
</div>

<style>
	.dashboard {
		padding: 2rem;
		max-width: 480px;
		margin: 0 auto;
	}

	.header {
		position: relative;
		margin-bottom: 2.5rem;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 800;
		color: #fff;
		letter-spacing: 6px;
		text-transform: uppercase;
		position: relative;
		z-index: 1;
	}

	.glow {
		position: absolute;
		bottom: -10px;
		left: 0;
		width: 120px;
		height: 4px;
		background: linear-gradient(90deg, #00ff88, transparent);
		box-shadow: 0 0 20px #00ff88;
	}

	.user-card {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%);
		padding: 1.5rem;
		border-radius: 8px;
		border: 1px solid #2a2a4a;
		margin-bottom: 1.5rem;
	}

	.avatar {
		width: 64px;
		height: 64px;
		background: linear-gradient(135deg, #00ff88, #00cc6a);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.75rem;
		font-weight: 700;
		color: #0a0a0a;
		box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
	}

	.user-details h2 {
		color: #fff;
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
	}

	.role-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 2px;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 2px;
		text-transform: uppercase;
	}

	.role-badge.admin {
		background: #ff3366;
		color: #fff;
		box-shadow: 0 0 10px rgba(255, 51, 102, 0.5);
	}

	.role-badge.mod {
		background: #ffd93d;
		color: #0a0a0a;
		box-shadow: 0 0 10px rgba(255, 217, 61, 0.5);
	}

	.role-badge.member {
		background: #00ff88;
		color: #0a0a0a;
		box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
	}

	.stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-box {
		background: #0a0a0f;
		padding: 1.25rem;
		border-radius: 4px;
		border: 1px solid #222;
		text-align: center;
	}

	.stat-value {
		display: block;
		font-size: 1.75rem;
		font-weight: 700;
		color: #00ff88;
		margin-bottom: 0.25rem;
	}

	.stat-label {
		font-size: 0.7rem;
		color: #666;
		letter-spacing: 2px;
		text-transform: uppercase;
	}

	.actions {
		display: flex;
		justify-content: center;
	}

	.btn-logout {
		position: relative;
		padding: 1rem 2.5rem;
		background: transparent;
		border: 1px solid #ff3366;
		color: #ff3366;
		font-size: 0.9rem;
		font-weight: 600;
		letter-spacing: 3px;
		text-transform: uppercase;
		cursor: pointer;
		overflow: hidden;
		transition: all 0.3s ease;
	}

	.btn-logout:hover {
		background: #ff3366;
		color: #0a0a0a;
		box-shadow: 0 0 30px rgba(255, 51, 102, 0.4);
	}
</style>