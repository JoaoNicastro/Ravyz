# 🚀 RAVYZ Supabase Implementation Guide

## 📋 Overview

Este guia fornece instruções passo-a-passo para implementar o schema otimizado do RAVYZ no Supabase, seguindo as melhores práticas de produção.

---

## 🛠️ **1. Setup Inicial**

### **1.1 Criar Projeto Supabase**
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova organização/projeto
3. Escolha região (recomendado: São Paulo para usuários brasileiros)
4. Anote URL e chaves de API

### **1.2 Configurar Environment Variables**
```bash
# Copie o arquivo de exemplo
cp .env.local.example .env.local

# Edite com suas credenciais reais
NEXT_PUBLIC_SUPABASE_URL=https://seu-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

---

## 🗄️ **2. Implementação do Schema (PRODUÇÃO)**

### **2.1 Executar Schema de Produção**
⚠️ **IMPORTANTE**: Use o schema de produção que segue todos os requisitos:

1. Acesse o **SQL Editor** no dashboard Supabase
2. Execute o arquivo `/SUPABASE_SCHEMA_PRODUCTION_READY.sql`
3. Execute em blocos se necessário (evitar timeouts)

### **2.2 Verificar Health Check**
```sql
-- PRIMEIRO: Execute o health check simples
-- Cole o conteúdo de /SUPABASE_HEALTH_CHECK_SIMPLE.sql

-- DEPOIS (opcional): Execute o health check completo
-- Cole o conteúdo de /SUPABASE_HEALTH_CHECK.sql (se não der erro)
```

### **2.3 Adicionar Índices Concorrentes (Opcional)**
Após o schema estar funcionando em produção:
```sql
-- Execute /SUPABASE_INDEXES_CONCURRENT.sql
-- Um comando por vez, fora de transação
```

### **2.2 Verificar Criação das Tabelas**
```sql
-- Verificar se todas as tabelas foram criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Deve retornar 15 tabelas principais + views
```

### **2.3 Verificar RLS (Row Level Security)**
```sql
-- Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;
```

---

## 🔐 **3. Configuração de Segurança**

### **3.1 Políticas RLS Implementadas**

#### **Usuários**
- ✅ Usuários podem ver/editar apenas seu próprio perfil
- ✅ Trigger automático para criar perfil na inscrição

#### **Candidatos**
- ✅ Acesso total aos próprios dados
- ✅ Empresas podem ver perfis públicos
- ✅ Dados privados protegidos

#### **Empresas**
- ✅ Acesso total aos próprios dados
- ✅ Candidatos podem ver perfis públicos de empresas
- ✅ Dados comerciais protegidos

#### **Matches**
- ✅ Usuários veem apenas seus próprios matches
- ✅ Atualizações controladas por propriedade
- ✅ Analytics automáticas via triggers

### **3.2 Testar Segurança**
```sql
-- Como candidato logado
SELECT * FROM candidate_profiles; -- Deve ver apenas próprio perfil

-- Como empresa logada  
SELECT * FROM jobs; -- Deve ver apenas próprias vagas

-- Test de cross-access (deve falhar)
SELECT * FROM user_profiles WHERE id != auth.uid(); -- Vazio/erro
```

---

## ⚡ **4. Otimização de Performance**

### **4.1 Índices Criados**

#### **Matching & Search**
- `idx_matches_compatibility_score` - Ranking de matches
- `idx_matches_candidate_job` - Lookups rápidos
- `idx_dream_jobs_matching_flags` - GIN para JSONB

#### **Profile Search**
- `idx_candidate_profiles_location` - Busca geográfica
- `idx_professional_assessments_profile` - Filtro por perfil
- `idx_jobs_location_seniority` - Busca de vagas

#### **Analytics**
- `idx_user_analytics_user_activity` - Métricas de usuário
- `idx_feedback_ratings_overall` - Ranking de feedback

### **4.2 Monitorar Performance**
```sql
-- Ver queries mais lentas
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Ver uso de índices
SELECT schemaname, tablename, indexname, idx_scan 
FROM pg_stat_user_indexes 
ORDER BY idx_scan DESC;
```

---

## 🔄 **5. Integração com Frontend**

### **5.1 Instalar Dependências**
```bash
npm install @supabase/supabase-js
```

### **5.2 Usar Cliente Supabase**
```typescript
import { supabase, getUserProfile, createCandidateProfile } from '@/lib/supabase'

