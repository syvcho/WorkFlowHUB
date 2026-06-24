<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import Message from 'primevue/message'
import Tag from 'primevue/tag'
import WorkflowBacklog from './WorkflowBacklog.vue'
import WorkflowForm from './WorkflowForm.vue'
import WorkflowStats from './WorkflowStats.vue'

const props = defineProps({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  profileLoading: {
    type: Boolean,
    required: true,
  },
  canUseBackend: {
    type: Boolean,
    required: true,
  },
  workflows: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  notice: {
    type: String,
    default: '',
  },
  plannedCount: {
    type: Number,
    required: true,
  },
  inProgressCount: {
    type: Number,
    required: true,
  },
  completedCount: {
    type: Number,
    required: true,
  },
  editingId: {
    type: [Number, String, null],
    default: null,
  },
  workflowForm: {
    type: Object,
    required: true,
  },
  workflowTouched: {
    type: Object,
    required: true,
  },
  workflowServerErrors: {
    type: Object,
    required: true,
  },
  workflowErrors: {
    type: Object,
    required: true,
  },
  workflowFilter: {
    type: String,
    required: true,
  },
  filterOptions: {
    type: Array,
    required: true,
  },
  filteredWorkflows: {
    type: Array,
    required: true,
  },
  filteredEmptyMessage: {
    type: String,
    required: true,
  },
  statusOptions: {
    type: Array,
    required: true,
  },
  priorityOptions: {
    type: Array,
    required: true,
  },
  isWorkflowUpdating: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits([
  'sign-out',
  'open-profile',
  'submit-workflow',
  'reset-workflow-form',
  'change-filter',
  'update-workflow-field',
  'edit-workflow',
  'delete-workflow',
])

const activeSection = ref('dashboard-overview')
const progressTotal = computed(() => props.plannedCount + props.inProgressCount + props.completedCount)
const plannedPercent = computed(() => progressPercent(props.plannedCount))
const inProgressPercent = computed(() => progressPercent(props.inProgressCount))
const completedPercent = computed(() => progressPercent(props.completedCount))
const sidebarItems = [
  { id: 'dashboard-overview', label: 'Dashboard', icon: 'pi pi-home' },
  { id: 'workflow-editor', label: 'Create workflow', icon: 'pi pi-plus-circle' },
  { id: 'workflow-items', label: 'Workflow items', icon: 'pi pi-list-check' },
]

let scrollFrame = null

function progressPercent(count) {
  if (!progressTotal.value) return 0

  return (count / progressTotal.value) * 100
}

function goToSection(sectionId) {
  activeSection.value = sectionId
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

function updateActiveSectionFromScroll() {
  if (window.scrollY <= 24) {
    activeSection.value = 'dashboard-overview'
    return
  }

  const bottomDistance = document.documentElement.scrollHeight - window.innerHeight - window.scrollY

  if (bottomDistance <= 24) {
    activeSection.value = 'workflow-items'
    return
  }

  const activationLine = 120
  const currentSection = sidebarItems.reduce((current, item) => {
    const section = document.getElementById(item.id)

    if (!section) return current

    if (section.getBoundingClientRect().top <= activationLine) {
      return item.id
    }

    return current
  }, 'dashboard-overview')

  activeSection.value = currentSection
}

function handleScroll() {
  if (scrollFrame) return

  scrollFrame = window.requestAnimationFrame(() => {
    updateActiveSectionFromScroll()
    scrollFrame = null
  })
}

onMounted(() => {
  updateActiveSectionFromScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)

  if (scrollFrame) {
    window.cancelAnimationFrame(scrollFrame)
  }
})
</script>

<template>
  <main class="dashboard-shell">
    <aside class="workspace-rail">
      <section class="rail-section rail-brand-section">
        <div class="rail-brand">
          <Avatar icon="pi pi-bolt" shape="circle" size="large" class="brand-avatar" />
          <div>
            <strong>WorkFlow Hub</strong>
            <span>Workflow workspace</span>
          </div>
        </div>
        <Tag
          :severity="canUseBackend ? 'success' : 'warn'"
          :value="canUseBackend ? 'Connected' : 'Setup needed'"
          rounded
          class="rail-status"
        />
      </section>

      <section class="rail-section">
        <p class="rail-section-title">Workspace</p>
        <nav class="rail-nav" aria-label="Workspace sections">
          <a
            v-for="item in sidebarItems"
            :key="item.id"
            :href="`#${item.id}`"
            :class="{ active: activeSection === item.id }"
            @click.prevent="goToSection(item.id)"
          >
            <i :class="item.icon"></i>
            {{ item.label }}
          </a>
        </nav>
      </section>

      <section class="rail-section">
        <p class="rail-section-title">Progress</p>
        <div class="rail-progress-summary" aria-label="Workflow status counts">
          <div class="rail-progress-bar" :class="{ empty: progressTotal === 0 }" aria-hidden="true">
            <span
              v-if="progressTotal && plannedCount > 0"
              class="rail-progress-segment planned"
              :style="{ width: `${plannedPercent}%` }"
            ></span>
            <span
              v-if="progressTotal && inProgressCount > 0"
              class="rail-progress-segment progress"
              :style="{ width: `${inProgressPercent}%` }"
            ></span>
            <span
              v-if="progressTotal && completedCount > 0"
              class="rail-progress-segment complete"
              :style="{ width: `${completedPercent}%` }"
            ></span>
          </div>

          <div class="rail-progress-labels">
            <span>
              <i class="planned"></i>
              Planned
              <strong>{{ plannedCount }}</strong>
            </span>
            <span>
              <i class="progress"></i>
              In progress
              <strong>{{ inProgressCount }}</strong>
            </span>
            <span>
              <i class="complete"></i>
              Completed
              <strong>{{ completedCount }}</strong>
            </span>
          </div>
        </div>
      </section>

      <Card class="rail-account-card">
        <template #content>
          <div class="rail-account">
            <Avatar icon="pi pi-user" shape="circle" />
            <div>
              <p class="rail-section-title">Signed in</p>
              <strong>{{ userName }}</strong>
              <span>{{ userEmail }}</span>
            </div>
          </div>
          <div class="rail-account-actions">
            <Button
              type="button"
              label="Edit"
              icon="pi pi-pencil"
              severity="secondary"
              outlined
              class="rail-edit-name"
              :loading="profileLoading"
              :disabled="profileLoading"
              @click="$emit('open-profile')"
            />
            <Button
              type="button"
              label="Sign out"
              icon="pi pi-sign-out"
              severity="danger"
              outlined
              class="rail-logout"
              @click="$emit('sign-out')"
            />
          </div>
        </template>
      </Card>
    </aside>

    <section class="dashboard-main">
      <section id="dashboard-overview" class="dashboard-hero">
        <div>
          <p class="eyebrow">WorkFlow Hub</p>
          <h1>Plan your work. Move every task forward.</h1>
          <p class="hero-copy">
            Track priorities, progress, and due dates in one focused workspace for learning, CV work, and project tasks.
          </p>
        </div>

      </section>

      <section class="identity-grid">
        <Card class="identity-card surface-card">
          <template #content>
            <div class="identity-row">
              <Avatar icon="pi pi-user" shape="circle" size="large" />
              <div>
                <p class="eyebrow">Supabase Auth</p>
                <h2>{{ userName }}</h2>
                <p class="section-copy">{{ userEmail }}</p>
              </div>
            </div>
            <Divider />
            <p class="section-copy">
              Your Supabase session token is sent to Laravel as a Bearer token for protected REST calls.
            </p>
          </template>
        </Card>

        <WorkflowStats
          :total="workflows.length"
          :planned="plannedCount"
          :in-progress="inProgressCount"
          :completed="completedCount"
        />
      </section>

      <Message v-if="errorMessage" severity="error" :closable="false" class="dashboard-message">
        {{ errorMessage }}
      </Message>
      <Message v-if="notice" severity="success" :closable="false" class="dashboard-message">
        {{ notice }}
      </Message>

      <section class="work-grid">
        <WorkflowForm
          id="workflow-editor"
          :editing-id="editingId"
          :workflow-form="workflowForm"
          :workflow-touched="workflowTouched"
          :workflow-server-errors="workflowServerErrors"
          :workflow-errors="workflowErrors"
          :can-use-backend="canUseBackend"
          :loading="loading"
          @submit-workflow="$emit('submit-workflow')"
          @reset-workflow-form="$emit('reset-workflow-form')"
        />

        <WorkflowBacklog
          id="workflow-items"
          :can-use-backend="canUseBackend"
          :loading="loading"
          :workflows-length="workflows.length"
          :filtered-workflows="filteredWorkflows"
          :filtered-empty-message="filteredEmptyMessage"
          :filter-options="filterOptions"
          :workflow-filter="workflowFilter"
          :status-options="statusOptions"
          :priority-options="priorityOptions"
          :is-workflow-updating="isWorkflowUpdating"
          @change-filter="$emit('change-filter', $event)"
          @update-workflow-field="$emit('update-workflow-field', $event)"
          @edit-workflow="$emit('edit-workflow', $event)"
          @delete-workflow="$emit('delete-workflow', $event)"
        />
      </section>
    </section>
  </main>
</template>
