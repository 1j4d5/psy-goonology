<script lang="ts">
	import { onMount } from 'svelte';

	// Categories state
	let categories = $state([]);
	let loadingCategories = $state(true);

	// Category form
	let showCategoryForm = $state(false);
	let editingCategory = $state(null);
	let categoryName = $state('');
	let categoryDescription = $state('');
	let categoryIcon = $state('');
	let categoryActive = $state(true);
	let savingCategory = $state(false);

	// Criteria form
	let selectedCategory = $state<number | null>(null);
	let criteria = $state([]);
	let loadingCriteria = $state(false);
	let showCriteriaForm = $state(false);
	let editingCriterion = $state(null);
	let criterionName = $state('');
	let criterionDescription = $state('');
	let criterionWeight = $state(1);
	let criterionMinScore = $state(1);
	let criterionMaxScore = $state(10);
	let criterionSortOrder = $state(0);
	let savingCriterion = $state(false);

	onMount(() => {
		loadCategories();
	});

	async function loadCategories() {
		loadingCategories = true;
		try {
			const res = await fetch('/api/categories');
			if (res.ok) {
				categories = await res.json();
			}
		} finally {
			loadingCategories = false;
		}
	}

	async function loadCriteria(categoryId: number) {
		loadingCriteria = true;
		selectedCategory = categoryId;
		try {
			const res = await fetch(`/api/criteria?categoryId=${categoryId}`);
			if (res.ok) {
				criteria = await res.json();
			}
		} finally {
			loadingCriteria = false;
		}
	}

	function openCategoryForm(category?: typeof categories[0]) {
		editingCategory = category || null;
		categoryName = category?.name || '';
		categoryDescription = category?.description || '';
		categoryIcon = category?.icon || '';
		categoryActive = category?.isActive ?? true;
		showCategoryForm = true;
	}

	function closeCategoryForm() {
		showCategoryForm = false;
		editingCategory = null;
	}

	async function saveCategory(e: Event) {
		e.preventDefault();
		if (!categoryName.trim()) return;

		savingCategory = true;
		try {
			if (editingCategory) {
				await fetch(`/api/categories/${editingCategory.id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: categoryName,
						description: categoryDescription || null,
						icon: categoryIcon || null,
						isActive: categoryActive
					})
				});
			} else {
				await fetch('/api/categories', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: categoryName,
						description: categoryDescription || null,
						icon: categoryIcon || null,
						isActive: categoryActive
					})
				});
			}
			closeCategoryForm();
			loadCategories();
		} finally {
			savingCategory = false;
		}
	}

	async function deleteCategory(id: number) {
		if (!confirm('Delete this category and all its items/ratings?')) return;
		await fetch(`/api/categories/${id}`, { method: 'DELETE' });
		loadCategories();
		if (selectedCategory === id) {
			selectedCategory = null;
			criteria = [];
		}
	}

	function openCriterionForm(criterion?: typeof criteria[0]) {
		editingCriterion = criterion || null;
		criterionName = criterion?.name || '';
		criterionDescription = criterion?.description || '';
		criterionWeight = criterion?.weight || 1;
		criterionMinScore = criterion?.minScore || 1;
		criterionMaxScore = criterion?.maxScore || 10;
		criterionSortOrder = criterion?.sortOrder || 0;
		showCriteriaForm = true;
	}

	function closeCriterionForm() {
		showCriteriaForm = false;
		editingCriterion = null;
	}

	async function saveCriterion(e: Event) {
		e.preventDefault();
		if (!criterionName.trim() || !selectedCategory) return;

		savingCriterion = true;
		try {
			if (editingCriterion) {
				await fetch(`/api/criteria/${editingCriterion.id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: criterionName,
						description: criterionDescription || null,
						weight: criterionWeight,
						minScore: criterionMinScore,
						maxScore: criterionMaxScore,
						sortOrder: criterionSortOrder
					})
				});
			} else {
				await fetch('/api/criteria', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						categoryId: selectedCategory,
						name: criterionName,
						description: criterionDescription || null,
						weight: criterionWeight,
						minScore: criterionMinScore,
						maxScore: criterionMaxScore,
						sortOrder: criterionSortOrder
					})
				});
			}
			closeCriterionForm();
			loadCriteria(selectedCategory);
		} finally {
			savingCriterion = false;
		}
	}

	async function deleteCriterion(id: number) {
		if (!confirm('Delete this criterion?')) return;
		await fetch(`/api/criteria/${id}`, { method: 'DELETE' });
		if (selectedCategory) {
			loadCriteria(selectedCategory);
		}
	}
