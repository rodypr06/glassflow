import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useSubscriptionStore = defineStore('subscriptions', () => {
  const subscriptions = ref([])
  const loading = ref(false)

  async function fetchSubscriptions() {
    loading.value = true
    try {
      const response = await api.get('/subscriptions')
      subscriptions.value = response.data
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error)
    } finally {
      loading.value = false
    }
  }

  async function addSubscription(subscription) {
    const response = await api.post('/subscriptions', subscription)
    subscriptions.value.push(response.data)
    return response.data
  }

  async function updateSubscription(id, subscription) {
    const response = await api.put(`/subscriptions/${id}`, subscription)
    const index = subscriptions.value.findIndex(s => s.id === id)
    if (index !== -1) {
      subscriptions.value[index] = response.data
    }
    return response.data
  }

  async function deleteSubscription(id) {
    await api.delete(`/subscriptions/${id}`)
    subscriptions.value = subscriptions.value.filter(s => s.id !== id)
  }

  return {
    subscriptions,
    loading,
    fetchSubscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription
  }
})

export const useMembershipStore = defineStore('memberships', () => {
  const memberships = ref([])
  const loading = ref(false)

  async function fetchMemberships() {
    loading.value = true
    try {
      const response = await api.get('/memberships')
      memberships.value = response.data
    } catch (error) {
      console.error('Failed to fetch memberships:', error)
    } finally {
      loading.value = false
    }
  }

  async function addMembership(membership) {
    const response = await api.post('/memberships', membership)
    memberships.value.push(response.data)
    return response.data
  }

  async function updateMembership(id, membership) {
    const response = await api.put(`/memberships/${id}`, membership)
    const index = memberships.value.findIndex(m => m.id === id)
    if (index !== -1) {
      memberships.value[index] = response.data
    }
    return response.data
  }

  async function deleteMembership(id) {
    await api.delete(`/memberships/${id}`)
    memberships.value = memberships.value.filter(m => m.id !== id)
  }

  return {
    memberships,
    loading,
    fetchMemberships,
    addMembership,
    updateMembership,
    deleteMembership
  }
})

export const useBillStore = defineStore('bills', () => {
  const bills = ref([])
  const loading = ref(false)

  async function fetchBills() {
    loading.value = true
    try {
      const response = await api.get('/bills')
      bills.value = response.data
    } catch (error) {
      console.error('Failed to fetch bills:', error)
    } finally {
      loading.value = false
    }
  }

  async function addBill(bill) {
    const response = await api.post('/bills', bill)
    bills.value.push(response.data)
    return response.data
  }

  async function updateBill(id, bill) {
    const response = await api.put(`/bills/${id}`, bill)
    const index = bills.value.findIndex(b => b.id === id)
    if (index !== -1) {
      bills.value[index] = response.data
    }
    return response.data
  }

  async function deleteBill(id) {
    await api.delete(`/bills/${id}`)
    bills.value = bills.value.filter(b => b.id !== id)
  }

  function getUpcomingBills(days = 30) {
    const today = new Date()
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
    return bills.value.filter(bill => {
      const dueDate = new Date(bill.dueDate)
      return dueDate >= today && dueDate <= futureDate
    })
  }

  return {
    bills,
    loading,
    fetchBills,
    addBill,
    updateBill,
    deleteBill,
    getUpcomingBills
  }
})

export const useCreditCardStore = defineStore('creditCards', () => {
  const creditCards = ref([])
  const loading = ref(false)

  async function fetchCreditCards() {
    loading.value = true
    try {
      const response = await api.get('/credit-cards')
      creditCards.value = response.data
    } catch (error) {
      console.error('Failed to fetch credit cards:', error)
    } finally {
      loading.value = false
    }
  }

  async function addCreditCard(card) {
    const response = await api.post('/credit-cards', card)
    creditCards.value.push(response.data)
    return response.data
  }

  async function updateCreditCard(id, card) {
    const response = await api.put(`/credit-cards/${id}`, card)
    const index = creditCards.value.findIndex(c => c.id === id)
    if (index !== -1) {
      creditCards.value[index] = response.data
    }
    return response.data
  }

  async function deleteCreditCard(id) {
    await api.delete(`/credit-cards/${id}`)
    creditCards.value = creditCards.value.filter(c => c.id !== id)
  }

  function getTotalBalance() {
    return creditCards.value.reduce((total, card) => total + (card.balance || 0), 0)
  }

  function getTotalCreditLimit() {
    return creditCards.value.reduce((total, card) => total + (card.creditLimit || 0), 0)
  }

  return {
    creditCards,
    loading,
    fetchCreditCards,
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
    getTotalBalance,
    getTotalCreditLimit
  }
})

export const useLoanStore = defineStore('loans', () => {
  const loans = ref([])
  const loading = ref(false)

  async function fetchLoans() {
    loading.value = true
    try {
      const response = await api.get('/loans')
      loans.value = response.data
    } catch (error) {
      console.error('Failed to fetch loans:', error)
    } finally {
      loading.value = false
    }
  }

  async function addLoan(loan) {
    const response = await api.post('/loans', loan)
    loans.value.push(response.data)
    return response.data
  }

  async function updateLoan(id, loan) {
    const response = await api.put(`/loans/${id}`, loan)
    const index = loans.value.findIndex(l => l.id === id)
    if (index !== -1) {
      loans.value[index] = response.data
    }
    return response.data
  }

  async function deleteLoan(id) {
    await api.delete(`/loans/${id}`)
    loans.value = loans.value.filter(l => l.id !== id)
  }

  function getTotalOutstanding() {
    return loans.value.reduce((total, loan) => total + (loan.outstandingAmount || 0), 0)
  }

  function addPayment(loanId, payment) {
    const loan = loans.value.find(l => l.id === loanId)
    if (loan) {
      loan.payments = loan.payments || []
      loan.payments.push(payment)
      loan.outstandingAmount = Math.max(0, loan.outstandingAmount - payment.amount)
    }
  }

  return {
    loans,
    loading,
    fetchLoans,
    addLoan,
    updateLoan,
    deleteLoan,
    getTotalOutstanding,
    addPayment
  }
})

export const useAnalyticsStore = defineStore('analytics', () => {
  const monthlyData = ref([])
  const categoryData = ref([])
  const loading = ref(false)

  async function fetchAnalytics() {
    loading.value = true
    try {
      const [monthlyRes, categoryRes] = await Promise.all([
        api.get('/analytics/monthly'),
        api.get('/analytics/categories')
      ])
      monthlyData.value = monthlyRes.data
      categoryData.value = categoryRes.data
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    monthlyData,
    categoryData,
    loading,
    fetchAnalytics
  }
})
