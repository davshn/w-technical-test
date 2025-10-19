import { useState } from 'react'
import { Modal, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import { View, Text, Button, TextInput, Checkbox, ActivityIndicator } from '../../atom'
import type { AddCardModalProps, CardFormData, CardFormErrors } from './AddCardModalProps'
import { WebView } from 'react-native-webview'
import { FontAwesome } from "@react-native-vector-icons/fontawesome"
import { IsCreditCard } from '../../../utils/utils'

export const AddCardModal: React.FC<AddCardModalProps> = ({
  visible,
  onClose,
  onAddCard,
  termsUrl,
  responsive = false,
  testID = 'add-card-modal',
}) => {
  const [formData, setFormData] = useState<CardFormData>({
    number: '',
    cvc: '',
    exp_month: '',
    exp_year: '',
    card_holder: '',
    email: '',
  })

  const [errors, setErrors] = useState<CardFormErrors>({})
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTermsWebView, setShowTermsWebView] = useState(false)

  const validateField = (field: keyof CardFormData, value: string): string | undefined => {
    switch (field) {
      case 'number':
        if (!value) return 'El número de tarjeta es requerido'
        if (value.replace(/\s/g, '').length < 16) return 'El número debe tener 16 dígitos'
        if (!/^\d+$/.test(value.replace(/\s/g, ''))) return 'El número debe contener solo dígitos'
        if (!IsCreditCard(value)) return 'Número de tarjeta inválido'
        return undefined

      case 'cvc':
        if (!value) return 'El CVC es requerido'
        if (value.length < 3 || value.length > 4) return 'El CVC debe tener 3 o 4 dígitos'
        if (!/^\d+$/.test(value)) return 'El CVC debe contener solo dígitos'
        return undefined

      case 'exp_month':
        if (!value) return 'El mes es requerido'
        const month = +value
        if (isNaN(month) || month < 1 || month > 12) return 'El mes no es valido'
        return undefined

      case 'exp_year':
        if (!value) return 'El año es requerido'
        const year = +value
        const currentYear = new Date().getFullYear() % 100
        if (isNaN(year) || year < currentYear) return 'El año no es valido'
        return undefined

      case 'card_holder':
        if (!value) return 'El nombre del titular es requerido'
        if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres'
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'El nombre debe contener solo letras'
        return undefined

      case 'email':
        if (!value) return 'El correo electrónico es requerido'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Ingresa un correo electrónico válido'
        return undefined

      default:
        return undefined
    }
  }

  const handleFieldChange = (field: keyof CardFormData, value: string) => {
    let formattedValue = value

    if (field === 'number') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
      if (formattedValue.replace(/\s/g, '').length > 16) return
    }

    if (field === 'cvc') {
      if (value.length > 4) return
    }

    if (field === 'exp_month') {
      if (value.length > 2) return
    }

    if (field === 'exp_year') {
      if (value.length > 2) return
    }

    if (field === 'card_holder') {
      formattedValue = value.toUpperCase()
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }))

    if (errors[field]) {
      const error = validateField(field, formattedValue)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const handleBlur = (field: keyof CardFormData) => {
    const error = validateField(field, formData[field])
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const validateForm = (): boolean => {
    const newErrors: CardFormErrors = {}
    let isValid = true

    Object.keys(formData).forEach((key) => {
      const field = key as keyof CardFormData
      const error = validateField(field, formData[field])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleAddCard = async () => {
    if (!validateForm()) return

    const cleanedData = {
      number: formData.number.replace(/\s/g, ''),
      cvc: formData.cvc,
      exp_month: formData.exp_month.padStart(2, '0'),
      exp_year: formData.exp_year,
      card_holder: formData.card_holder,
      email: formData.email,
    }
    setIsSubmitting(true)
    try {
    await onAddCard(cleanedData)
    } catch (error) {
      console.error('Error adding card:', error)
    }
    setIsSubmitting(false)
  }

  const handleClose = () => {
    setFormData({
      number: '',
      cvc: '',
      exp_month: '',
      exp_year: '',
      card_holder: '',
      email: '',
    })
    setErrors({})
    setAcceptedTerms(false)
    onClose()
  }

  const isFormValid = () => {
    return (
      Object.values(formData).every(value => value.trim() !== '') &&
      Object.values(errors).every(value => value === undefined) &&
      acceptedTerms
    )
  }

  const viewerUrl = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(termsUrl!)}`
  const handleTermsPress = async () => {
    if (viewerUrl) {
      setShowTermsWebView(true)
    }
  }

  const handleTermsClose = () => {
    if (showTermsWebView) {
      return setShowTermsWebView(false)
    }
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleTermsClose}
      testID={testID}
    >
      {showTermsWebView ? (
        <>
          <WebView
            source={{ uri: viewerUrl }}
            onClose={() => setShowTermsWebView(false)}
            style={styles.webview}
          />
        </>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.overlay}>
            <View variant="card" style={styles.modalContent}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                <View style={styles.header}>
                  <Text
                    size="2xl"
                    weight="bold"
                    color="primary"
                    responsive={responsive}
                  >
                    Agregar Tarjeta de Crédito
                  </Text>
                  <Button
                    variant="icon"
                    size="sm"
                    icon={<FontAwesome name="close" />}
                    onPress={handleClose}
                    testID={`${testID}-close-btn`}
                  />
                </View>

                <View style={styles.form}>
                  <View style={styles.field}>
                    <Text
                      size="sm"
                      weight="semibold"
                      color="primary"
                      responsive={responsive}
                      style={styles.label}
                    >
                      Número de Tarjeta
                    </Text>
                    <TextInput
                      value={formData.number}
                      onChangeText={(value) => handleFieldChange('number', value)}
                      onBlur={() => handleBlur('number')}
                      placeholder="1234 5678 9012 3456"
                      keyboardType="numeric"
                      maxLength={19}
                      state={errors.number ? 'error' : 'default'}
                      responsive={responsive}
                      testID={`${testID}-number-input`}
                    />
                    {errors.number && (
                      <Text
                        size="xs"
                        color="error"
                        responsive={responsive}
                        testID={`${testID}-number-error`}
                        style={styles.errorText}
                      >
                        {errors.number}
                      </Text>
                    )}
                  </View>

                  <View style={styles.field}>
                    <Text
                      size="sm"
                      weight="semibold"
                      color="primary"
                      responsive={responsive}
                      style={styles.label}
                    >
                      Nombre del Titular
                    </Text>
                    <TextInput
                      value={formData.card_holder}
                      onChangeText={(value) => handleFieldChange('card_holder', value)}
                      onBlur={() => handleBlur('card_holder')}
                      placeholder="JOHN DOE"
                      autoCapitalize="characters"
                      state={errors.card_holder ? 'error' : 'default'}
                      responsive={responsive}
                      testID={`${testID}-holder-input`}
                    />
                    {errors.card_holder && (
                      <Text
                        size="xs"
                        color="error"
                        responsive={responsive}
                        testID={`${testID}-holder-error`}
                        style={styles.errorText}
                      >
                        {errors.card_holder}
                      </Text>
                    )}
                  </View>

                  <View style={styles.field}>
                    <Text
                      size="sm"
                      weight="semibold"
                      color="primary"
                      responsive={responsive}
                      style={styles.label}
                    >
                      Correo Electrónico
                    </Text>
                    <TextInput
                      value={formData.email}
                      onChangeText={(value) => handleFieldChange('email', value)}
                      onBlur={() => handleBlur('email')}
                      placeholder="correo@ejemplo.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      state={errors.email ? 'error' : 'default'}
                      responsive={responsive}
                      testID={`${testID}-email-input`}
                    />
                    {errors.email && (
                      <Text
                        size="xs"
                        color="error"
                        responsive={responsive}
                        testID={`${testID}-email-error`}
                        style={styles.errorText}
                      >
                        {errors.email}
                      </Text>
                    )}
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.field, styles.halfWidth]}>
                      <Text
                        size="sm"
                        weight="semibold"
                        color="primary"
                        responsive={responsive}
                        style={styles.label}
                      >
                        Mes de Expiración
                      </Text>
                      <TextInput
                        value={formData.exp_month}
                        onChangeText={(value) => handleFieldChange('exp_month', value)}
                        onBlur={() => handleBlur('exp_month')}
                        placeholder="MM"
                        keyboardType="numeric"
                        maxLength={2}
                        state={errors.exp_month ? 'error' : 'default'}
                        responsive={responsive}
                        testID={`${testID}-month-input`}
                      />
                      {errors.exp_month && (
                        <Text
                          size="xs"
                          color="error"
                          responsive={responsive}
                          testID={`${testID}-month-error`}
                          style={styles.errorText}
                        >
                          {errors.exp_month}
                        </Text>
                      )}
                    </View>

                    <View style={[styles.field, styles.halfWidth]}>
                      <Text
                        size="sm"
                        weight="semibold"
                        color="primary"
                        responsive={responsive}
                        style={styles.label}
                      >
                        Año de Expiración
                      </Text>
                      <TextInput
                        value={formData.exp_year}
                        onChangeText={(value) => handleFieldChange('exp_year', value)}
                        onBlur={() => handleBlur('exp_year')}
                        placeholder="YY"
                        keyboardType="numeric"
                        maxLength={2}
                        state={errors.exp_year ? 'error' : 'default'}
                        responsive={responsive}
                        testID={`${testID}-year-input`}
                      />
                      {errors.exp_year && (
                        <Text
                          size="xs"
                          color="error"
                          responsive={responsive}
                          testID={`${testID}-year-error`}
                          style={styles.errorText}
                        >
                          {errors.exp_year}
                        </Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.field}>
                    <Text
                      size="sm"
                      weight="semibold"
                      color="primary"
                      responsive={responsive}
                      style={styles.label}
                    >
                      CVC
                    </Text>
                    <TextInput
                      value={formData.cvc}
                      onChangeText={(value) => handleFieldChange('cvc', value)}
                      onBlur={() => handleBlur('cvc')}
                      placeholder="123"
                      keyboardType="numeric"
                      maxLength={4}
                      secureTextEntry
                      state={errors.cvc ? 'error' : 'default'}
                      responsive={responsive}
                      testID={`${testID}-cvc-input`}
                    />
                    {errors.cvc && (
                      <Text
                        size="xs"
                        color="error"
                        responsive={responsive}
                        testID={`${testID}-cvc-error`}
                        style={styles.errorText}
                      >
                        {errors.cvc}
                      </Text>
                    )}
                  </View>

                  <View style={styles.termsContainer}>
                    <Checkbox
                      checked={acceptedTerms}
                      onPress={setAcceptedTerms}
                      size="sm"
                      responsive={responsive}
                      disabled={isSubmitting}
                      testID={`${testID}-terms-checkbox`}
                    />
                    <View style={styles.termsTextContainer}>
                      <Text
                        size="sm"
                        color="secondary"
                        responsive={responsive}
                      >
                        Acepto los{' '}
                      </Text>
                      {termsUrl ? (
                        <TouchableOpacity
                          onPress={handleTermsPress}
                          disabled={isSubmitting}
                          testID={`${testID}-terms-link`}
                        >
                          <Text
                            size="sm"
                            color="primary"
                            weight="semibold"
                            underline
                          >
                            Términos y Condiciones
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <Text
                          size="sm"
                          color="primary"
                          weight="semibold"
                        >
                          Términos y Condiciones
                        </Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.actions}>
                    <Button
                      title="Cancelar"
                      variant="outline"
                      size="lg"
                      onPress={handleClose}
                      disabled={isSubmitting}
                      responsive={responsive}
                      testID={`${testID}-cancel-btn`}
                      style={styles.cancelButton}
                    />
                    <Button
                      title="Agregar Tarjeta"
                      variant="primary"
                      size="lg"
                      onPress={handleAddCard}
                      disabled={!isFormValid() || isSubmitting}
                      loading={isSubmitting}
                      responsive={responsive}
                      testID={`${testID}-submit-btn`}
                      style={styles.submitButton}
                    />
                  </View>
                </View>
              </ScrollView>

              {isSubmitting && (
                <ActivityIndicator
                  overlay
                  size="lg"
                  variant="primary"
                  overlayColor="rgba(0, 0, 0, 0.7)"
                  testID={`${testID}-loading`}
                />
              )}
            </View>
          </View>
        </KeyboardAvoidingView>)}
    </Modal>
  )
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  webview: { flex: 1, margin: 20 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  form: {
    gap: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    marginBottom: 4,
  },
  errorText: {
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
})