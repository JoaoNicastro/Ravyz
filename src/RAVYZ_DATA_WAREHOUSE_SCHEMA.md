# 🏗️ RAVYZ Data Warehouse Schema

## 📋 **Visão Geral**

Sistema de dados estruturado para suportar matching inteligente entre candidatos e empresas, baseado em flags estruturadas e algoritmos de compatibilidade.

---

## 🗄️ **TABELAS PRINCIPAIS**

### 1. **👥 USERS (Usuários)**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  document VARCHAR(20) UNIQUE NOT NULL, -- CPF ou CNPJ
  user_type ENUM('candidate', 'company') NOT NULL,
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  email_verified BOOLEAN DEFAULT false,
  linkedin_connected BOOLEAN DEFAULT false,
  linkedin_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  
  -- Metadados
  registration_source VARCHAR(50), -- 'web', 'mobile', 'linkedin'
  utm_source VARCHAR(100),
  utm_campaign VARCHAR(100)
);
```

### 2. **🧙‍♂️ CANDIDATE_PROFILES (Perfis de Candidatos)**
```sql
CREATE TABLE candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Dados Básicos
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  location_city VARCHAR(100),
  location_state VARCHAR(100),
  location_country VARCHAR(100) DEFAULT 'Brasil',
  birth_date DATE,
  
  -- Avatar/Mentor Selecionado
  selected_mentor JSONB, -- {name, avatar, color, category, description, specialties, personality}
  
  -- Status do Perfil
  profile_completion_percentage INTEGER DEFAULT 0,
  is_profile_public BOOLEAN DEFAULT true,
  is_seeking_job BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. **🏢 COMPANY_PROFILES (Perfis de Empresas)**
```sql
CREATE TABLE company_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Dados da Empresa
  company_name VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) NOT NULL,
  industry VARCHAR(100),
  company_size ENUM('startup', 'small', 'medium', 'large', 'enterprise'),
  founded_year INTEGER,
  website VARCHAR(255),
  description TEXT,
  
  -- Localização
  headquarters_city VARCHAR(100),
  headquarters_state VARCHAR(100),
  headquarters_country VARCHAR(100) DEFAULT 'Brasil',
  
  -- Dados de Contato
  contact_person_name VARCHAR(255),
  contact_person_role VARCHAR(100),
  contact_phone VARCHAR(20),
  
  -- Configurações
  is_profile_public BOOLEAN DEFAULT true,
  is_hiring BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. **📊 PROFESSIONAL_ASSESSMENTS (Avaliações Profissionais)**
```sql
CREATE TABLE professional_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  
  -- Resultados da Avaliação
  primary_profile VARCHAR(100) NOT NULL, -- "Líder Estratégico", "Facilitador", etc.
  secondary_profile VARCHAR(100) NOT NULL,
  profile_type ENUM('leadership', 'communication', 'analytical', 'creative', 'execution'),
  
  -- Scores por Dimensão (0-5)
  leadership_score DECIMAL(3,2),
  communication_score DECIMAL(3,2),
  analytical_score DECIMAL(3,2),
  creative_score DECIMAL(3,2),
  execution_score DECIMAL(3,2),
  
  -- Dados Estatísticos
  overall_score DECIMAL(3,2),
  percentile INTEGER, -- Posição percentil comparado a outros usuários
  assessment_duration_minutes INTEGER,
  
  -- Metadados
  questions_answered INTEGER DEFAULT 15,
  detailed_results JSONB, -- Resultados completos da avaliação
  strengths JSONB, -- Array de pontos fortes
  development_areas JSONB, -- Array de áreas de desenvolvimento
  
  completed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. **💭 DREAM_JOBS (Jobs dos Sonhos - Candidatos)**
