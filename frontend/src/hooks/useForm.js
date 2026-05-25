import { useState, useCallback } from 'react'

/**
 * useForm Hook
 * Manages form state, validation, and error handling
 *
 * Usage:
 * const { formData, errors, handleChange, resetForm, setErrors } = useForm({
 *   email: '',
 *   password: '',
 * })
 */
export function useForm(initialValues = {}) {
  const [formData, setFormData] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  /**
   * Handle input change
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === 'checkbox' ? checked : value

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue,
    }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }))
    }

    // Mark as touched
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }))
  }, [errors])

  /**
   * Handle blur - mark field as touched
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }))
  }, [])

  /**
   * Set form errors
   */
  const setFormErrors = useCallback((newErrors) => {
    setErrors(newErrors)
  }, [])

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setFormData(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  /**
   * Set form data programmatically
   */
  const setFormData_ = useCallback((data) => {
    setFormData(data)
  }, [])

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    setErrors: setFormErrors,
    resetForm,
    setFormData: setFormData_,
  }
}

export default useForm
