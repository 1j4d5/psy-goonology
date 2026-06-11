<script>
	import { page } from '$app/stores';
	let { children, data } = $props();

	let sidebarOpen = $state(false);

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function closeSidebar() {
		sidebarOpen = false;
	}

	const navItems = $derived([
		{ href: '/dashboard', label: 'Dashboard' },
		{ href: '/account/manage', label: 'Manage Account' },
		{ href: '/a/rate', label: 'Rate' },
		{ href: '/a/theories', label: 'Theories' },
		...(data.user?.role === 'admin' ? [{ href: '/dev/admin', label: 'Admin' }] : [])
	]);

	// Only show sidebar on protected routes (not landing page)
	let showSidebar = $derived($page.url.pathname !== '/');
</script>

<svelte:head>
	<title>GOONOLOGY</title>
</svelte:head>

<div class="app" class:no-sidebar={!showSidebar}>
	{#if showSidebar}
		<button class="menu-toggle" onclick={toggleSidebar}>
			<span class="bar"></span>
			<span class="bar"></span>
			<span class="bar"></span>
		</button>

		<nav class="sidebar" class:open={sidebarOpen}>
			<button class="close-btn" onclick={closeSidebar}>&times;</button>
			<ul>
				{#each navItems as item}
					<li>
						<a
							href={item.href}
							class:active={$page.url.pathname === item.href}
							onclick={closeSidebar}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
			{#if data.user}
				<form method="POST" action="/dashboard?/logout">
					<button type="submit" class="logout-btn">Logout</button>
				</form>
			{/if}
		</nav>

		{#if sidebarOpen}
			<div class="overlay" onclick={closeSidebar}></div>
		{/if}
	{/if}

	<main>
		{@render children()}
	</main>
</div>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		background: #0a0a0a;
		color: #fff;
		min-height: 100vh;
	}

	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.app.no-sidebar main {
		margin-left: 0;
		padding: 0;
	}

	.menu-toggle {
		display: none;
		position: fixed;
		top: 1rem;
		left: 1rem;
		z-index: 1001;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
	}

	.bar {
		display: block;
		width: 25px;
		height: 3px;
		background: #00ff88;
		margin: 5px 0;
		transition: 0.3s;
	}

	.sidebar {
		position: fixed;
		left: 0;
		top: 0;
		height: 100vh;
		width: 250px;
		background: #1a1a2e;
		padding: 2rem 1rem;
		transform: translateX(-100%);
		transition: transform 0.3s ease;
		z-index: 1002;
	}

	.sidebar.open {
		transform: translateX(0);
	}

	.close-btn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: transparent;
		border: none;
		color: #fff;
		font-size: 2rem;
		cursor: pointer;
	}

	.sidebar ul {
		list-style: none;
		margin-top: 3rem;
	}

	.sidebar li {
		margin-bottom: 0.5rem;
	}

	.sidebar a {
		display: block;
		padding: 0.75rem 1rem;
		color: #888;
		text-decoration: none;
		border-radius: 4px;
		transition: all 0.2s;
	}

	.sidebar a:hover,
	.sidebar a.active {
		background: rgba(0, 255, 136, 0.1);
		color: #00ff88;
	}

	.logout-btn {
		position: absolute;
		bottom: 2rem;
		left: 1rem;
		right: 1rem;
		padding: 0.75rem;
		background: transparent;
		border: 2px solid #ff4444;
		color: #ff4444;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.logout-btn:hover {
		background: #ff4444;
		color: #0a0a0a;
	}

	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 1001;
	}

	main {
		flex: 1;
		padding: 1rem;
		padding-top: 4rem;
	}

	@media (min-width: 769px) {
		.menu-toggle {
			display: none;
		}

		.sidebar {
			transform: translateX(0);
			width: 200px;
			padding-top: 4rem;
		}

		.close-btn {
			display: none;
		}

		.overlay {
			display: none;
		}

		main {
			margin-left: 200px;
			padding: 2rem;
			padding-top: 2rem;
		}
	}

	@media (max-width: 768px) {
		.menu-toggle {
			display: block;
		}

		main {
			padding-top: 4rem;
		}
	}
</style>