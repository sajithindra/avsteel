import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  collection,
  query,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore'
import { db } from '../../../firebase'
import type {
  RequestForInformation,
  DrawingClarification,
  BackFromApprovalComment,
  BackFromApprovalClarification,
  PriorityLevel,
  DrawingDiscipline
} from '../../../types/portal'
import { useAuditStore } from '../../../core/audit/auditStore'
import { useAuthStore } from '../../../stores/auth'

export const useCommunicationStore = defineStore('communication', () => {
  const auditStore = useAuditStore()
  const authStore = useAuthStore()
  const rfis = ref<RequestForInformation[]>([])
  const clarifications = ref<DrawingClarification[]>([])
  const bfaComments = ref<BackFromApprovalComment[]>([])
  const bfaClarifications = ref<BackFromApprovalClarification[]>([])

  const loading = ref<boolean>(false)
  const error = ref<string>('')

  let rfiUnsubscribe: (() => void) | null = null
  let clrUnsubscribe: (() => void) | null = null
  let bfaCommentUnsubscribe: (() => void) | null = null
  let bfaClrUnsubscribe: (() => void) | null = null

  // Attach all listeners for a given project
  function initProjectCommunication(projectId: string) {
    stopProjectCommunication()
    loading.value = true

    try {
      // 1. Requests for Information
      const rfiRef = collection(db, 'projects', projectId, 'requests_for_information')
      const rfiQuery = query(rfiRef, orderBy('requestNumber', 'asc'))
      rfiUnsubscribe = onSnapshot(
        rfiQuery,
        (snapshot) => {
          const list: RequestForInformation[] = []
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as RequestForInformation)
          })
          rfis.value = list
        },
        (err) => {
          console.error('Error listening to RFIs:', err)
          error.value = err.message || 'Failed to sync requests for information.'
        }
      )

      // 2. Drawing Clarifications
      const clrRef = collection(db, 'projects', projectId, 'drawing_clarifications')
      const clrQuery = query(clrRef, orderBy('clarificationNumber', 'asc'))
      clrUnsubscribe = onSnapshot(
        clrQuery,
        (snapshot) => {
          const list: DrawingClarification[] = []
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as DrawingClarification)
          })
          clarifications.value = list
        },
        (err) => {
          console.error('Error listening to clarifications:', err)
          error.value = err.message || 'Failed to sync drawing clarifications.'
        }
      )

      // 3. Back From Approval Comments
      const bfaRef = collection(db, 'projects', projectId, 'bfa_comments')
      const bfaQuery = query(bfaRef, orderBy('commentNumber', 'asc'))
      bfaCommentUnsubscribe = onSnapshot(
        bfaQuery,
        (snapshot) => {
          const list: BackFromApprovalComment[] = []
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as BackFromApprovalComment)
          })
          bfaComments.value = list
        },
        (err) => {
          console.error('Error listening to BFA comments:', err)
          error.value = err.message || 'Failed to sync back from approval comments.'
        }
      )

      // 4. Back From Approval Clarifications
      const bfaClrRef = collection(db, 'projects', projectId, 'bfa_clarifications')
      const bfaClrQuery = query(bfaClrRef, orderBy('clarificationNumber', 'asc'))
      bfaClrUnsubscribe = onSnapshot(
        bfaClrQuery,
        (snapshot) => {
          const list: BackFromApprovalClarification[] = []
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as BackFromApprovalClarification)
          })
          bfaClarifications.value = list
          loading.value = false
        },
        (err) => {
          console.error('Error listening to BFA clarifications:', err)
          error.value = err.message || 'Failed to sync back from approval clarifications.'
          loading.value = false
        }
      )
    } catch (err: any) {
      console.error('Error initiating communication listeners:', err)
      error.value = err.message || 'Failed to load project communications.'
      loading.value = false
    }
  }

  function stopProjectCommunication() {
    if (rfiUnsubscribe) {
      rfiUnsubscribe()
      rfiUnsubscribe = null
    }
    if (clrUnsubscribe) {
      clrUnsubscribe()
      clrUnsubscribe = null
    }
    if (bfaCommentUnsubscribe) {
      bfaCommentUnsubscribe()
      bfaCommentUnsubscribe = null
    }
    if (bfaClrUnsubscribe) {
      bfaClrUnsubscribe()
      bfaClrUnsubscribe = null
    }
    rfis.value = []
    clarifications.value = []
    bfaComments.value = []
    bfaClarifications.value = []
  }

  // ==========================================
  // REQUEST FOR INFORMATION ACTIONS
  // ==========================================
  async function createRequestForInformation(
    projectId: string,
    payload: {
      discipline: DrawingDiscipline
      drawingReferenceId: string
      drawingReferenceLabel: string
      detailReference?: string
      questionTitle: string
      detailedDescription: string
      priority: PriorityLevel
      submittedByUserId: string
      submittedByUserName: string
      parentRequestId?: string
      isFollowUp?: boolean
    }
  ) {
    try {
      const colRef = collection(db, 'projects', projectId, 'requests_for_information')
      const newDocRef = doc(colRef)

      // Calculate sequential number
      let requestNumber = ''
      if (payload.isFollowUp && payload.parentRequestId) {
        const parent = rfis.value.find((r) => r.id === payload.parentRequestId)
        const siblingFollowUps = rfis.value.filter(
          (r) => r.parentRequestId === payload.parentRequestId
        )
        const index = siblingFollowUps.length + 1
        const formattedIndex = index.toString().padStart(2, '0')
        requestNumber = `${parent?.requestNumber || 'Request for Information'} - Follow-Up #${formattedIndex}`
      } else {
        const primaryCount = rfis.value.filter((r) => !r.isFollowUp).length + 1
        requestNumber = `Request for Information #${primaryCount.toString().padStart(3, '0')}`
      }

      const item: RequestForInformation = {
        id: newDocRef.id,
        projectId,
        requestNumber,
        parentRequestId: payload.parentRequestId,
        isFollowUp: !!payload.isFollowUp,
        discipline: payload.discipline,
        drawingReferenceId: payload.drawingReferenceId,
        drawingReferenceLabel: payload.drawingReferenceLabel,
        detailReference: payload.detailReference || '',
        questionTitle: payload.questionTitle.trim(),
        detailedDescription: payload.detailedDescription.trim(),
        priority: payload.priority,
        submittedByUserId: payload.submittedByUserId,
        submittedByUserName: payload.submittedByUserName,
        submittedAt: serverTimestamp(),
        incorporatedInModel: false,
        status: 'Submitted to Client'
      }

      await setDoc(newDocRef, item)
      await auditStore.recordActivity(
        projectId,
        item.isFollowUp ? 'Request for Information Follow-Up Raised' : 'Request for Information Raised',
        `${item.requestNumber}: "${item.questionTitle}" on ${item.drawingReferenceLabel}`,
        payload.submittedByUserName,
        authStore.currentRole
      )
      return item
    } catch (err: any) {
      console.error('Failed to create Request for Information:', err)
      throw err
    }
  }

  // Submit Client Response to Request for Information
  async function submitRfiResponse(
    projectId: string,
    rfiId: string,
    clientResponse: string,
    user: { uid: string; name: string }
  ) {
    try {
      const rRef = doc(db, 'projects', projectId, 'requests_for_information', rfiId)
      await updateDoc(rRef, {
        clientResponse: clientResponse.trim(),
        respondedByUserId: user.uid,
        respondedByUserName: user.name,
        respondedAt: serverTimestamp(),
        status: 'Answered'
      })
      const rfi = rfis.value.find((r) => r.id === rfiId)
      await auditStore.recordActivity(
        projectId,
        'Client Response Submitted',
        `Response provided for ${rfi?.requestNumber || 'RFI'}: "${clientResponse.slice(0, 80)}..."`,
        user.name,
        authStore.currentRole
      )
    } catch (err: any) {
      console.error('Failed to submit response:', err)
      throw err
    }
  }

  // Toggle "Incorporated in 3D Model: Yes / No"
  async function toggleModelIncorporation(
    projectId: string,
    rfiId: string,
    currentState: boolean,
    userName: string
  ) {
    try {
      const rRef = doc(db, 'projects', projectId, 'requests_for_information', rfiId)
      const nextState = !currentState
      await updateDoc(rRef, {
        incorporatedInModel: nextState,
        incorporatedAt: nextState ? serverTimestamp() : null,
        incorporatedByUserName: nextState ? userName : ''
      })
      const rfi = rfis.value.find((r) => r.id === rfiId)
      await auditStore.recordActivity(
        projectId,
        'Model Incorporation Status Updated',
        `${rfi?.requestNumber || 'RFI'} marked as ${nextState ? 'INCORPORATED in 3D Model' : 'NOT INCORPORATED'}`,
        userName,
        authStore.currentRole
      )
    } catch (err: any) {
      console.error('Failed to toggle model incorporation:', err)
      throw err
    }
  }

  // ==========================================
  // DRAWING CLARIFICATION ACTIONS
  // ==========================================
  async function createDrawingClarification(
    projectId: string,
    payload: {
      subject: string
      drawingReferenceId: string
      drawingReferenceLabel: string
      description: string
      submittedByUserId: string
      submittedByUserName: string
    }
  ) {
    try {
      const colRef = collection(db, 'projects', projectId, 'drawing_clarifications')
      const newDocRef = doc(colRef)
      const count = clarifications.value.length + 1
      const clarificationNumber = `Drawing Clarification #${count.toString().padStart(3, '0')}`

      const item: DrawingClarification = {
        id: newDocRef.id,
        projectId,
        clarificationNumber,
        subject: payload.subject.trim(),
        drawingReferenceId: payload.drawingReferenceId,
        drawingReferenceLabel: payload.drawingReferenceLabel,
        description: payload.description.trim(),
        submittedByUserId: payload.submittedByUserId,
        submittedByUserName: payload.submittedByUserName,
        submittedAt: serverTimestamp(),
        status: 'Open'
      }

      await setDoc(newDocRef, item)
      await auditStore.recordActivity(
        projectId,
        'Drawing Clarification Raised',
        `${item.clarificationNumber}: "${item.subject}" on ${item.drawingReferenceLabel}`,
        payload.submittedByUserName,
        authStore.currentRole
      )
      return item
    } catch (err: any) {
      console.error('Failed to create Drawing Clarification:', err)
      throw err
    }
  }

  async function submitClarificationResponse(
    projectId: string,
    clrId: string,
    response: string,
    userName: string
  ) {
    try {
      const cRef = doc(db, 'projects', projectId, 'drawing_clarifications', clrId)
      await updateDoc(cRef, {
        clientResponse: response.trim(),
        respondedByUserName: userName,
        respondedAt: serverTimestamp(),
        status: 'Resolved & Closed'
      })
      const clr = clarifications.value.find((c) => c.id === clrId)
      await auditStore.recordActivity(
        projectId,
        'Drawing Clarification Resolved',
        `${clr?.clarificationNumber || 'Clarification'} resolved: "${response.slice(0, 80)}..."`,
        userName,
        authStore.currentRole
      )
    } catch (err: any) {
      console.error('Failed to submit clarification response:', err)
      throw err
    }
  }

  // ==========================================
  // BACK FROM APPROVAL COMMENT ACTIONS
  // ==========================================
  async function createBfaComment(
    projectId: string,
    payload: {
      drawingReferenceId: string
      drawingReferenceLabel: string
      descriptionOfChange: string
      avaActionTaken?: string
      assignedQualityControlName?: string
    }
  ) {
    try {
      const colRef = collection(db, 'projects', projectId, 'bfa_comments')
      const newDocRef = doc(colRef)
      const count = bfaComments.value.length + 1
      const commentNumber = `Back From Approval Comment #${count.toString().padStart(3, '0')}`

      const item: BackFromApprovalComment = {
        id: newDocRef.id,
        projectId,
        commentNumber,
        drawingReferenceId: payload.drawingReferenceId,
        drawingReferenceLabel: payload.drawingReferenceLabel,
        descriptionOfChange: payload.descriptionOfChange.trim(),
        avaActionTaken: payload.avaActionTaken || 'Under Review',
        assignedQualityControlName: payload.assignedQualityControlName || '',
        status: 'Open',
        createdAt: serverTimestamp()
      }

      await setDoc(newDocRef, item)
      await auditStore.recordActivity(
        projectId,
        'Back From Approval Comment Logged',
        `${item.commentNumber} logged on ${item.drawingReferenceLabel}: "${item.descriptionOfChange.slice(0, 80)}..."`,
        authStore.profile?.name || authStore.user?.email || 'Quality Inspector',
        authStore.currentRole
      )
      return item
    } catch (err: any) {
      console.error('Failed to create Back From Approval Comment:', err)
      throw err
    }
  }

  async function updateBfaCommentStatus(
    projectId: string,
    commentId: string,
    updates: Partial<BackFromApprovalComment>
  ) {
    try {
      const bRef = doc(db, 'projects', projectId, 'bfa_comments', commentId)
      await updateDoc(bRef, updates)
    } catch (err: any) {
      console.error('Failed to update comment status:', err)
      throw err
    }
  }

  // ==========================================
  // BACK FROM APPROVAL CLARIFICATION
  // ==========================================
  async function createBfaClarification(
    projectId: string,
    payload: {
      drawingReferenceId: string
      drawingReferenceLabel: string
      sheetNumber?: string
      detailNumber?: string
      issue: string
      question: string
      proposedSolution: string
    }
  ) {
    try {
      const colRef = collection(db, 'projects', projectId, 'bfa_clarifications')
      const newDocRef = doc(colRef)
      const count = bfaClarifications.value.length + 1
      const clarificationNumber = `Back From Approval Clarification #${count.toString().padStart(3, '0')}`

      const item: BackFromApprovalClarification = {
        id: newDocRef.id,
        projectId,
        clarificationNumber,
        drawingReferenceId: payload.drawingReferenceId,
        drawingReferenceLabel: payload.drawingReferenceLabel,
        sheetNumber: payload.sheetNumber || '',
        detailNumber: payload.detailNumber || '',
        issue: payload.issue.trim(),
        question: payload.question.trim(),
        proposedSolution: payload.proposedSolution.trim(),
        status: 'Open',
        createdAt: serverTimestamp()
      }

      await setDoc(newDocRef, item)
      return item
    } catch (err: any) {
      console.error('Failed to create BFA clarification:', err)
      throw err
    }
  }

  return {
    rfis,
    clarifications,
    bfaComments,
    bfaClarifications,
    loading,
    error,
    initProjectCommunication,
    stopProjectCommunication,
    createRequestForInformation,
    submitRfiResponse,
    toggleModelIncorporation,
    createDrawingClarification,
    submitClarificationResponse,
    createBfaComment,
    updateBfaCommentStatus,
    createBfaClarification
  }
})
