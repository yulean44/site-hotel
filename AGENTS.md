# Instruções para agentes (Codex, ChatGPT, Claude e outros)

Site do Hotel Vila Nova do Príncipe (Caetité, BA). Estrutura, build e execução local estão no `README.md`: leia antes de mexer. Edite as páginas HTML, `styles.css`, `script.js` e `assets/` na raiz; `public/` é gerada.

## Skills (`.agents/skills/`)

Leia o `SKILL.md` da skill antes de começar a tarefa que ela cobre e siga-o.

| Tarefa | Skill |
|---|---|
| Criar, redesenhar ou polir páginas e visual do site | `design-taste-frontend` (principal) |
| Crítica ou auditoria de design | `impeccable` |
| Direção estética e tipografia | `frontend-design` |
| Construir ou alterar seções, layout responsivo, acessibilidade | `frontend-ui-engineering` |
| Revisar a UI antes de publicar | `web-design-guidelines` |
| Adicionar movimento ou transição | `animate` |
| Animação travando | `animation-performance` |
| Site lento, imagens/vídeos pesados, Core Web Vitals | `performance-optimization` |
| Testar e depurar no navegador | `browser-testing-with-devtools` (precisa do MCP chrome-devtools) |

Use uma só skill de design por tarefa para não misturar instruções. Mantenha a identidade atual do hotel (cores, fotos reais e textos) salvo pedido em contrário. Os scripts de `impeccable/scripts/` só rodam se a tarefa pedir.

## Commits

Mensagens curtas em português, descrevendo a mudança.