```sql
CREATE TABLE dream_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  
  -- Posição Desejada
  position VARCHAR(255) NOT NULL,
  seniority_level ENUM('estagiario', 'junior', 'pleno', 'senior', 'especialista', 'lider', 'diretor') NOT NULL,
  
  -- Preferências de Trabalho
  work_format ENUM('presencial', 'remoto', 'hibrido') NOT NULL,
  contract_type ENUM('clt', 'pj', 'estagio', 'freelancer') NOT NULL,
  
  -- Faixa Salarial
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency VARCHAR(3) DEFAULT 'BRL',
  
  -- Preferências de Empresa
  preferred_company_sizes JSONB, -- ['startup', 'medium', 'large']
  preferred_industries JSONB, -- ['tecnologia', 'financeiro', 'saude']
  
  -- Localização
  preferred_locations JSONB, -- [{'city': 'São Paulo', 'state': 'SP', 'country': 'Brasil'}]
  open_to_relocation BOOLEAN DEFAULT false,
  
  -- Disponibilidade
  availability_start_date DATE,
  notice_period_days INTEGER DEFAULT 30,
  
  -- Flags de Matching (Estruturadas)
  matching_flags JSONB, -- Flags específicas para algoritmo de matching
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6. **💼 JOBS (Vagas - Empresas)**
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
  
  -- Dados da Vaga
  title VARCHAR(255) NOT NULL,
  description TEXT,
  seniority_level ENUM('estagiario', 'junior', 'pleno', 'senior', 'especialista', 'lider', 'diretor') NOT NULL,
  
  -- Modalidade de Trabalho
  work_format ENUM('presencial', 'remoto', 'hibrido') NOT NULL,
  contract_type ENUM('clt', 'pj', 'estagio', 'freelancer') NOT NULL,
  
  -- Localização
  job_location_city VARCHAR(100),
  job_location_state VARCHAR(100),
  job_location_country VARCHAR(100) DEFAULT 'Brasil',
  
  -- Salário
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency VARCHAR(3) DEFAULT 'BRL',
  salary_show_range BOOLEAN DEFAULT true,
  
  -- Requisitos e Benefícios
  requirements JSONB, -- Lista de requisitos estruturados
  benefits JSONB, -- Lista de benefícios estruturados
  
  -- Flags de Matching (Estruturadas)
  matching_flags JSONB, -- Flags específicas para algoritmo de matching
  target_profile_flags JSONB, -- Perfil ideal do candidato em flags
  
  -- Status da Vaga
  status ENUM('draft', 'active', 'paused', 'filled', 'cancelled') DEFAULT 'draft',
  applications_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  
  -- Datas
  expires_at TIMESTAMP,
  filled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 7. **💕 MATCHES (Sistema de Matching)**
```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  company_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
  
  -- Score de Compatibilidade
  compatibility_score DECIMAL(5,2) NOT NULL, -- 0-100
  compatibility_breakdown JSONB, -- Detalhamento do score por dimensão
  
  -- Flags de Matching Detalhadas
  profile_match_score DECIMAL(5,2), -- Compatibilidade de perfil profissional
  salary_match_score DECIMAL(5,2), -- Compatibilidade salarial
  location_match_score DECIMAL(5,2), -- Compatibilidade de localização
  work_format_match_score DECIMAL(5,2), -- Compatibilidade de modalidade
  
  -- Status do Match
  status ENUM('pending', 'candidate_liked', 'company_liked', 'mutual_match', 'candidate_passed', 'company_passed') DEFAULT 'pending',
  
  -- Ações dos Usuários
  candidate_action ENUM('like', 'pass', 'super_like') NULL,
  candidate_action_at TIMESTAMP NULL,
  company_action ENUM('like', 'pass', 'super_like') NULL,
  company_action_at TIMESTAMP NULL,
  
  -- Comunicação
  conversation_started BOOLEAN DEFAULT false,
  last_message_at TIMESTAMP NULL,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(candidate_id, job_id)
);
```

### 8. **⭐ FEEDBACK_RATINGS (Sistema de Feedback)**
```sql
CREATE TABLE feedback_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rater_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Quem está avaliando
  rated_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Quem está sendo avaliado
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  
  -- Tipo de Feedback
  feedback_type ENUM('interview_feedback', 'hire_feedback', 'process_feedback') NOT NULL,
  
  -- Avaliações Específicas
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  technical_rating INTEGER CHECK (technical_rating >= 1 AND technical_rating <= 5),
  cultural_fit_rating INTEGER CHECK (cultural_fit_rating >= 1 AND cultural_fit_rating <= 5),
  professionalism_rating INTEGER CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
  
  -- Avaliação Geral
  overall_rating DECIMAL(3,2) NOT NULL, -- Média ponderada das avaliações específicas
  
  -- Comentários
  positive_feedback TEXT,
  improvement_feedback TEXT,
  additional_comments TEXT,
  
  -- Recomendação
  would_recommend BOOLEAN,
  would_work_again BOOLEAN,
  
  -- Status
  is_public BOOLEAN DEFAULT false, -- Se pode ser exibido publicamente
  is_verified BOOLEAN DEFAULT false, -- Se foi verificado pelo sistema
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 9. **💰 SALARY_DATA (Dados Salariais de Mercado)**
```sql
CREATE TABLE salary_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação da Posição
  position_title VARCHAR(255) NOT NULL,
  seniority_level ENUM('estagiario', 'junior', 'pleno', 'senior', 'especialista', 'lider', 'diretor') NOT NULL,
  industry VARCHAR(100),
  
  -- Localização
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Brasil',
  
  -- Dados Salariais
  salary_min INTEGER,
  salary_max INTEGER,
  salary_median INTEGER,
  salary_average INTEGER,
  currency VARCHAR(3) DEFAULT 'BRL',
  
  -- Contexto
  company_size ENUM('startup', 'small', 'medium', 'large', 'enterprise'),
  work_format ENUM('presencial', 'remoto', 'hibrido'),
  
  -- Metadados
  sample_size INTEGER, -- Número de dados coletados para esta média
  confidence_level DECIMAL(3,2), -- Nível de confiança dos dados
  last_updated TIMESTAMP DEFAULT NOW(),
  
  -- Fontes
  data_source VARCHAR(100), -- 'user_reported', 'job_posts', 'surveys', 'external_api'
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 10. **💬 CONVERSATIONS (Sistema de Mensagens)**
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
  
  -- Status da Conversa
  status ENUM('active', 'paused', 'archived', 'blocked') DEFAULT 'active',
  
  -- Metadados
  last_message_at TIMESTAMP,
  messages_count INTEGER DEFAULT 0,
  
  -- Flags de Controle
  candidate_archived BOOLEAN DEFAULT false,
  company_archived BOOLEAN DEFAULT false,
  candidate_blocked BOOLEAN DEFAULT false,
  company_blocked BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Conteúdo
  message_type ENUM('text', 'file', 'system') DEFAULT 'text',
  content TEXT NOT NULL,
  file_url VARCHAR(500), -- Para anexos
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔗 **TABELAS DE RELACIONAMENTO**

### 11. **🏷️ SKILLS (Habilidades)**
```sql
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50), -- 'technical', 'soft', 'language', 'certification'
  subcategory VARCHAR(50),
  is_verified BOOLEAN DEFAULT false, -- Se é uma skill verificada pelo sistema
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE candidate_skills (
  candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert') NOT NULL,
  years_experience INTEGER,
  is_primary BOOLEAN DEFAULT false, -- Se é uma habilidade principal
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (candidate_id, skill_id)
);

