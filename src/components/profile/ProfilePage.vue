<script setup>
import { computed, reactive, ref, watch } from 'vue'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Password from 'primevue/password'
import Tag from 'primevue/tag'

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
  passwordLoading: {
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
  updateUserName: {
    type: Function,
    required: true,
  },
  changePassword: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['back-to-dashboard'])

const nameDraft = ref(props.userName)
const nameSubmitted = ref(false)
const passwordSubmitted = ref(false)
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const nameError = computed(() => {
  if (!nameSubmitted.value) return ''

  const trimmedName = nameDraft.value.trim()

  if (!trimmedName) return 'Enter your name.'
  if (trimmedName.length > 80) return 'Keep your name to 80 characters or fewer.'

  return ''
})

const passwordErrors = computed(() => {
  const errors = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }

  if (!passwordSubmitted.value) return errors

  if (!passwordForm.currentPassword) {
    errors.currentPassword = 'Enter your current password.'
  }

  if (!passwordForm.newPassword) {
    errors.newPassword = 'Enter a new password.'
  } else if (passwordForm.newPassword.length < 6) {
    errors.newPassword = 'Use at least 6 characters.'
  }

  if (!passwordForm.confirmPassword) {
    errors.confirmPassword = 'Confirm your new password.'
  } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    errors.confirmPassword = 'Password confirmation does not match.'
  }

  return errors
})

const hasPasswordErrors = computed(() => Object.values(passwordErrors.value).some(Boolean))

watch(() => props.userName, (nextName) => {
  nameDraft.value = nextName
})

async function submitName() {
  nameSubmitted.value = true

  if (nameError.value) return

  await props.updateUserName(nameDraft.value.trim())
  nameSubmitted.value = false
}

async function submitPassword() {
  passwordSubmitted.value = true

  if (hasPasswordErrors.value) return

  const changed = await props.changePassword({
    currentPassword: passwordForm.currentPassword,
    newPassword: passwordForm.newPassword,
  })

  if (!changed) return

  passwordSubmitted.value = false
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}
</script>

<template>
  <main class="profile-shell">
    <section class="profile-hero">
      <div>
        <p class="eyebrow">Profile</p>
        <h1>Manage your WorkFlow Hub account.</h1>
        <p class="hero-copy">
          Keep your display name current and update the password for your Supabase sign-in.
        </p>
      </div>
      <Button
        type="button"
        label="Back to dashboard"
        icon="pi pi-arrow-left"
        severity="secondary"
        outlined
        @click="emit('back-to-dashboard')"
      />
    </section>

    <Message v-if="errorMessage" severity="error" :closable="false" class="dashboard-message">
      {{ errorMessage }}
    </Message>
    <Message v-if="notice" severity="success" :closable="false" class="dashboard-message">
      {{ notice }}
    </Message>

    <section class="profile-grid">
      <Card class="surface-card profile-card profile-account-card">
        <template #content>
          <div class="profile-account">
            <Avatar icon="pi pi-user" shape="circle" size="xlarge" />
            <div>
              <p class="eyebrow">Signed in as</p>
              <h2>{{ userName }}</h2>
              <p class="section-copy">{{ userEmail }}</p>
            </div>
          </div>
          <Divider />
          <div class="profile-tags">
            <Tag value="Supabase Auth" severity="info" rounded />
            <Tag value="Laravel Profile" severity="success" rounded />
          </div>
        </template>
      </Card>

      <Card class="surface-card profile-card">
        <template #content>
          <div class="section-heading">
            <p class="eyebrow">Display name</p>
            <h2>Edit profile</h2>
            <p class="section-copy">This name is stored in your Laravel-backed profile record.</p>
          </div>

          <form class="profile-form" novalidate @submit.prevent="submitName">
            <label class="field-group">
              <span>Name</span>
              <InputText
                v-model="nameDraft"
                autocomplete="name"
                placeholder="Your name"
                fluid
                :class="{ invalid: nameError }"
              />
              <Message v-if="nameError" severity="error" size="small" variant="simple">
                {{ nameError }}
              </Message>
            </label>

            <Button
              type="submit"
              label="Save profile"
              icon="pi pi-check"
              :loading="profileLoading"
              :disabled="profileLoading"
            />
          </form>
        </template>
      </Card>

      <Card class="surface-card profile-card profile-password-card">
        <template #content>
          <div class="section-heading">
            <p class="eyebrow">Security</p>
            <h2>Change password</h2>
            <p class="section-copy">Confirm your current password before setting a new one.</p>
          </div>

          <form class="profile-form" novalidate @submit.prevent="submitPassword">
            <label class="field-group">
              <span>Current password</span>
              <Password
                v-model="passwordForm.currentPassword"
                fluid
                toggle-mask
                :feedback="false"
                autocomplete="current-password"
                :class="{ invalid: passwordErrors.currentPassword }"
              />
              <Message v-if="passwordErrors.currentPassword" severity="error" size="small" variant="simple">
                {{ passwordErrors.currentPassword }}
              </Message>
            </label>

            <label class="field-group">
              <span>New password</span>
              <Password
                v-model="passwordForm.newPassword"
                fluid
                toggle-mask
                feedback
                autocomplete="new-password"
                :class="{ invalid: passwordErrors.newPassword }"
              />
              <Message v-if="passwordErrors.newPassword" severity="error" size="small" variant="simple">
                {{ passwordErrors.newPassword }}
              </Message>
            </label>

            <label class="field-group">
              <span>Confirm new password</span>
              <Password
                v-model="passwordForm.confirmPassword"
                fluid
                toggle-mask
                :feedback="false"
                autocomplete="new-password"
                :class="{ invalid: passwordErrors.confirmPassword }"
              />
              <Message v-if="passwordErrors.confirmPassword" severity="error" size="small" variant="simple">
                {{ passwordErrors.confirmPassword }}
              </Message>
            </label>

            <Button
              type="submit"
              label="Update password"
              icon="pi pi-lock"
              :loading="passwordLoading"
              :disabled="passwordLoading"
            />
          </form>
        </template>
      </Card>
    </section>
  </main>
</template>
