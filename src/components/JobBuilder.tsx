import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, User, GraduationCap, Building2, Code, Users, Brain, ChevronRight, Factory, Briefcase, DollarSign, Gift, MapPin } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { RavyzButton } from "./RavyzButton";
import ravyzLogo from 'figma:asset/8960371eebb802b3117a00de4cf27c5cf9c567af.png';

interface JobData {
  // Informações Básicas
  gender: string;
  ageRanges: string[];
  
  // Formação (múltipla escolha)
  education: string[];
  institutions: string[];
  
  // Setores/Indústrias (múltipla escolha)
  industries: string[];
  
  // Experiência
  companies: string[];
  
  // Informações da Vaga
  title: string;
  department: string;
  
  // Posição e Atribuições
  position: string;
  responsibilities: string[];
  
  // Hard Skills (6) - baseado na vaga
  hardSkills: string[];
  
  // Soft Skills (6) - com intensidade 1-5
  softSkills: {
    leadership: number;
    communication: number;
    problemSolving: number;
    creativity: number;
    teamwork: number;
    adaptability: number;
  };
  
  // Traços de Personalidade - com intensidade 1-5
  personality: {
    analytical: number;
    extroversion: number;
    innovation: number;
    resilience: number;
    attention: number;
    autonomy: number;
  };
  
  // Salário e Benefícios
  salary: {
    min: number;
    max: number;
  };
  benefits: string[];
  workModel: string;
  location: string;
}

interface JobBuilderProps {
  onComplete: (jobData: JobData) => void;
  onBack: () => void;
}

