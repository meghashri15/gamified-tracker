export const mockLogin = (email) => {
  const name = email.split('@')[0]
  localStorage.setItem('gp-user', JSON.stringify({ email, name }))
  return Promise.resolve({ user: { email, name } })
}

export const mockRegister = (name, email) => {
  localStorage.setItem('gp-user', JSON.stringify({ name, email }))
  return Promise.resolve({ user: { name, email } })
}

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('gp-user') || 'null')
  } catch {
    return null
  }
}

export const logout = () => {
  localStorage.removeItem('gp-user')
}