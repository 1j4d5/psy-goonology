<script>
	let { data, form } = $props();

	let showCreateCategory = $state(false);
	let showCreateItem = $state(false);
	let saving = $state(false);
	let success = $state(false);

	// Form states
	let newCategoryName = $state('');
	let newCategoryDesc = $state('');
	let newItemName = $state('');
	let newItemDesc = $state('');
	let newItemImage = $state('');
	let newItemExtra = $state('');
	let ratingScores = $state({});
	let ratingComment = $state('');

	// Placeholder example for JSON
	const jsonExample = '{"grade": "S", "year": 2019}';

	// Get rating fields from current category
	let ratingFields = $derived(data.currentCategory?.ratingFields || null);

	$effect(() => {
		if (data.currentItem && data.userRating?.scores) {
			ratingScores = { ...data.userRating.scores };
		} else if (ratingFields) {
			// Initialize with default 5 for each field
			const defaults = {};
			ratingFields.forEach(f => defaults[f] = 5);
			ratingScores = defaults;
		}
		ratingComment = data.userRating?.comment || '';
	});

	$effect(() => {
		if (form?.success) {
			success = true;
			showCreateCategory = false;
			showCreateItem = false;
			setTimeout(() => success = false, 2000);
		}
	});

	function getStars(score) {
		return '★'.repeat(Math.floor(score)) + (score % 1 >= 0.5 ? '½' : '') + '☆'.repeat(5 - Math.floor(score));
	}

	function getOverallScore() {
		const scores = Object.values(ratingScores);
		if (scores.length === 0) return 0;
		return scores.reduce((a, b) => a + b, 0) / scores.length;
	}

	function calcAvg(scores) {
		if (!scores || typeof scores !== 'object') return 0;
		const vals = Object.values(scores);
		if (vals.length === 0) return 0;
		return vals.reduce((a, b) => a + b, 0) / vals.length;
	}
</script>

<svelte:head>
	<title>Rate - GOONOLOGY</title>
</svelte:head>

