<script>
	let { data, form } = $props();

	let activeTab = $state('users');
	let selectedCategory = $state('');
	let fieldsInput = $state('');
	let successMsg = $state('');

	$effect(() => {
		if (form?.success) {
			successMsg = form.message || 'Action completed!';
			setTimeout(() => successMsg = '', 3000);
		}
	});

	function onCategoryChange(e) {
		const catId = parseInt(e.target.value);
		const cat = data.categories.find(c => c.id === catId);
		fieldsInput = cat?.ratingFields ? JSON.stringify(cat.ratingFields) : '[]';
	}
</script>

<svelte:head>
	<title>Admin - GOONOLOGY</title>
</svelte:head>

<div class="admin-page">
	<div class="header">
		<h1>Admin Panel</h1>
		<div class="glow"></div>
	</div>

	<div class="tabs">
		<button class:active={activeTab === 'users'} onclick={() => activeTab = 'users'}>Users</button>
		<button class:active={activeTab === 'fields'} onclick={() => activeTab = 'fields'}>Rating Fields</button>
		<button class:active={activeTab === 'settings'} onclick={() => activeTab = 'settings'}>Settings</button>
	</div>

	{#if successMsg}
		<div class="success-toast">{successMsg}</div>
	{/if}

	{#if activeTab === 'users'}
		<div class="panel">
			<h2>Create User</h2>

			{#if form?.error}
				<div class="error">{form.error}</div>
			{/if}

			{#if form?.success && form?.user}
				<div class="success">
					User <strong>{form.user.username}</strong> created with role <strong>{form.user.role}</strong>
				</div>
			{/if}

			<form method="POST" action="?/createUser">
				<div class="field">
					<label for="username">Username</label>
					<input type="text" id="username" name="username" required />
				</div>

				<div class="field">
					<label for="password">Password</label>
					<input type="password" id="password" name="password" required />
				</div>

				<div class="field">
					<label for="role">Role</label>
					<select id="role" name="role" required>
						<option value="member">Member</option>
						<option value="mod">Moderator</option>
						<option value="admin">Admin</option>
					</select>
				</div>

				<button type="submit">Create User</button>
			</form>
		</div>
	{/if}

	{#if activeTab === 'fields'}
		<div class="panel">
			<h2>Manage Rating Fields</h2>
			<p class="desc">Add custom rating fields to categories (e.g., gameplay, graphics, story)</p>

			{#if form?.error}
				<div class="error">{form.error}</div>
			{/if}

			<form method="POST" action="?/updateFields">
				<div class="field">
					<label for="category">Category</label>
					<select id="category" name="categoryId" onchange={onCategoryChange} required>
						<option value="">Select a category...</option>
						{#each data.categories as cat}
							<option value={cat.id}>{cat.name}</option>
						{/each}
					</select>
				</div>

				<div class="field">
					<label for="fields">Rating Fields (JSON array)</label>
					<textarea id="fields" name="fields" rows="4" bind:value={fieldsInput} placeholder='["overall", "gameplay", "graphics"]'></textarea>
					<span class="hint">Example: ["overall", "gameplay", "graphics", "sound"]</span>
				</div>

				<button type="submit">Update Fields</button>
			</form>

			<div class="category-list">
				<h3>Current Fields</h3>
				{#each data.categories as cat}
					<div class="cat-item">
						<strong>{cat.name}</strong>
						{#if cat.ratingFields}
							<span class="fields">{cat.ratingFields.join(', ')}</span>
						{:else}
							<span class="no-fields">No custom fields</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if activeTab === 'settings'}
		<div class="panel">
			<h2>Server Settings</h2>

			<form method="POST" action="?/toggleMaintenance">
				<div class="maintenance-toggle">
					<div class="toggle-info">
						<strong>Maintenance Mode</strong>
						<p>Shut down server for all users except admins</p>
					</div>
					<label class="switch">
						<input
							type="checkbox"
							name="enabled"
							value="true"
							checked={data.maintenanceMode}
							onchange={(e) => e.target.form.submit()}
						/>
						<span class="slider"></span>
					</label>
				</div>
			</form>

			<div class="info-box">
				<p><strong>Admin Login:</strong> <code>/admin/login</code></p>
				<p>Use this separate login for admin access. Regular users use <code>/login</code></p>
			</div>
		</div>
	{/if}
</div>

<style>
	.admin-page {
		padding: 2rem;
		max-width: 600px;
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
		width: 120px;
		height: 3px;
		background: linear-gradient(90deg, #00ff88, transparent);
		box-shadow: 0 0 15px #00ff88;
	}

	.tabs {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.tabs button {
		padding: 0.75rem 1.5rem;
		background: transparent;
		border: 1px solid #333;
		color: #666;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.tabs button.active {
		border-color: #00ff88;
		color: #00ff88;
		background: rgba(0, 255, 136, 0.1);
	}

	.panel {
		background: #1a1a2e;
		border: 1px solid #2a2a4a;
		border-radius: 8px;
		padding: 1.5rem;
	}

	h2 {
		color: #fff;
		font-size: 1.25rem;
		margin-bottom: 1rem;
	}

	.desc {
		color: #666;
		font-size: 0.9rem;
		margin-bottom: 1.5rem;
	}

	.error {
		background: #ff3333;
		color: #fff;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.success {
		background: #00ff88;
		color: #0a0a0a;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.success-toast {
		background: #00ff88;
		color: #0a0a0a;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1rem;
		font-weight: 600;
	}

	.field {
		margin-bottom: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		color: #888;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	input, select, textarea {
		width: 100%;
		padding: 0.75rem;
		background: #0a0a0f;
		border: 1px solid #2a2a4a;
		border-radius: 4px;
		color: #fff;
		font-size: 0.9rem;
	}

	input:focus, select:focus, textarea:focus {
		outline: none;
		border-color: #00ff88;
	}

	textarea {
		resize: vertical;
		font-family: monospace;
	}

	.hint {
		display: block;
		color: #555;
		font-size: 0.75rem;
		margin-top: 0.25rem;
	}

	button[type="submit"] {
		padding: 0.75rem 1.5rem;
		background: #00ff88;
		border: none;
		color: #0a0a0a;
		border-radius: 4px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	button[type="submit"]:hover {
		box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
	}

	.category-list {
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid #2a2a4a;
	}

	.category-list h3 {
		color: #888;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 1px;
		margin-bottom: 1rem;
	}

	.cat-item {
		background: #0a0a0f;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 0.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.cat-item strong {
		color: #fff;
	}

	.fields {
		color: #00ff88;
		font-size: 0.85rem;
	}

	.no-fields {
		color: #555;
		font-size: 0.85rem;
	}

	.maintenance-toggle {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: #0a0a0f;
		border-radius: 4px;
		margin-bottom: 1.5rem;
	}

	.toggle-info strong {
		color: #fff;
		display: block;
		margin-bottom: 0.25rem;
	}

	.toggle-info p {
		color: #666;
		font-size: 0.85rem;
		margin: 0;
	}

	.switch {
		position: relative;
		display: inline-block;
		width: 50px;
		height: 26px;
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #333;
		transition: 0.3s;
		border-radius: 26px;
	}

	.slider:before {
		position: absolute;
		content: "";
		height: 20px;
		width: 20px;
		left: 3px;
		bottom: 3px;
		background: #fff;
		transition: 0.3s;
		border-radius: 50%;
	}

	.switch input:checked + .slider {
		background: #ff3366;
	}

	.switch input:checked + .slider:before {
		transform: translateX(24px);
	}

	.info-box {
		background: #0a0a0f;
		padding: 1rem;
		border-radius: 4px;
		border: 1px solid #2a2a4a;
	}

	.info-box p {
		color: #888;
		margin: 0.5rem 0;
		font-size: 0.9rem;
	}

	.info-box code {
		background: #1a1a2e;
		padding: 0.2rem 0.5rem;
		border-radius: 2px;
		color: #00ff88;
	}
</style>