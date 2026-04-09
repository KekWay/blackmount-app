# MODEL_REGISTRY.md — Единый реестр моделей Blackmount

> Единственный источник правды для всех моделей, версий, цен и маппингов.
> Все документы, код и промпты ОБЯЗАНЫ ссылаться на этот файл.
> При расхождении — верить ЭТОМУ файлу и `src/data/ai-models.ts`.
> Последнее обновление: апрель 2026.

---

## 1. Общая статистика

- Нейросетей: 7 (ChatGPT, Claude, Gemini, NanoBanana, Flux, Kling, Veo 3.1)
- Версий: 32
- Категории: текст (16 версий), изображения (7 версий), видео (7 версий)
- Провайдеры: OpenRouter (текст), fal.ai (изображения), kie.ai (видео)
- Валюта: 1 айкоин = 1₽

---

## 2. Текстовые модели (OpenRouter) — 16 версий

| model_id | version_id | Label (UI) | Цена (₽) | Tier | OpenRouter slug | subscriptionOnly | FREE_FOR_SUBSCRIBERS |
|----------|-----------|------------|-----------|-------------|-----------------|------------------|---------------------|
| chatgpt | gpt-5.4 | ChatGPT 5.4 | 6 | sub | openai/gpt-5.4 | ✅ | — |
| chatgpt | gpt-5.3 | ChatGPT 5.3 | 5 | sub | openai/gpt-5.3 | ✅ | — |
| chatgpt | chatgpt-5.2 | ChatGPT 5.2 | 5 | free | openai/gpt-5.2 | — | — |
| chatgpt | chatgpt-5 | ChatGPT 5 | 3 | free | openai/gpt-5 | — | — |
| chatgpt | chatgpt-5-mini | ChatGPT 5 mini | 1 | free | openai/gpt-5-mini | — | ✅ Pro/Max |
| claude | claude-opus-4.6 | Claude Opus 4.6 | 8 | sub | anthropic/claude-opus-4.6 | ✅ | — |
| claude | claude-sonnet-4.6 | Claude Sonnet 4.6 | 5 | free | anthropic/claude-sonnet-4.6 | — | — |
| claude | claude-opus-4.5 | Claude Opus 4.5 | 8 | sub | anthropic/claude-opus-4.5 | ✅ | — |
| claude | claude-sonnet-4.5 | Claude Sonnet 4.5 | 5 | free | anthropic/claude-sonnet-4.5 | — | — |
| claude | claude-sonnet-3.7 | Claude Sonnet 3.7 | 5 | free | anthropic/claude-3.7-sonnet | — | — |
| claude | claude-haiku-4.5 | Claude Haiku 4.5 | 1.5 | free | anthropic/claude-haiku-4.5 | — | — |
| gemini | gemini-3.1-pro | Gemini 3.1 Pro | 5 | sub | google/gemini-3.1-pro | ✅ | — |
| gemini | gemini-3-pro | Gemini 3 Pro | 5 | free | google/gemini-3-pro | — | — |
| gemini | gemini-2.5-pro | Gemini 2.5 Pro | 3 | free | google/gemini-2.5-pro | — | — |
| gemini | gemini-3-flash | Gemini 3 Flash | 1 | free | google/gemini-3-flash | — | ✅ Pro/Max |
| gemini | gemini-2.5-flash | Gemini 2.5 Flash | 1 | free | google/gemini-2.5-flash | — | ✅ Pro/Max |

> **Claude Sonnet 4.6** — единственная топовая модель (5₽), доступная без подписки. Tier: `free` в коде. НЕ входит в `locked-versions.ts`.

---

## 3. Модели изображений (fal.ai) — 7 версий

