#!/bin/bash
# Testa os verbetes âncora do GPTchê (glossário) no backend local.
# Uso: ./test-verbetes.sh
# Ajusta a variável BASE_URL abaixo se a porta ou o prefixo da rota forem diferentes.

BASE_URL="http://localhost:3000/glossario"

TERMOS=(
  "mate galleta"
  "cuia"
  "porongo"
  "tereré"
  "chimarrão invertido"
  "mateador"
)

echo "Testando verbetes âncora em: $BASE_URL"
echo "----------------------------------------"

for termo in "${TERMOS[@]}"; do
  echo ""
  echo "🧉 Termo: $termo"

  inicio=$(date +%s%N)
  resposta=$(curl -s -X POST "$BASE_URL" \
    -H "Content-Type: application/json" \
    -d "{\"palavra\":\"$termo\"}")
  fim=$(date +%s%N)

  duracao_ms=$(( (fim - inicio) / 1000000 ))

  echo "$resposta" | python3 -m json.tool 2>/dev/null || echo "$resposta"
  echo "⏱️  Tempo de resposta: ${duracao_ms}ms"

  if [ "$duracao_ms" -lt 300 ]; then
    echo "✅ Rápido — provavelmente veio do VERBETES_ANCORA (sem chamar a API)"
  else
    echo "⚠️  Demorou mais que o esperado — confere se caiu no fallback da API"
  fi
done

echo ""
echo "----------------------------------------"
echo "Teste concluído, tchê!"