CREATE TABLE job_required_skills (
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  requirement_level ENUM('nice_to_have', 'preferred', 'required', 'essential') NOT NULL,
  minimum_years_experience INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (job_id, skill_id)
);
```

### 12. **🎓 EDUCATION (Educação)**
```sql
CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  
  -- Dados da Educação
  institution_name VARCHAR(255) NOT NULL,
  degree_type ENUM('ensino_medio', 'tecnico', 'graduacao', 'pos_graduacao', 'mestrado', 'doutorado') NOT NULL,
  field_of_study VARCHAR(255),
  degree_status ENUM('completed', 'in_progress', 'incomplete') NOT NULL,
  
  -- Datas
  start_date DATE,
  end_date DATE, -- NULL se ainda em andamento
  
  -- Detalhes
  gpa DECIMAL(4,2), -- GPA ou nota média
  activities TEXT, -- Atividades extracurriculares
  description TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 13. **💼 WORK_EXPERIENCE (Experiência Profissional)**
```sql
CREATE TABLE work_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  
  -- Dados da Empresa
  company_name VARCHAR(255) NOT NULL,
  company_industry VARCHAR(100),
  company_size ENUM('startup', 'small', 'medium', 'large', 'enterprise'),
  
  -- Posição
  job_title VARCHAR(255) NOT NULL,
  employment_type ENUM('clt', 'pj', 'estagio', 'freelancer', 'voluntario') NOT NULL,
  
  -- Datas
  start_date DATE NOT NULL,
  end_date DATE, -- NULL se ainda trabalhando
  is_current_job BOOLEAN DEFAULT false,
  
  -- Localização
  location_city VARCHAR(100),
  location_state VARCHAR(100),
  location_country VARCHAR(100) DEFAULT 'Brasil',
  work_format ENUM('presencial', 'remoto', 'hibrido'),
  
  -- Descrição
  description TEXT,
  key_achievements TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📊 **TABELAS DE ANALYTICS E MÉTRICAS**

### 14. **📈 USER_ANALYTICS (Analytics de Usuário)**
```sql
CREATE TABLE user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Métricas de Engajamento
  total_logins INTEGER DEFAULT 0,
  total_session_time_minutes INTEGER DEFAULT 0,
  last_activity_at TIMESTAMP,
  
  -- Métricas Específicas por Tipo
  -- Para Candidatos
  profile_views INTEGER DEFAULT 0,
  job_applications INTEGER DEFAULT 0,
  matches_received INTEGER DEFAULT 0,
  matches_given INTEGER DEFAULT 0,
  
  -- Para Empresas
  job_posts_created INTEGER DEFAULT 0,
  candidate_views INTEGER DEFAULT 0,
  interviews_scheduled INTEGER DEFAULT 0,
  hires_made INTEGER DEFAULT 0,
  
  -- Calculado automaticamente
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 15. **🎯 MATCHING_ANALYTICS (Analytics de Matching)**
```sql
CREATE TABLE matching_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date_snapshot DATE NOT NULL,
  
  -- Métricas Globais
  total_active_candidates INTEGER,
  total_active_jobs INTEGER,
  total_matches_created INTEGER,
  total_mutual_matches INTEGER,
  
  -- Taxa de Conversão
  match_to_conversation_rate DECIMAL(5,2),
  conversation_to_interview_rate DECIMAL(5,2),
  interview_to_hire_rate DECIMAL(5,2),
  
  -- Métricas de Qualidade
  average_compatibility_score DECIMAL(5,2),
  average_feedback_rating DECIMAL(3,2),
  
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(date_snapshot)
);
```

