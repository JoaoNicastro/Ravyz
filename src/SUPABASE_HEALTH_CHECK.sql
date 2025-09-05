-- 🔍 RAVYZ Production Health Check
-- Comprehensive validation of all production checklist items

-- ========================================
-- 1. CHECK: No uuid-ossp extension usage
-- ========================================
SELECT 
  'UUID Functions' as check_category,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ PASS: No uuid_generate_v4() found'
    ELSE '❌ FAIL: Found uuid_generate_v4() usage'
  END as status,
  COUNT(*) as occurrences
FROM information_schema.routines 
WHERE routine_definition LIKE '%uuid_generate_v4%'
  AND routine_schema = 'public';

-- Check for gen_random_uuid() usage (should be present)
SELECT 
  'UUID Functions' as check_category,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ PASS: Using gen_random_uuid()'
    ELSE '❌ FAIL: gen_random_uuid() not found'
  END as status,
  COUNT(*) as occurrences
FROM information_schema.columns 
WHERE column_default LIKE '%gen_random_uuid%'
  AND table_schema = 'public';

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

-- Count tables with RLS disabled
SELECT 
  'Row Level Security Summary' as check_category,
  CASE 
    WHEN COUNT(CASE WHEN NOT rowsecurity THEN 1 END) = 0 
    THEN '✅ PASS: All tables have RLS enabled'
    ELSE '❌ FAIL: ' || COUNT(CASE WHEN NOT rowsecurity THEN 1 END) || ' tables missing RLS'
  END as status,
  COUNT(*) as total_tables,
  COUNT(CASE WHEN rowsecurity THEN 1 END) as rls_enabled,
  COUNT(CASE WHEN NOT rowsecurity THEN 1 END) as rls_disabled
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
-- 3. CHECK: No FOR ALL policies (should be per-operation)
-- ========================================
SELECT 
  'RLS Policies' as check_category,
  schemaname,
  tablename,
  policyname,
  cmd,
  CASE 
    WHEN cmd = '*' THEN '❌ FOR ALL policy found'
    ELSE '✅ Per-operation policy'
  END as policy_type
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Summary of FOR ALL policies
SELECT 
  'RLS Policies Summary' as check_category,
  CASE 
    WHEN COUNT(CASE WHEN cmd = '*' THEN 1 END) = 0 
    THEN '✅ PASS: No FOR ALL policies found'
    ELSE '❌ FAIL: ' || COUNT(CASE WHEN cmd = '*' THEN 1 END) || ' FOR ALL policies found'
  END as status,
  COUNT(*) as total_policies,
  COUNT(CASE WHEN cmd != '*' THEN 1 END) as per_operation_policies,
  COUNT(CASE WHEN cmd = '*' THEN 1 END) as for_all_policies
FROM pg_policies 
WHERE schemaname = 'public';

-- ========================================
-- 4. CHECK: All policies use auth.uid() or auth.role()
-- ========================================
SELECT 
  'Auth Function Usage' as check_category,
  schemaname,
  tablename,
  policyname,
  CASE 
    WHEN qual LIKE '%auth.uid()%' OR qual LIKE '%auth.role()%' 
      OR with_check LIKE '%auth.uid()%' OR with_check LIKE '%auth.role()%'
    THEN '✅ Uses auth functions'
    ELSE '❌ Missing auth functions'
  END as auth_usage,
  CASE 
    WHEN qual LIKE '%auth.role() = ''authenticated''%' 
      OR with_check LIKE '%auth.role() = ''authenticated''%'
    THEN '✅ Proper role check'
    WHEN qual LIKE '%auth.role()%' OR with_check LIKE '%auth.role()%'
    THEN '⚠️ Uses auth.role() but check syntax'
    ELSE '✅ Uses auth.uid()'
  END as role_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ========================================
-- 5. CHECK: Updated_at triggers on tables with updated_at column
-- ========================================
SELECT 
  'Updated_at Triggers' as check_category,
  t.table_name,
  CASE 
    WHEN trig.trigger_name IS NOT NULL THEN '✅ Trigger exists'
    ELSE '❌ Missing trigger'
  END as trigger_status,
  trig.trigger_name
FROM information_schema.tables t
LEFT JOIN information_schema.columns c 
  ON t.table_name = c.table_name 
  AND t.table_schema = c.table_schema 
  AND c.column_name = 'updated_at'
LEFT JOIN information_schema.triggers trig 
  ON t.table_name = trig.event_object_table 
  AND trig.trigger_name LIKE '%updated_at%'
WHERE t.table_schema = 'public' 
  AND c.column_name = 'updated_at'
ORDER BY t.table_name;

-- ========================================
-- 6. CHECK: Private schema for heavy analytics views
-- ========================================
SELECT 
  'Private Schema' as check_category,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ PASS: Private schema exists'
    ELSE '❌ FAIL: Private schema missing'
  END as status,
  COUNT(*) as private_views
FROM information_schema.views 
WHERE table_schema = 'private';

