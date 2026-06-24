<script setup>
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Password from 'primevue/password'

defineProps({
  authMode: {
    type: String,
    required: true,
  },
  authTitle: {
    type: String,
    required: true,
  },
  authSubmitLabel: {
    type: String,
    required: true,
  },
  authLoading: {
    type: Boolean,
    required: true,
  },
  authForm: {
    type: Object,
    required: true,
  },
  authTouched: {
    type: Object,
    required: true,
  },
  authErrors: {
    type: Object,
    required: true,
  },
})

defineEmits(['submit-auth', 'switch-mode'])
</script>

<template>
  <div class="section-heading">
    <p class="eyebrow">Secure access</p>
    <h2>{{ authTitle }}</h2>
    <p class="section-copy">Use Supabase Auth to unlock your Laravel-protected workflow workspace.</p>
  </div>

  <div class="auth-tabs" aria-label="Authentication mode">
    <Button
      type="button"
      label="Sign in"
      icon="pi pi-sign-in"
      :outlined="authMode !== 'sign-in'"
      :severity="authMode === 'sign-in' ? 'primary' : 'secondary'"
      @click="$emit('switch-mode', 'sign-in')"
    />
    <Button
      type="button"
      label="Create"
      icon="pi pi-user-plus"
      :outlined="authMode !== 'sign-up'"
      :severity="authMode === 'sign-up' ? 'primary' : 'secondary'"
      @click="$emit('switch-mode', 'sign-up')"
    />
  </div>

  <form class="auth-form" novalidate @submit.prevent="$emit('submit-auth')">
    <label v-if="authMode === 'sign-up'" class="field-group">
      <span>Name</span>
      <InputText
        v-model="authForm.name"
        type="text"
        autocomplete="name"
        placeholder="Your name"
        fluid
        :class="{ invalid: authErrors.name }"
        @blur="authTouched.name = true"
      />
      <Message v-if="authErrors.name" severity="error" size="small" variant="simple">
        {{ authErrors.name }}
      </Message>
    </label>

    <label class="field-group">
      <span>Email</span>
      <InputText
        v-model="authForm.email"
        type="email"
        autocomplete="email"
        placeholder="you@example.com"
        fluid
        :class="{ invalid: authErrors.email }"
        @blur="authTouched.email = true"
      />
      <Message v-if="authErrors.email" severity="error" size="small" variant="simple">
        {{ authErrors.email }}
      </Message>
    </label>
    <label class="field-group">
      <span>Password</span>
      <Password
        v-model="authForm.password"
        fluid
        toggle-mask
        :feedback="authMode === 'sign-up'"
        :autocomplete="authMode === 'sign-up' ? 'new-password' : 'current-password'"
        :class="{ invalid: authErrors.password }"
        placeholder="At least 6 characters"
        @blur="authTouched.password = true"
      />
      <Message v-if="authErrors.password" severity="error" size="small" variant="simple">
        {{ authErrors.password }}
      </Message>
    </label>
    <label v-if="authMode === 'sign-up'" class="field-group">
      <span>Confirm password</span>
      <Password
        v-model="authForm.passwordConfirmation"
        fluid
        toggle-mask
        :feedback="false"
        autocomplete="new-password"
        :class="{ invalid: authErrors.passwordConfirmation }"
        placeholder="Repeat your password"
        @blur="authTouched.passwordConfirmation = true"
      />
      <Message v-if="authErrors.passwordConfirmation" severity="error" size="small" variant="simple">
        {{ authErrors.passwordConfirmation }}
      </Message>
    </label>

    <Button
      type="submit"
      :label="authSubmitLabel"
      icon="pi pi-lock"
      :loading="authLoading"
      :disabled="authLoading"
    />
  </form>
</template>
