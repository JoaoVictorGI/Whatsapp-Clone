import type { User } from './types'
import { createServer } from 'node:http'
import { env } from 'bun'
import express from 'express'
import { Server } from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server)

const port = env.PORT || 4000

const users: Array<User> = []

io.on('connection', (socket) => {
  socket.on('disconnect', () => {

  })

  socket.on('join', (name) => {
    const user: User = {
      id: socket.id,
      name,
    }
    users.push(user)
    // io.emit('message', {name: null, message: `${name} joined the chat`})
    io.emit('users', users)
  })

  socket.on('message', (message) => {
    io.emit('message', message)
  })
})

server.listen(port, () => {
  // console.log(`Running on port ${port}`)
})