</script>

<div class="min-h-screen bg-gray-900 text-white">
	<header class="bg-gray-800 border-b border-gray-700">
		<div class="max-w-6xl mx-auto px-4 py-6">
			<a href="/" class="text-gray-400 hover:text-white text-sm flex items-center gap-1">
				← Back to Home
			</a>
			<h1 class="text-3xl font-bold mt-4">Admin Dashboard</h1>
			<p class="text-gray-400 mt-2">Manage categories and rating criteria</p>
		</div>
	</header>

	<main class="max-w-6xl mx-auto px-4 py-8">
		<!-- Categories Section -->
		<section class="mb-12">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-semibold">Categories</h2>
				<button
					onclick={() => openCategoryForm()}
					class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition-colors"
				>
					+ New Category
				</button>
			</div>

			{#if loadingCategories}
				<div class="flex justify-center py-8">
					<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
				</div>
			{:else if categories.length === 0}
				<p class="text-gray-400">No categories yet.</p>
			{:else}
				<div class="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
					<table class="w-full">
						<thead class="bg-gray-700">
							<tr>
								<th class="px-4 py-3 text-left">Name</th>
								<th class="px-4 py-3 text-left">Slug</th>
								<th class="px-4 py-3 text-left">Status</th>
								<th class="px-4 py-3 text-right">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each categories as cat}
								<tr class="border-t border-gray-700">
									<td class="px-4 py-3">
										<button
											onclick={() => loadCriteria(cat.id)}
											class="text-blue-400 hover:text-blue-300 font-medium"
										>
											{cat.icon} {cat.name}
										</button>
									</td>
									<td class="px-4 py-3 text-gray-400 font-mono text-sm">{cat.slug}</td>
									<td class="px-4 py-3">
										<span class="px-2 py-1 rounded text-xs font-medium {cat.isActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}">
											{cat.isActive ? 'Active' : 'Inactive'}
										</span>
									</td>
									<td class="px-4 py-3 text-right">
										<button
											onclick={() => openCategoryForm(cat)}
											class="text-blue-400 hover:text-blue-300 mr-3"
										>
											Edit
										</button>
										<button
											onclick={() => deleteCategory(cat.id)}
											class="text-red-400 hover:text-red-300"
										>
											Delete
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</section>

		<!-- Category Form Modal -->
		{#if showCategoryForm}
			<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
				<div class="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md">
					<h3 class="text-xl font-semibold mb-4">
						{editingCategory ? 'Edit Category' : 'New Category'}
					</h3>
					<form onsubmit={saveCategory} class="space-y-4">
						<div>
							<label class="block text-sm text-gray-400 mb-1">Name *</label>
							<input
								type="text"
								bind:value={categoryName}
								required
								class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
							/>
						</div>
						<div>
							<label class="block text-sm text-gray-400 mb-1">Description</label>
							<textarea
								bind:value={categoryDescription}
								class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
								rows="3"
							></textarea>
						</div>
						<div>
							<label class="block text-sm text-gray-400 mb-1">Icon (emoji)</label>
							<input
								type="text"
								bind:value={categoryIcon}
								class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
								placeholder="🎮"
							/>
						</div>
						<div class="flex items-center gap-2">
							<input
								type="checkbox"
								id="active"
								bind:checked={categoryActive}
								class="rounded bg-gray-700 border-gray-600"
							/>
							<label for="active" class="text-sm">Active</label>
						</div>
						<div class="flex gap-3 pt-2">
							<button
								type="button"
								onclick={closeCategoryForm}
								class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={savingCategory}
								class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 rounded-lg transition-colors"
							>
								{savingCategory ? 'Saving...' : 'Save'}
							</button>
						</div>
					</form>
				</div>
			</div>
		{/if}

		<!-- Criteria Section -->
		<section>
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-semibold">
					Criteria
					{#if selectedCategory}
						<span class="text-gray-400 font-normal">
							- {categories.find(c => c.id === selectedCategory)?.name}
						</span>
					{/if}
				</h2>
				{#if selectedCategory}
					<button
						onclick={() => openCriterionForm()}
						class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition-colors"
					>
						+ New Criterion
					</button>
				{/if}
			</div>

			{#if !selectedCategory}
				<p class="text-gray-400">Select a category above to manage its criteria.</p>
			{:else if loadingCriteria}
				<div class="flex justify-center py-8">
					<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
				</div>
			{:else if criteria.length === 0}
				<p class="text-gray-400">No criteria for this category yet.</p>
			{:else}
				<div class="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
					<table class="w-full">
						<thead class="bg-gray-700">
							<tr>
								<th class="px-4 py-3 text-left">Order</th>
								<th class="px-4 py-3 text-left">Name</th>
								<th class="px-4 py-3 text-left">Weight</th>
								<th class="px-4 py-3 text-left">Score Range</th>
								<th class="px-4 py-3 text-right">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each criteria.sort((a, b) => a.sortOrder - b.sortOrder) as criterion}
								<tr class="border-t border-gray-700">
									<td class="px-4 py-3 text-gray-400">{criterion.sortOrder}</td>
									<td class="px-4 py-3 font-medium">{criterion.name}</td>
									<td class="px-4 py-3 text-gray-400">{criterion.weight}</td>
									<td class="px-4 py-3 text-gray-400">{criterion.minScore} - {criterion.maxScore}</td>
									<td class="px-4 py-3 text-right">
										<button
											onclick={() => openCriterionForm(criterion)}
											class="text-blue-400 hover:text-blue-300 mr-3"
										>
											Edit
										</button>
										<button
											onclick={() => deleteCriterion(criterion.id)}
											class="text-red-400 hover:text-red-300"
										>
											Delete
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</section>

		<!-- Criterion Form Modal -->
		{#if showCriteriaForm}
			<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
				<div class="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md">
					<h3 class="text-xl font-semibold mb-4">
						{editingCriterion ? 'Edit Criterion' : 'New Criterion'}
					</h3>
					<form onsubmit={saveCriterion} class="space-y-4">
						<div>
							<label class="block text-sm text-gray-400 mb-1">Name *</label>
							<input
								type="text"
								bind:value={criterionName}
								required
								class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
							/>
						</div>
						<div>
							<label class="block text-sm text-gray-400 mb-1">Description</label>
							<textarea
								bind:value={criterionDescription}
								class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
								rows="2"
							></textarea>
						</div>
						<div class="grid grid-cols-3 gap-4">
							<div>
								<label class="block text-sm text-gray-400 mb-1">Weight</label>
								<input
									type="number"
									bind:value={criterionWeight}
									min="1"
									class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
								/>
							</div>
							<div>
								<label class="block text-sm text-gray-400 mb-1">Min Score</label>
								<input
									type="number"
									bind:value={criterionMinScore}
									min="0"
									class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
								/>
							</div>
							<div>
								<label class="block text-sm text-gray-400 mb-1">Max Score</label>
								<input
									type="number"
									bind:value={criterionMaxScore}
									min="1"
									class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
								/>
							</div>
						</div>
						<div>
							<label class="block text-sm text-gray-400 mb-1">Sort Order</label>
							<input
								type="number"
								bind:value={criterionSortOrder}
								class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
							/>
						</div>
						<div class="flex gap-3 pt-2">
							<button
								type="button"
								onclick={closeCriterionForm}
								class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={savingCriterion}
								class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 rounded-lg transition-colors"
							>
								{savingCriterion ? 'Saving...' : 'Save'}
							</button>
						</div>
					</form>
				</div>
			</div>
		{/if}
	</main>
</div>