---

## 🔄 **VIEWS E CONSULTAS IMPORTANTES**

### **View: Candidate Complete Profile**
```sql
CREATE VIEW candidate_complete_profile AS
SELECT 
  u.id as user_id,
  u.email,
  u.user_type,
  u.linkedin_connected,
  cp.full_name,
  cp.location_city,
  cp.location_state,
  cp.selected_mentor,
  pa.primary_profile,
  pa.secondary_profile,
  pa.overall_score,
  pa.percentile,
  dj.position as dream_position,
  dj.seniority_level,
  dj.salary_min,
  dj.salary_max,
  ua.profile_views,
  ua.matches_received
FROM users u
LEFT JOIN candidate_profiles cp ON u.id = cp.user_id
LEFT JOIN professional_assessments pa ON cp.id = pa.candidate_id
LEFT JOIN dream_jobs dj ON cp.id = dj.candidate_id
LEFT JOIN user_analytics ua ON u.id = ua.user_id
WHERE u.user_type = 'candidate';
```

### **View: Job with Company Info**
```sql
CREATE VIEW jobs_with_company AS
SELECT 
  j.*,
  comp.company_name,
  comp.industry,
  comp.company_size,
  comp.website,
  u.email as company_email
FROM jobs j
JOIN company_profiles comp ON j.company_id = comp.id
JOIN users u ON comp.user_id = u.id;
```

