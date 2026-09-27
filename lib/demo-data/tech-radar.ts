/**
 * Technology Radar — AI-generated, illustrative industry analysis.
 *
 * This is general, publicly-known industry commentary, not a researched
 * report on any specific private company. Company names mentioned as
 * "important" are well-known public/major players used as reference
 * points, not verified claims about their strategy — always treat this
 * page as a starting point for further research, not a finished one.
 */
export interface TechCategory {
  id: string;
  name: string;
  whatIsChanging: string;
  whyNow: string;
  importantStartups: string[];
  importantPublicCompanies: string[];
  industriesAffected: string[];
  potentialCorporateImpact: string[];
  risks: string[];
  fiveYearQuestions: string[];
}

export const TECH_RADAR: TechCategory[] = [
  {
    id: "ai-agents",
    name: "AI Agents",
    whatIsChanging: "AI systems are moving from answering questions to taking multi-step actions across tools and software.",
    whyNow: "Large language models recently became reliable enough to plan and execute multi-step tasks with acceptable error rates when paired with human review.",
    importantStartups: ["Enterprise workflow-automation agent startups (e.g. finance, support, ops)"],
    importantPublicCompanies: ["Major cloud/AI infrastructure providers", "Enterprise software incumbents adding agent features"],
    industriesAffected: ["Customer support", "Finance operations", "Software engineering", "Sales operations"],
    potentialCorporateImpact: ["Labor cost reduction in repetitive knowledge work", "New attack surface for security teams to manage"],
    risks: ["Agent errors compounding across multi-step actions", "Overtrust in autonomous decision-making"],
    fiveYearQuestions: ["Which categories of work fully automate vs. stay human-reviewed?", "Who is liable when an agent's action causes harm?"],
  },
  {
    id: "robotics",
    name: "Robotics",
    whatIsChanging: "Falling sensor/compute costs and better vision models are making robots viable in less-structured environments.",
    whyNow: "Computer vision and grasping models have improved enough to handle variability that used to require human dexterity.",
    importantStartups: ["Warehouse and logistics robotics startups", "Agricultural robotics startups"],
    importantPublicCompanies: ["Established industrial automation manufacturers"],
    industriesAffected: ["Warehousing", "Manufacturing", "Agriculture"],
    potentialCorporateImpact: ["Labor shortage mitigation", "Capital expenditure shift from labor to equipment"],
    risks: ["High capital intensity", "Safety regulation in human-robot shared spaces"],
    fiveYearQuestions: ["Does robotics-as-a-service pricing become the dominant model?", "How fast does reliability improve for irregular tasks?"],
  },
  {
    id: "humanoid-robots",
    name: "Humanoid Robots",
    whatIsChanging: "General-purpose bipedal robots are being tested for manufacturing and light industrial tasks.",
    whyNow: "Advances in locomotion control and manipulation, combined with falling actuator costs, have made humanoid form factors commercially discussed for the first time.",
    importantStartups: ["Several well-funded humanoid robotics startups across the US, China, and Japan"],
    importantPublicCompanies: ["Automotive manufacturers piloting humanoid robots on their own production lines"],
    industriesAffected: ["Automotive manufacturing", "Warehousing", "Eldercare (longer-term)"],
    potentialCorporateImpact: ["Potential labor substitution in manufacturing over the next decade"],
    risks: ["Commercial timelines may be much longer than press coverage suggests", "High unit costs today"],
    fiveYearQuestions: ["What is the real unit economics of a humanoid robot vs. task-specific automation?", "Which use cases reach commercial viability first?"],
  },
  {
    id: "ai-infrastructure",
    name: "AI Infrastructure",
    whatIsChanging: "Massive investment in compute, data centers, and specialized chips to train and serve AI models.",
    whyNow: "Model scale has driven demand for compute well beyond prior data-center planning assumptions.",
    importantStartups: ["AI chip and inference-optimization startups"],
    importantPublicCompanies: ["Major GPU/chip manufacturers", "Cloud hyperscalers"],
    industriesAffected: ["Data centers", "Energy/utilities", "Semiconductor supply chain"],
    potentialCorporateImpact: ["Rising capital expenditure cycles tied to AI compute buildout"],
    risks: ["Overbuild risk if AI demand growth slows", "Power availability constraints"],
    fiveYearQuestions: ["Does compute demand growth outpace or undershoot current buildout plans?", "How much does inference cost fall per unit of capability?"],
  },
  {
    id: "semiconductors",
    name: "Semiconductors",
    whatIsChanging: "AI workloads are reshaping chip design priorities toward specialized accelerators and advanced packaging.",
    whyNow: "General-purpose CPUs are insufficient for AI training/inference at scale, driving specialized silicon investment.",
    importantStartups: ["AI accelerator chip startups", "Chip design tooling startups"],
    importantPublicCompanies: ["Leading foundries and chip designers"],
    industriesAffected: ["Consumer electronics", "Data centers", "Automotive"],
    potentialCorporateImpact: ["Supply chain concentration risk around a small number of advanced foundries"],
    risks: ["Geopolitical concentration of advanced chip manufacturing", "Long capital cycles for new fabs"],
    fiveYearQuestions: ["Does chip manufacturing capacity diversify geographically?", "Which specialized architectures win for inference specifically?"],
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    whatIsChanging: "AI is being used both to defend systems (anomaly detection, automated response) and to attack them (more convincing phishing, automated exploit discovery).",
    whyNow: "Generative AI has lowered the cost of producing convincing attacks, forcing a defensive response in kind.",
    importantStartups: ["AI-native security operations startups"],
    importantPublicCompanies: ["Established enterprise security vendors adding AI features"],
    industriesAffected: ["Financial services", "Healthcare", "Critical infrastructure"],
    potentialCorporateImpact: ["Rising security spend as an AI arms race between attackers and defenders"],
    risks: ["AI-generated attacks outpacing defensive tooling", "Over-reliance on automated response without human oversight"],
    fiveYearQuestions: ["Does AI net favor attackers or defenders over time?", "How does regulation respond to AI-enabled attacks?"],
  },
  {
    id: "quantum-computing",
    name: "Quantum Computing",
    whatIsChanging: "Error-correction and error-mitigation techniques are slowly extending what near-term quantum hardware can attempt.",
    whyNow: "Qubit counts and error rates have improved, though commercially useful advantage over classical computing remains narrow and contested.",
    importantStartups: ["Quantum hardware and error-mitigation software startups"],
    importantPublicCompanies: ["Cloud providers offering quantum computing access"],
    industriesAffected: ["Materials science", "Cryptography", "Pharmaceuticals (long-term)"],
    potentialCorporateImpact: ["Long-horizon R&D investment rather than near-term commercial impact for most industries"],
    risks: ["Commercial timeline remains highly uncertain", "Cryptography-breaking implications require early planning despite uncertain timing"],
    fiveYearQuestions: ["Does any commercially meaningful quantum advantage get demonstrated?", "How should enterprises plan for post-quantum cryptography migration?"],
  },
  {
    id: "space-technology",
    name: "Space Technology",
    whatIsChanging: "Falling launch costs are enabling new satellite constellations and in-space commercial activity.",
    whyNow: "Reusable launch vehicles have materially reduced the cost per kilogram to orbit over the past decade.",
    importantStartups: ["Small satellite manufacturing and launch startups"],
    importantPublicCompanies: ["Major aerospace and satellite communications companies"],
    industriesAffected: ["Telecommunications", "Agriculture (satellite imagery)", "Defense"],
    potentialCorporateImpact: ["New connectivity infrastructure reaching previously underserved regions"],
    risks: ["Orbital debris and congestion", "High capital intensity and long development cycles"],
    fiveYearQuestions: ["Does launch cost continue falling at the recent pace?", "Which downstream applications (imagery, connectivity) monetize first?"],
  },
  {
    id: "climate-tech",
    name: "Climate Tech",
    whatIsChanging: "Falling costs for renewable generation and storage are shifting the economics of energy infrastructure.",
    whyNow: "Solar and battery cost curves have crossed cost-parity thresholds with fossil generation in many markets.",
    importantStartups: ["Grid software, carbon removal, and industrial decarbonization startups"],
    importantPublicCompanies: ["Utilities and industrial conglomerates investing in decarbonization"],
    industriesAffected: ["Utilities", "Heavy industry", "Transportation"],
    potentialCorporateImpact: ["Capital reallocation toward renewable and storage infrastructure"],
    risks: ["Policy/subsidy dependency in some segments", "Long payback periods for industrial decarbonization"],
    fiveYearQuestions: ["Which climate tech segments are commercially viable without subsidy?", "How does policy volatility affect investment pacing?"],
  },
  {
    id: "energy-storage",
    name: "Energy Storage",
    whatIsChanging: "Battery cost declines and software-driven optimization are making storage a larger part of grid and commercial energy strategy.",
    whyNow: "Battery costs have fallen enough to pair economically with intermittent renewable generation at commercial scale.",
    importantStartups: ["Battery management software and commercial storage integration startups"],
    importantPublicCompanies: ["Battery manufacturers and utility-scale storage developers"],
    industriesAffected: ["Utilities", "Commercial real estate", "Electric vehicles"],
    potentialCorporateImpact: ["New revenue models from grid services (demand response, arbitrage)"],
    risks: ["Battery supply chain/raw material dependency", "Regulatory treatment of storage varies by market"],
    fiveYearQuestions: ["Does software or hardware capture more of the value in storage systems?", "How does raw material supply (lithium, etc.) affect cost curves?"],
  },
  {
    id: "biotech",
    name: "Biotech",
    whatIsChanging: "AI-driven protein structure prediction and molecule design are accelerating early-stage drug discovery.",
    whyNow: "Machine learning models have meaningfully improved the speed and cost of early-stage candidate identification.",
    importantStartups: ["AI-driven drug discovery startups"],
    importantPublicCompanies: ["Major pharmaceutical companies partnering with AI drug-discovery firms"],
    industriesAffected: ["Pharmaceuticals", "Agriculture (crop science)"],
    potentialCorporateImpact: ["Faster, cheaper early-stage discovery, though clinical trial timelines remain unchanged"],
    risks: ["AI speeds up discovery but not regulatory approval timelines", "High clinical trial failure rates persist regardless of AI"],
    fiveYearQuestions: ["Does AI-discovered pipeline show better clinical success rates than traditional discovery?", "Which therapeutic areas benefit most?"],
  },
  {
    id: "digital-health",
    name: "Digital Health",
    whatIsChanging: "AI is being applied to clinical documentation, diagnostics support, and remote patient monitoring.",
    whyNow: "Language models have become accurate enough for human-reviewed clinical documentation and triage support.",
    importantStartups: ["Ambient clinical documentation and AI triage startups"],
    importantPublicCompanies: ["Major EHR vendors adding AI features natively"],
    industriesAffected: ["Hospitals", "Outpatient clinics", "Health insurance"],
    potentialCorporateImpact: ["Reduced physician administrative burden; potential EHR vendor bundling risk for point solutions"],
    risks: ["Regulatory scrutiny of AI in clinical settings", "Liability questions around AI-assisted diagnosis"],
    fiveYearQuestions: ["Does regulation classify more AI clinical tools as medical devices?", "Do EHR incumbents out-execute point solutions?"],
  },
  {
    id: "fintech",
    name: "Fintech",
    whatIsChanging: "AI agents are being applied to back-office finance workflows, underwriting, and fraud detection.",
    whyNow: "Document understanding and reasoning models have become reliable enough for structured financial workflows with human review.",
    importantStartups: ["AI-driven finance automation and underwriting startups"],
    importantPublicCompanies: ["Major payment processors and core banking software providers"],
    industriesAffected: ["Banking", "Insurance", "Corporate finance"],
    potentialCorporateImpact: ["Operational cost reduction in back-office finance functions"],
    risks: ["Regulatory scrutiny of AI-driven credit/underwriting decisions", "Fraud actors also using AI to attack fintech systems"],
    fiveYearQuestions: ["How does financial regulation adapt to AI-driven decisioning?", "Which back-office functions fully automate first?"],
  },
  {
    id: "autonomous-systems",
    name: "Autonomous Systems",
    whatIsChanging: "Self-driving and autonomous vehicle/drone systems are expanding from pilots into limited commercial operation.",
    whyNow: "Sensor costs have fallen and perception models have improved enough for constrained-environment autonomy (specific routes, warehouses, ports).",
    importantStartups: ["Autonomous trucking, delivery, and drone logistics startups"],
    importantPublicCompanies: ["Major automotive manufacturers investing in autonomy"],
    industriesAffected: ["Trucking/logistics", "Automotive", "Delivery/last-mile"],
    potentialCorporateImpact: ["Long-term labor cost reduction in freight and delivery"],
    risks: ["Regulatory approval remains a long, uncertain process", "Safety incidents can significantly delay broader rollout"],
    fiveYearQuestions: ["Which specific corridors/use cases reach unsupervised operation first?", "How does regulation and public trust evolve after incidents?"],
  },
];
