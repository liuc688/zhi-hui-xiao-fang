import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

export async function messages_add(params) {
  return request(`${BASE_URL}/message/add`, params || {}, METHOD.POST)
}

export async function messages_paginate(params) {
  return request(`${BASE_URL}/message/paginate`, params || {}, METHOD.POST)
}

export async function messages_get(params) {
  return request(`${BASE_URL}/message/get`, params || {}, METHOD.POST)
}

export async function messages_total(params) {
  return request(`${BASE_URL}/message/total`, params || {}, METHOD.POST)
}