export function JobBuilder({ onComplete, onBack }: JobBuilderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [jobData, setJobData] = useState<JobData>({
    gender: '',
    ageRanges: [],
    education: [],
    institutions: [],
    industries: [],
    companies: [],
    title: '',
    department: '',
    position: '',
    responsibilities: [],
    hardSkills: [],
    softSkills: {
      leadership: 3,
      communication: 3,
      problemSolving: 3,
      creativity: 3,
      teamwork: 3,
      adaptability: 3
    },
    personality: {
      analytical: 3,
      extroversion: 3,
      innovation: 3,
      resilience: 3,
      attention: 3,
      autonomy: 3
    },
    salary: {
      min: 0,
      max: 0
    },
    benefits: [],
    workModel: '',
    location: ''
  });

  const totalSteps = 11;

  const genderOptions = [
    { value: 'any', label: 'Indiferente' },
    { value: 'male', label: 'Masculino' },
    { value: 'female', label: 'Feminino' },
    { value: 'other', label: 'Outros' }
  ];

  const ageRanges = [
    { value: '18-25', label: '18-25 anos' },
    { value: '26-35', label: '26-35 anos' },
    { value: '36-45', label: '36-45 anos' },
    { value: '46-55', label: '46-55 anos' },
    { value: '55+', label: '55+ anos' },
    { value: 'any', label: 'Indiferente' }
  ];

  const educationLevels = [
    { value: 'high-school', label: 'Ensino Médio' },
    { value: 'technical', label: 'Técnico' },
    { value: 'bachelor', label: 'Superior Completo' },
    { value: 'postgrad', label: 'Pós-graduação' },
    { value: 'mba', label: 'MBA' },
    { value: 'masters', label: 'Mestrado' },
    { value: 'phd', label: 'Doutorado' }
  ];

  const commonInstitutions = [
    'USP', 'UFRJ', 'UFMG', 'PUC-SP', 'PUC-RJ', 'Mackenzie', 'FEI', 
    'Insper', 'FGV', 'ESPM', 'Anhembi Morumbi', 'UniCamp', 'UFSC',
    'UFRGS', 'UnB', 'UFC', 'UFPE', 'UFBA', 'SENAC', 'SENAI'
  ];

  // Array expandido de indústrias com mais empresas
  const industries = [
    { 
      value: 'technology', 
      label: 'Tecnologia', 
      icon: '💻',
      companies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Spotify', 'Nubank', 'Stone', 'PagSeguro', 'iFood', 'Mercado Livre', '99', 'Uber', 'Rappi', 'Loggi', 'Gympass', 'QuintoAndar', 'GetNinjas', 'Creditas', 'Loft', 'Quinto Andar', 'Conta Azul', 'RD Station', 'Resultados Digitais']
    },
    { 
      value: 'finance', 
      label: 'Financeiro', 
      icon: '💰',
      companies: ['Itaú', 'Bradesco', 'Santander', 'Nubank', 'XP Investimentos', 'BTG Pactual', 'Inter', 'C6 Bank', 'Original', 'Safra', 'Banco do Brasil', 'Caixa', 'Stone', 'PagSeguro', 'Cielo', 'Elo', 'Visa', 'Mastercard', 'Warren', 'Rico', 'Clear', 'Modal', 'Toro', 'GuiaBolso', 'Creditas']
    },
    { 
      value: 'retail', 
      label: 'Varejo', 
      icon: '🛒',
      companies: ['Magazine Luiza', 'Via', 'Americanas', 'Amazon', 'Mercado Livre', 'Carrefour', 'Pão de Açúcar', 'Extra', 'Casas Bahia', 'Shopee', 'AliExpress', 'Submarino', 'Netshoes', 'Dafiti', 'Zara', 'C&A', 'Renner', 'Riachuelo', 'Centauro', 'Decathlon', 'Lojas Americanas', 'Fast Shop', 'Fnac', 'Ricardo Eletro', 'Ponto Frio']
    },
    { 
      value: 'healthcare', 
      label: 'Saúde', 
      icon: '🏥',
      companies: ['Amil', 'SulAmérica', 'Unimed', 'Hapvida', 'NotreDame', 'Hospital Albert Einstein', 'Hospital Sírio-Libanês', 'Rede D\'Or', 'Prevent Senior', 'Bradesco Saúde', 'Porto Seguro Saúde', 'Golden Cross', 'Omint', 'Allianz Care', 'Telemedicina', 'Doctoralia', 'DASA', 'Fleury', 'Hermes Pardini', 'Grupo Fleury']
    },
    { 
      value: 'consulting', 
      label: 'Consultoria', 
      icon: '📊',
      companies: ['McKinsey', 'BCG', 'Bain', 'Deloitte', 'PwC', 'KPMG', 'EY', 'Accenture', 'IBM', 'Monitor Deloitte', 'Oliver Wyman', 'Roland Berger', 'A.T. Kearney', 'Strategy&', 'Capgemini', 'Tata Consultancy', 'Infosys', 'Cognizant', 'Wipro', 'HCL', 'Thoughtworks', 'CI&T', 'Stefanini', 'Globant', 'Avenue Code']
    },
    { 
      value: 'education', 
      label: 'Educação', 
      icon: '🎓',
      companies: ['Kroton', 'Estácio', 'Unip', 'Anhanguera', 'UNINOVE', 'FGV', 'Insper', 'Descomplica', 'Alura', 'Coursera', 'Udemy', 'Khan Academy', 'Veduca', 'FIAP', 'Impacta', 'Senac', 'Senai', 'Poliedro', 'Anglo', 'Objetivo', 'COC', 'Etapa', 'Mackenzie', 'ESPM', 'FIA']
    },
    { 
      value: 'energy', 
      label: 'Energia', 
      icon: '⚡',
      companies: ['Petrobras', 'Vale', 'Eletrobras', 'CPFL', 'Cemig', 'Copel', 'Equatorial', 'EDP Brasil', 'Shell Brasil', 'Raízen', 'Ultrapar', 'Ipiranga', 'Vibra', 'Engie', 'Enel', 'Light', 'AES Brasil', 'Neoenergia', 'Omega Energia', 'Casa dos Ventos', 'Cosan', 'BR Distribuidora', 'Total', 'Chevron', 'BP']
    },
    { 
      value: 'automotive', 
      label: 'Automotivo', 
      icon: '🚗',
      companies: ['Volkswagen', 'GM', 'Ford', 'Fiat', 'Toyota', 'Honda', 'Hyundai', 'Mercedes-Benz', 'BMW', 'Audi', 'Nissan', 'Renault', 'Peugeot', 'Citroën', 'Jeep', 'Land Rover', 'Volvo', 'Scania', 'Mercedes Trucks', 'Iveco', 'Mahle', 'Bosch', 'Continental', 'Marcopolo', 'WEG']
    },
    { 
      value: 'media', 
      label: 'Mídia', 
      icon: '📺',
      companies: ['Globo', 'SBT', 'Record', 'Band', 'RedeTV', 'Folha', 'Estadão', 'UOL', 'G1', 'Abril', 'Globosat', 'ESPN', 'Fox', 'Discovery', 'CNN Brasil', 'GloboNews', 'Jovem Pan', 'CBN', 'Rádio Bandeirantes', 'Mix FM', 'Eldorado', 'Cultura', 'TV Brasil', 'Veja', 'Exame']
    },
    { 
      value: 'logistics', 
      label: 'Logística', 
      icon: '📦',
      companies: ['Correios', 'Loggi', 'Total Express', 'Braspress', 'Jamef', 'Mercado Envios', 'Amazon Logística', 'DHL', 'FedEx', 'UPS', 'TNT', 'Sequoia', 'Azul Cargo', 'GOL Log', 'Patrus', 'Rodomar', 'Rodonaves', 'Transportadora Americana', 'JSL', 'Movida', 'Jadlog', 'Grupo Simpar', 'Localiza', 'Unidas', 'Grupo JSL']
    },
    { 
      value: 'food', 
      label: 'Alimentação', 
      icon: '🍔',
      companies: ['iFood', 'Uber Eats', 'Rappi', 'McDonald\'s', 'Burger King', 'KFC', 'Subway', 'Domino\'s', 'Pizza Hut', 'Outback', 'Giraffas', 'Bob\'s', 'Habib\'s', 'China in Box', 'Spoleto', 'Starbucks', 'Café do Ponto', 'Kopenhagen', 'Cacau Show', 'Chocolates Brasil', 'JBS', 'BRF', 'Minerva', 'Marfrig', 'Nestlé']
    },
    { 
      value: 'ecommerce', 
      label: 'E-commerce', 
      icon: '🛍️',
      companies: ['Mercado Livre', 'Amazon', 'Americanas', 'Magazine Luiza', 'Via', 'Shopee', 'AliExpress', 'Submarino', 'Casas Bahia', 'Extra', 'Dafiti', 'Netshoes', 'Centauro', 'Zara', 'C&A', 'Renner', 'OLX', 'Enjoei', 'Repassa', 'Vinted', 'Loja Integrada', 'VTEX', 'Tray', 'Nuvemshop', 'WooCommerce']
    }
  ];

  const departments = [
    'Tecnologia', 'Desenvolvimento', 'DevOps', 'Data Science', 'Cybersecurity',
    'Design', 'UX/UI', 'Marketing', 'Vendas', 'Business Development',
    'Produto', 'Recursos Humanos', 'Financeiro', 'Operações', 'Jurídico',
    'Customer Success', 'Consultoria', 'Estratégia', 'Inovação'
  ];

  const getPositionsForDepartment = (department: string): string[] => {
    const positionsMap: { [key: string]: string[] } = {
      'Tecnologia': ['Desenvolvedor Jr', 'Desenvolvedor Pleno', 'Desenvolvedor Sênior', 'Tech Lead', 'Arquiteto de Software', 'CTO'],
      'Desenvolvimento': ['Frontend Jr', 'Frontend Pleno', 'Frontend Sênior', 'Backend Jr', 'Backend Pleno', 'Backend Sênior', 'Full Stack Jr', 'Full Stack Pleno', 'Full Stack Sênior'],
      'DevOps': ['DevOps Jr', 'DevOps Pleno', 'DevOps Sênior', 'Site Reliability Engineer', 'Cloud Architect', 'Infrastructure Lead'],
      'Data Science': ['Analista de Dados Jr', 'Analista de Dados Pleno', 'Data Scientist Jr', 'Data Scientist Pleno', 'Data Scientist Sênior', 'ML Engineer', 'Head of Data'],
      'Design': ['Designer Jr', 'Designer Pleno', 'Designer Sênior', 'Art Director', 'Head of Design', 'Creative Director'],
      'UX/UI': ['UX Designer Jr', 'UX Designer Pleno', 'UX Designer Sênior', 'UI Designer Jr', 'UI Designer Pleno', 'UI Designer Sênior', 'Product Designer', 'UX Research'],
      'Marketing': ['Analista de Marketing Jr', 'Analista de Marketing Pleno', 'Coordenador de Marketing', 'Gerente de Marketing', 'Head of Marketing', 'CMO'],
      'Vendas': ['SDR', 'BDR', 'Account Executive Jr', 'Account Executive Pleno', 'Account Executive Sênior', 'Sales Manager', 'Head of Sales'],
      'Produto': ['Product Owner Jr', 'Product Owner Pleno', 'Product Manager Jr', 'Product Manager Pleno', 'Senior Product Manager', 'Head of Product', 'CPO'],
      'Recursos Humanos': ['Analista de RH Jr', 'Analista de RH Pleno', 'Business Partner Jr', 'Business Partner Pleno', 'Gerente de RH', 'Head of People', 'CHRO'],
      'Financeiro': ['Analista Financeiro Jr', 'Analista Financeiro Pleno', 'Coordenador Financeiro', 'Gerente Financeiro', 'Controller', 'CFO'],
      'Customer Success': ['Customer Success Jr', 'Customer Success Pleno', 'Customer Success Sênior', 'Customer Success Manager', 'Head of Customer Success'],
      'Operações': ['Analista de Operações Jr', 'Analista de Operações Pleno', 'Coordenador de Operações', 'Gerente de Operações', 'Head of Operations', 'COO']
    };

    return positionsMap[department] || ['Analista Jr', 'Analista Pleno', 'Coordenador', 'Gerente', 'Head', 'Diretor'];
  };

  const getResponsibilitiesForPosition = (department: string, position: string): string[] => {
    const responsibilitiesMap: { [key: string]: { [key: string]: string[] } } = {
      'Desenvolvimento': {
        'Frontend Jr': ['Desenvolver interfaces de usuário', 'Implementar designs responsivos', 'Integrar APIs', 'Participar de code reviews', 'Aprender novas tecnologias'],
        'Frontend Pleno': ['Liderar desenvolvimento de features', 'Mentorizar developers junior', 'Definir arquitetura frontend', 'Otimizar performance', 'Colaborar com designers'],
        'Frontend Sênior': ['Definir padrões de código', 'Arquitetar soluções complexas', 'Liderar projetos técnicos', 'Mentorizar equipe', 'Tomar decisões técnicas estratégicas'],
        'Backend Jr': ['Desenvolver APIs REST', 'Implementar business logic', 'Trabalhar com banco de dados', 'Escrever testes unitários', 'Documentar código'],
        'Backend Pleno': ['Projetar APIs escaláveis', 'Otimizar queries de banco', 'Implementar padrões arquiteturais', 'Code review', 'Mentorizar junior developers'],
        'Backend Sênior': ['Definir arquitetura de sistemas', 'Liderar projetos backend', 'Mentoriar equipe técnica', 'Tomar decisões de tecnologia', 'Garantir escalabilidade']
      },
      'Marketing': {
        'Analista de Marketing Jr': ['Executar campanhas digitais', 'Criar conteúdo para redes sociais', 'Analisar métricas básicas', 'Apoiar eventos', 'Pesquisar mercado'],
        'Analista de Marketing Pleno': ['Planejar campanhas integradas', 'Gerenciar orçamento de mídia', 'Analisar ROI detalhadamente', 'Coordenar fornecedores', 'Otimizar conversões'],
        'Coordenador de Marketing': ['Coordenar equipe de marketing', 'Planejar estratégias de canal', 'Gerenciar cronogramas', 'Reportar resultados', 'Desenvolver processos'],
        'Gerente de Marketing': ['Definir estratégia de marketing', 'Gerenciar budget total', 'Liderar equipe', 'Reportar para diretoria', 'Parcerias estratégicas'],
        'Head of Marketing': ['Definir visão de marketing', 'Construir e liderar time', 'Estratégia de crescimento', 'Reportar para C-level', 'Transformação digital']
      }
    };

    const deptResponsibilities = responsibilitiesMap[department];
    if (deptResponsibilities && deptResponsibilities[position]) {
      return deptResponsibilities[position];
    }

    if (position.includes('Jr')) {
      return ['Executar tarefas operacionais', 'Aprender processos internos', 'Apoiar projetos da equipe', 'Desenvolver habilidades técnicas', 'Colaborar com colegas'];
    } else if (position.includes('Pleno')) {
      return ['Liderar projetos específicos', 'Mentorizar profissionais junior', 'Otimizar processos existentes', 'Colaborar com outras áreas', 'Propor melhorias'];
    } else if (position.includes('Sênior') || position.includes('Lead')) {
      return ['Definir estratégias técnicas', 'Liderar equipe', 'Mentorizar profissionais', 'Tomar decisões complexas', 'Representar área em projetos'];
    } else if (position.includes('Head') || position.includes('Diretor') || position.includes('C')) {
      return ['Definir visão estratégica', 'Construir e liderar time', 'Gerenciar orçamento da área', 'Reportar para alta liderança', 'Desenvolver parcerias'];
    }

    return ['Executar atividades da função', 'Colaborar com equipe', 'Atingir metas estabelecidas', 'Desenvolver competências', 'Contribuir para resultados'];
  };

  const getHardSkillsForPosition = (department: string, position: string): string[] => {
    const skillsMap: { [key: string]: string[] } = {
      'Tecnologia': ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git', 'TypeScript', 'MongoDB', 'PostgreSQL'],
      'Desenvolvimento': ['JavaScript', 'Python', 'React', 'Node.js', 'Git', 'SQL', 'HTML/CSS', 'TypeScript', 'Vue.js', 'Angular', 'Redux', 'GraphQL'],
      'DevOps': ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Ansible', 'Linux', 'Git', 'Python', 'Bash', 'Monitoring', 'CI/CD'],
      'Data Science': ['Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas', 'NumPy', 'Jupyter', 'Tableau', 'Power BI', 'Statistics', 'Big Data'],
      'Design': ['Figma', 'Adobe Creative Suite', 'Sketch', 'Prototyping', 'UI/UX Design', 'Design Systems', 'Adobe XD', 'InVision', 'Principle', 'After Effects'],
      'UX/UI': ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research', 'Wireframing', 'Design Systems', 'Usability Testing', 'Information Architecture'],
      'Marketing': ['Google Ads', 'Facebook Ads', 'SEO', 'SEM', 'Google Analytics', 'Social Media', 'Content Marketing', 'Email Marketing', 'CRO', 'Growth Hacking'],
      'Vendas': ['Salesforce', 'HubSpot', 'CRM', 'Pipeline Management', 'Negociação', 'Prospecção', 'Closing', 'Account Management', 'Sales Analytics'],
      'Produto': ['Product Management', 'Roadmapping', 'Agile', 'Scrum', 'User Stories', 'Analytics', 'A/B Testing', 'Wireframing', 'Market Research', 'SQL'],
      'Recursos Humanos': ['Recrutamento', 'Gestão de Talentos', 'Treinamento', 'Performance Management', 'HRIS', 'Compensation', 'Employee Relations', 'Compliance'],
      'Financeiro': ['Excel Avançado', 'SAP', 'Oracle', 'Modelagem Financeira', 'Valuation', 'Bloomberg', 'VBA', 'R', 'Python', 'Risk Management', 'Compliance'],
      'Operações': ['Process Improvement', 'Lean Six Sigma', 'Project Management', 'Supply Chain', 'ERP', 'Operations Research', 'Quality Management'],
      'Customer Success': ['CRM', 'Customer Analytics', 'Onboarding', 'Retention Strategy', 'Support Tools', 'Data Analysis', 'Communication', 'Problem Solving']
    };

    return skillsMap[department] || [
      'Excel', 'PowerPoint', 'Project Management', 'Communication', 'Problem Solving', 
      'Data Analysis', 'Leadership', 'Strategic Thinking', 'Teamwork', 'Adaptability'
    ];
  };

  const benefits = [
    { id: 'health', name: 'Plano de Saúde', icon: '🏥' },
    { id: 'dental', name: 'Plano Odontológico', icon: '🦷' },
    { id: 'meal', name: 'Vale Alimentação', icon: '🍽️' },
    { id: 'transport', name: 'Vale Transporte', icon: '🚌' },
    { id: 'education', name: 'Auxílio Educação', icon: '📚' },
    { id: 'gym', name: 'Gympass', icon: '💪' },
    { id: 'daycare', name: 'Auxílio Creche', icon: '👶' },
    { id: 'life', name: 'Seguro de Vida', icon: '🛡️' },
    { id: 'bonus', name: 'Bônus por Performance', icon: '💎' },
    { id: 'stock', name: 'Stock Options', icon: '📈' },
    { id: 'flexible', name: 'Horário Flexível', icon: '⏰' },
    { id: 'vacation', name: 'Férias Estendidas', icon: '🌴' }
  ];

  const workModels = [
    { value: 'presencial', label: 'Presencial', icon: '🏢', desc: '100% no escritório' },
    { value: 'hibrido', label: 'Híbrido', icon: '🔄', desc: 'Flexibilidade entre casa e escritório' },
    { value: 'remoto', label: 'Remoto', icon: '🏠', desc: '100% trabalho remoto' }
  ];

  const updateJobData = (field: keyof JobData, value: any) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  };

  const updateSoftSkill = (skill: keyof JobData['softSkills'], value: number) => {
    setJobData(prev => ({
      ...prev,
      softSkills: { ...prev.softSkills, [skill]: value }
    }));
  };

  const updatePersonality = (trait: keyof JobData['personality'], value: number) => {
    setJobData(prev => ({
      ...prev,
      personality: { ...prev.personality, [trait]: value }
    }));
  };

  const toggleArrayItem = (field: keyof JobData, item: string) => {
    const currentArray = jobData[field] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateJobData(field, newArray);
  };

  const formatNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parseNumber = (value: string) => {
    return parseInt(value.replace(/\./g, '') || '0');
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(jobData);
    }
  };

  // Função melhorada para obter empresas das indústrias selecionadas
  const getCompaniesForIndustries = () => {
    console.log('🔍 Debug - jobData.industries:', jobData.industries);
    console.log('🔍 Debug - Total industries available:', industries.length);
    
    if (!jobData.industries || jobData.industries.length === 0) {
      console.log('❌ No industries selected');
      return [];
    }

    const allCompanies: string[] = [];
    
    jobData.industries.forEach(industryValue => {
      console.log('🔍 Debug - Looking for industry:', industryValue);
      const industry = industries.find(ind => ind.value === industryValue);
      if (industry) {
        console.log(`✅ Found industry ${industry.label} with ${industry.companies.length} companies`);
        allCompanies.push(...industry.companies);
      } else {
        console.log(`❌ Industry not found:`, industryValue);
      }
    });
    
    // Remove duplicatas e ordena alfabeticamente
    const uniqueCompanies = [...new Set(allCompanies)].sort();
    console.log('📊 Debug - Total unique companies found:', uniqueCompanies.length);
    
    return uniqueCompanies;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-ravyz-orange rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Perfil Básico do Candidato
              </h2>
              <p className="text-gray-600">
                Defina as características básicas que você procura
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Gênero</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {genderOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateJobData('gender', option.value)}
                      className={`
                        p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200
                        ${jobData.gender === option.value
                          ? 'border-ravyz-orange bg-ravyz-orange text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-ravyz-orange/50'
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Faixa Etária (múltipla escolha)</h3>
                  <Badge variant="secondary">
                    {jobData.ageRanges.length} selecionados
                  </Badge>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {ageRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => toggleArrayItem('ageRanges', range.value)}
                      className={`
                        p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200
                        ${jobData.ageRanges.includes(range.value)
                          ? 'border-ravyz-orange bg-ravyz-orange text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-ravyz-orange/50'
                        }
                      `}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
                {jobData.ageRanges.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {jobData.ageRanges.map((ageValue) => {
                      const ageRange = ageRanges.find(age => age.value === ageValue);
                      return (
                        <Badge key={ageValue} variant="secondary" className="bg-ravyz-orange/10 text-ravyz-orange">
                          {ageRange?.label}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-ravyz-purple rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Formação Acadêmica
              </h2>
              <p className="text-gray-600">
                Qual o nível de formação e instituições preferidas?
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Nível de Formação (múltipla escolha)</h3>
                  <Badge variant="secondary">
                    {jobData.education.length} selecionados
                  </Badge>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {educationLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => toggleArrayItem('education', level.value)}
                      className={`
                        p-4 rounded-lg border-2 text-left transition-all duration-200
                        ${jobData.education.includes(level.value)
                          ? 'border-ravyz-purple bg-ravyz-purple text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-ravyz-purple/50'
                        }
                      `}
                    >
                      <div className="font-medium">{level.label}</div>
                    </button>
                  ))}
                </div>
                {jobData.education.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {jobData.education.map((eduValue) => {
                      const education = educationLevels.find(edu => edu.value === eduValue);
                      return (
                        <Badge key={eduValue} variant="secondary" className="bg-ravyz-purple/10 text-ravyz-purple">
                          {education?.label}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Instituições Preferidas (opcional)</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Selecione até 8 instituições que você considera referência
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
                  {commonInstitutions.map((institution) => (
                    <button
                      key={institution}
                      onClick={() => toggleArrayItem('institutions', institution)}
                      disabled={!jobData.institutions.includes(institution) && jobData.institutions.length >= 8}
                      className={`
                        p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200
                        ${jobData.institutions.includes(institution)
                          ? 'border-ravyz-purple bg-ravyz-purple text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-ravyz-purple/50 disabled:opacity-50 disabled:cursor-not-allowed'
                        }
                      `}
                    >
                      {institution}
                    </button>
                  ))}
                </div>
                {jobData.institutions.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {jobData.institutions.map((institution) => (
                      <Badge key={institution} variant="secondary" className="bg-ravyz-purple/10 text-ravyz-purple">
                        {institution}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-ravyz-blue rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Setores e Indústrias
              </h2>
              <p className="text-gray-600">
                Em quais setores você gostaria que o candidato tenha experiência?
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Setores de Interesse (múltipla escolha)</h3>
                <Badge variant="secondary">
                  {jobData.industries.length} selecionados
                </Badge>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {industries.map((industry) => (
                  <button
                    key={industry.value}
                    onClick={() => toggleArrayItem('industries', industry.value)}
                    className={`
                      p-4 rounded-lg border-2 text-left transition-all duration-200
                      ${jobData.industries.includes(industry.value)
                        ? 'border-ravyz-blue bg-ravyz-blue text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-ravyz-blue/50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{industry.icon}</span>
                      <div>
                        <div className="font-medium">{industry.label}</div>
                        <div className={`text-sm ${jobData.industries.includes(industry.value) ? 'text-white/80' : 'text-gray-500'}`}>
                          {industry.companies.slice(0, 3).join(', ')}...
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {jobData.industries.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {jobData.industries.map((industryValue) => {
                    const industry = industries.find(ind => ind.value === industryValue);
                    return (
                      <Badge key={industryValue} variant="secondary" className="bg-ravyz-blue/10 text-ravyz-blue">
                        {industry?.icon} {industry?.label}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        );

      case 4:
        const companiesFromIndustries = getCompaniesForIndustries();
        
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-ravyz-green rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Factory className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Experiência em Empresas
              </h2>
              <p className="text-gray-600">
                Há empresas específicas onde você valoriza experiência prévia?
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Empresas de Interesse (opcional)</h3>
                <Badge variant="secondary">
                  {jobData.companies.length} selecionadas
                </Badge>
              </div>
              
              {/* Debug Info - Remover em produção */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-xs text-yellow-800">
                    <strong>Debug:</strong> Indústrias selecionadas: {JSON.stringify(jobData.industries)} | 
                    Empresas encontradas: {companiesFromIndustries.length}
                  </p>
                </div>
              )}
              
              {jobData.industries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">
                    Selecione pelo menos um setor na etapa anterior para ver empresas relevantes
                  </p>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="text-ravyz-blue font-medium hover:underline"
                  >
                    ← Voltar para Setores
                  </button>
                </div>
              ) : companiesFromIndustries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                    <Factory className="w-8 h-8 text-red-400" />
                  </div>
                  <p className="text-red-500 mb-4">
                    ⚠️ Erro: Nenhuma empresa encontrada para os setores selecionados
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Setores selecionados: {jobData.industries.join(', ')}
                  </p>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="text-ravyz-blue font-medium hover:underline"
                  >
                    ← Voltar e verificar setores
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      💡 <strong>{companiesFromIndustries.length} empresas disponíveis</strong> baseadas nos setores selecionados:
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {jobData.industries.map(industryValue => {
                        const industry = industries.find(ind => ind.value === industryValue);
                        return industry ? (
                          <span key={industryValue} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {industry.icon} {industry.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Selecione até 10 empresas onde você valoriza experiência prévia do candidato.
                  </p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto border border-gray-100 rounded-lg p-4">
                    {companiesFromIndustries.map((company, index) => (
                      <button
                        key={`${company}-${index}`}
                        onClick={() => toggleArrayItem('companies', company)}
                        disabled={!jobData.companies.includes(company) && jobData.companies.length >= 10}
                        className={`
                          p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200
                          ${jobData.companies.includes(company)
                            ? 'border-ravyz-green bg-ravyz-green text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-ravyz-green/50 disabled:opacity-50 disabled:cursor-not-allowed'
                          }
                        `}
                      >
                        {company}
                      </button>
                    ))}
                  </div>
                  
                  {jobData.companies.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Empresas selecionadas ({jobData.companies.length}/10):
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {jobData.companies.map((company) => (
                          <Badge 
                            key={company} 
                            variant="secondary" 
                            className="bg-ravyz-green/10 text-ravyz-green cursor-pointer hover:bg-ravyz-green/20"
                            onClick={() => toggleArrayItem('companies', company)}
                          >
                            {company}
                            <span className="ml-1 text-ravyz-green/70 hover:text-ravyz-green">×</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {jobData.companies.length === 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 text-center">
                        💭 Nenhuma empresa selecionada ainda. Esta etapa é opcional.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-ravyz-orange rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Informações da Vaga
              </h2>
              <p className="text-gray-600">
                Vamos definir o cargo e departamento
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título da Vaga
                </label>
                <input
                  type="text"
                  value={jobData.title}
                  onChange={(e) => updateJobData('title', e.target.value)}
                  placeholder="Ex: Desenvolvedor Frontend Sênior"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ravyz-orange focus:border-transparent"
                />
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Departamento</h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {departments.map((department) => (
                    <button
                      key={department}
                      onClick={() => updateJobData('department', department)}
                      className={`
                        p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200
                        ${jobData.department === department
                          ? 'border-ravyz-orange bg-ravyz-orange text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-ravyz-orange/50'
                        }
                      `}
                    >
                      {department}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-ravyz-purple rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Posição e Responsabilidades
              </h2>
              <p className="text-gray-600">
                Defina o nível hierárquico e principais atribuições
              </p>
            </div>

            <div className="space-y-6">
              {jobData.department && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Posição</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {getPositionsForDepartment(jobData.department).map((position) => (
                      <button
                        key={position}
                        onClick={() => {
                          updateJobData('position', position);
                          updateJobData('responsibilities', getResponsibilitiesForPosition(jobData.department, position));
                        }}
                        className={`
                          p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200
                          ${jobData.position === position
                            ? 'border-ravyz-purple bg-ravyz-purple text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-ravyz-purple/50'
                          }
                        `}
                      >
                        {position}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {jobData.position && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Principais Responsabilidades</h3>
                  <div className="space-y-2">
                    {jobData.responsibilities.map((responsibility, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 bg-ravyz-purple rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-medium">{index + 1}</span>
                        </div>
                        <span className="text-gray-700">{responsibility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 7:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-ravyz-blue rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Hard Skills
              </h2>
              <p className="text-gray-600">
                Competências técnicas essenciais para a vaga
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Habilidades Técnicas (selecione até 8)</h3>
                <Badge variant="secondary">
                  {jobData.hardSkills.length}/8 selecionadas
                </Badge>
              </div>
              
              {jobData.department ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Baseado no departamento {jobData.department} e posição {jobData.position}
                  </p>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {getHardSkillsForPosition(jobData.department, jobData.position).map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleArrayItem('hardSkills', skill)}
                        disabled={!jobData.hardSkills.includes(skill) && jobData.hardSkills.length >= 8}
                        className={`
                          p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200
                          ${jobData.hardSkills.includes(skill)
                            ? 'border-ravyz-blue bg-ravyz-blue text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-ravyz-blue/50 disabled:opacity-50 disabled:cursor-not-allowed'
                          }
                        `}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  {jobData.hardSkills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {jobData.hardSkills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-ravyz-blue/10 text-ravyz-blue">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Selecione um departamento e posição nas etapas anteriores para ver habilidades relevantes
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 8:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-ravyz-green rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Soft Skills
              </h2>
              <p className="text-gray-600">
                Defina o nível de importância de cada competência comportamental
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-6">Competências Comportamentais</h3>
              <div className="space-y-6">
                {Object.entries({
                  leadership: 'Liderança',
                  communication: 'Comunicação',
                  problemSolving: 'Resolução de Problemas',
                  creativity: 'Criatividade',
                  teamwork: 'Trabalho em Equipe',
                  adaptability: 'Adaptabilidade'
                }).map(([key, label]) => (
                  <div key={key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-medium text-gray-700">{label}</label>
                      <span className="text-sm text-gray-500">
                        Nível {jobData.softSkills[key as keyof typeof jobData.softSkills]}
                      </span>
                    </div>
                    <Slider
                      value={[jobData.softSkills[key as keyof typeof jobData.softSkills]]}
                      onValueChange={(value) => updateSoftSkill(key as keyof typeof jobData.softSkills, value[0])}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>1 - Pouco importante</span>
                      <span>5 - Muito importante</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 9:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-ravyz-purple rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Perfil de Personalidade
              </h2>
              <p className="text-gray-600">
                Defina os traços de personalidade ideais para a vaga
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-6">Traços de Personalidade</h3>
              <div className="space-y-6">
                {Object.entries({
                  analytical: 'Perfil Analítico',
                  extroversion: 'Extroversão',
                  innovation: 'Inovação',
                  resilience: 'Resiliência',
                  attention: 'Atenção aos Detalhes',
                  autonomy: 'Autonomia'
                }).map(([key, label]) => (
                  <div key={key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-medium text-gray-700">{label}</label>
                      <span className="text-sm text-gray-500">
                        Nível {jobData.personality[key as keyof typeof jobData.personality]}
                      </span>
                    </div>
                    <Slider
                      value={[jobData.personality[key as keyof typeof jobData.personality]]}
                      onValueChange={(value) => updatePersonality(key as keyof typeof jobData.personality, value[0])}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>1 - Pouco importante</span>
                      <span>5 - Muito importante</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 10:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-ravyz-green rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Salário e Localização
              </h2>
              <p className="text-gray-600">
                Defina a faixa salarial e modelo de trabalho
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Faixa Salarial (CLT)</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salário Mínimo (R$)
                    </label>
                    <input
                      type="text"
                      value={jobData.salary.min > 0 ? formatNumber(jobData.salary.min.toString()) : ''}
                      onChange={(e) => {
                        const value = parseNumber(e.target.value);
                        setJobData(prev => ({
                          ...prev,
                          salary: { ...prev.salary, min: value }
                        }));
                      }}
                      placeholder="5.000"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ravyz-green focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salário Máximo (R$)
                    </label>
                    <input
                      type="text"
                      value={jobData.salary.max > 0 ? formatNumber(jobData.salary.max.toString()) : ''}
                      onChange={(e) => {
                        const value = parseNumber(e.target.value);
                        setJobData(prev => ({
                          ...prev,
                          salary: { ...prev.salary, max: value }
                        }));
                      }}
                      placeholder="8.000"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ravyz-green focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Modelo de Trabalho</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {workModels.map((model) => (
                    <button
                      key={model.value}
                      onClick={() => updateJobData('workModel', model.value)}
                      className={`
                        p-4 rounded-lg border-2 text-left transition-all duration-200
                        ${jobData.workModel === model.value
                          ? 'border-ravyz-green bg-ravyz-green text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-ravyz-green/50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl">{model.icon}</span>
                        <span className="font-medium">{model.label}</span>
                      </div>
                      <p className={`text-sm ${jobData.workModel === model.value ? 'text-white/80' : 'text-gray-500'}`}>
                        {model.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localização
                </label>
                <input
                  type="text"
                  value={jobData.location}
                  onChange={(e) => updateJobData('location', e.target.value)}
                  placeholder="Ex: São Paulo, SP"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ravyz-green focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>
        );

      case 11:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-ravyz-orange rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Benefícios
              </h2>
              <p className="text-gray-600">
                Quais benefícios sua empresa oferece?
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Pacote de Benefícios</h3>
                <Badge variant="secondary">
                  {jobData.benefits.length} selecionados
                </Badge>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {benefits.map((benefit) => (
                  <button
                    key={benefit.id}
                    onClick={() => toggleArrayItem('benefits', benefit.id)}
                    className={`
                      p-4 rounded-lg border-2 text-left transition-all duration-200
                      ${jobData.benefits.includes(benefit.id)
                        ? 'border-ravyz-orange bg-ravyz-orange text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-ravyz-orange/50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{benefit.icon}</span>
                      <span className="font-medium text-sm">{benefit.name}</span>
                    </div>
                  </button>
                ))}
              </div>
              {jobData.benefits.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {jobData.benefits.map((benefitId) => {
                    const benefit = benefits.find(b => b.id === benefitId);
                    return (
                      <Badge key={benefitId} variant="secondary" className="bg-ravyz-orange/10 text-ravyz-orange">
                        {benefit?.icon} {benefit?.name}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return jobData.gender && jobData.ageRange;
      case 2:
        return jobData.education.length > 0;
      case 3:
        return jobData.industries.length > 0;
      case 4:
        return true; // Etapa opcional
      case 5:
        return jobData.title && jobData.department;
      case 6:
        return jobData.position && jobData.responsibilities.length > 0;
      case 7:
        return jobData.hardSkills.length > 0;
      case 8:
        return true; // Soft skills têm valores padrão
      case 9:
        return true; // Personality traits têm valores padrão
      case 10:
        return jobData.salary.min > 0 && jobData.salary.max > 0 && jobData.workModel && jobData.location;
      case 11:
        return true; // Benefícios são opcionais
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logo */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <img src={ravyzLogo} alt="RAVYZ" className="h-8" />
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Etapa {currentStep} de {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-ravyz-orange to-ravyz-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <div key={currentStep}>
            {renderStepContent()}
          </div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-12">
          <RavyzButton
            variant="outline"
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </RavyzButton>

          <RavyzButton
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2"
          >
            {currentStep === totalSteps ? 'Finalizar' : 'Próximo'}
            {currentStep < totalSteps && <ArrowRight className="w-4 h-4" />}
          </RavyzButton>
        </div>
      </div>
    </div>
  );
}