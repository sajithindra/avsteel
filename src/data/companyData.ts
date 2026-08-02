// AVA SSDS Streamlined PM-Focused Data Store

export interface ServiceItem {
  id: string
  title: string
  subtitle: string
  description: string
  highlights: string[]
  deliverables: string[]
}

export interface TeamMember {
  name: string
  role: string
  experience?: string
  keyRole: string
  isLeadership?: boolean
}

export interface StampingState {
  name: string
  types: 'PE' | 'SE' | 'PE/SE'
}

export interface ChallengeItem {
  id: string
  title: string
  problem: string
  solution: string
}

export interface UspItem {
  id: number
  title: string
  description: string
  valuePoints: string[]
}

export const COMPANY_INFO = {
  name: 'AVA Structural Steel Detailing Services',
  shortName: 'AVA SSDS',
  tagline: 'Strengthening Details on Time',
  heroHeadline: 'Strengthening Details on Time',
  heroSubheadline: 'Accurate SDS/2 & Tekla detailing, shop drawings, and CNC files delivered with 20+ years of U.S. fabrication expertise.',
  trustBar: [
    '20+ Years Industry Experience',
    'SDS/2 Specialists',
    'Tekla Specialists',
    'AISC Standards',
    'Shop Drawings',
    'Erection Drawings',
    'CNC / DSTV Files',
    'Dedicated Project Manager',
    'USA Time Zone Support'
  ],
  locationHeader: 'Kerala, India',
  address: 'No. 36/1878, 2nd Floor, Raymond Building, Kuruppam Road, Thrissur-680001, Kerala, India',
  udyam: 'UDYAM-KL-13-0094321',
  gst: '32THMPS4540H1ZQ',
  website: 'www.avassds.com',
  email: 'info@avassds.com',
  salesEmail: 'sales@avassds.com',
  hrEmail: 'hr@avassds.com',
  infoEmail: 'info@avassds.com',
  phoneNumbers: ['+1 401 392 2810', '+1 214 644 6466'],
  primarySoftware: ['SDS/2', 'Tekla Structure', 'ZWCAD'],
  socialProof: ['AISC', 'NISD', 'CISC', 'IS CODE'],
  designCodes: ['AISC', 'NISD', 'AWS', 'SDI', 'OSHA', 'CISC', 'IS CODE'],
  metrics: [
    { value: '20+', label: 'Years Experience' },
    { value: '10+', label: 'Projects Delivered' },
    { value: '98%', label: 'On-Time Rate' },
    { value: '24 hrs', label: 'Quote Turnaround' },
    { value: '6 Days', label: 'Weekly Support' }
  ]
}

export const PAIN_POINTS_CONTENT = {
  headline: 'Are These Challenges Slowing Your Shop?',
  checklist: [
    'Detailing capacity bottlenecks',
    'Tight fabrication deadlines',
    'Unclear drawings causing RFIs',
    'Revision tracking delays',
    'Need experienced SDS/2 detailers'
  ],
  callout: 'AVA supports your team with fast, accurate detailing capacity.'
}

export const WHY_CHOOSE_FABRICATORS = {
  headline: 'Why Fabricators Choose AVA',
  subheading: 'Fabrication-First Approach',
  intro: 'We provide clear, actionable solutions for shop floor constructability:',
  solutions: [
    'Expand your detailing capacity with our experienced SDS/2 & Tekla team, allowing your shop to take on more projects without hiring additional staff.',
    'Fast project turnaround with dedicated resources, priority scheduling, and milestone-based delivery.',
    'Thorough model reviews, clash detection, and proactive RFI generation before fabrication begins.',
    'Structured revision management with clear revision logs, cloud document control, and rapid update delivery.',
    'Skilled SDS/2 detailers and checkers with AISC standards experience, ready to integrate with your existing workflow.'
  ]
}

export const VALUE_PROPOSITION = {
  headline: 'Your Offshore Detailing Partner—Built Around U.S. Fabrication Standards',
  body: 'AVA Structural Steel Detailing Services helps steel fabricators scale capacity with AISC-compliant drawings, rigorous QA/QC, and reliable delivery.'
}

