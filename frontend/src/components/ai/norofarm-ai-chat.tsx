'use client'

import * as React from 'react'
import {
  X,
  Send,
  RotateCcw,
  Minimize2,
  ChevronRight,
  User,
  Coffee,
  CloudSun,
  Sprout,
  TrendingUp,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { aiService, ChatMessage } from '@/api/services/ai.service'
import { NoroFarmAiLogo } from './norofarm-ai-logo'

interface MessageItem extends ChatMessage {
  id: string
  timestamp: string
  suggestions?: string[]
}

const STARTER_PROMPTS = [
  { label: 'Giá cà phê hôm nay', icon: Coffee },
  { label: 'Trị nấm hồng sầu riêng', icon: Sprout },
  { label: 'Quy định xuất khẩu EUDR', icon: TrendingUp },
  { label: 'Thời tiết nông vụ tuần này', icon: CloudSun },
]

export function NoroFarmAiChat() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [, setShowTooltip] = React.useState(false)
  const [isMinimized, setIsMinimized] = React.useState(false)
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [messages, setMessages] = React.useState<MessageItem[]>([
    {
      id: 'welcome',
      role: 'model',
      content:
        'Kính chào quý bà con và đối tác! Tôi là **Cố vấn Nông nghiệp & Thị trường NoroFarm**.\n\nTôi sẵn sàng giải đáp toàn diện về:\n• **Kỹ thuật canh tác & Quản lý dịch bệnh** trên mọi loại cây trồng (cà phê, hồ tiêu, sầu riêng, lúa gạo, cây ăn trái, hoa màu).\n• **Bản tin & Diễn biến thị trường**: Sàn London Robusta, New York Arabica, hồ tiêu IPC, giá thu mua nội địa.\n• **Chính sách & Tiêu chuẩn xuất khẩu**: Quy định chống phá rừng EUDR, mã số vùng trồng, VietGAP/GlobalGAP.\n• **Khí tượng nông vụ & Thời tiết**: Lịch tưới, bón phân đón mưa dông, phòng ngừa hạn mặn.\n\nBạn đang cần tư vấn cây trồng, sâu bệnh hay thông tin nông sản nào?',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'Giá cà phê Tây Nguyên và sàn London hôm nay',
        'Kỹ thuật trị nấm hồng và rệp sáp',
        'Quy định EUDR ảnh hưởng thế nào đến cà phê Việt Nam?',
        'Thời tiết Tây Nguyên có thích hợp bón phân?',
      ],
    },
  ])

  const [hasUnread, setHasUnread] = React.useState(false)

  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom()
      inputRef.current?.focus()
    }
  }, [messages, isOpen, isMinimized])

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim()
    if (!query || isLoading) return

    setInput('')

    const userMsg: MessageItem = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)

    try {
      const historyPayload: ChatMessage[] = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const response = await aiService.chat(query, historyPayload)

      const aiMsg: MessageItem = {
        id: `a-${Date.now()}`,
        role: 'model',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        suggestions: response.suggestions,
      }

      setMessages((prev) => [...prev, aiMsg])
      if (!isOpen) setHasUnread(true)
    } catch {
      const errorMsg: MessageItem = {
        id: `err-${Date.now()}`,
        role: 'model',
        content:
          'Xin lỗi bạn, kết nối dữ liệu tới máy chủ AI đang tạm thời gián đoạn. Bạn vui lòng thử lại sau ít giây.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Giá cà phê hôm nay', 'Thời tiết nông vụ'],
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        content: 'Cuộc trò chuyện đã được làm mới. NoroFarm AI sẵn sàng hỗ trợ câu hỏi mới của bạn!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'Giá cà phê Tây Nguyên hôm nay',
          'Thời tiết tuần này thế nào?',
          'Tư vấn kỹ thuật cây trồng',
        ],
      },
    ])
  }

  return (
    <>
      {/* 1. FLOATING LAUNCHER BUTTON (Chỉ Logo tròn với hiệu ứng nảy nhẹ nhàng, chuẩn doanh nghiệp) */}
      <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50">
        <motion.button
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            setIsOpen(!isOpen)
            setIsMinimized(false)
            setHasUnread(false)
          }}
          className={cn(
            'group relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300',
            isOpen
              ? 'bg-[#181c22] border-2 border-emerald-500/70 text-white shadow-lg'
              : 'bg-gradient-to-tr from-[#064e3b] via-[#047857] to-[#10b981] p-0.5 shadow-[0_8px_25px_rgba(16,185,129,0.45)] ring-2 ring-emerald-400/50 hover:ring-emerald-300'
          )}
          aria-label="Cố vấn NoroFarm"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white transition-transform group-hover:rotate-90 duration-200" />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950/40 p-1">
              <NoroFarmAiLogo size={36} showText={false} showSparkleBadge={false} />
            </div>
          )}

          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-slate-950 shadow">
              1
            </span>
          )}
        </motion.button>
      </div>

      {/* 2. CHATBOT WINDOW DIALOG */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? 'auto' : '580px',
            }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 flex w-[calc(100vw-32px)] sm:w-[420px] flex-col rounded-3xl border border-emerald-500/30 bg-[#12161a]/95 text-slate-100 shadow-2xl backdrop-blur-xl overflow-hidden',
              isMinimized ? 'h-auto' : 'max-h-[85vh]'
            )}
          >
            {/* Window Header */}
            <div className="flex items-center justify-between border-b border-[#2b313a] bg-gradient-to-r from-[#064e3b]/80 via-[#0a2f24]/90 to-[#0f172a] px-4 py-3">
              <NoroFarmAiLogo
                size={34}
                showText
                title="NoroFarm"
                badgeText="Cố vấn"
                subtitle="Chuyên gia Nông nghiệp & Thị trường"
                showSparkleBadge={false}
              />

              <div className="flex items-center gap-1 text-slate-400">
                <button
                  onClick={handleClear}
                  className="rounded-lg p-1.5 hover:bg-white/10 hover:text-white transition-colors"
                  title="Làm mới cuộc trò chuyện"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="rounded-lg p-1.5 hover:bg-white/10 hover:text-white transition-colors"
                  title={isMinimized ? 'Phóng to' : 'Thu nhỏ'}
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 hover:bg-white/10 hover:text-white transition-colors"
                  title="Đóng chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Window Body (when not minimized) */}
            {!isMinimized && (
              <>
                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm scrollbar-thin scrollbar-thumb-[#2b313a] scrollbar-track-transparent">
                  {messages.map((m) => {
                    const isAi = m.role === 'model' || m.role === 'assistant'
                    return (
                      <div
                        key={m.id}
                        className={cn('flex flex-col', isAi ? 'items-start' : 'items-end')}
                      >
                        <div
                          className={cn(
                            'flex gap-2.5 max-w-[92%]',
                            isAi ? 'flex-row' : 'flex-row-reverse'
                          )}
                        >
                          {/* Avatar */}
                          <div
                            className={cn(
                              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold mt-0.5 overflow-hidden',
                              isAi
                                ? 'bg-transparent'
                                : 'bg-primary text-primary-foreground'
                            )}
                          >
                            {isAi ? (
                              <NoroFarmAiLogo size={28} showText={false} showSparkleBadge={false} />
                            ) : (
                              <User className="h-4 w-4" />
                            )}
                          </div>

                          {/* Message Bubble */}
                          <div
                            className={cn(
                              'rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-md',
                              isAi
                                ? 'bg-[#1e2329] text-slate-100 border border-[#2b313a]'
                                : 'bg-emerald-600 text-white rounded-tr-none font-medium'
                            )}
                          >
                            <div className="whitespace-pre-wrap space-y-1">
                              {m.content.split('\n').map((line, idx) => {
                                // Bold parsing for basic markdown **text**
                                const parts = line.split(/(\*\*.*?\*\*)/g)
                                return (
                                  <p key={idx} className={line.startsWith('•') ? 'pl-2' : ''}>
                                    {parts.map((p, pIdx) => {
                                      if (p.startsWith('**') && p.endsWith('**')) {
                                        return (
                                          <strong key={pIdx} className="font-bold text-amber-300">
                                            {p.slice(2, -2)}
                                          </strong>
                                        )
                                      }
                                      return p
                                    })}
                                  </p>
                                )
                              })}
                            </div>

                            <span className="mt-1 block text-right text-[10px] opacity-60">
                              {m.timestamp}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Suggestion Chips below AI replies */}
                        {isAi && m.suggestions && m.suggestions.length > 0 && (
                          <div className="mt-2 ml-9 flex flex-wrap gap-1.5">
                            {m.suggestions.map((s, sIdx) => (
                              <button
                                key={sIdx}
                                onClick={() => handleSend(s)}
                                className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-1 text-[11px] font-medium text-emerald-300 hover:bg-emerald-900/60 transition-colors"
                              >
                                <span>{s}</span>
                                <ChevronRight className="h-3 w-3" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* Loading Typing Indicator */}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full overflow-hidden">
                        <NoroFarmAiLogo size={26} showText={false} showSparkleBadge={false} />
                      </div>
                      <div className="rounded-2xl bg-[#1e2329] border border-[#2b313a] px-3.5 py-2 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" />
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Starter Prompts Bar (Không có thanh cuộn ngang gây thô xấu, hiển thị dạng thẻ gọn gàng) */}
                {messages.length <= 1 && (
                  <div className="border-t border-[#2b313a]/50 px-4 py-2.5 bg-[#161a20]">
                    <span className="text-[11px] text-slate-400 font-medium block mb-2">
                      Gợi ý câu hỏi nhanh:
                    </span>
                    <div className="flex flex-wrap gap-1.5 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {STARTER_PROMPTS.map((item, idx) => {
                        const Icon = item.icon
                        return (
                          <button
                            key={idx}
                            onClick={() => handleSend(item.label)}
                            className="flex items-center gap-1.5 rounded-xl border border-[#2b313a] bg-[#1e2329] px-2.5 py-1.5 text-xs text-slate-300 hover:border-emerald-400/50 hover:bg-emerald-950/40 hover:text-white transition-all shadow-sm"
                          >
                            <Icon className="h-3.5 w-3.5 text-emerald-400" />
                            <span>{item.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Footer Input Box */}
                <div className="border-t border-[#2b313a] bg-[#12161a] p-3">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSend()
                    }}
                    className="flex items-center gap-2 rounded-2xl border border-[#2b313a] bg-[#181c22] px-3 py-1.5 focus-within:border-emerald-500 transition-colors"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Hỏi về sâu bệnh, giá cả, kỹ thuật mùa vụ, bản tin..."
                      className="flex-1 bg-transparent text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                      disabled={isLoading}
                    />

                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-xl transition-all',
                        input.trim() && !isLoading
                          ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold'
                          : 'bg-[#2b313a] text-slate-500 cursor-not-allowed'
                      )}
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 px-1">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                      Cố vấn Nông nghiệp & Thị trường
                    </span>
                    <span>Phản hồi 24/7</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
