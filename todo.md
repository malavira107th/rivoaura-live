# Rivoaura Live - Independent Vercel Deployment (Zero Manus Dependencies)

## Critical: Remove ALL Manus Platform Code (Google Ads Compliance)

### Phase 1: Remove Manus Dependencies
- [x] Remove Manus OAuth system (server/_core/oauth.ts)
- [x] Remove Manus SDK calls from routers.ts and context.ts
- [ ] Remove Manus built-in APIs (llm, storage, notification, etc.)
- [ ] Remove Manus environment variables from code
- [ ] Remove Manus system router
- [ ] Check and remove any Manus imports

### Phase 2: Implement Custom Authentication
- [x] Create custom JWT-based auth (no external OAuth)
- [x] Use email/password stored in database
- [x] Create login/register endpoints (already exist)
- [x] Create auth middleware for protected routes

### Phase 3: Configure Vercel
- [ ] Update vercel.json for serverless deployment
- [ ] Create Vercel serverless function for API
- [ ] Configure environment variables in Vercel dashboard
- [ ] Disable Socket.IO (show "Coming Soon" message)

### Phase 4: Test and Deploy
- [ ] Test build locally
- [ ] Verify zero Manus references
- [ ] Push to GitHub
- [ ] Deploy to Vercel

### Phase 5: Verification
- [ ] Test login/register on live site
- [ ] Verify no Manus code in deployed files
- [ ] Check Google Ads compliance