export const ABOUT_CONTENT = {
  corePurpose: 'Dedicated technical consultancy specializing in high-accuracy structural steel detailing, connection design, and material take-offs to eliminate field errors and rework.',
  values: [
    { title: 'Integrity', desc: 'Ethical, transparent, and accountable engineering.' },
    { title: 'Accuracy', desc: 'Sub-millimeter precision complying with AISC & AWS.' },
    { title: 'On-Time Delivery', desc: 'Meeting critical fabrication deadlines consistently.' }
  ],
  whoWeServe: [
    { title: 'Steel Fabricators', desc: 'Precise shop drawings and CNC data for automated fabrication.' },
    { title: 'General Contractors', desc: 'High-volume detailing adhering strictly to building codes.' },
    { title: 'Architectural Firms', desc: 'Technical BIM coordination for clash-free designs.' }
  ]
}

export const CHALLENGES_SOLVED: ChallengeItem[] = [
  {
    id: 'errors',
    title: 'Eliminating Costly Fabrication Errors',
    problem: 'Drawing mistakes lead to scrap and field rework.',
    solution: 'Multi-stage QA/QC ensures 100% fabrication-ready drawings.'
  },
  {
    id: 'schedule',
    title: 'Delivering Projects on Schedule',
    problem: 'Detailing delays disrupt shop production timelines.',
    solution: 'Dedicated project teams maintain strict milestone schedules.'
  },
  {
    id: 'rfis',
    title: 'Reducing RFIs',
    problem: 'Incomplete plans generate unnecessary shop RFIs.',
    solution: 'Upfront contract reviews catch discrepancies early.'
  },
  {
    id: 'communication',
    title: 'Improving Status Visibility',
    problem: 'Slow updates leave PMs uncertain about delivery.',
    solution: 'Real-time client portal for live progress and RFI tracking.'
  },
  {
    id: 'revisions',
    title: 'Managing Drawing Revisions',
    problem: 'Outdated drawings risk costly shop mistakes.',
    solution: 'Strict document control ensures only approved plans reach the shop floor.'
  },
  {
    id: 'materials',
    title: 'Accurate Material Take-Offs',
    problem: 'Quantity errors cause material shortages or excess.',
    solution: 'SDS/2 model BOMs provide exact weights and bolt counts.'
  }
]

