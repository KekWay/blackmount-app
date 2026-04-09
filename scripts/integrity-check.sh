#!/bin/bash
# ============================================
# Blackmount Integrity Check
# Запускай перед каждым git commit
# ============================================

PASS=0
FAIL=0
WARN=0

pass() { echo "  ✅ $1"; ((PASS++)); }
fail() { echo "  ❌ $1"; ((FAIL++)); }
warn() { echo "  ⚠️  $1"; ((WARN++)); }

echo ""
echo "🔍 Blackmount Integrity Check"
echo "================================"

# --- 1. Модели: количество версий ---
echo ""
echo "📦 Модели и версии"

V_AI=$(grep -c "tier: '" src/data/ai-models.ts 2>/dev/null)
V_LB=$(grep -c 'id: "' src/data/leaderboard.ts 2>/dev/null)
V_AR=$(grep -c "id: '" src/data/arena-models.ts 2>/dev/null)

if [ "$V_AI" = "$V_LB" ] && [ "$V_AI" = "$V_AR" ]; then
  pass "Версии совпадают: ai-models=$V_AI, leaderboard=$V_LB, arena=$V_AR"
else
  fail "Версии НЕ совпадают: ai-models=$V_AI, leaderboard=$V_LB, arena=$V_AR"
fi

# --- 2. Locked sync ---
echo ""
echo "🔒 Подписки и locked"

T_SUB=$(grep -c "tier: 'sub'" src/data/ai-models.ts 2>/dev/null)
T_LOCKED=$(grep "'" src/lib/locked-versions.ts 2>/dev/null | grep -v "export\|import\|//\|\*" | tr ',' '\n' | grep "'" | wc -l | tr -d ' ')

if [ "$T_SUB" = "$T_LOCKED" ]; then
  pass "tier:sub ($T_SUB) = locked-versions ($T_LOCKED)"
else
  fail "tier:sub ($T_SUB) ≠ locked-versions ($T_LOCKED)"
fi

# --- 3. Sora ---
echo ""
echo "🗑️  Удалённые модели"

SORA=$(grep -rn "Sora\|sora" src/ docs/ 2>/dev/null | grep -v "MODEL_REGISTRY.*Удалённые\|node_modules\|без Sora\|НЕ должна" | wc -l | tr -d ' ')

if [ "$SORA" = "0" ]; then
  pass "Sora нигде не найдена"
else
  fail "Sora найдена в $SORA местах:"
  grep -rn "Sora\|sora" src/ docs/ 2>/dev/null | grep -v "MODEL_REGISTRY.*Удалённые\|node_modules\|без Sora\|НЕ должна" | head -5
fi

# --- 4. Именование ---
echo ""
echo "📝 Именование"

BAD_FLUX=$(grep -rn "Flux 1 Pro" src/ docs/ 2>/dev/null | grep -v "1.1 Pro\|flux-1-pro\|fal-ai/flux" | wc -l | tr -d ' ')
if [ "$BAD_FLUX" = "0" ]; then
  pass "Flux 1.1 Pro — везде корректно"
else
  fail "«Flux 1 Pro» без «1.1» найдено в $BAD_FLUX местах"
fi

BAD_GPT=$(grep -rn "GPT-5\|GPT 5" src/ docs/ 2>/dev/null | grep -v "ChatGPT\|openai/gpt\|'gpt-5\|\"gpt-5" | wc -l | tr -d ' ')
if [ "$BAD_GPT" = "0" ]; then
  pass "ChatGPT — везде корректно"
else
  fail "«GPT» без «Chat» найдено в $BAD_GPT местах"
fi

# --- 5. Код ---
echo ""
echo "🧹 Качество кода"

ANY=$(grep -rn ": any\|as any\|@ts-ignore\|@ts-expect-error" src/ 2>/dev/null | grep -v node_modules | wc -l | tr -d ' ')
if [ "$ANY" = "0" ]; then
  pass "Нет any / @ts-ignore"
else
  fail "any/@ts-ignore найдено в $ANY местах"
fi

LOGS=$(grep -rn "console\.log\|console\.warn" src/ 2>/dev/null | grep -v node_modules | wc -l | tr -d ' ')
if [ "$LOGS" = "0" ]; then
  pass "Нет console.log/warn"
else
  fail "console.log/warn найдено в $LOGS местах"
fi

# --- Тесты ---
echo ""
echo "🧪 Тесты"

TEST_OUTPUT=$(npx vitest run 2>&1)
TEST_EXIT=$?

if [ $TEST_EXIT -eq 0 ]; then
  pass "vitest — все тесты пройдены"
else
  fail "vitest — есть падения"
  echo "$TEST_OUTPUT" | grep "FAIL\|AssertionError" | head -5
fi

# --- 6. TypeScript ---
echo ""
echo "🔧 TypeScript"

TSC_OUTPUT=$(npx tsc --noEmit 2>&1)
TSC_EXIT=$?

if [ $TSC_EXIT -eq 0 ]; then
  pass "tsc --noEmit — без ошибок"
else
  TSC_ERRORS=$(echo "$TSC_OUTPUT" | grep -c "error TS")
  fail "tsc --noEmit — $TSC_ERRORS ошибок"
  echo "$TSC_OUTPUT" | grep "error TS" | head -5
fi

# --- Итог ---
echo ""
echo "================================"
TOTAL=$((PASS + FAIL + WARN))
echo "📊 Результат: $PASS/$TOTAL пройдено"

if [ $FAIL -gt 0 ]; then
  echo "❌ $FAIL проблем — ИСПРАВЬ ПЕРЕД КОММИТОМ"
  exit 1
else
  if [ $WARN -gt 0 ]; then
    echo "⚠️  $WARN предупреждений — можно коммитить, но лучше проверить"
  else
    echo "✅ Всё чисто — можно коммитить"
  fi
  exit 0
fi
