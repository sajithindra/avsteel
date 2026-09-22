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
  cinLlpin: 'LLPIN: AAY-9821',
  complaintsEmail: 'complaints@avassds.com',
  grievanceOfficer: 'Rosdal K S (Compliance & Grievance Officer)',
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

export const TERMS_AND_CONDITIONS = {
  effectiveDate: '02 August 2026',
  sections: [
    {
      num: 1,
      title: 'Company Information',
      content: 'AVA Structural Steel Detailing Services LLP provides professional structural steel detailing, BIM modeling, shop drawings, erection drawings, miscellaneous steel detailing, QA/QC checking, estimation, material take-off services, and technical training.'
    },
    {
      num: 2,
      title: 'Scope of Services',
      content: 'Our services include, but are not limited to:',
      items: [
        'Structural Steel Detailing',
        'Miscellaneous Steel Detailing',
        'BIM Modeling',
        'Shop & Erection Drawings',
        'Connection Detailing',
        'CNC/DSTV/DXF File Generation',
        'Material Take-Off',
        'QA/QC Review',
        'Training & Consulting'
      ],
      footer: 'Each project shall be governed by the agreed quotation, purchase order, work order, or service agreement.'
    },
    {
      num: 3,
      title: 'Applicable Engineering Standards',
      content: 'Unless otherwise agreed in writing, detailing shall be prepared in accordance with applicable project specifications and relevant industry standards, including where applicable:',
      items: [
        'AISC Steel Construction Manual',
        'AISC Code of Standard Practice',
        'OSHA Regulations',
        'AWS D1.1 Structural Welding Code',
        'RCSC Specification for Structural Joints',
        'ASTM Material Specifications',
        'SDI Standards',
        'SJI Standards',
        'NISD Guidelines',
        'Project-specific client standards'
      ],
      footer: 'The governing code shall always be the one specified in the contract documents.'
    },
    {
      num: 4,
      title: 'Client Responsibilities',
      content: 'The Client shall provide:',
      items: [
        'IFC Drawings',
        'Structural Calculations',
        'Design Revisions',
        'Specifications',
        'RFI Responses',
        'Approval Comments',
        'Timely Communication'
      ],
      footer: 'Delays in receiving required information may affect delivery schedules.'
    },
    {
      num: 5,
      title: 'Intellectual Property',
      content: 'All drawings, models, templates, software workflows, documents, website content, logos, training materials, and other intellectual property remain the exclusive property of AVA unless otherwise agreed in writing. No material may be copied, reproduced, distributed, or modified without prior written permission.'
    },
    {
      num: 6,
      title: 'Confidentiality',
      content: 'AVA maintains strict confidentiality regarding all client information, drawings, project data, and technical documents. Client information shall not be disclosed except:',
      items: [
        'with written consent;',
        'where required by law; or',
        'for approved subcontractors working under confidentiality obligations.'
      ]
    },
    {
      num: 7,
      title: 'Project Revisions',
      content: 'Revisions arising from client comments after submission shall be completed in accordance with the agreed project scope. Major design changes, scope increases, or redesign work may result in additional charges and revised delivery schedules.'
    },
    {
      num: 8,
      title: 'Quality Assurance',
      content: 'AVA follows internal QA/QC procedures before project delivery. However, the client remains responsible for final engineering approval and construction verification.'
    },
    {
      num: 9,
      title: 'Payment Terms',
      content: 'Payment terms shall be as stated in the quotation, invoice, purchase order, or signed agreement. Late payments may result in:',
      items: [
        'Suspension of work;',
        'Delay in project delivery; and',
        'Additional charges where permitted by applicable law.'
      ]
    },
    {
      num: 10,
      title: 'Delivery Schedule',
      content: 'Estimated completion dates are provided based on available project information. AVA shall not be responsible for delays caused by:',
      items: [
        'Design revisions;',
        'Client delays;',
        'Late approvals;',
        'Force majeure events;',
        'Third-party software failures.'
      ]
    },
    {
      num: 11,
      title: 'Website Usage',
      content: 'Visitors shall not:',
      items: [
        'Copy website content.',
        'Reverse engineer downloadable materials.',
        'Attempt unauthorized access.',
        'Upload malicious software.',
        'Misrepresent AVA or its services.'
      ]
    },
    {
      num: 12,
      title: 'Disclaimer',
      content: 'Information published on this website is provided for general information only and does not constitute engineering certification, legal advice, or construction approval. Project-specific engineering decisions must always be verified by the responsible Engineer of Record (EOR).'
    },
    {
      num: 13,
      title: 'Limitation of Liability',
      content: 'To the maximum extent permitted by applicable law, AVA shall not be liable for any indirect, incidental, consequential, special, or punitive damages, including loss of profits, business interruption, or project delays arising from the use of this website or our services.'
    },
    {
      num: 14,
      title: 'Force Majeure',
      content: 'AVA shall not be liable for delays caused by events beyond reasonable control, including natural disasters, power failures, internet outages, cyber-attacks, government actions, pandemics, labor disputes, or similar events.'
    },
    {
      num: 15,
      title: 'Privacy',
      content: 'Personal information submitted through our website shall be handled in accordance with our Privacy Policy.'
    },
    {
      num: 16,
      title: 'Third-Party Software',
      content: 'Project deliverables may utilize industry software including SDS/2, AutoCAD, IFC, BIM platforms, or other licensed software. All trademarks remain the property of their respective owners.'
    },
    {
      num: 17,
      title: 'Governing Law',
      content: 'These Terms & Conditions shall be governed by the laws of India. Subject to applicable law, courts having jurisdiction in Thrissur, Kerala, India shall have exclusive jurisdiction over disputes arising from these Terms.'
    },
    {
      num: 18,
      title: 'Amendments',
      content: 'AVA reserves the right to modify these Terms & Conditions at any time without prior notice. Continued use of the website constitutes acceptance of the revised Terms.'
    },
    {
      num: 19,
      title: 'Contact',
      content: 'AVA Structural Steel Detailing Services LLP | Thrissur, Kerala, India | Email: info@avassds.com | Website: www.avassds.com'
    }
  ]
}

