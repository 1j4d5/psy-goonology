<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let categorySlug = $derived($page.params.categorySlug);
	let itemId = $derived($page.params.itemId);

	let item = $state(null);
	let category = $state(null);
	let criteria = $state([]);
	let criterionStats = $state({});
	let overallAverage = $state(0);
	let totalVotes = $state(0);
	let loading = $state(true);
	let error = $state('');

	// User ratings
	let userId = $state('');
	let userRatings: Record<number, number> = $state({});
	let submitting = $state(false);

	onMount(() => {
		// Generate or get user ID
		let stored = localStorage.getItem('goonology_user_id');
		if (!stored) {
			stored = 'user_' + Math.random().toString(36).substring(2, 15);
			localStorage.setItem('goonology_user_id', stored);
		}
		userId = stored;

		loadItem();
	});

	async function loadItem() {
		loading = true;
		error = '';
		try {
			const res = await fetch(`/api/items/${itemId}`);
			if (res.ok) {
				const data = await res.json();
				item = data.item;
				category = data.category;
				criteria = data.criteria;
				criterionStats = data.criterionStats;
				overallAverage = data.overallAverage;
				totalVotes = data.totalVotes;

				// Get user's existing ratings
				for (const rating of data.ratings) {
					if (rating.userId === userId) {
						userRatings[rating.criterionId] = rating.score;
					}
				}
			} else {
				const data = await res.json();
				error = data.error || 'Failed to load item';
			}
		} catch (e) {
			error = 'Failed to load item';
		} finally {
			loading = false;
		}
	}

	async function handleRate(criterionId: number, score: number) {
		userRatings[criterionId] = score;
		submitting = true;

		try {
			await fetch('/api/ratings', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId,
					itemId: parseInt(itemId),
					criterionId,
					score
				})
			});

			// Reload to get updated stats
			loadItem();
		} finally {
			submitting = false;
		}
	}
</script>

<div class="min-h-screen bg-gray-900 text-white">
	<header class="bg-gray-800 border-b border-gray-700">
		<div class="max-w-6xl mx-auto px-4 py-6">
			<a href="/{categorySlug}" class="text-gray-400 hover:text-white text-sm flex items-center gap-1">
				← Back to {category?.name || 'Category'}
			</a>
		</div>
	</header>

	<main class="max-w-4xl mx-auto px-4 py-8">
		{#if loading}
			<div class="flex justify-center py-12">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
			</div>
		{:else if error}
			<div class="bg-red-900/50 border border-red-500 rounded-lg p-4 text-red-200">
				{error}
			</div>
		{:else}
			<!-- Item Header -->
			<div class="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
				<div class="flex items-start gap-6">
					{#if item.imageUrl}
						<img src={item.imageUrl} alt={item.title} class="w-32 h-32 object-cover rounded-lg" />
					{:else}
						<div class="w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center text-5xl">
							🎮
						</div>
					{/if}
					<div class="flex-1">
						<h1 class="text-3xl font-bold">{item.title}</h1>
						{#if item.description}
							<p class="text-gray-400 mt-2">{item.description}</p>
						{/if}
						<div class="flex items-center gap-4 mt-4">
							<div>
								<span class="text-3xl font-bold text-blue-400">{overallAverage.toFixed(1)}</span>
								<span class="text-gray-500">/ 10</span>
							</div>
							<div class="text-gray-400">
								{totalVotes} vote{totalVotes !== 1 ? 's' : ''}
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Rating Form -->
			<div class="bg-gray-800 border border-gray-700 rounded-lg p-6">
				<h2 class="text-xl font-semibold mb-6">Rate This Item</h2>

				{#if criteria.length === 0}
					<p class="text-gray-400">No rating criteria defined for this category.</p>
				{:else}
					<div class="space-y-6">
						{#each criteria as criterion}
							<div class="border-b border-gray-700 pb-4 last:border-0">
								<div class="flex items-center justify-between mb-2">
									<div>
										<h3 class="font-medium">{criterion.name}</h3>
										{#if criterion.description}
											<p class="text-sm text-gray-400">{criterion.description}</p>
										{/if}
									</div>
									<div class="text-right">
										{#if criterionStats[criterion.id]}
											<span class="text-lg font-bold text-blue-400">
												{criterionStats[criterion.id].avg.toFixed(1)}
											</span>
											<span class="text-sm text-gray-500">
												({criterionStats[criterion.id].count} votes)
											</span>
										{:else}
											<span class="text-gray-500">No votes</span>
										{/if}
									</div>
								</div>

								<!-- Rating Input -->
								<div class="flex items-center gap-2">
									{#each Array(criterion.maxScore - criterion.minScore + 1) as _, i}
										{@const score = criterion.minScore + i}
										<button
											onclick={() => handleRate(criterion.id, score)}
											disabled={submitting}
											class="w-10 h-10 rounded-lg font-medium transition-all {
												userRatings[criterion.id] === score
													? 'bg-blue-600 text-white'
													: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
											}"
										>
											{score}
										</button>
									{/each}
								</div>

								{#if userRatings[criterion.id]}
									<p class="text-sm text-green-400 mt-2">✓ You rated: {userRatings[criterion.id]}</p>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</main>
</div>