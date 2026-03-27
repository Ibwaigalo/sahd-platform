'use client'
import { useState, useEffect, useRef } from 'react'
import { MessageSquare, Send, Search, Circle } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import toast from 'react-hot-toast'
import { useLang } from '@/lib/lang-context'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eikyqsjnfydjikhugnjj.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpa3lxc2puZnlkamlraHVnbmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTE4ODIsImV4cCI6MjA4ODU2Nzg4Mn0.LRNg8nsj-I48i4JHtOITb52WFk5dgV3m8ndBK-A7fFA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  created_at: string
  sender?: {
    full_name: string
    organization: string
  }
}

interface Conversation {
  user_id: string
  full_name: string
  organization: string
  last_message?: string
  last_message_at?: string
  unread_count: number
}

interface RealtimeChatProps {
  currentUserId: string
  targetUserId: string
  targetName: string
  targetOrganization: string
}

export function RealtimeChat({ currentUserId, targetUserId, targetName, targetOrganization }: RealtimeChatProps) {
  const { lang } = useLang()
  const t = lang === 'fr' ? fr : en
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id(full_name, organization)
        `)
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true })
      
      if (data) {
        setMessages(data)
      }
      setLoading(false)
    }

    fetchMessages()

    const channel = supabase
      .channel(`chat-${currentUserId}-${targetUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id.eq.${currentUserId},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${currentUserId}))`
        },
        async (payload) => {
          const { data: senderData } = await supabase
            .from('profiles')
            .select('full_name, organization')
            .eq('user_id', payload.new.sender_id)
            .single()
          
          const newMessage: Message = {
            id: payload.new.id,
            sender_id: payload.new.sender_id,
            receiver_id: payload.new.receiver_id,
            content: payload.new.content,
            read: false,
            created_at: payload.new.created_at,
            sender: senderData || undefined
          }
          setMessages(prev => [...prev, newMessage])
          
          if (payload.new.sender_id !== currentUserId) {
            supabase
              .from('messages')
              .update({ read: true })
              .eq('id', payload.new.id)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId, targetUserId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const { error } = await supabase.from('messages').insert({
      sender_id: currentUserId,
      receiver_id: targetUserId,
      content: newMessage.trim()
    })

    if (error) {
      console.error('Send message error:', error)
      toast.error(lang === 'fr' ? 'Erreur envoi: ' + error.message : 'Send error: ' + error.message)
    } else {
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center text-white font-bold">
          {targetName.split(' ').map(n => n[0]).slice(0, 2).join('')}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{targetName}</p>
          <p className="text-xs text-gray-500">{targetOrganization}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-primary-900 border-t-transparent rounded-full" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
            <p>{lang === 'fr' ? 'Pas encore de messages' : 'No messages yet'}</p>
            <p className="text-sm">{lang === 'fr' ? 'Envoyez le premier message !' : 'Send the first message!'}</p>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.sender_id === currentUserId
                    ? 'bg-primary-900 text-white rounded-br-sm'
                    : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender_id === currentUserId ? 'text-white/60' : 'text-gray-400'
                }`}>
                  {new Date(msg.created_at).toLocaleTimeString(lang === 'fr' ? 'fr-FR' : 'en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={lang === 'fr' ? 'Votre message...' : 'Your message...'}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-700"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2.5 bg-primary-900 text-white rounded-xl hover:bg-primary-800 disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

interface ConversationsListProps {
  currentUserId: string
  onSelectConversation: (userId: string, name: string, org: string) => void
}

export function ConversationsList({ currentUserId, onSelectConversation }: ConversationsListProps) {
  const { lang } = useLang()
  const t = lang === 'fr' ? fr : en
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConversations = async () => {
      const { data: messagesData } = await supabase
        .from('messages')
        .select('sender_id, receiver_id, content, created_at, read')
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order('created_at', { ascending: false })

      if (!messagesData) {
        setLoading(false)
        return
      }

      const userMap = new Map<string, Conversation>()
      
      messagesData.forEach(msg => {
        const otherUserId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id
        
        if (!userMap.has(otherUserId)) {
          const otherUserMsg = msg.sender_id === currentUserId 
            ? messagesData.find(m => m.receiver_id === currentUserId && m.sender_id === otherUserId)
            : msg
          
          userMap.set(otherUserId, {
            user_id: otherUserId,
            full_name: '',
            organization: '',
            last_message: msg.content,
            last_message_at: msg.created_at,
            unread_count: msg.receiver_id === currentUserId && !msg.read ? 1 : 0
          })
        } else {
          const conv = userMap.get(otherUserId)!
          if (msg.receiver_id === currentUserId && !msg.read) {
            conv.unread_count++
          }
        }
      })

      const userIds = Array.from(userMap.keys())
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, full_name, organization')
          .in('user_id', userIds)

        if (profilesData) {
          profilesData.forEach(profile => {
            if (userMap.has(profile.user_id)) {
              const conv = userMap.get(profile.user_id)!
              conv.full_name = profile.full_name
              conv.organization = profile.organization
            }
          })
        }
      }

      setConversations(Array.from(userMap.values()).filter(c => c.full_name))
      setLoading(false)
    }

    fetchConversations()

    const channel = supabase
      .channel('conversations-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `or(sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId})`
      }, () => {
        fetchConversations()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId])

  const filtered = conversations.filter(c =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    c.organization.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin w-6 h-6 border-2 border-primary-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
        <p className="font-medium">{lang === 'fr' ? 'Aucune conversation' : 'No conversations'}</p>
        <p className="text-sm mt-1">
          {lang === 'fr' ? 'Commencez par proposer un rendez-vous' : 'Start by requesting a meeting'}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="relative mb-4">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={lang === 'fr' ? 'Rechercher...' : 'Search...'}
          className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-700"
        />
      </div>

      <div className="space-y-2">
        {filtered.map(conv => (
          <button
            key={conv.user_id}
            onClick={() => onSelectConversation(conv.user_id, conv.full_name, conv.organization)}
            className="w-full p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center text-white font-bold flex-shrink-0">
              {conv.full_name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900 truncate">{conv.full_name}</p>
                {conv.unread_count > 0 && (
                  <span className="w-5 h-5 bg-primary-900 text-white text-xs rounded-full flex items-center justify-center">
                    {conv.unread_count}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">{conv.organization}</p>
              {conv.last_message && (
                <p className="text-xs text-gray-400 truncate mt-1">{conv.last_message}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
