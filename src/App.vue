<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { RouterView, useRoute, useRouter } from 'vue-router'
import AuthPage from './components/auth/AuthPage.vue'
import ProfilePage from './components/profile/ProfilePage.vue'
import WorkflowDashboard from './components/workflows/WorkflowDashboard.vue'
import { useAuth } from './composables/useAuth'
import { useWorkflows } from './composables/useWorkflows'

const toast = useToast()
const route = useRoute()
const router = useRouter()

const {
  hasSupabaseConfig,
  session,
  authLoading,
  errorMessage: authErrorMessage,
  notice: authNotice,
  authMode,
  authForm,
  authTouched,
  authErrors,
  userEmail,
  userName,
  profileLoading,
  passwordLoading,
  authTitle,
  authSubmitLabel,
  loadSession,
  loadProfile,
  submitAuth,
  signOut: signOutOfSupabase,
  updateUserName,
  changePassword,
  switchAuthMode,
  subscribeToAuthChanges,
} = useAuth()

const accessToken = computed(() => session.value?.access_token)
const canUseBackend = computed(() => Boolean(hasSupabaseConfig && accessToken.value))

const {
  statusOptions,
  priorityOptions,
  workflows,
  loading,
  errorMessage: workflowErrorMessage,
  notice: workflowNotice,
  editingId,
  workflowForm,
  workflowTouched,
  workflowServerErrors,
  workflowErrors,
  workflowFilter,
  filterOptions,
  filteredWorkflows,
  filteredEmptyMessage,
  completedCount,
  inProgressCount,
  plannedCount,
  loadWorkflows,
  clearWorkflows,
  submitWorkflow,
  resetWorkflowForm,
  editWorkflow,
  deleteWorkflow,
  isWorkflowUpdating,
  updateWorkflowField,
} = useWorkflows({ accessToken, canUseBackend })

let authSubscription = null

const activeErrorMessage = computed(() => workflowErrorMessage.value || authErrorMessage.value)
const activeNotice = computed(() => workflowNotice.value || authNotice.value)
const isProfileRoute = computed(() => route.name === 'profile')

async function signOut() {
  await signOutOfSupabase()
  clearWorkflows()
}

function syncRouteForSession(nextSession) {
  if (!nextSession) {
    if (route.name !== 'auth') {
      router.replace('/auth')
    }
    return
  }

  if (route.name === 'auth' || route.path === '/') {
    router.replace('/dashboard')
  }
}

function goToProfile() {
  router.push('/profile')
}

function goToDashboard() {
  router.push('/dashboard')
}

function setWorkflowFilter(nextFilter) {
  workflowFilter.value = nextFilter
}

async function handleWorkflowFieldUpdate({ workflow, field, value }) {
  await updateWorkflowField(workflow, field, value)
}

onMounted(async () => {
  await loadSession()
  syncRouteForSession(session.value)

  if (session.value) {
    await Promise.all([
      loadProfile(),
      loadWorkflows(),
    ])
  }

  authSubscription = subscribeToAuthChanges((nextSession) => {
    syncRouteForSession(nextSession)

    if (nextSession) {
      loadProfile()
      loadWorkflows()
      return
    }

    clearWorkflows()
  })
})

onUnmounted(() => {
  authSubscription?.unsubscribe()
})

watch(session, (nextSession, previousSession) => {
  syncRouteForSession(nextSession)

  if (nextSession && !previousSession) {
    loadProfile()
    loadWorkflows()
  }

  if (!nextSession) {
    clearWorkflows()
  }
})

watch(activeErrorMessage, (message) => {
  if (!message) return

  toast.add({
    severity: 'error',
    summary: 'Action needed',
    detail: message,
    life: 4200,
  })
})

watch(activeNotice, (message) => {
  if (!message) return

  toast.add({
    severity: 'success',
    summary: 'WorkFlow Hub',
    detail: message,
    life: 2800,
  })
})
</script>

<template>
  <Toast position="top-right" />

  <AuthPage
    v-if="!session"
    :has-supabase-config="hasSupabaseConfig"
    :auth-mode="authMode"
    :auth-title="authTitle"
    :auth-submit-label="authSubmitLabel"
    :auth-loading="authLoading"
    :auth-form="authForm"
    :auth-touched="authTouched"
    :auth-errors="authErrors"
    :error-message="activeErrorMessage"
    :notice="activeNotice"
    @submit-auth="submitAuth"
    @switch-mode="switchAuthMode"
  />

  <RouterView v-else />

  <ProfilePage
    v-if="session && isProfileRoute"
    :user-name="userName"
    :user-email="userEmail"
    :profile-loading="profileLoading"
    :password-loading="passwordLoading"
    :error-message="activeErrorMessage"
    :notice="activeNotice"
    :update-user-name="updateUserName"
    :change-password="changePassword"
    @back-to-dashboard="goToDashboard"
  />

  <WorkflowDashboard
    v-else-if="session"
    :user-name="userName"
    :user-email="userEmail"
    :profile-loading="profileLoading"
    :can-use-backend="canUseBackend"
    :workflows="workflows"
    :loading="loading"
    :error-message="activeErrorMessage"
    :notice="activeNotice"
    :in-progress-count="inProgressCount"
    :planned-count="plannedCount"
    :completed-count="completedCount"
    :editing-id="editingId"
    :workflow-form="workflowForm"
    :workflow-touched="workflowTouched"
    :workflow-server-errors="workflowServerErrors"
    :workflow-errors="workflowErrors"
    :workflow-filter="workflowFilter"
    :filter-options="filterOptions"
    :filtered-workflows="filteredWorkflows"
    :filtered-empty-message="filteredEmptyMessage"
    :status-options="statusOptions"
    :priority-options="priorityOptions"
    :is-workflow-updating="isWorkflowUpdating"
    @sign-out="signOut"
    @open-profile="goToProfile"
    @submit-workflow="submitWorkflow"
    @reset-workflow-form="resetWorkflowForm"
    @change-filter="setWorkflowFilter"
    @update-workflow-field="handleWorkflowFieldUpdate"
    @edit-workflow="editWorkflow"
    @delete-workflow="deleteWorkflow"
  />
</template>
