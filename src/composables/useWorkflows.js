import { computed, reactive, ref } from 'vue'
import { workflowApi } from '../lib/workflowApi'
import { hasErrors, validateWorkflowForm } from '../utils/validation'

const statusOptions = [
  { value: 'planned', label: 'Planned' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export function useWorkflows({ accessToken, canUseBackend }) {
  const workflows = ref([])
  const loading = ref(false)
  const errorMessage = ref('')
  const notice = ref('')
  const editingId = ref(null)
  const workflowSubmitted = ref(false)
  const updatingWorkflowIds = ref([])
  const workflowFilter = ref('all')

  const workflowForm = reactive({
    title: '',
    description: '',
    category: 'learning',
    priority: 'medium',
    status: 'planned',
    due_date: '',
  })

  const workflowTouched = reactive({
    title: false,
    description: false,
    due_date: false,
  })

  const workflowServerErrors = reactive({
    title: '',
    description: '',
    category: '',
    priority: '',
    status: '',
    due_date: '',
  })

  const plannedCount = computed(() => workflows.value.filter((workflow) => workflow.status === 'planned').length)
  const completedCount = computed(() => workflows.value.filter((workflow) => workflow.status === 'completed').length)
  const inProgressCount = computed(() => workflows.value.filter((workflow) => workflow.status === 'in_progress').length)
  const filterOptions = computed(() => [
    { value: 'all', label: 'All', count: workflows.value.length },
    { value: 'planned', label: 'Planned', count: plannedCount.value },
    { value: 'in_progress', label: 'In progress', count: inProgressCount.value },
    { value: 'completed', label: 'Completed', count: completedCount.value },
  ])
  const filteredWorkflows = computed(() => {
    if (workflowFilter.value === 'all') {
      return workflows.value
    }

    return workflows.value.filter((workflow) => workflow.status === workflowFilter.value)
  })
  const filteredEmptyMessage = computed(() => {
    if (workflowFilter.value === 'planned') return 'No planned workflows yet.'
    if (workflowFilter.value === 'in_progress') return 'No in-progress workflows yet.'
    if (workflowFilter.value === 'completed') return 'No completed workflows yet.'

    return 'No workflow items yet.'
  })
  const workflowErrors = computed(() => validateWorkflowForm({
    form: workflowForm,
    touched: workflowTouched,
    submitted: workflowSubmitted.value,
    serverErrors: workflowServerErrors,
  }))

  function showError(error) {
    errorMessage.value = error?.message || 'Something went wrong.'
  }

  function clearWorkflowServerErrors() {
    Object.keys(workflowServerErrors).forEach((field) => {
      workflowServerErrors[field] = ''
    })
  }

  function applyWorkflowServerErrors(errors = {}) {
    clearWorkflowServerErrors()

    Object.entries(errors).forEach(([field, messages]) => {
      if (field in workflowServerErrors) {
        workflowServerErrors[field] = Array.isArray(messages) ? messages[0] : String(messages)
      }
    })
  }

  function resetWorkflowForm() {
    workflowForm.title = ''
    workflowForm.description = ''
    workflowForm.category = 'learning'
    workflowForm.priority = 'medium'
    workflowForm.status = 'planned'
    workflowForm.due_date = ''
    editingId.value = null
    workflowSubmitted.value = false
    Object.keys(workflowTouched).forEach((field) => {
      workflowTouched[field] = false
    })
    clearWorkflowServerErrors()
  }

  function clearWorkflows() {
    workflows.value = []
    resetWorkflowForm()
    workflowFilter.value = 'all'
  }

  async function loadWorkflows() {
    if (!canUseBackend.value) return

    loading.value = true
    errorMessage.value = ''

    try {
      workflows.value = await workflowApi.list(accessToken.value)
    } catch (error) {
      showError(error)
    } finally {
      loading.value = false
    }
  }

  async function submitWorkflow() {
    workflowSubmitted.value = true
    clearWorkflowServerErrors()

    if (!canUseBackend.value || hasErrors(workflowErrors.value)) return

    loading.value = true
    errorMessage.value = ''

    const payload = {
      title: workflowForm.title.trim(),
      description: workflowForm.description.trim() || null,
      category: workflowForm.category,
      priority: workflowForm.priority,
      status: workflowForm.status,
      due_date: workflowForm.due_date || null,
    }

    try {
      if (editingId.value) {
        const updated = await workflowApi.update(accessToken.value, editingId.value, payload)
        workflows.value = workflows.value.map((workflow) => (workflow.id === updated.id ? updated : workflow))
        notice.value = 'Workflow updated.'
      } else {
        const created = await workflowApi.create(accessToken.value, payload)
        workflows.value = [created, ...workflows.value]
        notice.value = 'Workflow created.'
      }

      resetWorkflowForm()
    } catch (error) {
      if (error.status === 422 && error.errors) {
        applyWorkflowServerErrors(error.errors)
        errorMessage.value = 'Please fix the highlighted workflow fields.'
      } else {
        showError(error)
      }
    } finally {
      loading.value = false
    }
  }

  function editWorkflow(workflow) {
    editingId.value = workflow.id
    workflowForm.title = workflow.title
    workflowForm.description = workflow.description || ''
    workflowForm.category = workflow.category
    workflowForm.priority = workflow.priority
    workflowForm.status = workflow.status
    workflowForm.due_date = workflow.due_date || ''
    workflowSubmitted.value = false
    clearWorkflowServerErrors()
  }

  async function deleteWorkflow(workflowId) {
    if (!canUseBackend.value) return

    loading.value = true
    errorMessage.value = ''

    try {
      await workflowApi.remove(accessToken.value, workflowId)
      workflows.value = workflows.value.filter((workflow) => workflow.id !== workflowId)
      notice.value = 'Workflow deleted.'
    } catch (error) {
      showError(error)
    } finally {
      loading.value = false
    }
  }

  function isWorkflowUpdating(workflowId) {
    return updatingWorkflowIds.value.includes(workflowId)
  }

  async function updateWorkflowField(workflow, field, value) {
    if (!canUseBackend.value || workflow[field] === value || isWorkflowUpdating(workflow.id)) return

    const previousWorkflow = { ...workflow }
    updatingWorkflowIds.value = [...updatingWorkflowIds.value, workflow.id]
    errorMessage.value = ''
    notice.value = ''
    workflows.value = workflows.value.map((item) => (
      item.id === workflow.id ? { ...item, [field]: value } : item
    ))

    try {
      const updated = await workflowApi.update(accessToken.value, workflow.id, {
        [field]: value,
      })

      workflows.value = workflows.value.map((item) => (
        item.id === updated.id ? updated : item
      ))
      notice.value = 'Workflow progress updated.'
    } catch (error) {
      workflows.value = workflows.value.map((item) => (
        item.id === previousWorkflow.id ? previousWorkflow : item
      ))
      showError(error)
    } finally {
      updatingWorkflowIds.value = updatingWorkflowIds.value.filter((id) => id !== workflow.id)
    }
  }

  return {
    statusOptions,
    priorityOptions,
    workflows,
    loading,
    errorMessage,
    notice,
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
  }
}