export const UNIQUE_SELLING_POINTS: UspItem[] = [
  {
    id: 1,
    title: 'AI-Assisted PDF Drawing QA/QC',
    description: 'AI technology flags documentation issues so engineers focus on constructability.',
    valuePoints: ['Faster reviews', 'Higher technical accuracy']
  },
  {
    id: 2,
    title: 'Real-Time Project Tracking Portal',
    description: 'Secure online portal provides live visibility into progress and delivery dates.',
    valuePoints: ['Instant status checks', 'Zero email delays']
  },
  {
    id: 3,
    title: 'Instant Communication Alerts',
    description: 'Automated internal alerts ensure prompt response to inquiries and revisions.',
    valuePoints: ['Fast response times', 'Seamless coordination']
  },
  {
    id: 4,
    title: 'Multi-Level Quality Assurance',
    description: '4-tier check: Self-check, Senior Checker, AI verification, and Final QA/QC.',
    valuePoints: ['Maximum drawing accuracy', 'Fewer shop errors']
  },
  {
    id: 5,
    title: 'Fabrication-Focused Detailing',
    description: 'Drawings engineered for practical cutting, fitting, and welding on the shop floor.',
    valuePoints: ['Streamlined shop work', 'Reduced rework']
  },
  {
    id: 6,
    title: 'Experienced SDS/2 Team',
    description: 'Detailers with deep expertise in North American structural steel standards.',
    valuePoints: ['Full AISC compliance', 'Proven U.S. experience']
  }
]

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'structural-misc',
    title: 'Structural & Miscellaneous Steel Detailing',
    subtitle: 'Fabrication & erection ready drawings from design specs',
    description: 'Converting structural design drawings into precise 3D BIM models and fabrication drawings for beams, columns, stairs, handrails, truss, bridges, and frames.',
    highlights: [
      'Shop drawings for beams, columns, bracings, truss, bridges & misc steel',
      'Erection drawings with member locations and sequence plans',
      '3D BIM modeling (SDS/2 & Tekla Structures) for clash detection',
      'Automated NC / CNC data (DSTV & DXF) for automated shop machinery'
    ],
    deliverables: [
      'Assembly & Part Drawings',
      'Erection Framing Plans',
      'Anchor Bolt Layouts',
      'NC / DSTV & DXF Files',
      '3D Model BIM Data Exports'
    ]
  },
  {
    id: 'connection-design',
    title: 'Connection Design & PE/SE Stamping',
    subtitle: 'Code-compliant connection modeling & sealed engineering calculations',
    description: 'Combining engineering expertise with SDS/2 intelligent automation for safe, economical connections. Sealed calculations provided across 27 US States.',
    highlights: [
      'AISC 360 & 341 code-compliant connection designs',
      'Shear, moment, bracing, base plate & splice connection packages',
      'Connections integrated directly inside the 3D SDS/2 model',
      'Comprehensive calculation reports for reviewer approval'
    ],
    deliverables: [
      'PE/SE Sealed Calculations',
      'Delegated Connection Packages',
      'SDS/2 Connection Reports'
    ]
  },
  {
    id: 'deck-detailing',
    title: 'Metal Deck Detailing',
    subtitle: 'Floor & roof metal decking system layout documentation',
    description: 'Accurate modeling and documentation of composite and non-composite floor and roof metal decking systems adhering to SDI guidelines.',
    highlights: [
      'Floor and roof deck direction, panel lengths, and lap details',
      'Shear stud & embossment placement coordination on beams',
      'Pour stop, edge angle, and opening trim details',
      'Coordination for MEP penetrations, elevator shafts, and stairs'
    ],
    deliverables: [
      'Deck Layout Drawings',
      'Stud & Pour Stop Details',
      'Deck Material Take-Offs'
    ]
  },
  {
    id: 'estimation-mto',
    title: 'Steel Estimation & Material Take Off',
    subtitle: '3D model-based quantity extraction for accurate bidding',
    description: 'SDS/2 model-driven material take-offs delivering exact member weights and hardware counts to prevent material wastage and bidding errors.',
    highlights: [
      'Automated BOM for beams, columns, plates, bolts & deck items',
      'Member-wise & assembly-wise steel weight calculations',
      'Exact connection hardware and plate take-offs',
      'Dynamic quantity updates when project revisions occur'
    ],
    deliverables: [
      'Advanced Bill of Materials (ABOM)',
      'Tonnage & Weight Reports',
      'Connection Hardware Counts'
    ]
  }
]

export const STAMPING_STATES: StampingState[] = [
  { name: 'Arizona', types: 'PE/SE' },
  { name: 'Arkansas', types: 'PE' },
  { name: 'California', types: 'PE/SE' },
  { name: 'Delaware', types: 'PE' },
  { name: 'Florida', types: 'PE/SE' },
  { name: 'Georgia', types: 'PE/SE' },
  { name: 'Idaho', types: 'PE' },
  { name: 'Illinois', types: 'SE' },
  { name: 'Indiana', types: 'PE' },
  { name: 'Kentucky', types: 'PE' },
  { name: 'Louisiana', types: 'PE' },
  { name: 'Michigan', types: 'PE' },
  { name: 'Mississippi', types: 'PE' },
  { name: 'Montana', types: 'PE' },
  { name: 'Nevada', types: 'PE/SE' },
  { name: 'New Jersey', types: 'PE' },
  { name: 'New Mexico', types: 'PE' },
  { name: 'New York', types: 'PE' },
  { name: 'North Carolina', types: 'PE' },
  { name: 'North Dakota', types: 'PE' },
  { name: 'Oklahoma', types: 'PE/SE' },
  { name: 'Oregon', types: 'PE' },
  { name: 'Pennsylvania', types: 'PE' },
  { name: 'South Dakota', types: 'PE' },
  { name: 'Texas', types: 'PE' },
  { name: 'Utah', types: 'PE/SE' },
  { name: 'Washington', types: 'PE' }
]

