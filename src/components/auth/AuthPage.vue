<script setup>
import Avatar from 'primevue/avatar'
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import Message from 'primevue/message'
import Tag from 'primevue/tag'
import AuthForm from './AuthForm.vue'

defineProps({
  hasSupabaseConfig: {
    type: Boolean,
    required: true,
  },
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
  errorMessage: {
    type: String,
    default: '',
  },
  notice: {
    type: String,
    default: '',
  },
})

defineEmits(['submit-auth', 'switch-mode'])
</script>

<template>
  <main class="auth-shell">
    <section class="auth-hero">
      <div class="brand-cluster">
        <Avatar icon="pi pi-bolt" shape="circle" size="large" class="brand-avatar" />
        <p class="eyebrow">Vue + Vite workflow system</p>
        <h1>WorkFlow Hub</h1>
        <p class="hero-copy">
          A focused workspace for proving auth, API protection, and product-grade workflow UX.
        </p>
      </div>
      <Tag
        :severity="hasSupabaseConfig ? 'success' : 'warn'"
        :value="hasSupabaseConfig ? 'Supabase ready' : 'Setup needed'"
        rounded
      />
    </section>

    <section class="auth-layout">
      <Card class="auth-card surface-card">
        <template #content>
          <AuthForm
            v-if="hasSupabaseConfig"
            :auth-mode="authMode"
            :auth-title="authTitle"
            :auth-submit-label="authSubmitLabel"
            :auth-loading="authLoading"
            :auth-form="authForm"
            :auth-touched="authTouched"
            :auth-errors="authErrors"
            @submit-auth="$emit('submit-auth')"
            @switch-mode="$emit('switch-mode', $event)"
          />

          <template v-else>
            <div class="section-heading">
              <p class="eyebrow">Account</p>
              <h2>{{ authTitle }}</h2>
              <p class="section-copy">Supabase credentials are required before WorkFlow Hub can authenticate.</p>
            </div>
            <Message severity="warn" :closable="false">
              Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local.
            </Message>
          </template>

          <Message v-if="errorMessage" severity="error" :closable="false" class="form-message">
            {{ errorMessage }}
          </Message>
          <Message v-if="notice" severity="success" :closable="false" class="form-message">
            {{ notice }}
          </Message>
        </template>
      </Card>

      <Card class="auth-explainer surface-card">
        <template #content>
          <p class="eyebrow">Architecture</p>
          <h2>Supabase signs you in. Laravel protects the work.</h2>
          <Divider />
          <div class="architecture-list">
            <div>
              <i class="pi pi-desktop"></i>
              <span>Vue renders reactive forms and dashboard state.</span>
            </div>
            <div>
              <i class="pi pi-key"></i>
              <span>Supabase Auth returns a session access token.</span>
            </div>
            <div>
              <i class="pi pi-shield"></i>
              <span>Laravel verifies Bearer tokens before REST actions.</span>
            </div>
            <div>
              <i class="pi pi-database"></i>
              <span>Supabase Postgres stores user-owned workflows.</span>
            </div>
          </div>
        </template>
      </Card>
    </section>
  </main>
</template>