<div class="rate-page">
	<div class="header">
		<h1>Rate</h1>
		<div class="glow"></div>
	</div>

	{#if success}
		<div class="success-toast">Action completed!</div>
	{/if}

	<!-- Categories View -->
	{#if !data.currentCategory}
		<div class="section-header">
			<h2>Rating Categories</h2>
			<button class="btn-add" onclick={() => showCreateCategory = !showCreateCategory}>
				{showCreateCategory ? 'Cancel' : '+ New Category'}
			</button>
		</div>

		{#if showCreateCategory}
			<form method="POST" action="?/createCategory" class="create-form" onsubmit={() => saving = true}>
				<div class="form-group">
					<label for="catName">Category Name</label>
					<input type="text" id="catName" name="name" bind:value={newCategoryName} placeholder="e.g. Roblox Games" required />
				</div>
				<div class="form-group">
					<label for="catDesc">Description</label>
					<textarea id="catDesc" name="description" bind:value={newCategoryDesc} placeholder="What should people rate in this category?"></textarea>
				</div>
				<button type="submit" class="btn-submit" disabled={saving}>
					{saving ? 'Creating...' : 'Create Category'}
				</button>
			</form>
		{/if}

		<div class="category-grid">
			{#each data.categories as cat}
				<a href="/a/rate?category={cat.slug}" class="category-card">
					<h3>{cat.name}</h3>
					{#if cat.description}
						<p>{cat.description}</p>
					{/if}
				</a>
			{:else}
				<p class="empty">No rating categories yet. Create one!</p>
			{/each}
		</div>
	{/if}

	<!-- Items View -->
	{#if data.currentCategory && !data.currentItem}
		<div class="breadcrumb">
			<a href="/a/rate">← All Categories</a>
		</div>

		<div class="section-header">
			<h2>{data.currentCategory.name}</h2>
			<button class="btn-add" onclick={() => showCreateItem = !showCreateItem}>
				{showCreateItem ? 'Cancel' : '+ Add Item'}
			</button>
		</div>

		{#if data.currentCategory.description}
			<p class="category-desc">{data.currentCategory.description}</p>
		{/if}

		{#if showCreateItem}
			<form method="POST" action="?/createItem" class="create-form" onsubmit={() => saving = true}>
				<input type="hidden" name="categoryId" value={data.currentCategory.id} />
				<div class="form-group">
					<label for="itemName">Name</label>
					<input type="text" id="itemName" name="name" bind:value={newItemName} placeholder="What are you rating?" required />
				</div>
				<div class="form-group">
					<label for="itemDesc">Description (optional)</label>
					<textarea id="itemDesc" name="description" bind:value={newItemDesc} placeholder="Details..."></textarea>
				</div>
				<div class="form-group">
					<label for="itemImage">Image URL (optional)</label>
					<input type="url" id="itemImage" name="imageUrl" bind:value={newItemImage} placeholder="https://..." />
				</div>
				<div class="form-group">
					<label for="itemExtra">Extra Data (optional)</label>
					<input type="text" id="itemExtra" name="extraFields" bind:value={newItemExtra} placeholder={jsonExample} />
					<span class="help">Enter any extra info as JSON</span>
				</div>
				<button type="submit" class="btn-submit" disabled={saving}>
					{saving ? 'Adding...' : 'Add Item'}
				</button>
			</form>
		{/if}

		<div class="item-grid">
			{#each data.items as item}
				<a href="/a/rate?category={data.currentCategory.slug}&item={item.id}" class="item-card">
					{#if item.imageUrl}
						<div class="item-image" style="background-image: url({item.imageUrl})"></div>
					{:else}
						<div class="item-image placeholder">🎮</div>
					{/if}
					<div class="item-info">
						<h3>{item.name}</h3>
						{#if item.avgScore}
							<div class="item-rating">
								<span class="score">{item.avgScore}</span>
								<span class="count">({item.ratingCount} ratings)</span>
							</div>
						{/if}
					</div>
				</a>
			{:else}
				<p class="empty">No items yet. Add something to rate!</p>
			{/each}
		</div>
	{/if}

	<!-- Single Item View -->
	{#if data.currentItem}
		<div class="breadcrumb">
			<a href="/a/rate?category={data.currentCategory.slug}">← {data.currentCategory.name}</a>
		</div>

		<div class="item-detail">
			{#if data.currentItem.imageUrl}
				<div class="detail-image" style="background-image: url({data.currentItem.imageUrl})"></div>
			{:else}
				<div class="detail-image placeholder">🎮</div>
			{/if}

			<div class="detail-info">
				<h2>{data.currentItem.name}</h2>
				{#if data.currentItem.description}
					<p class="detail-desc">{data.currentItem.description}</p>
				{/if}
				{#if data.currentItem.extraData}
					{@const extra = JSON.parse(data.currentItem.extraData)}
					<div class="extra-data">
						{#each Object.entries(extra) as [key, value]}
							<span class="extra-tag">{key}: {value}</span>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- Rating Form -->
		<div class="rating-form">
			<h3>Your Rating</h3>
			<form method="POST" action="?/rate" onsubmit={() => saving = true}>
				<input type="hidden" name="itemId" value={data.currentItem.id} />
				<input type="hidden" name="scores" value={JSON.stringify(ratingScores)} />

				{#if ratingFields && ratingFields.length > 0}
					{#each ratingFields as field}
						<div class="rating-field">
							<label for="score-{field}">{field}</label>
							<div class="rating-row">
								<input
									type="range"
									id="score-{field}"
									min="0"
									max="10"
									step="0.5"
									bind:value={ratingScores[field]}
								/>
								<span class="score-display">{ratingScores[field]}</span>
							</div>
						</div>
					{/each}
					<div class="overall-score">
						<span>Overall:</span>
						<strong>{getOverallScore().toFixed(1)}</strong>
					</div>
				{:else}
					<div class="rating-input">
						<label for="score">Score (0-10)</label>
						<input type="range" id="score" name="score" min="0" max="10" step="0.5" bind:value={ratingScores.overall} />
						<span class="score-display">{ratingScores.overall || 5}</span>
					</div>
					<div class="rating-stars">
						{getStars((ratingScores.overall || 5) / 2)}
					</div>
				{/if}

				<div class="form-group">
					<label for="comment">Comment (optional)</label>
					<textarea id="comment" name="comment" bind:value={ratingComment} placeholder="Your thoughts..." rows="3"></textarea>
				</div>
				<button type="submit" class="btn-submit" disabled={saving}>
					{saving ? 'Submitting...' : 'Submit Rating'}
				</button>
			</form>
		</div>

		<!-- Other Ratings -->
		<div class="ratings-list">
			<h3>Community Ratings ({data.itemRatings.length})</h3>
			{#each data.itemRatings as rating}
				<div class="rating-card">
					<div class="rating-header">
						<span class="rating-user">@{rating.username}</span>
						{#if typeof rating.scores === 'object' && rating.scores !== null}
							<span class="rating-score">
								{#if ratingFields && ratingFields.length > 0}
									{calcAvg(rating.scores).toFixed(1)}
								{:else}
									{rating.scores.overall || rating.score}
								{/if}
							</span>
						{:else}
							<span class="rating-score">{rating.score}</span>
						{/if}
					</div>
					{#if typeof rating.scores === 'object' && rating.scores !== null}
						<div class="score-details">
							{#each Object.entries(rating.scores) as [field, score]}
								<span class="score-tag">{field}: {score}</span>
							{/each}
						</div>
					{/if}
					{#if rating.comment}
						<p class="rating-comment">{rating.comment}</p>
					{/if}
					<span class="rating-date">{new Date(rating.createdAt).toLocaleDateString()}</span>
				</div>
			{:else}
				<p class="empty">No ratings yet. Be the first!</p>
			{/each}
		</div>
	{/if}
</div>

<style>
	.rate-page {
		padding: 2rem;
		max-width: 800px;
		margin: 0 auto;
	}

	.header {
		position: relative;
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2rem;
		font-weight: 800;
		color: #fff;
		letter-spacing: 4px;
		text-transform: uppercase;
		position: relative;
		z-index: 1;
	}

	.glow {
		position: absolute;
		bottom: -8px;
		left: 0;
		width: 80px;
		height: 3px;
		background: linear-gradient(90deg, #00ff88, transparent);
		box-shadow: 0 0 15px #00ff88;
	}

	.success-toast {
		background: #00ff88;
		color: #0a0a0a;
		padding: 0.75rem 1rem;
		border-radius: 4px;
		margin-bottom: 1.5rem;
		font-weight: 600;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	h2 {
		color: #fff;
		font-size: 1.25rem;
	}

	.btn-add {
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid #00ff88;
		color: #00ff88;
		border-radius: 4px;
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-add:hover {
		background: #00ff88;
		color: #0a0a0a;
	}

	.create-form {
		background: #1a1a2e;
		padding: 1.5rem;
		border-radius: 8px;
		border: 1px solid #2a2a4a;
		margin-bottom: 1.5rem;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-group label {
		display: block;
		color: #888;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 1px;
		margin-bottom: 0.5rem;
	}

	.form-group input,
	.form-group textarea {
		width: 100%;
		padding: 0.75rem;
		background: #0a0a0f;
		border: 1px solid #2a2a4a;
		border-radius: 4px;
		color: #fff;
		font-size: 0.9rem;
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: #00ff88;
	}

	.form-group .help {
		display: block;
		color: #555;
		font-size: 0.75rem;
		margin-top: 0.25rem;
	}

	.btn-submit {
		padding: 0.75rem 1.5rem;
		background: #00ff88;
		border: none;
		color: #0a0a0a;
		border-radius: 4px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-submit:hover:not(:disabled) {
		box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
	}

	.btn-submit:disabled {
		opacity: 0.6;
	}

	.category-grid, .item-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}

	.category-card {
		background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%);
		border: 1px solid #2a2a4a;
		border-radius: 8px;
		padding: 1.5rem;
		text-decoration: none;
		transition: all 0.2s;
	}

	.category-card:hover {
		border-color: #00ff88;
		transform: translateY(-2px);
	}

	.category-card h3 {
		color: #fff;
		font-size: 1.1rem;
		margin-bottom: 0.5rem;
	}

	.category-card p {
		color: #666;
		font-size: 0.85rem;
	}

	.item-card {
		background: #1a1a2e;
		border: 1px solid #2a2a4a;
		border-radius: 8px;
		overflow: hidden;
		text-decoration: none;
		transition: all 0.2s;
	}

	.item-card:hover {
		border-color: #00ff88;
		transform: translateY(-2px);
	}

	.item-image {
		height: 120px;
		background-size: cover;
		background-position: center;
		background-color: #0a0a0f;
	}

	.item-image.placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2.5rem;
	}

	.item-info {
		padding: 1rem;
	}

	.item-info h3 {
		color: #fff;
		font-size: 1rem;
		margin-bottom: 0.5rem;
	}

	.item-rating {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.item-rating .score {
		color: #00ff88;
		font-weight: 700;
		font-size: 1.1rem;
	}

	.item-rating .count {
		color: #666;
		font-size: 0.75rem;
	}

	.breadcrumb {
		margin-bottom: 1.5rem;
	}

	.breadcrumb a {
		color: #666;
		text-decoration: none;
		font-size: 0.9rem;
	}

	.breadcrumb a:hover {
		color: #00ff88;
	}

	.category-desc {
		color: #888;
		margin-bottom: 1.5rem;
	}

	.empty {
		color: #666;
		text-align: center;
		padding: 2rem;
	}

	.item-detail {
		display: flex;
		gap: 1.5rem;
		background: #1a1a2e;
		border: 1px solid #2a2a4a;
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.detail-image {
		width: 200px;
		height: 200px;
		border-radius: 8px;
		background-size: cover;
		background-position: center;
		background-color: #0a0a0f;
		flex-shrink: 0;
	}

	.detail-image.placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 4rem;
	}

	.detail-info h2 {
		color: #fff;
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
	}

	.detail-desc {
		color: #aaa;
		margin-bottom: 1rem;
	}

	.extra-data {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.extra-tag {
		background: #2a2a4a;
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
		font-size: 0.8rem;
		color: #00ff88;
	}

	.rating-form {
		background: #1a1a2e;
		border: 1px solid #2a2a4a;
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.rating-form h3 {
		color: #fff;
		margin-bottom: 1rem;
	}

	.rating-input {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.rating-input label {
		color: #888;
		font-size: 0.85rem;
	}

	.rating-field {
		margin-bottom: 1rem;
	}

	.rating-field label {
		color: #888;
		font-size: 0.85rem;
		text-transform: capitalize;
	}

	.rating-row {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.rating-row input[type="range"] {
		flex: 1;
		accent-color: #00ff88;
	}

	.overall-score {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: #0a0a0f;
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.overall-score span {
		color: #666;
	}

	.overall-score strong {
		color: #00ff88;
		font-size: 1.25rem;
	}

	.score-details {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0.5rem 0;
	}

	.score-tag {
		background: #2a2a4a;
		padding: 0.2rem 0.5rem;
		border-radius: 2px;
		font-size: 0.75rem;
		color: #00ff88;
	}

	.rating-input input[type="range"] {
		flex: 1;
		accent-color: #00ff88;
	}

	.score-display {
		color: #00ff88;
		font-weight: 700;
		font-size: 1.25rem;
		min-width: 40px;
	}

	.rating-stars {
		color: #ffd93d;
		font-size: 1.25rem;
		margin-bottom: 1rem;
	}

	.ratings-list h3 {
		color: #fff;
		margin-bottom: 1rem;
	}

	.rating-card {
		background: #0a0a0f;
		border: 1px solid #222;
		border-radius: 4px;
		padding: 1rem;
		margin-bottom: 0.75rem;
	}

	.rating-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.rating-user {
		color: #00ff88;
		font-weight: 600;
	}

	.rating-score {
		color: #fff;
		font-weight: 700;
		font-size: 1.1rem;
	}

	.rating-comment {
		color: #aaa;
		font-size: 0.9rem;
		margin-bottom: 0.5rem;
	}

	.rating-date {
		color: #555;
		font-size: 0.75rem;
	}

	@media (max-width: 600px) {
		.item-detail {
			flex-direction: column;
		}

		.detail-image {
			width: 100%;
			height: 180px;
		}
	}
</style>