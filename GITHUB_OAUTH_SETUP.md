# GitHub OAuth Setup Guide

This guide explains how to set up GitHub OAuth integration for Seekr.

## Overview

The GitHub integration allows users to:

- Connect their GitHub account
- Automatically sync repositories
- Detect skills from code and project files
- Auto-populate projects with GitHub repos
- Estimate skill proficiency levels

## Setup Steps

### 1. Create a GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: Seekr
   - **Homepage URL**: `https://yourdomain.com` (or `http://localhost:3000` for development)
   - **Authorization callback URL**: `https://yourdomain.com/api/auth/github/callback`
4. Click "Register application"
5. Note the **Client ID** and generate a **Client Secret**

### 2. Configure Supabase GitHub Provider

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable GitHub provider
3. Enter your GitHub OAuth **Client ID** and **Client Secret**
4. Set the callback URL to: `https://your-project.supabase.co/auth/v1/callback`

### 3. Add Environment Variables

Add these to your `.env.local` file:

```bash
# GitHub OAuth (optional - Supabase handles this)
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

### 4. Run Database Migrations

Execute the GitHub-related migrations:

```bash
# Apply migrations to create github_repositories and user_github_tokens tables
# You can use Supabase CLI or run the SQL files directly in Supabase Studio
```

Files to run:

- `supabase/migrations/20260127_create_github_repositories.sql`

## Using the Integration

### For Users

1. Navigate to Settings → Integrations
2. Click "Connect GitHub"
3. Authorize the app in the GitHub OAuth flow
4. Click "Sync Now" to import repositories
5. View synced projects in the Profile page (they'll have a GitHub badge)

### API Endpoints

#### Connect GitHub Account

```typescript
POST /api/github/connect
Body: { access_token: string, token_type?: string, scope?: string }
```

#### Check Connection Status

```typescript
GET /api/github/connect
Response: { connected: boolean, connectedAt?: string, lastUpdated?: string }
```

#### Disconnect GitHub

```typescript
DELETE / api / github / connect;
```

#### Sync Repositories

```typescript
POST / api / github / sync;
Response: {
  message: string;
  synced: number;
  skillsDetected: number;
  newSkillsAdded: number;
  repositories: Array<{
    name: string;
    url: string;
    languages: Record<string, number>;
  }>;
}
```

## Skill Detection Logic

The integration analyzes repositories to detect skills:

### Programming Languages

- Detects from GitHub's language statistics API
- Calculates usage percentage
- Filters out languages used less than 5%

### Frameworks & Tools

- Analyzes package.json, requirements.txt, README
- Uses regex patterns to detect:
  - React, Next.js, Vue, Angular, Svelte
  - Node.js, Django, Flask, Spring Boot
  - Docker, Kubernetes, Terraform
  - PostgreSQL, MongoDB, Redis
  - GraphQL, REST APIs
  - AWS, Firebase, GitHub Actions

### Proficiency Estimation

Proficiency is calculated based on:

- Language usage percentage (0-25 points)
- Number of repositories using the skill (0-25 points)
- Estimated commit count (0-25 points)
- Repository stars (0-25 points)

**Levels:**

- 75+ points = Expert
- 60-74 points = Advanced
- 35-59 points = Intermediate
- 0-34 points = Beginner

## Security Considerations

1. **Token Storage**: GitHub access tokens are stored in the `user_github_tokens` table
   - Ensure Row Level Security (RLS) is enabled
   - Only allow users to access their own tokens
   - Consider encrypting tokens at rest

2. **API Rate Limiting**: GitHub API has rate limits
   - Authenticated requests: 5,000/hour
   - Implement caching for repository data
   - Consider limiting sync frequency (e.g., once per day)

3. **Permissions**: Request minimal scopes
   - `repo`: Access public and private repositories
   - `read:user`: Read user profile information

## Future Enhancements

- [ ] Implement actual OAuth flow (currently manual token entry)
- [ ] Add webhook support for automatic syncing on push events
- [ ] Fetch actual commit counts from GitHub API
- [ ] Analyze README content for additional skills
- [ ] Support for GitLab and Bitbucket
- [ ] Selective repository syncing (choose which repos to include)
- [ ] Contribution graph visualization
- [ ] Team/organization repository support

## Troubleshooting

### "GitHub account not connected" error

- Ensure the user has a record in `user_github_tokens` table
- Verify the access token is valid and not expired

### No repositories synced

- Check GitHub token permissions (needs `repo` scope)
- Verify the user has repositories in their GitHub account
- Check API response in browser console for errors

### Skills not detected

- Ensure repositories have code (not empty repos)
- Check that language statistics are available via GitHub API
- Verify the repository is not archived or private without proper permissions

## Development Testing

For local development without OAuth:

1. Get a Personal Access Token from GitHub:
   - Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` scope

2. Manually insert into database:

```sql
INSERT INTO user_github_tokens (user_id, access_token)
VALUES ('your-user-id', 'your-github-token');
```

3. Test sync endpoint:

```bash
curl -X POST http://localhost:3000/api/github/sync \
  -H "Cookie: your-session-cookie"
```
