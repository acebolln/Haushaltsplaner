# Deploy to Vercel

Run pre-deployment checks and deploy to Vercel.

## Steps

1. **Pre-flight checks**:
   ```bash
   npm run type-check
   npm run lint
   npm run build
   ```

2. **Environment variables check**:
   - Verify ANTHROPIC_API_KEY is set in Vercel dashboard
   - Verify POSTGRES_URL is configured
   - Verify BLOB_READ_WRITE_TOKEN is configured

3. **Deploy**:
   ```bash
   # Preview deployment (default)
   vercel

   # Production deployment (only if user confirms)
   vercel --prod
   ```

4. **Post-deployment**:
   - Show deployment URL
   - Verify environment variables are accessible
   - Test critical paths (budget planner loads, API route responds)

## Notes
- Always deploy to preview first
- Only deploy to production if user explicitly confirms
- Check build logs for warnings
- Verify database migrations ran successfully