| model_id | version_id | Label (UI) | Цена (₽) | Tier | fal.ai endpoint | subscriptionOnly |
|----------|-----------|------------|-----------|------|-----------------|------------------|
| nanobanana | nanobanana-2 | NanoBanana 2 | 13/19/26 (1K/2K/4K) | sub | fal-ai/nano-banana-2 | ✅ |
| nanobanana | nanobanana-pro | NanoBanana Pro | 22/22/43 (1K/2K/4K) | sub | fal-ai/nano-banana/pro | ✅ |
| nanobanana | nanobanana | NanoBanana | 7 | free | fal-ai/nano-banana | — |
| flux | flux-2-pro | Flux 2 Pro | 5 | sub | fal-ai/flux-2-pro | ✅ |
| flux | flux-1.1-pro-ultra | Flux 1.1 Pro Ultra | 15 | sub | fal-ai/flux-pro/v1.1-ultra | ✅ |
| flux | flux-1-pro | Flux 1.1 Pro | 7 | free | fal-ai/flux-pro/v1 | — |
| flux | flux-1-dev | Flux 1 Dev | 4 | free | fal-ai/flux/dev | — |

> **⚠️ ID переименованы (апрель 2026):** `nb-2.0` → `nanobanana`, `nb-pro` → `nanobanana-pro`. Старые ID НЕ использовать.
> Динамические цены NanoBanana 2 и Pro: разрешение выбирается в UI (1K/2K/4K) → цена меняется.
> Flux 2 Pro — новейшая генерация от Black Forest Labs ($0.03/MP).
> Flux 1 Dev — открытая модель, бесплатна для всех пользователей ($0.025/MP).

---

## 4. Модели видео (kie.ai) — 7 версий

| model_id | version_id | Label (UI) | Цена (₽) | Tier | kie.ai model | Звук | subscriptionOnly |
|----------|-----------|------------|-----------|------|-------------|------|------------------|
| kling | kling-3.0-pro | Kling 3.0 Pro | 85/170 (5с/10с) | sub | kling3.0_pro | всегда вкл | ✅ |
| kling | kling-3.0 | Kling 3.0 | 55/110 (5с/10с) | sub | kling3.0 | всегда вкл | ✅ |
| kling | kling-2.6-pro | Kling 2.6 Pro | 45-170 (длит+звук) | sub | kling2.6_pro | toggle | ✅ |
| kling | kling-2.6 | Kling 2.6 | 45-170 (длит+звук) | free | kling2.6 | toggle | — |
| kling | kling-2.5-turbo | Kling 2.5 Turbo | 35/65 (5с/10с) | free | kling2.5_turbo | нет | — |
| veo31 | veo-3.1-quality | Veo 3.1 Quality | 220 | sub | veo3_quality | — | ✅ |
| veo31 | veo-3.1-fast | Veo 3.1 Fast | 50 | sub | veo3_fast | — | ✅ |

> Veo 3.1 Quality — цена обновлена до 220₽ (API подорожал: $1.25 → $2.00 за 8с на kie.ai).
> Kling 3.0 / 3.0 Pro — звук всегда включён (нет toggle).
> Kling 2.6 / 2.6 Pro — звук опциональный (toggle: с/без аудио, разная цена).
> Kling 2.5 Turbo — звука нет.

---

## 5. Подписки

| Тариф | Цена/мес | Айкоины/мес | Лимит запросов/день | Скидка на пополнение | Реф. бонус |
|-------|---------|------------|--------------------|--------------------|------------|
| Free | 0₽ | 20 (единоразово) | 50 | — | 15% |
| Basic | 499₽ | 300 | 100 | 10% | 20% |
| Pro ⭐ | 999₽ | 550 | 150 | 15% | 25% |
| Max | 1799₽ | 1200 | 200 | 20% | 30% |

### Бесплатные модели для Pro/Max (cost=0):
- chatgpt-5-mini
- gemini-3-flash
- gemini-2.5-flash

---

## 6. subscriptionOnly версии (locked-versions.ts)

Входят в `SUBSCRIPTION_VERSION_IDS` — требуют подписку Basic+:

