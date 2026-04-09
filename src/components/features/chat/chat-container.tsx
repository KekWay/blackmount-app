'use client'

import { Suspense } from 'react'
import type { ModelVersion } from '@/types'
import { hexToRgba } from './chat-constants'
import { useChatState } from './use-chat-state'
import { ChatHeader } from './chat-header'
import { ChatEmptyState } from './chat-empty-state'
import { ChatMessages } from './chat-messages'
import { ChatInput } from './chat-input'
import { ChatSettingsPanel } from './chat-settings-panel'
import { ChatModals } from './chat-modals'
import { ChatMediaLightbox } from './chat-media-lightbox'
import { ShareModal } from './share-modal'

function ChatContainerInner() {
  const s = useChatState()
  const { model, selectedVersion, messages, actions } = s

  const shareProps = (() => {
    if (s.msgShareIdx !== null) {
      const msg = messages[s.msgShareIdx]
      const userMsg = messages.slice(0, s.msgShareIdx).reverse().find((m) => m.role === 'user')
      return {
        prompt: userMsg?.content || '',
        response: msg?.content || '',
        mediaType: (msg?.mediaType || 'text') as 'text' | 'image' | 'video',
        mediaUrl: msg?.mediaSrc,
      }
    }
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')
    const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant')
    return {
      prompt: lastUser?.content || '',
      response: lastAssistant?.content || '',
      mediaType: (lastAssistant?.mediaType || 'text') as 'text' | 'image' | 'video',
      mediaUrl: lastAssistant?.mediaSrc,
    }
  })()

  return (
    <div className="w-full h-screen flex flex-col bg-[#121118] relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2" style={{ top: '38%', transform: 'translateX(-50%) translateY(-50%)', width: '80%', height: '55%', background: `radial-gradient(ellipse 70% 55% at 50% 50%, ${hexToRgba(model.glowColors[0] || '#3e993e', 0.28)} 0%, ${hexToRgba(model.glowColors[1] || model.glowColors[0] || '#3e993e', 0.15)} 30%, ${hexToRgba(model.glowColors[0] || '#3e993e', 0.06)} 55%, transparent 75%)`, filter: 'blur(140px)' }} />
      </div>
      <ChatHeader model={model} selectedVersion={selectedVersion} onSelectVersion={(v: ModelVersion) => s.setSelectedVersionId(v.id)} hasSub={s.hasSub} subBannerDismissed={s.subBannerDismissed} setSubBannerDismissed={s.setSubBannerDismissed} handleNewChat={actions.handleNewChat} setShareOpen={s.setShareOpen} settingsOpen={s.settingsOpen} setSettingsOpen={s.setSettingsOpen} />
      <div ref={s.scrollRef} onScroll={s.handleScroll} className="flex-1 flex flex-col items-center relative min-h-0 overflow-y-auto z-[1] chat-scrollbar">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center px-[16px] md:px-[24px] lg:px-[40px]"><ChatEmptyState model={model} modelLocked={s.modelLocked} greeting={s.greeting} /></div>
        ) : (
          <ChatMessages messages={messages} model={model} msgRatings={s.msgRatings} setMsgRatings={s.setMsgRatings} setMsgShareIdx={s.setMsgShareIdx} setViewerMedia={s.setViewerMedia} setTypingIdx={s.setTypingIdx} setIsGenerating={s.setIsGenerating} setMessages={s.setMessages} setInput={s.setInput} />
        )}
        {s.showScrollBtn && (
          <button onClick={s.scrollToBottom} className="sticky bottom-[16px] mb-[16px] w-[38px] h-[38px] min-w-[38px] min-h-[38px] rounded-full bg-[rgba(61,57,80,0.8)] border border-[rgba(255,255,255,0.08)] backdrop-blur-[12px] flex items-center justify-center cursor-pointer transition-all hover:bg-[rgba(255,255,255,0.1)] shadow-[0_4px_16px_rgba(0,0,0,0.4)] z-[10] shrink-0 aspect-square">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M8 3v10m0 0l-4-4m4 4l4-4" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
      </div>
      <ChatInput input={s.input} setInput={s.setInput} handleSend={actions.handleSend} handleStopGeneration={actions.handleStopGeneration} handleModelSwitch={actions.handleModelSwitch} model={model} isTextModel={s.isTextModel} isGenerating={s.isGenerating} isRecording={s.isRecording} toggleRecording={actions.toggleRecording} cancelRecording={actions.cancelRecording} modelLocked={s.modelLocked} messagesLength={messages.length} dynamicCost={s.dynamicCost} webSearchActive={s.webSearchActive} setWebSearchActive={s.setWebSearchActive} deepResearchActive={s.deepResearchActive} setDeepResearchActive={s.setDeepResearchActive} attachOpen={s.attachOpen} setAttachOpen={s.setAttachOpen} />
      <ShareModal
        open={s.shareOpen || s.msgShareIdx !== null}
        onClose={() => { s.setShareOpen(false); s.setMsgShareIdx(null) }}
        modelId={model.id}
        modelName={model.name}
        {...shareProps}
      />
      <ChatSettingsPanel settingsOpen={s.settingsOpen} setSettingsOpen={s.setSettingsOpen} model={model} selectedVersion={selectedVersion} isTextModel={s.isTextModel} systemPrompt={s.systemPrompt} setSystemPrompt={s.setSystemPrompt} toneSetting={s.toneSetting} setToneSetting={s.setToneSetting} aspectRatio={s.aspectRatio} setAspectRatio={s.setAspectRatio} quality={s.quality} setQuality={s.setQuality} imageCount={s.imageCount} setImageCount={s.setImageCount} videoDuration={s.videoDuration} setVideoDuration={s.setVideoDuration} audioEnabled={s.audioEnabled} setAudioEnabled={s.setAudioEnabled} dynamicCost={s.dynamicCost} messagesLength={messages.length} handleNewChat={actions.handleNewChat} />
      <ChatModals showLowBalance={s.showLowBalance} setShowLowBalance={s.setShowLowBalance} showLimitReached={s.showLimitReached} setShowLimitReached={s.setShowLimitReached} showAuthGate={s.showAuthGate} setShowAuthGate={s.setShowAuthGate} selectedVersion={selectedVersion} dynamicCost={s.dynamicCost} balance={s.balance} hasSub={s.hasSub} dailyLimit={s.dailyLimit} />
      {s.viewerMedia && <ChatMediaLightbox media={s.viewerMedia} onClose={() => s.setViewerMedia(null)} />}
      <style>{`@keyframes micPulseViolet { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.35); opacity: 0; } } @keyframes shimmerBar { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
    </div>
  )
}

export function ChatContainer() {
  return (
    <Suspense fallback={null}>
      <ChatContainerInner />
    </Suspense>
  )
}
