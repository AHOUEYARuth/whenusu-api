import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

const rateLimits = new Map<string, { count: number; expiresAt: number }>()

export default class ThrottleMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    const ip = request.ip()
    const endpoint = request.url()
    const key = `${ip}:${endpoint}`

    const now = Date.now()
    const limitWindow = 10 * 60 * 1000 // 10 minutes
    const maxRequests = endpoint.includes('verify') ? 5 : 3

    const record = rateLimits.get(key)

    if (record) {
      if (now < record.expiresAt) {
        if (record.count >= maxRequests) {
          return response.status(429).json({
            message: 'Trop de requêtes, veuillez patienter avant de réessayer.',
          })
        }
        record.count += 1
      } else {
        rateLimits.set(key, { count: 1, expiresAt: now + limitWindow })
      }
    } else {
      rateLimits.set(key, { count: 1, expiresAt: now + limitWindow })
    }

    // Cleanup old records to prevent memory leak
    if (rateLimits.size > 10000) {
      for (const [k, v] of rateLimits.entries()) {
        if (now > v.expiresAt) {
          rateLimits.delete(k)
        }
      }
    }

    return await next()
  }
}
