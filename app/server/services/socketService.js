let ioInstance = null

export function registerSocketServer(io) {
  ioInstance = io
}

export function getSocketServer() {
  return ioInstance
}

export function emitClinicEvent(event, payload) {
  if (!ioInstance) return
  ioInstance.emit(event, payload)
}

export function emitRoleEvent(role, event, payload) {
  if (!ioInstance) return
  ioInstance.to(`role:${role}`).emit(event, payload)
}