-- Check for security_invoker option on private views
SELECT 
  'Private Views Security' as check_category,
  table_name,
  view_definition,
  CASE 
    WHEN view_definition LIKE '%security_invoker%' THEN '✅ Has security_invoker'
    ELSE '⚠️ Check security_invoker'
  END as security_status
FROM information_schema.views 
WHERE table_schema = 'private';

-- ========================================
-- 7. CHECK: Index status and performance
-- ========================================
SELECT 
  'Indexes' as check_category,
  schemaname,
  tablename,
  indexname,
  CASE 
    WHEN indexname LIKE '%_concurrent' THEN '🔄 Concurrent version'
    ELSE '✅ Regular index'
  END as index_type,
  pg_size_pretty(pg_relation_size(indexname::regclass)) as size
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- Index usage statistics
SELECT 
  'Index Usage' as check_category,
  schemaname,
  relname as tablename,
  indexrelname as indexname,
  idx_scan as times_used,
  CASE 
    WHEN idx_scan = 0 THEN '⚠️ Unused index'
    WHEN idx_scan < 10 THEN '⚠️ Low usage'
    ELSE '✅ Well used'
  END as usage_status
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- ========================================
-- 8. CHECK: JSONB indexes for matching flags
-- ========================================
SELECT 
  'JSONB Indexes' as check_category,
  schemaname,
  tablename,
  indexname,
  indexdef,
  CASE 
    WHEN indexdef LIKE '%USING gin%' THEN '✅ GIN index'
    ELSE '⚠️ Not GIN index'
  END as index_type
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND (
    indexname LIKE '%matching_flags%' 
    OR indexname LIKE '%target_profile_flags%'
  )
ORDER BY tablename;

-- ========================================
-- 9. CHECK: Foreign key constraints and indexes
-- ========================================
SELECT 
  'Foreign Keys' as check_category,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  CASE 
    WHEN idx.indexname IS NOT NULL THEN '✅ Has index'
    ELSE '⚠️ Missing index'
  END as index_status
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
LEFT JOIN pg_indexes idx 
  ON tc.table_name = idx.tablename 
  AND idx.indexdef LIKE '%' || kcu.column_name || '%'
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- ========================================
-- 10. CHECK: Table sizes and growth monitoring
-- ========================================
SELECT 
  'Table Sizes' as check_category,
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as indexes_size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ========================================
-- 11. CHECK: Active connections and performance
-- ========================================
SELECT 
  'Database Health' as check_category,
  'Active Connections' as metric,
  count(*) as value,
  CASE 
    WHEN count(*) < 50 THEN '✅ Normal'
    WHEN count(*) < 100 THEN '⚠️ High'
    ELSE '❌ Very High'
  END as status
FROM pg_stat_activity 
WHERE state = 'active';

-- ========================================
-- 12. CHECK: Trigger functions exist and are valid
-- ========================================
SELECT 
  'Trigger Functions' as check_category,
  routine_name,
  routine_type,
  CASE 
    WHEN routine_name IN (
      'update_updated_at_column',
      'update_match_analytics', 
      'handle_new_user'
    ) THEN '✅ Required function exists'
    ELSE '✅ Additional function'
  END as function_status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- ========================================
-- OVERALL HEALTH SUMMARY
-- ========================================
SELECT 
  '=== PRODUCTION READINESS SUMMARY ===' as summary,
  CASE 
    WHEN (
      -- All critical checks pass
      (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND tablename IN (
        'user_profiles', 'candidate_profiles', 'company_profiles',
        'professional_assessments', 'dream_jobs', 'jobs', 'matches',
        'feedback_ratings', 'salary_data', 'conversations', 'messages',
        'skills', 'candidate_skills', 'job_required_skills',
        'education', 'work_experience', 'user_analytics'
      ) AND NOT rowsecurity) = 0 -- All tables have RLS
      AND 
      (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND cmd = '*') = 0 -- No FOR ALL policies
      AND
      (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'private') > 0 -- Private schema exists
    ) THEN '🎉 READY FOR PRODUCTION!'
    ELSE '⚠️ NEEDS ATTENTION - Check failed items above'
  END as production_status;

-- ========================================
-- PERFORMANCE RECOMMENDATIONS
-- ========================================
SELECT 
  'Performance Recommendations' as category,
  CASE 
    WHEN (SELECT COUNT(*) FROM pg_stat_user_indexes WHERE idx_scan = 0) > 5 
    THEN 'Consider removing unused indexes'
    WHEN (SELECT AVG(n_tup_ins + n_tup_upd + n_tup_del) FROM pg_stat_user_tables WHERE schemaname = 'public') > 1000
    THEN 'High activity detected - monitor performance'
    ELSE 'Performance looks good'
  END as recommendation;

SELECT 
  'Security Recommendations' as category,
  CASE 
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND (qual NOT LIKE '%auth.uid()%' AND qual NOT LIKE '%auth.role()%')) > 0
    THEN 'Some policies may not use proper auth functions'
    ELSE 'All policies use proper authentication'
  END as recommendation;