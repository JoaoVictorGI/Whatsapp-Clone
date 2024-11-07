import { useEffect, useState } from 'react'
import socket from 'socket.io-client'
import Image from './assets/profissao-programador-logo.jpg'
import { FluentSend20Filled } from './assets/send-message-icon'

const io = socket('http://localhost:4000')

interface User {
  id: string
  name: string
}

interface Message {
  name: string | null
  message: string
}

function App() {
  const [name, setName] = useState('')
  const [joined, setJoined] = useState(false)
  const [users, setUsers] = useState<Array<User>>()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<Message>>([])

  useEffect(() => {
    io.on('users', (users: Array<User>) => setUsers(users))
    io.on('message', message => setMessages(messages => [...messages, message]))
    // io.on('connect', (socket) => console.log(socket.id))
  }, [])

  const handleJoin = () => {
    if (name) {
      io.emit('join', name)
      setJoined(true)
    }
  }

  const handleMessage = () => {
    if (message) {
      io.emit('message', { message, name })
      setMessage('')
    }
  }

  if (!joined || !users) {
    return (
      <div>
        <span>Digite o seu nome: </span>
        <input value={name} onChange={e => setName(e.target.value)} />
        <button type="submit" onClick={() => { handleJoin() }}>Entrar</button>
      </div>
    )
  }

  return (
    <div className="h-screen flex justify-center items-center flex-col bg-stone-200">
      <div className="bg-emerald-600 h-1/5 w-full absolute top-0"></div>
      <div className="w-[95%] max-w-[1800px] h-[95%] bg-white absolute flex">

        <div className="w-1/3 h-full border-r border-solid border-stone-300">
          <div className="w-full h-20 bg-stone-200"></div>
          <div className="box-border p-2 border-t border-b border-solid border-stone-100 flex items-center cursor-pointer">
            <img src={Image} className="w-16 h-auto rounded-full" />
            <div className="flex flex-col ml-4">
              <span className="text-lg">Networking Profissão Programador</span>
              <span className="text-stone-500">
                {messages.length ? `${messages[messages.length - 1].name} ${messages[messages.length - 1].message}` : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[url('./assets/zap-bg.png')] flex flex-col justify-between">
          <div className="w-full h-20 bg-stone-200">
            <div className="box-border p-2 border-t border-b border-solid border-stone-100 flex items-center cursor-pointer">
              <img src={Image} className="w-16 h-auto rounded-full" />
              <div className="flex flex-col ml-4">
                <span className="text-lg">Networking Profissão Programador</span>
                <span className="text-stone-500">
                  {users.map((user, idx) => (
                    <span key={user.id}>
                      {user.name}
                      {idx + 1 < users.length ? ', ' : ''}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col max-h-full overflow-y-auto">
            {messages.map(message => (
              <div
                key={`${message.name}-${message.message}`}
                className={
                  message.name === name
                    ? 'w-full flex box-border px-5 my-0.5 justify-end'
                    : 'w-full flex box-border px-5 my-0.5 justify-start'
                }
              >
                {
                  message.name === name
                    ? (
                        <span className="bg-green-200 p-2 rounded">
                          {message.name}
                          :
                          {' '}
                          {message.message}
                        </span>
                      )
                    : (
                        <span className="bg-white p-2 rounded">
                          {message.name}
                          :
                          {' '}
                          {message.message}
                        </span>
                      )
                }

              </div>
            ))}
          </div>

          <div className="chat-input-area w-full h-16 bg-slate-200 box-border px-2.5 flex items-center justify-around">
            <input
              className="chat-input w-11/12 bg-white h-11 border-none outline-none rounded-lg box-border p-1 text-base"
              placeholder="Mensagem"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <FluentSend20Filled onClick={() => handleMessage()} className="w-6 h-auto cursor-pointer text-stone-600" />
          </div>

        </div>

      </div>
    </div>
  )
}

export default App
