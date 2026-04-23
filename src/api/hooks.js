import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './client.js'

// --- Household ---
export const useHousehold = () => useQuery({ queryKey: ['household'], queryFn: () => api.get('/household') })

// --- Members ---
export const useMembers = () => useQuery({ queryKey: ['members'], queryFn: () => api.get('/members') })
export const useCreateMember = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (d) => api.post('/members', d), onSuccess: () => qc.invalidateQueries({ queryKey: ['members'] }) })
}
export const useUpdateMember = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, ...d }) => api.patch(`/members/${id}`, d), onSuccess: () => qc.invalidateQueries({ queryKey: ['members'] }) })
}
export const useDeleteMember = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id) => api.delete(`/members/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['members'] }) })
}

// --- Properties ---
export const useProperties = () => useQuery({ queryKey: ['properties'], queryFn: () => api.get('/properties') })
export const useCreateProperty = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (d) => api.post('/properties', d), onSuccess: () => qc.invalidateQueries({ queryKey: ['properties'] }) })
}
export const useUpdateProperty = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, ...d }) => api.patch(`/properties/${id}`, d), onSuccess: () => qc.invalidateQueries({ queryKey: ['properties'] }) })
}
export const useDeleteProperty = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id) => api.delete(`/properties/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['properties'] }) })
}

// --- Vehicles ---
export const useVehicles = () => useQuery({ queryKey: ['vehicles'], queryFn: () => api.get('/properties/vehicles') })
export const useCreateVehicle = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (d) => api.post('/properties/vehicles', d), onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }) })
}
export const useUpdateVehicle = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, ...d }) => api.patch(`/properties/vehicles/${id}`, d), onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }) })
}
export const useDeleteVehicle = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id) => api.delete(`/properties/vehicles/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }) })
}

// --- Contracts ---
export const useContracts = () => useQuery({ queryKey: ['contracts'], queryFn: () => api.get('/contracts') })
export const useCreateContract = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (d) => api.post('/contracts', d), onSuccess: () => qc.invalidateQueries({ queryKey: ['contracts'] }) })
}
export const useUpdateContract = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, ...d }) => api.patch(`/contracts/${id}`, d), onSuccess: () => qc.invalidateQueries({ queryKey: ['contracts'] }) })
}
export const useDeleteContract = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id) => api.delete(`/contracts/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['contracts'] }) })
}

// --- Workers ---
export const useWorkers = () => useQuery({ queryKey: ['workers'], queryFn: () => api.get('/workers') })
export const useCreateWorker = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (d) => api.post('/workers', d), onSuccess: () => qc.invalidateQueries({ queryKey: ['workers'] }) })
}
export const useUpdateWorker = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, ...d }) => api.patch(`/workers/${id}`, d), onSuccess: () => qc.invalidateQueries({ queryKey: ['workers'] }) })
}
export const useDeleteWorker = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id) => api.delete(`/workers/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['workers'] }) })
}

// --- Events ---
export const useEvents = (params = '') => useQuery({ queryKey: ['events', params], queryFn: () => api.get(`/events${params}`) })
export const useCreateEvent = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (d) => api.post('/events', d), onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }) })
}
export const useUpdateEvent = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, ...d }) => api.patch(`/events/${id}`, d), onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }) })
}
export const useDeleteEvent = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id) => api.delete(`/events/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }) })
}

// --- Budget ---
export const useTransactions = (period = '') => useQuery({ queryKey: ['transactions', period], queryFn: () => api.get(`/budget${period ? `?period=${period}` : ''}`) })
export const useBudgetSummary = () => useQuery({ queryKey: ['budget-summary'], queryFn: () => api.get('/budget/summary') })
export const useCreateTransaction = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (d) => api.post('/budget', d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['transactions'] }); qc.invalidateQueries({ queryKey: ['budget-summary'] }) } })
}
export const useDeleteTransaction = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id) => api.delete(`/budget/${id}`), onSuccess: () => { qc.invalidateQueries({ queryKey: ['transactions'] }); qc.invalidateQueries({ queryKey: ['budget-summary'] }) } })
}

// --- Documents ---
export const useDocuments = () => useQuery({ queryKey: ['documents'], queryFn: () => api.get('/documents') })
export const useUploadDocument = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (formData) => api.upload('/documents', formData), onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }) })
}
export const useDeleteDocument = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id) => api.delete(`/documents/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }) })
}

// --- Notifications ---
export const useNotifications = () => useQuery({ queryKey: ['notifications'], queryFn: () => api.get('/notifications'), refetchInterval: 30000 })
export const useMarkRead = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id) => api.post(`/notifications/${id}/read`), onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }) })
}
export const useMarkAllRead = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: () => api.post('/notifications/read-all'), onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }) })
}
