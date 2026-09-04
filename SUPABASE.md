# Contas no Supabase (grátis)

1. Crie conta em https://supabase.com
2. New project → nome DeuPingu → senha forte do banco → Create
3. Settings → API:
   - Project URL
   - anon public
4. SQL Editor → cole o arquivo supabase/schema.sql → Run
5. Authentication → Providers → Email → desligue "Confirm email"
6. No PC, na pasta pinguork, crie o arquivo `.env.local`:

NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

7. Na Vercel: Project → Settings → Environment Variables → as mesmas duas → Redeploy
8. `npm install` no PC e `git push`
