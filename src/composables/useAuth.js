import { computed, reactive, ref } from 'vue'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
import { profileApi } from '../lib/profileApi'
import { hasErrors, validateAuthForm } from '../utils/validation'

const duplicateAccountMessage = 'An account with this email already exists. Sign in instead.'

function isDuplicateSignupResponse(data) {
  const identities = data?.user?.identities

  return Array.isArray(identities) && identities.length === 0
}

function friendlyAuthMessage(error, fallback = 'Something went wrong. Please try again.') {
  const message = error?.message?.toLowerCase() || ''
  const status = error?.status

  if (
    message.includes('invalid login credentials')
    || message.includes('invalid credentials')
    || message.includes('email not confirmed')
  ) {
    return 'Email or password is incorrect. Please try again.'
  }

  if (
    message.includes('already registered')
    || message.includes('already exists')
    || message.includes('user_already_exists')
    || message.includes('cannot be created again')
  ) {
    return duplicateAccountMessage
  }

  if (status === 429 || message.includes('rate limit') || message.includes('too many')) {
    return 'Too many attempts. Please wait a moment, then try again.'
  }

  if (message.includes('failed to fetch') || message.includes('network')) {
    return 'Connection problem. Check your internet connection and try again.'
  }

  return fallback
}

export function useAuth() {
  const session = ref(null)
  const authLoading = ref(false)
  const profileLoading = ref(false)
  const passwordLoading = ref(false)
  const profile = ref(null)
  const errorMessage = ref('')
  const notice = ref('')
  const authMode = ref('sign-in')
  const authSubmitted = ref(false)

  const authForm = reactive({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  })

  const authTouched = reactive({
    name: false,
    email: false,
    password: false,
    passwordConfirmation: false,
  })

  const userEmail = computed(() => session.value?.user?.email || 'Supabase learner')
  const userName = computed(() => {
    const profileName = profile.value?.name?.trim()
    const metadataName = session.value?.user?.user_metadata?.name?.trim()

    return profileName || metadataName || userEmail.value
  })
  const authTitle = computed(() => (authMode.value === 'sign-up' ? 'Create account' : 'Sign in'))
  const authSubmitLabel = computed(() => {
    if (authLoading.value) return 'Working...'

    return authMode.value === 'sign-up' ? 'Create account' : 'Sign in'
  })
  const authErrors = computed(() => validateAuthForm({
    form: authForm,
    touched: authTouched,
    submitted: authSubmitted.value,
    mode: authMode.value,
  }))

  function showError(error) {
    errorMessage.value = friendlyAuthMessage(error, error?.message || 'Something went wrong. Please try again.')
  }

  function switchAuthMode(mode) {
    authMode.value = mode
    errorMessage.value = ''
    notice.value = ''
    authSubmitted.value = false
    if (mode === 'sign-in') {
      authForm.name = ''
    }
    authForm.password = ''
    authForm.passwordConfirmation = ''
    Object.keys(authTouched).forEach((field) => {
      authTouched[field] = false
    })
  }

  async function loadSession() {
    if (!supabase) return

    const { data, error } = await supabase.auth.getSession()

    if (error) {
      showError(error)
      return
    }

    session.value = data.session
  }

  async function signIn() {
    if (!supabase) return
    authSubmitted.value = true

    if (hasErrors(authErrors.value)) return

    authLoading.value = true
    errorMessage.value = ''
    notice.value = ''

    const { data, error } = await supabase.auth.signInWithPassword({
      email: authForm.email,
      password: authForm.password,
    })

    authLoading.value = false

    if (error) {
      errorMessage.value = friendlyAuthMessage(error, 'Email or password is incorrect. Please try again.')
      return
    }

    session.value = data.session
    notice.value = 'Signed in with Supabase Auth.'
    await loadProfile()
  }

  async function signUp() {
    if (!supabase) return
    authSubmitted.value = true

    if (hasErrors(authErrors.value)) return

    authLoading.value = true
    errorMessage.value = ''
    notice.value = ''

    const { data, error } = await supabase.auth.signUp({
      email: authForm.email,
      password: authForm.password,
      options: {
        data: {
          name: authForm.name.trim(),
        },
      },
    })

    authLoading.value = false

    if (error) {
      errorMessage.value = friendlyAuthMessage(error, duplicateAccountMessage)
      if (errorMessage.value === duplicateAccountMessage) {
        authForm.password = ''
        authForm.passwordConfirmation = ''
        authMode.value = 'sign-in'
      }
      return
    }

    if (isDuplicateSignupResponse(data)) {
      session.value = null
      errorMessage.value = duplicateAccountMessage
      notice.value = ''
      authMode.value = 'sign-in'
      authSubmitted.value = false
      authForm.name = ''
      authForm.password = ''
      authForm.passwordConfirmation = ''
      return
    }

    session.value = data.session
    notice.value = data.session
      ? 'Account created and signed in.'
      : 'Account created. Check your email if confirmation is enabled, then sign in.'

    if (data.session) {
      await loadProfile()
    }

    if (!data.session) {
      authMode.value = 'sign-in'
      authSubmitted.value = false
      authForm.name = ''
      authForm.password = ''
      authForm.passwordConfirmation = ''
    }
  }

  async function updateUserName(name) {
    if (!session.value?.access_token) return

    const trimmedName = name.trim()

    if (!trimmedName) {
      errorMessage.value = 'Enter your name.'
      return
    }

    if (trimmedName.length > 80) {
      errorMessage.value = 'Keep your name to 80 characters or fewer.'
      return
    }

    profileLoading.value = true
    errorMessage.value = ''
    notice.value = ''

    try {
      profile.value = await profileApi.update(session.value.access_token, {
        name: trimmedName,
      })
      notice.value = 'Name updated.'
    } catch (error) {
      showError(error)
    } finally {
      profileLoading.value = false
    }
  }

  async function changePassword({ currentPassword, newPassword }) {
    if (!supabase || !session.value?.user?.email) return false

    passwordLoading.value = true
    errorMessage.value = ''
    notice.value = ''

    const { error: verificationError } = await supabase.auth.signInWithPassword({
      email: session.value.user.email,
      password: currentPassword,
    })

    if (verificationError) {
      passwordLoading.value = false
      errorMessage.value = 'Current password is incorrect. Please try again.'
      return false
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    passwordLoading.value = false

    if (updateError) {
      errorMessage.value = friendlyAuthMessage(updateError, 'Password could not be updated. Please try again.')
      return false
    }

    notice.value = 'Password updated.'

    return true
  }

  async function loadProfile() {
    if (!session.value?.access_token) return

    profileLoading.value = true
    errorMessage.value = ''

    try {
      profile.value = await profileApi.get(session.value.access_token)
    } catch (error) {
      showError(error)
    } finally {
      profileLoading.value = false
    }
  }

  async function submitAuth() {
    if (authMode.value === 'sign-up') {
      await signUp()
      return
    }

    await signIn()
  }

  async function signOut() {
    if (!supabase) return

    await supabase.auth.signOut()
    session.value = null
    profile.value = null
    switchAuthMode('sign-in')
  }

  function subscribeToAuthChanges(onChange) {
    if (!supabase) return null

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      session.value = nextSession
      if (!nextSession) {
        profile.value = null
      }
      onChange?.(nextSession)
    })

    return data.subscription
  }

  return {
    hasSupabaseConfig,
    session,
    userEmail,
    userName,
    profile,
    authLoading,
    profileLoading,
    passwordLoading,
    errorMessage,
    notice,
    authMode,
    authForm,
    authTouched,
    authTitle,
    authSubmitLabel,
    authErrors,
    loadSession,
    loadProfile,
    submitAuth,
    signOut,
    updateUserName,
    changePassword,
    switchAuthMode,
    subscribeToAuthChanges,
  }
}