```
gpt-5.4, gpt-5.3,
claude-opus-4.6, claude-opus-4.5,
gemini-3.1-pro,
nanobanana-2, nanobanana-pro,
flux-2-pro, flux-1.1-pro-ultra,
kling-3.0-pro, kling-3.0, kling-2.6-pro,
veo-3.1-quality, veo-3.1-fast
```

НЕ входят (доступны без подписки):
`chatgpt-5.2`, `chatgpt-5`, `chatgpt-5-mini`,
`claude-sonnet-4.6`, `claude-sonnet-4.5`, `claude-sonnet-3.7`, `claude-haiku-4.5`,
`gemini-3-pro`, `gemini-2.5-pro`, `gemini-3-flash`, `gemini-2.5-flash`,
`nanobanana`, `flux-1-pro`, `flux-1-dev`,
`kling-2.6`, `kling-2.5-turbo`

---

## 7. Thinking (режим рассуждений)

Все 16 текстовых версий поддерживают thinking через OpenRouter `reasoning: { effort }`.

| Модель | Effort levels | Особенности |
|--------|--------------|-------------|
| ChatGPT 5.4 | none, low, medium, high | Reasoning tokens (GPT-5 серия) |
| ChatGPT 5.3 | none, low, medium, high | Adaptive reasoning |
| ChatGPT 5.2 | none, low, medium, high | effort "none" отключает thinking |
| ChatGPT 5 | low, medium, high | Dynamic reasoning |
| ChatGPT 5 mini | low, medium, high | Reasoning (наследник o4-mini) |
| Claude Opus 4.6 | low, medium, high, **max** | Adaptive Thinking, уникальный effort "max" |
| Claude Sonnet 4.6 | low, medium, high, **max** | Adaptive Thinking, уникальный effort "max" |
| Claude Opus 4.5 | low, medium, high | Extended Thinking (budget_tokens) |
| Claude Sonnet 4.5 | low, medium, high | Extended Thinking |
| Claude Sonnet 3.7 | low, medium, high | Extended Thinking (:thinking вариант) |
| Claude Haiku 4.5 | low, medium, high | Extended Thinking (первый Haiku с thinking) |
| Gemini 3.1 Pro | low, medium, high | thinkingLevel |
| Gemini 3 Pro | low, high | thinking нельзя отключить (минимум "low") |
| Gemini 2.5 Pro | low, medium, high | thinkingBudget (старый API) |
| Gemini 3 Flash | minimal, low, medium, high | thinkingLevel |
| Gemini 2.5 Flash | low, medium, high | thinkingBudget |

UI тогл `deepResearchActive` → API добавляет `reasoning: { effort: "high" }` → ответ: `reasoning_details[]` + `content`.

---

## 8. Web Search

Доступен для ВСЕХ 16 текстовых моделей через OpenRouter:
- Способ 1: суффикс `:online` к slug (пример: `anthropic/claude-sonnet-4.6:online`)
- Способ 2: tool `openrouter:web_search` (рекомендуется — модель сама решает когда искать)
- Стоимость: ~$0.02 за запрос (~0.5-1 айкоин надбавка)
- НЕ применимо к image/video моделям

---

## 9. Пакеты айкоинов

| ID | Название | Цена | Айкоинов |
|----|----------|------|----------|
| start | СТАРТ | 149₽ | 90 |
| basic | БАЗОВЫЙ | 349₽ | 220 |
| advanced | ПРОДВИНУТЫЙ ⭐ | 499₽ | 350 |
| professional | ПРОФЕССИОНАЛЬНЫЙ | 799₽ | 650 |
| business | БИЗНЕС 🏆 | 1499₽ | 1200 |

---

## 10. Себестоимость API (для расчёта маржинальности)