export const WORK_PROCESS_STEPS = [
  {
    step: '01',
    title: 'Inquiry & Scope Review',
    shortTitle: 'Inquiry',
    desc: 'Review project specifications, drawings, and scope requirements.'
  },
  {
    step: '02',
    title: 'Project Estimation',
    shortTitle: 'Estimation',
    desc: 'Evaluate detailing hours, timeline, and competitive pricing.'
  },
  {
    step: '03',
    title: 'Quotation Submission',
    shortTitle: 'Quotation',
    desc: 'Deliver detailed quotation with scope, schedule, and commercial terms.'
  },
  {
    step: '04',
    title: 'Contract / Purchase Order',
    shortTitle: 'Contract',
    desc: 'Confirm Purchase Order and finalize project kickoff milestones.'
  },
  {
    step: '05',
    title: 'Project Kick-off',
    shortTitle: 'Kick-off',
    desc: 'Align team on shop standards, AISC specifications, and communication channels.'
  },
  {
    step: '06',
    title: '3D Modeling',
    shortTitle: 'Modeling',
    desc: 'Construct precise SDS/2 or Tekla 3D model with clash detection.'
  },
  {
    step: '07',
    title: 'Detailing',
    shortTitle: 'Detailing',
    desc: 'Generate shop drawings, erection plans, and CNC machinery data.'
  },
  {
    step: '08',
    title: 'Checking & QA/QC',
    shortTitle: 'QA/QC',
    desc: 'Execute 4-tier check for dimensions, member marks, and code compliance.'
  },
  {
    step: '09',
    title: 'Client Submission',
    shortTitle: 'Submission',
    desc: 'Deliver completed drawing package for client review.'
  },
  {
    step: '10',
    title: 'Revisions & Approval',
    shortTitle: 'Revisions',
    desc: 'Incorporate review feedback promptly for final fabrication release.'
  },
  {
    step: '11',
    title: 'Project Closeout',
    shortTitle: 'Closeout',
    desc: 'Issue final approved files, CNC data, and project documentation.'
  }
]

export const TERMS_AND_CONDITIONS = [
  { num: 1, title: 'Project Documentation', content: 'The client shall provide all necessary project information before detailing work begins... AVA Structural Steel Detailing Services shall not be responsible for delays or additional costs resulting from incomplete, incorrect, or late project information.' },
  { num: 2, title: 'Scope of Work', content: 'Our scope of work is limited to the services specifically agreed upon in the proposal or purchase order. Any additional work requested after project commencement may be treated as additional services and quoted separately.' },
  { num: 3, title: 'Project Revisions', content: 'The quoted price includes revisions resulting from our detailing errors at no additional cost. Revisions caused by design changes, architectural changes, engineer revisions, or client modifications after detailing has commenced may be subject to additional charges.' },
  { num: 4, title: 'Drawing Approval', content: 'All shop and erection drawings should be reviewed and approved by the client and the Engineer of Record before fabrication. Final responsibility for design approval remains with the project engineer and client.' },
  { num: 5, title: 'Quality Assurance', content: 'Every drawing undergoes internal QA/QC before submission. While every reasonable effort is made to ensure accuracy, the client is responsible for reviewing the drawings before fabrication.' },
  { num: 6, title: 'Project Communication', content: 'Project-related communication should be made through the designated project coordinator or authorized representatives. Prompt responses to RFIs and approval comments help maintain the agreed project schedule.' },
  { num: 7, title: 'Project Schedule', content: 'Delivery schedules are based on the information available at the time of project commencement and may be adjusted in cases of late client responses, design revisions, missing info, or force majeure events.' },
  { num: 8, title: 'Confidentiality', content: 'All project documents, models, drawings, specifications, and related information received from the client shall be treated as confidential.' },
  { num: 9, title: 'Intellectual Property', content: 'All project documents provided by the client remain the property of the client. AVA retains ownership of its internal detailing procedures, templates, quality-control methods, project management tools, and proprietary software.' },
  { num: 10, title: 'Payment Terms', content: 'Payment terms shall be as agreed in the proposal, quotation, purchase order, or service agreement. Invoices are issued according to agreed project milestones.' },
  { num: 11, title: 'Suspension of Services', content: 'AVA reserves the right to suspend ongoing work if payments become significantly overdue. Project schedules may be revised once work resumes.' },
  { num: 12, title: 'Delivery of Final Files', content: 'Final deliverables, including shop drawings, erection drawings, CNC files, reports, and other agreed outputs, will be issued in accordance with the agreed project scope.' },
  { num: 13, title: 'Limitation of Liability', content: 'Our liability is limited to correcting errors within our scope of work. We are not responsible for losses arising from design errors, incomplete project information, or fabrication performed without approved drawings.' },
  { num: 14, title: 'Governing Agreement', content: 'Any project-specific proposal, quotation, purchase order, or signed service agreement shall take precedence over these general Terms & Conditions where differences exist.' }
]