export const PRIVACY_POLICY = {
  effectiveDate: '02 August 2026',
  lastUpdated: '02 August 2026',
  intro: 'AVS Structural Steel Detailing Service ("AVS", "we", "our", or "us") respects your privacy and is committed to protecting the personal information you provide when using our website and services. This Privacy Policy explains how we collect, use, store, disclose, and safeguard your information. By accessing or using our website, you agree to the practices described in this Privacy Policy.',
  sections: [
    {
      num: 1,
      title: 'Information We Collect',
      content: 'We may collect the following information:',
      items: [
        'Name',
        'Company Name',
        'Email Address',
        'Phone Number',
        'Postal Address',
        'Country and Location',
        'Project Information',
        'Billing Information',
        'Website Usage Data',
        'IP Address',
        'Browser and Device Information',
        'Cookies and Analytics Data'
      ]
    },
    {
      num: 2,
      title: 'How We Use Your Information',
      content: 'Your information may be used to:',
      items: [
        'Respond to enquiries.',
        'Prepare quotations and proposals.',
        'Deliver structural steel detailing services.',
        'Communicate project updates.',
        'Process invoices and payments.',
        'Improve our website and services.',
        'Comply with legal and regulatory obligations.',
        'Protect our business against fraud and unauthorized access.'
      ]
    },
    {
      num: 3,
      title: 'Confidentiality of Engineering Data',
      content: 'Engineering drawings, BIM models, IFC files, fabrication drawings, shop drawings, erection drawings, RFIs, calculations, specifications, and related project documents submitted by clients shall be treated as confidential. Such information will not be disclosed except:',
      items: [
        'with the client\'s written authorization;',
        'where required by law; or',
        'to authorized subcontractors or consultants who are bound by confidentiality obligations.'
      ]
    },
    {
      num: 4,
      title: 'Cookies',
      content: 'Our website may use cookies and similar technologies to:',
      items: [
        'Improve website functionality.',
        'Remember user preferences.',
        'Measure website performance.',
        'Analyze visitor traffic.'
      ],
      footer: 'Users may disable cookies through their browser settings.'
    },
    {
      num: 5,
      title: 'Data Security',
      content: 'We implement reasonable administrative, technical, and physical safeguards to protect personal information and confidential project data from unauthorized access, disclosure, alteration, or destruction. Although we strive to use commercially acceptable means to protect your information, no method of electronic transmission or storage is completely secure.'
    },
    {
      num: 6,
      title: 'Data Retention',
      content: 'We retain personal information only for as long as necessary to:',
      items: [
        'Provide our services;',
        'Fulfil contractual obligations;',
        'Meet legal, accounting, and taxation requirements; and',
        'Resolve disputes and enforce our agreements.'
      ]
    },
    {
      num: 7,
      title: 'Third-Party Services',
      content: 'We may engage trusted third-party service providers for hosting, email, analytics, cloud storage, payment processing, and other business operations. Such providers are required to maintain appropriate confidentiality and security standards.'
    },
    {
      num: 8,
      title: 'International Data Transfers',
      content: 'Where projects involve international clients, information may be transferred across jurisdictions using appropriate contractual and technical safeguards, subject to applicable laws.'
    },
    {
      num: 9,
      title: 'Your Rights',
      content: 'Subject to applicable law, you may request to:',
      items: [
        'Access your personal information.',
        'Correct inaccurate information.',
        'Update your information.',
        'Request deletion of your personal information.',
        'Withdraw consent where applicable.',
        'Raise concerns regarding data processing.'
      ],
      footer: 'Requests may be submitted using the contact details below.'
    },
    {
      num: 10,
      title: 'Third-Party Websites',
      content: 'Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those websites.'
    },
    {
      num: 11,
      title: 'Changes to this Privacy Policy',
      content: 'We reserve the right to amend this Privacy Policy at any time. Any changes will be posted on this page together with the revised Effective Date.'
    },
    {
      num: 12,
      title: 'Contact Us',
      content: 'AVS Structural Steel Detailing Service | Thrissur, Kerala, India | Email: info@avassds.com | Website: www.avassds.com'
    }
  ],
  legalRefs: {
    title: 'Applicable Laws and Legal References',
    intro: 'This Privacy Policy is prepared with reference to applicable laws and internationally recognized privacy principles, including:',
    jurisdictions: [
      {
        name: 'India',
        laws: [
          'Digital Personal Data Protection Act, 2023',
          'Information Technology Act, 2000',
          'Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011',
          'Indian Contract Act, 1872',
          'Copyright Act, 1957 (where applicable)'
        ]
      }
    ],
    footer: 'Where required by law, AVS Structural Steel Detailing Service will comply with the applicable data protection and privacy regulations of the relevant jurisdiction.'
  }
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
