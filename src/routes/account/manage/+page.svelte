<script>
	let { data, form } = $props();

	let editing = $state(false);
	let saving = $state(false);
	let success = $state(false);

	// Form fields
	let displayName = $state(data.user.displayName || '');
	let bio = $state(data.user.bio || '');
	let avatarUrl = $state(data.user.avatarUrl || '');
	let website = $state(data.user.website || '');
	let location = $state(data.user.location || '');

	// Reset on successful save
	$effect(() => {
		if (form?.success) {
			success = true;
			setTimeout(() => success = false, 3000);
		}
	});

	function getInitials(name) {
		if (!name) return data.user.username.charAt(0).toUpperCase();
		return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
	}
</script>

<svelte:head>
	<title>Manage Account - GOONOLOGY</title>
</svelte:head>

<div class="account-page">
	<div class="header">
		<h1>Account</h1>
		<div class="glow"></div>
	</div>

	{#if success}
		<div class="success-toast">Profile updated!</div>
	{/if}

	<div class="profile-card">
		<div class="avatar-section">
			{#if avatarUrl}
				<img src={avatarUrl} alt="Avatar" class="avatar-img" />
			{:else}
				<div class="avatar-placeholder">
					{getInitials(displayName)}
				</div>
			{/if}
		</div>

		<div class="info-section">
			{#if editing}
				<form method="POST" action="?/updateProfile" onsubmit={() => saving = true}>
					<div class="form-group">
						<label for="avatarUrl">Avatar URL</label>
						<input
							type="url"
							id="avatarUrl"
							name="avatarUrl"
							bind:value={avatarUrl}
							placeholder="https://example.com/avatar.jpg"
						/>
					</div>

					<div class="form-group">
						<label for="displayName">Display Name</label>
						<input
							type="text"
							id="displayName"
							name="displayName"
							bind:value={displayName}
							placeholder="Your display name"
						/>
					</div>

					<div class="form-group">
						<label for="bio">Bio</label>
						<textarea
							id="bio"
							name="bio"
							bind:value={bio}
							placeholder="Tell us about yourself"
							rows="3"
						></textarea>
					</div>

					<div class="form-group">
						<label for="website">Website</label>
						<input
							type="url"
							id="website"
							name="website"
							bind:value={website}
							placeholder="https://yourwebsite.com"
						/>
					</div>

					<div class="form-group">
						<label for="location">Location</label>
						<input
							type="text"
							id="location"
							name="location"
							bind:value={location}
							placeholder="City, Country"
						/>
					</div>

					<div class="form-actions">
						<button type="submit" class="btn-save" disabled={saving}>
							{saving ? 'Saving...' : 'Save'}
						</button>
						<button type="button" class="btn-cancel" onclick={() => editing = false}>
							Cancel
						</button>
					</div>
				</form>
			{:else}
				<div class="profile-display">
					<h2>{displayName || data.user.username}</h2>
					<p class="username">@{data.user.username}</p>
					{#if bio}
						<p class="bio">{bio}</p>
					{/if}
					<div class="meta">
						{#if location}
							<span class="meta-item">📍 {location}</span>
						{/if}
						{#if website}
							<span class="meta-item">🔗 <a href={website} target="_blank" rel="noopener">{website.replace(/^https?:\/\//, '')}</a></span>
						{/if}
					</div>
					<button class="btn-edit" onclick={() => editing = true}>
						Edit Profile
					</button>
				</div>
			{/if}
		</div>
	</div>

	<div class="stats-card">
		<div class="stat">
			<span class="stat-label">Role</span>
			<span class="stat-value role-{data.user.role}">{data.user.role}</span>
		</div>
		<div class="stat">
			<span class="stat-label">Member Since</span>
			<span class="stat-value">{new Date(data.user.createdAt).toLocaleDateString()}</span>
		</div>
	</div>
</div>

<style>
	.account-page {
		padding: 2rem;
		max-width: 520px;
		margin: 0 auto;
	}

	.header {
		position: relative;
		margin-bottom: 2.5rem;
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
		width: 100px;
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
		animation: fadeIn 0.3s ease;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(-10px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.profile-card {
		background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%);
		border-radius: 8px;
		border: 1px solid #2a2a4a;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		display: flex;
		gap: 1.5rem;
	}

	.avatar-section {
		flex-shrink: 0;
	}

	.avatar-img {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid #00ff88;
	}

	.avatar-placeholder {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: linear-gradient(135deg, #00ff88, #00cc6a);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.75rem;
		font-weight: 700;
		color: #0a0a0a;
	}

	.info-section {
		flex: 1;
	}

	.profile-display h2 {
		color: #fff;
		font-size: 1.25rem;
		margin-bottom: 0.25rem;
	}

	.username {
		color: #666;
		font-size: 0.875rem;
		margin-bottom: 0.75rem;
	}

	.bio {
		color: #aaa;
		font-size: 0.9rem;
		margin-bottom: 0.75rem;
		line-height: 1.5;
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.meta-item {
		color: #666;
		font-size: 0.8rem;
	}

	.meta-item a {
		color: #00ff88;
		text-decoration: none;
	}

	.meta-item a:hover {
		text-decoration: underline;
	}

	.btn-edit {
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid #00ff88;
		color: #00ff88;
		border-radius: 4px;
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-edit:hover {
		background: #00ff88;
		color: #0a0a0a;
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
		transition: border-color 0.2s;
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: #00ff88;
	}

	.form-group textarea {
		resize: vertical;
		min-height: 80px;
	}

	.form-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.btn-save {
		padding: 0.6rem 1.5rem;
		background: #00ff88;
		border: none;
		color: #0a0a0a;
		border-radius: 4px;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-save:hover:not(:disabled) {
		box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
	}

	.btn-save:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-cancel {
		padding: 0.6rem 1.5rem;
		background: transparent;
		border: 1px solid #666;
		color: #666;
		border-radius: 4px;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-cancel:hover {
		border-color: #fff;
		color: #fff;
	}

	.stats-card {
		background: #0a0a0f;
		border-radius: 8px;
		border: 1px solid #222;
		padding: 1rem 1.5rem;
		display: flex;
		justify-content: space-between;
	}

	.stat {
		text-align: center;
	}

	.stat-label {
		display: block;
		color: #666;
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 1px;
		margin-bottom: 0.25rem;
	}

	.stat-value {
		color: #fff;
		font-size: 0.95rem;
		font-weight: 600;
	}

	.stat-value.role-admin {
		color: #ff3366;
	}

	.stat-value.role-mod {
		color: #ffd93d;
	}

	.stat-value.role-member {
		color: #00ff88;
	}

	@media (max-width: 480px) {
		.profile-card {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}

		.meta {
			justify-content: center;
		}
	}
</style>