// Exemplo: Criar perfil de candidato
const { data, error } = await createCandidateProfile({
  user_id: user.id,
  full_name: "João Silva",
  location_city: "São Paulo",
  location_state: "SP",
  selected_mentor: { name: "Alex", avatar: "🎯" }
})
```

### **5.3 Autenticação Integrada**
```typescript
// Registro com metadados
const { data, error } = await signUp(
  'usuario@email.com', 
  'senha123',
  { 
    user_type: 'candidate', 
    document: '12345678901' 
  }
)

// Login simples
const { data, error } = await signIn('usuario@email.com', 'senha123')
```

---

## 📊 **6. Analytics & Monitoring**

### **6.1 Métricas Disponíveis**

#### **Usuário Individual**
- Logins totais e tempo de sessão
- Visualizações de perfil
- Matches recebidos/dados
- Candidaturas/vagas criadas

#### **Sistema Global**
- Candidatos/vagas ativos
- Taxa de conversão de matches
- Score médio de compatibilidade
- Rating médio de feedback

### **6.2 Queries Úteis**
```sql
-- Dashboard de métricas principais
SELECT 
  COUNT(*) FILTER (WHERE user_type = 'candidate') as total_candidates,
  COUNT(*) FILTER (WHERE user_type = 'company') as total_companies,
  COUNT(*) FILTER (WHERE last_login > NOW() - INTERVAL '7 days') as active_users
FROM user_profiles;

-- Top matches por compatibilidade
SELECT * FROM match_quality_analysis 
WHERE match_quality = 'Excellent' 
ORDER BY compatibility_score DESC 
LIMIT 10;
```

---

## 🔧 **7. Manutenção & Backup**

### **7.1 Backup Automático**
- Supabase faz backup automático diário
- Configure backup manual para dados críticos
- Exporte schema regularmente

### **7.2 Limpeza de Dados**
```sql
-- Arquivar matches antigos (>6 meses sem atividade)
UPDATE matches 
SET status = 'archived' 
WHERE last_message_at < NOW() - INTERVAL '6 months'
AND status = 'pending';

-- Limpar analytics antigas (>1 ano)
DELETE FROM matching_analytics 
WHERE date_snapshot < NOW() - INTERVAL '1 year';
```

### **7.3 Monitoring de Saúde**
```sql
-- Check conexões ativas
SELECT count(*) as active_connections 
FROM pg_stat_activity;

-- Check tamanho das tabelas
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🚀 **8. Deploy & Scaling**

### **8.1 Configurações de Produção**

#### **Connection Pooling**
- Use PgBouncer para conexões otimizadas
- Configure pool size baseado no traffic

#### **Read Replicas**
- Configure read replicas para queries analíticas
- Separe reads/writes quando necessário

#### **Caching**
- Implemente Redis para cache de queries frequentes
- Cache perfis e matches por tempo limitado

### **8.2 Limites & Quotas**
```typescript
// Rate limiting por usuário
const rateLimiter = {
  matches_per_day: 100,
  profile_updates_per_hour: 10,
  messages_per_minute: 30
}

// Monitoring de uso
const checkQuotas = async (userId: string) => {
  const { data } = await getUserAnalytics(userId)
  // Implementar lógica de rate limiting
}
```

---

## 🔍 **9. Debugging & Troubleshooting**

### **9.1 Problemas Comuns**

