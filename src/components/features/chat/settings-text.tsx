import { CustomIcon } from '@/components/shared/custom-icon'

interface SettingsTextProps {
  systemPrompt: string
  setSystemPrompt: (v: string) => void
  toneSetting: string
  setToneSetting: (v: string) => void
}

export function SettingsText({ systemPrompt, setSystemPrompt, toneSetting, setToneSetting }: SettingsTextProps) {
  return (
    <div className="flex flex-col gap-[16px]">
      <div>
        <p className="font-manrope font-medium text-[14px] text-white mb-[8px]">Системный промпт</p>
        <textarea
          className="w-full bg-[rgba(57,55,91,0.5)] rounded-[10px] px-[12px] py-[10px] text-[12px] text-white placeholder-[rgba(166,166,166,0.6)] outline-none resize-none font-manrope"
          rows={4}
          placeholder="Напишите пользовательскую инструкцию для ИИ"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        />
      </div>
      <div>
        <p className="font-manrope font-medium text-[14px] text-white mb-[8px]">Стиль и тон</p>
        <div className="relative">
          <select
            value={toneSetting}
            onChange={(e) => setToneSetting(e.target.value)}
            className="w-full appearance-none bg-[rgba(57,55,91,0.5)] rounded-[10px] px-[12px] py-[9px] text-[13px] text-white outline-none cursor-pointer font-manrope"
          >
            <option value="default">по умолчанию</option>
            <option value="formal">формальный</option>
            <option value="friendly">дружелюбный</option>
            <option value="concise">краткий</option>
            <option value="creative">креативный</option>
          </select>
          <CustomIcon src="/icons/arrow_down_icon.png" size={14} className="absolute right-[12px] top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" />
        </div>
      </div>
    </div>
  )
}
