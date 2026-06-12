<script lang="ts">
	import { onMount } from 'svelte';

	let categories = $state([]);
	let loading = $state(true);
	let error = $state('');

	onMount(async () => {
		try {
			const res = await fetch('/api/categories');
			if (res.ok) {
				categories = await res.json();
			} else {
				error = 'Failed to load categories';
			}
		} catch (e) {
			error = 'Failed to load categories';
		} finally {
			loading = false;
		}
	});
</script>

<div class="min-h-screen bg-gray-900 text-white">
	<header class="bg-gray-800 border-b border-gray-700">
		<div class="max-w-6xl mx-auto px-4 py-6">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold">Goonology</h1>
					<p class="text-gray-400 mt-2">Rate and rank anything</p>
				</div>
				<a href="/admin" class="text-gray-400 hover:text-white text-sm">Admin →</a>
			</div>
		</div>
	</header>

	<main class="max-w-6xl mx-auto px-4 py-8">
		{#if loading}
			<div class="flex justify-center py-12">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
			</div>
		{:else if error}
			<div class="bg-red-900/50 border border-red-500 rounded-lg p-4 text-red-200">
				{error}
			</div>
		{:else if categories.length === 0}
			<div class="text-center py-12">
				<p class="text-gray-400 text-lg">No categories yet.</p>
				<p class="text-gray-500 mt-2">Create a category to get started!</p>
			</div>
		{:else}
			<h2 class="text-xl font-semibold mb-6">Browse Categories</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each categories as category}
					<a
						href="/{category.slug}"
						class="block bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 rounded-lg p-6 transition-all"
					>
						<div class="flex items-center gap-3">
							{#if category.icon}
								<span class="text-3xl">{category.icon}</span>
							{:else}
								<span class="text-3xl">📊</span>
							{/if}
							<div>
								<h3 class="text-lg font-semibold">{category.name}</h3>
								{#if category.description}
									<p class="text-gray-400 text-sm mt-1 line-clamp-2">{category.description}</p>
								{/if}
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</main>
</div>