#### **RLS Bloqueando Queries**
```sql
-- Verificar políticas ativas
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Testar query como usuário específico
SET ROLE TO authenticated;
SET request.jwt.claims.sub TO 'user-uuid-here';
SELECT * FROM candidate_profiles; -- Testar acesso
```

#### **Performance Lenta**
```sql
-- Analisar query plan
EXPLAIN ANALYZE SELECT * FROM matches 
WHERE candidate_id = 'uuid-here' 
ORDER BY compatibility_score DESC;

-- Verificar índices usados
SELECT * FROM pg_stat_user_indexes 
WHERE idx_scan = 0; -- Índices não utilizados
```

#### **Constraints Falhando**
```sql
-- Ver errors de constraint
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE contype = 'c' AND connamespace = 'public'::regnamespace;
```

### **9.2 Logs & Monitoring**
```typescript
// Interceptar erros Supabase
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in:', session?.user?.id)
    // Track analytics
  }
  if (event === 'SIGNED_OUT') {
    console.log('User signed out')
    // Clear cache
  }
})
```

---

## ✅ **10. Checklist de Produção**

### **📋 Pre-Production Checklist (Completo)**
- [x] ✅ **uuid-ossp removido** - Usando gen_random_uuid()
- [x] ✅ **Índices básicos** - Criados sem CONCURRENTLY para primeira execução
- [x] ✅ **RLS per-operation** - Sem políticas FOR ALL
- [x] ✅ **Views analíticas** - Movidas para schema privado com security_invoker
- [x] ✅ **Triggers updated_at** - Adicionados a todas as tabelas necessárias
- [x] ✅ **Políticas auth.uid()** - Todas usam auth.uid() ou auth.role() apropriado
- [x] ✅ **Health check** - Query de verificação RLS incluída

### **🚀 Arquivos de Produção**
- **`/SUPABASE_SCHEMA_PRODUCTION_READY.sql`** - Schema principal
- **`/SUPABASE_INDEXES_CONCURRENT.sql`** - Índices concorrentes (opcional)
- **`/SUPABASE_HEALTH_CHECK.sql`** - Verificação completa

### **Antes de Deploy**
- [ ] Schema de produção implementado
- [ ] Health check executado e aprovado
- [ ] RLS policies testadas
- [ ] Environment variables configuradas
- [ ] Backups configurados
- [ ] Rate limiting implementado
- [ ] Monitoring configurado
- [ ] Error handling implementado
- [ ] Cache strategy definida
- [ ] Security audit realizado

### **Pós Deploy**
- [ ] Health checks funcionando
- [ ] Métricas sendo coletadas
- [ ] Alertas configurados
- [ ] Índices concorrentes adicionados (se necessário)
- [ ] Documentation atualizada
- [ ] Team treinado
- [ ] Rollback plan definido

---

## 🎯 **11. Recursos Adicionais**

### **Links Úteis**
- [Supabase Documentation](https://supabase.io/docs)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [RLS Best Practices](https://supabase.io/docs/guides/auth/row-level-security)

### **Ferramentas Recomendadas**
- **pgAdmin** - Interface gráfica para PostgreSQL
- **DataGrip** - IDE para databases
- **Grafana** - Dashboards de monitoring
- **Sentry** - Error tracking
- **New Relic** - Performance monitoring

### **Comunidade**
- [Supabase Discord](https://discord.supabase.io)
- [PostgreSQL Brasil](https://www.postgresql.org.br)
- [RAVYZ GitHub Issues](link-para-repo)

---

## 🔥 **12. Performance Benchmarks**

### **Targets de Performance**
- **Queries de Match**: < 100ms
- **Profile Searches**: < 200ms  
- **Analytics Queries**: < 500ms
- **Real-time Updates**: < 50ms

### **Scaling Metrics**
- **10K usuarios**: Single instance
- **100K usuarios**: Read replicas + caching
- **1M+ usuarios**: Sharding + microservices

Este schema foi projetado para escalar de 0 a 1M+ usuários mantendo performance excelente! 🚀