### **View: Match Quality Analysis**
```sql
CREATE VIEW match_quality_analysis AS
SELECT 
  m.id as match_id,
  m.compatibility_score,
  m.status,
  cp.full_name as candidate_name,
  comp.company_name,
  j.title as job_title,
  pa.primary_profile,
  CASE 
    WHEN m.compatibility_score >= 85 THEN 'Excellent'
    WHEN m.compatibility_score >= 70 THEN 'Good'
    WHEN m.compatibility_score >= 55 THEN 'Average'
    ELSE 'Poor'
  END as match_quality,
  m.created_at
FROM matches m
JOIN candidate_profiles cp ON m.candidate_id = cp.id
JOIN company_profiles comp ON m.company_id = comp.id
JOIN jobs j ON m.job_id = j.id
LEFT JOIN professional_assessments pa ON cp.id = pa.candidate_id;
```

---

## 🚀 **ÍNDICES PARA PERFORMANCE**

```sql
-- Índices para queries de matching
CREATE INDEX idx_matches_compatibility_score ON matches(compatibility_score DESC);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_candidate_company ON matches(candidate_id, company_id);

-- Índices para busca de candidatos
CREATE INDEX idx_candidate_profiles_location ON candidate_profiles(location_city, location_state);
CREATE INDEX idx_professional_assessments_profile ON professional_assessments(primary_profile, secondary_profile);
CREATE INDEX idx_dream_jobs_position_seniority ON dream_jobs(position, seniority_level);

-- Índices para busca de vagas
CREATE INDEX idx_jobs_location_seniority ON jobs(job_location_city, job_location_state, seniority_level);
CREATE INDEX idx_jobs_status_created ON jobs(status, created_at DESC);
CREATE INDEX idx_jobs_salary_range ON jobs(salary_min, salary_max);

-- Índices para analytics
CREATE INDEX idx_user_analytics_user_activity ON user_analytics(user_id, last_activity_at);
CREATE INDEX idx_feedback_ratings_overall ON feedback_ratings(overall_rating DESC, created_at DESC);
```

---

## 🔧 **TRIGGERS E FUNÇÕES**

### **Trigger: Update Analytics on New Match**
```sql
CREATE OR REPLACE FUNCTION update_match_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar contadores de match para candidato
  UPDATE user_analytics 
  SET matches_received = matches_received + 1
  WHERE user_id = (SELECT user_id FROM candidate_profiles WHERE id = NEW.candidate_id);
  
  -- Atualizar contadores para empresa
  UPDATE user_analytics 
  SET matches_given = matches_given + 1
  WHERE user_id = (SELECT user_id FROM company_profiles WHERE id = NEW.company_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_match_analytics
AFTER INSERT ON matches
FOR EACH ROW EXECUTE FUNCTION update_match_analytics();
```

---

## 📝 **NOTAS IMPORTANTES**

### **🔒 Segurança e Privacidade**
- Todos os dados pessoais devem ser criptografados em repouso
- Senhas armazenadas apenas como hash bcrypt
- Logs de auditoria para alterações em dados sensíveis
- LGPD compliance para dados de usuários brasileiros

### **⚡ Performance e Escalabilidade**
- Particionamento por data para tabelas de analytics
- Caching de queries frequentes (Redis)
- Indexação otimizada para queries de matching
- Arquivamento automático de dados antigos

### **🎯 Algoritmo de Matching**
- Base nas flags estruturadas de `matching_flags`
- Pesos configuráveis por dimensão
- Machine learning para otimização contínua
- A/B testing para diferentes versões do algoritmo

### **📊 Data Warehouse**
- ETL diário para métricas agregadas
- Snapshots históricos para análise temporal
- Data lake para dados não estruturados
- BI tools integration (Metabase, Tableau)

Este schema suporta completamente todas as funcionalidades implementadas no RAVYZ e permite crescimento futuro com novas features!