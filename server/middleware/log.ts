/**
 * Logging middleware - Tracks all API requests and responses
 */
export default defineEventHandler((event) => {
  // Only log API routes
  if (!event.node.req.url?.startsWith('/api')) {
    return
  }

  const start = Date.now()
  const method = event.node.req.method
  const url = event.node.req.url

  // Log after response using event hook
  event.res.on('finish', () => {
    const duration = Date.now() - start
    const statusCode = event.node.res.statusCode
    console.log(`[${method}] ${url} - ${statusCode} (${duration}ms)`)
  })
})