### Текст (OpenRouter) — формула: (Input×1500 + Output×500) / 1M × курс
| Модель | Input $/M | Output $/M | Себестоимость* |
|--------|----------|-----------|---------------|
| ChatGPT 5.4 | $2.50 | $20.00 | ~$0.034 |
| ChatGPT 5.3 / 5.2 | $1.75 | $14.00 | ~$0.024 |
| ChatGPT 5 | $1.25 | $10.00 | ~$0.0175 |
| ChatGPT 5 mini | $0.25 | $2.00 | ~$0.0035 |
| Claude Opus 4.6 / 4.5 | $5.00 | $25.00 | ~$0.0475 |
| Claude Sonnet 4.6 / 4.5 / 3.7 | $3.00 | $15.00 | ~$0.0285 |
| Claude Haiku 4.5 | $1.00 | $5.00 | ~$0.0095 |
| Gemini 3.1 Pro / 3 Pro | $2.00 | $12.00 | ~$0.022 |
| Gemini 2.5 Pro | $1.00 | $10.00 | ~$0.017 |
| Gemini 3 Flash | $0.50 | $3.00 | ~$0.0055 |
| Gemini 2.5 Flash | $0.30 | $2.50 | ~$0.0044 |

### Изображения (fal.ai)
| Модель | API стоимость | Себестоимость (₽)* | Цена Blackmount |
|--------|--------------|-------------------|-----------------|
| NanoBanana | $0.039/img | ~3.70₽ | 7₽ |
| NanoBanana Pro (1K/2K) | $0.15/img | ~14.25₽ | 22₽ |
| NanoBanana Pro (4K) | $0.30/img | ~28.50₽ | 43₽ |
| NanoBanana 2 (1K) | $0.08/img | ~7.60₽ | 13₽ |
| NanoBanana 2 (2K) | $0.12/img | ~11.40₽ | 19₽ |
| NanoBanana 2 (4K) | $0.16/img | ~15.20₽ | 26₽ |
| Flux 2 Pro | $0.03/MP | ~2.85₽ | 5₽ |
| Flux 1.1 Pro Ultra | $0.06/img | ~5.70₽ | 15₽ |
| Flux 1.1 Pro | $0.04/MP | ~3.80₽ | 7₽ |
| Flux 1 Dev | $0.025/MP | ~2.38₽ | 4₽ |

### Видео (kie.ai)
| Модель | API стоимость | Себестоимость (₽)* | Цена Blackmount |
|--------|--------------|-------------------|-----------------|
| Veo 3.1 Quality 8с | $2.00/video | ~190₽ | 220₽ |
| Veo 3.1 Fast 8с | $0.30/video | ~28.50₽ | 50₽ |
| Kling 3.0 Pro 5с/10с | ~$0.29/$0.58 | ~28/55₽ | 85/170₽ |
| Kling 3.0 5с/10с | ~$0.145/$0.29 | ~14/28₽ | 55/110₽ |
| Kling 2.6 5с без звука | $0.275 | ~26₽ | 45₽ |
| Kling 2.6 10с со звуком | $1.10 | ~104₽ | 170₽ |
| Kling 2.5 Turbo 5с/10с | $0.21/$0.42 | ~20/40₽ | 35/65₽ |

*Курс: 95₽/$

---

## 11. Правила именования

- GPT всегда пишется **ChatGPT** (ChatGPT 5.4, не GPT-5.4)
- Описания версий — 2-3 слова по смыслу
- Kling 3.0 без суффикса "Std" (просто "Kling 3.0")
- NanoBanana 2 — это версия внутри модели NanoBanana, не отдельная модель
- version_id NanoBanana: `nanobanana`, `nanobanana-pro`, `nanobanana-2` (НЕ `nb-2.0`, НЕ `nb-pro`)

---

## 12. Удалённые модели

| Модель | Когда удалена | Причина |
|--------|--------------|---------|
| Sora 2 / Sora 2 Pro | Апрель 2026 | Убрана из каталога |

> Sora 2 НЕ должна упоминаться ни в одном документе, файле данных или UI.
