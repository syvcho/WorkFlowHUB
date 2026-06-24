export function hasErrors(errors) {
  return Object.values(errors).some(Boolean)
}

export function validateAuthForm({ form, touched, submitted, mode }) {
  const errors = {
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  }
  const name = form.name.trim()
  const email = form.email.trim()

  if (mode === 'sign-up' && (touched.name || submitted)) {
    if (!name) {
      errors.name = 'Enter your name.'
    } else if (name.length > 80) {
      errors.name = 'Keep your name to 80 characters or fewer.'
    }
  }

  if ((touched.email || submitted) && !email) {
    errors.email = 'Enter your email address.'
  } else if ((touched.email || submitted) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  if ((touched.password || submitted) && !form.password) {
    errors.password = 'Enter your password.'
  } else if ((touched.password || submitted) && form.password.length < 6) {
    errors.password = 'Use at least 6 characters.'
  }

  if (mode === 'sign-up' && (touched.passwordConfirmation || submitted)) {
    if (!form.passwordConfirmation) {
      errors.passwordConfirmation = 'Confirm your password.'
    } else if (form.password !== form.passwordConfirmation) {
      errors.passwordConfirmation = 'Password confirmation does not match.'
    }
  }

  return errors
}

export function validateWorkflowForm({ form, touched, submitted, serverErrors }) {
  const errors = {
    title: '',
    description: '',
    due_date: '',
  }
  const title = form.title.trim()
  const description = form.description.trim()

  if ((touched.title || submitted) && !title) {
    errors.title = 'Give this workflow a short title.'
  } else if ((touched.title || submitted) && title.length > 160) {
    errors.title = 'Keep the title to 160 characters or fewer.'
  }

  if ((touched.description || submitted) && description.length > 2000) {
    errors.description = 'Keep the description to 2000 characters or fewer.'
  }

  if ((touched.due_date || submitted) && form.due_date) {
    const timestamp = Date.parse(form.due_date)

    if (Number.isNaN(timestamp)) {
      errors.due_date = 'Choose a valid due date.'
    }
  }

  return {
    title: errors.title || serverErrors.title,
    description: errors.description || serverErrors.description,
    due_date: errors.due_date || serverErrors.due_date,
    category: serverErrors.category,
    priority: serverErrors.priority,
    status: serverErrors.status,
  }
}
