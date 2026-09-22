// User Roles: Full Human-Readable System Definitions
export type UserRole =
  | 'superadmin'              // Super Administrator
  | 'project_head'            // Project Head
  | 'project_manager'         // Project Manager
  | 'quality_control'         // Quality Control Inspector
  | 'steel_detailer'          // Steel Detailer
  | 'client_project_lead'     // Client Project Lead
  | 'client_project_reviewer' // Client Project Reviewer

export interface UserProfile {
  uid: string
  email: string
  name: string
  phoneNumber: string
  companyName?: string
  role: UserRole
  profileCompleted: boolean
  assignedProjectIds: string[]
  createdAt?: any
}

// Client Organizations (Fabricator / General Contractor)
export interface ClientOrganization {
  id: string
  name: string
  contactEmail: string
  contactPhone: string
  address: string
  activeProjectCount?: number
  createdAt?: any
}

// Project Lifecycle Phases
export type ProjectPhase =
  | 'input_standards'         // 1. Input & Standards Confirmation
  | 'detailing_clarification' // 2. Detailing & Clarifications
  | 'approval_review'         // 3. Approval Submittal & Engineering Review
  | 'shop_release'            // 4. Shop Fabrication & Field Release
  | 'completed'               // 5. Project Completed & As-Built Handover

// Drawing Disciplines
export type DrawingDiscipline =
  | 'Structural'
  | 'Architectural'
  | 'Mechanical'
  | 'Electrical'
  | 'Civil'
  | 'Connection Design'
  | 'General'

// Project Drawing Item in System Drawing Register
export interface ProjectDrawing {
  id: string
  projectId: string
  discipline: DrawingDiscipline
  sheetNumber: string         // e.g. S-201
  sheetTitle: string          // e.g. First Floor Framing Plan
  currentRevision: string     // e.g. Rev 0, Rev 1
  fileUrl?: string
  uploadedBy: string
  uploadedAt?: any
}

// Dedicated Project Profile
export interface ProjectProfile {
  id: string
  name: string
  projectNumber: string
  poNumber: string
  clientId: string
  clientName: string
  structuralEngineer: string
  architect: string
  generalContractor: string
  fabricator: string
  projectLocation: string
  projectType: string
  softwareVersion: string     // e.g. SDS/2 v2024 or Tekla Structures 2024
  applicableStandards: string // e.g. AISC 360-22, CISC, OSHA
  
  // Schedule
  startDate: string
  targetCompletionDate: string
  actualCompletionDate?: string
  currentPhase: ProjectPhase

  // Team Allocation IDs
  projectHeadId?: string
  projectManagerId?: string
  qualityControlIds: string[]
  steelDetailerIds: string[]
  clientProjectLeadIds: string[]
  clientProjectReviewerIds: string[]

  // Confidential AVA Internal Metrics
  contractHours: number
  estimatedHours: number
  actualHours: number
  poValue?: number
  invoicedAmount?: number
  receivedAmount?: number

  // Standards Confirmation
  standardsPublished: boolean
  standardsDocumentUrl?: string
  standardsConfirmedByClient: boolean
  standardsConfirmedAt?: any

  createdAt?: any
}

// Priority
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent'

// Request for Information Status
export type RequestForInformationStatus =
  | 'Draft'
  | 'Submitted to Client'
  | 'Awaiting Client Response'
  | 'Awaiting AVA Response'
  | 'Answered'
  | 'Closed'

// Request for Information
export interface RequestForInformation {
  id: string
  projectId: string
  requestNumber: string       // e.g. Request for Information #001
  parentRequestId?: string    // set if this is a follow-up
  isFollowUp: boolean
  followUpIndex?: number      // 1 for Follow-Up #01
  discipline: DrawingDiscipline
  drawingReferenceId: string  // ID of drawing from ProjectDrawingRegister
  drawingReferenceLabel: string // e.g. Structural: S-201 - First Floor Framing Plan
  detailReference?: string    // e.g. Detail 4 / Grid Line B-2
  questionTitle: string
  detailedDescription: string
  priority: PriorityLevel
  submittedByUserId: string
  submittedByUserName: string
  submittedAt?: any
  
  // Client Response
  clientResponse?: string
  respondedByUserId?: string
  respondedByUserName?: string
  respondedAt?: any

  // Model Incorporation
  incorporatedInModel: boolean
  incorporatedAt?: any
  incorporatedByUserName?: string

  status: RequestForInformationStatus
  attachmentUrl?: string
}

// Drawing Clarification (Arch vs Structural)
export interface DrawingClarification {
  id: string
  projectId: string
  clarificationNumber: string // e.g. Drawing Clarification #001
  subject: string
  drawingReferenceId: string
  drawingReferenceLabel: string
  description: string
  submittedByUserId: string
  submittedByUserName: string
  submittedAt?: any
  clientResponse?: string
  respondedByUserName?: string
  respondedAt?: any
  status: 'Open' | 'Awaiting Client Response' | 'Resolved & Closed'
  attachmentUrl?: string
}

// Back From Approval Comments
export interface BackFromApprovalComment {
  id: string
  projectId: string
  commentNumber: string       // e.g. Back From Approval Comment #001
  drawingReferenceId: string
  drawingReferenceLabel: string
  descriptionOfChange: string
  avaActionTaken: string      // e.g. Revised Dimension, Request for Information Issued, Completed
  assignedQualityControlName?: string
  status: 'Open' | 'In Progress' | 'Completed' | 'Closed'
  createdAt?: any
}

// Back From Approval Clarification
export interface BackFromApprovalClarification {
  id: string
  projectId: string
  clarificationNumber: string // e.g. Back From Approval Clarification #001
  drawingReferenceId: string
  drawingReferenceLabel: string
  sheetNumber?: string
  detailNumber?: string
  issue: string
  question: string
  proposedSolution: string
  clientResponse?: string
  status: 'Open' | 'Awaiting Client Response' | 'Resolved & Closed'
  createdAt?: any
}

// Drawing Transmittal
export interface DrawingTransmittal {
  id: string
  projectId: string
  transmittalNumber: string   // e.g. Drawing Transmittal #001
  purpose: 'Approval' | 'Fabrication' | 'Field Use'
  revision: string            // Revision A, Revision B (for Approval); Revision 0, Revision 1 (for Release)
  title: string
  notes?: string
  documentsList: string[]     // e.g. ['Erection Plan E-101', 'Shop Details D-201', 'Bolt Summary']
  fileUrls?: string[]
  submittedByUserName: string
  submittedAt?: any
  
  // Client Review Action (for Approval transmittals)
  clientAction?: 'Approve' | 'Approve as Noted' | 'Revise and Resubmit' | 'Reject'
  clientActionNotes?: string
  clientActionByUserName?: string
  clientActionAt?: any
}

// Shop Fabrication & Field Release Packages
export interface ReleasePackage {
  id: string
  projectId: string
  releaseType: 'Shop Fabrication' | 'Field Erection'
  revision: string            // Revision 0, Revision 1
  transmittalNumber: string   // e.g. Drawing Transmittal #004
  description: string
  includesMachineFiles: boolean // CNC, KISS, DXF, Tekla PowerFab
  fileUrls?: { name: string; url: string; type: string }[]
  releasedByUserName: string
  releasedAt?: any
}

// Project Activity Log
export interface ProjectActivityLog {
  id: string
  projectId: string
  timestamp: any
  actorName: string
  actorRole: UserRole
  actionTitle: string
  actionDetails: string
}
