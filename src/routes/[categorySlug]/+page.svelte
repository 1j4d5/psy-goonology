<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let categorySlug = $derived($page.params.categorySlug);

	let category = $state(null);
	let criteria = $state([]);
	let items = $state([]);
	let loading = $state(true);
	let error = $state('');

	// Form state
	let showSubmitForm = $state(false);
	let submitTitle = $state('');
	let submitDescription = $state('');
	let submitImageUrl = $state('');
	let submitUsername = $state('');
	let submitting = $state(false);

	let activeTab = $state('items'); // 'items' or 'leaderboard'

	onMount(() => {
		loadCategory();
	});

	async function loadCategory() {
		loading = true;
		error = '';
		try {
			const res = await fetch(`/api/items?categorySlug=${categorySlug}`);
			if (res.ok) {
				const data = await res.json();
				category = data.category;
				criteria = data.criteria;
				items = data.items;
			} else {
				const data = await res.json();
				error = data.error || 'Failed to load category';
			}
		} catch (e) {
			error = 'Failed to load category';
		} finally {
			loading = false;
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!submitTitle.trim()) return;

		submitting = true;
		try {
			const res = await fetch('/api/items', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					categoryId: category.id,
					title: submitTitle,
					description: submitDescription || null,
					imageUrl: submitImageUrl || null,
					submittedBy: submitUsername || null
				})
			});

			if (res.ok) {
				showSubmitForm = false;
				submitTitle = '';
				submitDescription = '';
				submitImageUrl = '';
				loadCategory();
			}
		} finally {
			submitting = false;
		}
	}
</script>

<div class="min-h-screen bg-gray-900 text-white">
	<header class="bg-gray-800 border-b border-gray-700">
		<div class="max-w-6xl mx-auto px-4 py-6">
			<a href="/" class="text-gray-400 hover:text-white text-sm flex items-center gap-1">
				← Back to Categories
			</a>
			<div class="flex items-center gap-3 mt-4">
				{#if category?.icon}
					<span class="text-4xl">{category.icon}</span>
				{:else}
					<span class="text-4xl">📊</span>
				{/if}
				<div>
					<h1 class="text-3xl font-bold">{category?.name || 'Loading...'}</h1>
					{#if category?.description}
						<p class="text-gray-400 mt-1">{category.description}</p>
					{/if}
				</div>
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
		{:else if criteria.length === 0}
			<div class="text-center py-12">
				<p class="text-gray-400 text-lg">No criteria defined for this category.</p>
				<p class="text-gray-500 mt-2">Ask an admin to add rating criteria!</p>
			</div>
		{:else}
			<!-- Tabs -->
			<div class="flex gap-4 border-b border-gray-700 mb-6">
				<button
					class="px-4 py-2 font-medium transition-colors {activeTab === 'items' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}"
					onclick={() => activeTab = 'items'}
				>
					All Items
				</button>
				<button
					class="px-4 py-2 font-medium transition-colors {activeTab === 'leaderboard' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}"
					onclick={() => activeTab = 'leaderboard'}
				>
					Leaderboard
				</button>
			</div>

			<!-- Submit Button -->
			<div class="mb-6">
				<button
					onclick={() => showSubmitForm = !showSubmitForm}
					class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition-colors"
				>
					{showSubmitForm ? 'Cancel' : '+ Submit Item'}
				</button>
			</div>

			<!-- Submit Form -->
			{#if showSubmitForm}
				<form onsubmit={handleSubmit} class="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
					<h3 class="text-lg font-semibold mb-4">Submit New Item</h3>
					<div class="grid gap-4">
						<div>
							<label class="block text-sm text-gray-400 mb-1">Title *</label>
							<input
								type="text"
								bind:value={submitTitle}
								required
								class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
								placeholder="e.g., Attack on Titan"
							/>
						</div>
						<div>
							<label class="block text-sm text-gray-400 mb-1">Description</label>
							<textarea
								bind:value={submitDescription}
								class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
								rows="3"
								placeholder="Optional description..."
							></textarea>
						</div>
						<div>
							<label class="block text-sm text-gray-400 mb-1">Image URL</label>
							<input
								type="url"
								bind:value={submitImageUrl}
								class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
								placeholder="https://..."
							/>
						</div>
						<div>
							<label class="block text-sm text-gray-400 mb-1">Your Name (optional)</label>
							<input
								type="text"
								bind:value={submitUsername}
								class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
								placeholder="Anonymous"
							/>
						</div>
						<button
							type="submit"
							disabled={submitting}
							class="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 px-4 py-2 rounded-lg font-medium transition-colors"
						>
							{submitting ? 'Submitting...' : 'Submit'}
						</button>
					</div>
				</form>
			{/if}

			<!-- Items List -->
			{#if activeTab === 'items'}
				{#if items.length === 0}
					<div class="text-center py-12">
						<p class="text-gray-400 text-lg">No items yet.</p>
						<p class="text-gray-500 mt-2">Be the first to submit something!</p>
					</div>
				{:else}
					<div class="grid gap-4">
						{#each items as item}
							<a
								href="/{categorySlug}/{item.id}"
								class="block bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 rounded-lg p-4 transition-all"
							>
								<div class="flex items-center gap-4">
									{#if item.imageUrl}
										<img src={item.imageUrl} alt={item.title} class="w-16 h-16 object-cover rounded-lg" />
									{:else}
										<div class="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
											🎮
										</div>
									{/if}
									<div class="flex-1">
										<div class="flex items-center gap-2">
											{#if item.rank}
												<span class="text-lg font-bold text-gray-500">#{item.rank}</span>
											{/if}
											<h3 class="text-lg font-semibold">{item.title}</h3>
										</div>
										{#if item.description}
											<p class="text-gray-400 text-sm mt-1 line-clamp-1">{item.description}</p>
										{/if}
									</div>
									<div class="text-right">
										<div class="text-2xl font-bold text-blue-400">
											{item.overallAverage.toFixed(1)}
										</div>
										<div class="text-sm text-gray-500">
											{item.totalVotes} vote{item.totalVotes !== 1 ? 's' : ''}
										</div>
									</div>
								</div>
							</a>
						{/each}
					</div>
				{/if}
			{/if}

			<!-- Leaderboard -->
			{#if activeTab === 'leaderboard'}
				{#if items.filter(i => i.totalVotes > 0).length === 0}
					<div class="text-center py-12">
						<p class="text-gray-400 text-lg">No votes yet.</p>
						<p class="text-gray-500 mt-2">Rate some items to see the leaderboard!</p>
					</div>
				{:else}
					<div class="space-y-3">
						{#each items.filter(i => i.totalVotes > 0) as item}
							<div class="flex items-center gap-4 bg-gray-800 border border-gray-700 rounded-lg p-4">
								<div class="text-3xl font-bold w-12 text-center {
									item.rank === 1 ? 'text-yellow-400' :
									item.rank === 2 ? 'text-gray-300' :
									item.rank === 3 ? 'text-amber-600' : 'text-gray-500'
								}">
									#{item.rank}
								</div>
								{#if item.imageUrl}
									<img src={item.imageUrl} alt={item.title} class="w-12 h-12 object-cover rounded" />
								{/if}
								<div class="flex-1">
									<h3 class="font-semibold">{item.title}</h3>
									<p class="text-sm text-gray-400">{item.totalVotes} vote{item.totalVotes !== 1 ? 's' : ''}</p>
								</div>
								<div class="text-2xl font-bold text-blue-400">
									{item.overallAverage.toFixed(1)}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			{/if}
		{/if}
	</main>
</div>