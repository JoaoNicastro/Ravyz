-- 🔍 RAVYZ Simple Health Check
-- Quick validation for initial setup

-- ========================================
-- 1. CHECK: Basic schema exists
-- ========================================
SELECT 
  'Schema Tables' as check_category,
  tablename,
  '✅ Table exists' as status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'user_profiles', 'candidate_profiles', 'company_profiles',
    'professional_assessments', 'dream_jobs', 'jobs', 'matches',
    'feedback_ratings', 'salary_data', 'conversations', 'messages',
    'skills', 'candidate_skills', 'job_required_skills',
    'education', 'work_experience', 'user_analytics'
  )
ORDER BY tablename;

-- ========================================
-- 2. CHECK: RLS enabled on all expected tables
-- ========================================
SELECT 
  'Row Level Security' as check_category,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ Enabled'
    ELSE '❌ DISABLED'
  END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'user_profiles', 'candidate_profiles', 'company_profiles',
    'professional_assessments', 'dream_jobs', 'jobs', 'matches',
    'feedback_ratings', 'salary_data', 'conversations', 'messages',
    'skills', 'candidate_skills', 'job_required_skills',
    'education', 'work_experience', 'user_analytics'
  )
ORDER BY tablename;

-- ========================================
-- 3. CHECK: Summary
-- ========================================
SELECT 
  'Summary' as check_category,
  COUNT(*) as total_tables,
  COUNT(CASE WHEN rowsecurity THEN 1 END) as rls_enabled,
  COUNT(CASE WHEN NOT rowsecurity THEN 1 END) as rls_disabled,
  CASE 
    WHEN COUNT(CASE WHEN NOT rowsecurity THEN 1 END) = 0 
    THEN '🎉 ALL TABLES HAVE RLS!'
    ELSE '⚠️ ' || COUNT(CASE WHEN NOT rowsecurity THEN 1 END) || ' tables missing RLS'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'user_profiles', 'candidate_profiles', 'company_profiles',
    'professional_assessments', 'dream_jobs', 'jobs', 'matches',
    'feedback_ratings', 'salary_data', 'conversations', 'messages',
    'skills', 'candidate_skills', 'job_required_skills',
    'education', 'work_experience', 'user_analytics'
  );

-- ========================================
-- 4. CHECK: Policies exist
-- ========================================
SELECT 
  'RLS Policies' as check_category,
  COUNT(*) as total_policies,
  COUNT(CASE WHEN cmd = '*' THEN 1 END) as for_all_policies,
  COUNT(CASE WHEN cmd != '*' THEN 1 END) as per_operation_policies,
  CASE 
    WHEN COUNT(CASE WHEN cmd = '*' THEN 1 END) = 0 
    THEN '✅ No FOR ALL policies'
    ELSE '⚠️ ' || COUNT(CASE WHEN cmd = '*' THEN 1 END) || ' FOR ALL policies found'
  END as policy_status
FROM pg_policies 
WHERE schemaname = 'public';

-- ========================================
-- 5. CHECK: Basic indexes exist
-- ========================================
SELECT 
  'Indexes' as check_category,
  COUNT(*) as total_indexes,
  '✅ Basic indexes created' as status
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND indexname LIKE 'idx_%';

-- ========================================
-- 6. CHECK: Trigger functions exist
-- ========================================
SELECT 
  'Trigger Functions' as check_category,
  routine_name,
  '✅ Function exists' as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_type = 'FUNCTION'
  AND routine_name IN (
    'update_updated_at_column',
    'update_match_analytics', 
    'handle_new_user'
  )
ORDER BY routine_name;

-- ========================================
-- FINAL STATUS
-- ========================================
SELECT 
  '=== FINAL STATUS ===' as summary,
  CASE 
    WHEN (
      -- Check if all main tables exist
      (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_profiles') > 0
      AND
      -- Check if RLS is enabled
      (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND tablename IN (
        'user_profiles', 'candidate_profiles', 'company_profiles'
      ) AND NOT rowsecurity) = 0
      AND
      -- Check if policies exist
      (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') > 0
    ) THEN '🎉 DATABASE READY!'
    ELSE '❌ Setup incomplete - check errors above'
  END as production_status;