export const PRIVACY_POLICY = {
  effectiveDate: 'July 14, 2026',
  sections: [
    { title: '1. Information We Collect', content: 'Personal Information (Name, Company, Job title, Email, Phone, Location) and Project Information (Structural drawings, Specifications, RFIs, Revisions).' },
    { title: '2. How We Use Your Information', content: 'Respond to inquiries, prepare proposals, execute detailing projects, communicate updates, and comply with obligations. We do not sell or rent personal information.' },
    { title: '3. Confidentiality of Project Documents', content: 'All project drawings and documents are strictly confidential and accessed only by authorized engineering personnel.' },
    { title: '4. Data Security', content: 'Administrative, technical, and organizational measures including secure storage, access control, password protection, and backups.' },
    { title: '5. Cookies', content: 'Used to remember user preferences and analyze visitor traffic to improve functionality.' },
    { title: '6. Third-Party Services', content: 'Third-party services (Google Maps, Google Analytics, LinkedIn) operate under their own privacy policies.' },
    { title: '7. Data Retention', content: 'Information is retained only as necessary to complete requested services and maintain business records.' },
    { title: '8. Your Rights', content: 'You may request access, correction, or deletion of your personal information.' },
    { title: '9. Children’s Privacy', content: 'Our services are intended for business and professional use.' },
    { title: '10. Policy Updates', content: 'Updates are posted on this page with the effective date.' },
    { title: '11. Contact Information', content: 'AVA Structural Steel Detailing Services LLP | Email: info@avassds.com | Phone: +91 80891 42578' }
  ]
}

export const CORE_TEAM: TeamMember[] = [
  {
    name: 'Anish V A',
    role: 'Founder & Managing Partner',
    experience: '21 Yrs EXP.',
    keyRole: 'Sales/Marketing, Project Management',
    isLeadership: true
  },
  {
    name: 'Rosdal K S',
    role: 'Co-Founder & Managing Partner',
    experience: '7 Yrs EXP.',
    keyRole: 'Accounts & Office admin',
    isLeadership: true
  },
  {
    name: 'Saranya S Kumar',
    role: 'Team Lead - Misc. Steel',
    experience: '14 Yrs EXP.',
    keyRole: 'Misc. Modeling & Checking Expert',
    isLeadership: true
  },
  {
    name: 'Nirmal Raj',
    role: 'Team Lead - Structural Steel',
    experience: '14 Yrs EXP.',
    keyRole: 'Structural Modeling & Detailing Expert',
    isLeadership: true
  },
  {
    name: 'Shiny Shibin',
    role: 'QA/QC Lead',
    experience: '15 Yrs EXP.',
    keyRole: 'Misc. Modeling, detailing & Checking Expert',
    isLeadership: true
  },
  {
    name: 'Anagha D',
    role: 'Modeler - Structural Steel',
    experience: '4 Yrs EXP.',
    keyRole: 'Modeling & Detailing Expert',
    isLeadership: false
  },
  {
    name: 'Basil Mathew',
    role: 'Steel detailer',
    experience: '2.5 Yrs EXP.',
    keyRole: 'Structural & Misc. Steel detailing expert',
    isLeadership: false
  },
  {
    name: 'Febin Varghese',
    role: 'Steel detailer - Trainee',
    experience: '2 months EXP.',
    keyRole: 'Structural Steel detailing',
    isLeadership: false
  },
  {
    name: 'Farzeena P A',
    role: 'Training Department - In Charge',
    experience: '2 months EXP.',
    keyRole: 'Marketing & Detailing Trainer',
    isLeadership: true
  }
]
