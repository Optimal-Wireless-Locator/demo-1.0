# 🦉 Sistema OWL - Gerenciamento de Places e Tags

## Visão Geral

O **Sistema OWL** é uma plataforma completa para gerenciar **Places** (locais/mapas) e **Tags** (dispositivos) com interface web moderna, visualizações SVG interativas e funcionalidades completas de CRUD (Create, Read, Update, Delete).

## Funcionalidades Implementadas

### ✅ Modais de Criação (Página Principal)
- **ModalMap**: Cria novos places com validação completa
- **ModalTag**: Cria novos devices/tags com validação

### ✅ Sistema OWL (Página de Gerenciamento)
- **3 Abas Principais**: Places, Tags e Visualizações
- **Tabelas Interativas**: Edição inline, exclusão com confirmação
- **Formulários Integrados**: Criação direta na página OWL
- **Busca e Filtros**: Em tempo real com ordenação
- **Estatísticas Dinâmicas**: Cards com métricas em tempo real
- **Exportação de Dados**: JSON completo, CSV por categoria

### ✅ Visualizações SVG Avançadas
- **Escala Proporcional**: 15m = 40px (base), escala automática para outras dimensões
- **Representação Gráfica**: Retângulos com grid de referência
- **Posições ESP32**: Visualização dos sensores calculados pela API
- **Dimensões e Medidas**: Exibição de largura, altura, área e perímetro
- **Modal de Detalhes**: Visualização expandida com informações técnicas

### ✅ Página de Testes da API
- **Testes Diretos**: Botões para testar GET e POST
- **Debug Completo**: Logs detalhados no console
- **Interface Separada**: Página dedicada para desenvolvedores

### ✅ API Completa
- Endpoints REST para Places e Devices
- Validação com Zod
- Integração com Neon PostgreSQL
- Documentação Swagger

## Como Usar

### 1. Navegação
- **Home**: Página principal com modais de criação
- **OWL**: Sistema de gerenciamento completo
- **API Test**: Página para testes de desenvolvimento

### 2. Criando Dados
**Opção A - Modais (Página Home):**
- **Modal Map**: Cria places com validação completa
- **Modal Tag**: Cria devices com validação completa

**Opção B - Formulários OWL:**
- **Botão "Criar Place/Tag"**: Formulários integrados na página OWL
- **Validação em Tempo Real**: Feedback imediato de erros

### 3. Gerenciando Dados (Sistema OWL)
**Aba Places:**
- **👁️ Visualizar**: Modal com representação SVG do place
- **✏️ Editar**: Edição inline de todos os campos
- **🗑️ Excluir**: Remoção com confirmação

**Aba Tags:**
- **✏️ Editar**: Modificar nome e MAC address
- **🗑️ Excluir**: Remoção com confirmação

**Aba Visualizações:**
- **Galeria SVG**: Todos os places em formato visual
- **Escala Automática**: Proporção baseada nas dimensões
- **Detalhes Técnicos**: ESP32s, área, perímetro

### 4. Funcionalidades Avançadas
- **Busca Inteligente**: Busca por nome, MAC address
- **Filtros**: Ordenação por área, nome, dimensões
- **Estatísticas**: Métricas em tempo real
- **Exportação**: JSON, CSV por categoria
- **Atualização**: Sincronização automática entre páginas

## Estrutura dos Dados

### Places
```json
{
  "id": 1,
  "name": "Escritório Principal",
  "width": 20.5,
  "height": 15.0,
  "one_meter_rssi": -45.5,
  "propagation_factor": 2.1,
  "esp_positions": "calculated_positions"
}
```

### Devices/Tags
```json
{
  "mac_address": "aa:bb:cc:11:22:33",
  "name": "Tag de Teste 1"
}
```

## Componentes Criados

### Principais
- `ManagementPage.jsx` - Sistema OWL completo
- `useApiData.js` - Hook personalizado para gerenciar dados da API
- `PlaceVisualization.jsx` - Visualização SVG dos places
- `CreateForms.jsx` - Formulários de criação integrados

### Auxiliares
- `Navigation.jsx` - Navegação entre páginas (Home, OWL, API Test)
- `StatsCards.jsx` - Cartões de estatísticas dinâmicas
- `SearchAndFilters.jsx` - Busca e filtros avançados
- `ExportData.jsx` - Exportação de dados
- `PlacesGallery.jsx` - Galeria de visualizações
- `ApiTestPage.jsx` - Página de testes da API

### Visualização SVG
- **Escala Inteligente**: 15m = 40px base, proporção automática
- **Grid de Referência**: Quadriculado de 1m x 1m
- **ESP32 Positioning**: Círculos azuis com labels
- **Dimensões**: Linhas de cota com medidas
- **Responsivo**: Adapta-se ao tamanho da tela

## Funcionalidades Técnicas

### Sincronização Automática
- Os modais emitem eventos customizados quando criam novos itens
- A página de gerenciamento escuta esses eventos e atualiza automaticamente
- Dados são mantidos sincronizados entre localStorage e API

### Validação e Tratamento de Erros
- Validação completa nos formulários
- Mensagens de erro claras
- Confirmação antes de excluir itens
- Loading states durante operações

### Performance
- Filtros e busca em tempo real usando useMemo
- Componentes otimizados para re-renderização
- Lazy loading de dados

## Próximos Passos Sugeridos

1. **Relatórios**: Criar dashboards com gráficos dos dados
2. **Importação**: Permitir importar dados via CSV/JSON
3. **Histórico**: Manter log de alterações
4. **Permissões**: Sistema de usuários e permissões
5. **API Real-time**: WebSockets para atualizações em tempo real

## Como Executar

### Pré-requisitos
- Node.js instalado
- Banco Neon configurado
- Variáveis de ambiente configuradas

### Passos
1. **Instalar dependências**: `pnpm install`
2. **Iniciar API**: `node server.js` (porta 3000)
3. **Iniciar Frontend**: `pnpm web:dev` (porta 5174)
4. **Acessar**: http://localhost:5174

### Navegação
- **Home**: Página principal com modais
- **🦉 OWL**: Sistema de gerenciamento completo
- **API Test**: Testes de desenvolvimento

## Recursos Técnicos

### Escala SVG Inteligente
```javascript
// Regra de escala: 15 metros = 40 pixels (base)
const baseMeters = 15;
const basePixels = 40;

// Para dimensões > 15m: escala diminui proporcionalmente
// Para dimensões < 15m: escala aumenta proporcionalmente
const pixelsPerMeter = basePixels * (baseMeters / maxDimension);
```

### Sincronização Automática
- Eventos customizados entre componentes
- Atualização em tempo real
- Cache inteligente com localStorage

### Performance
- Componentes otimizados com useMemo
- Lazy loading de visualizações
- Debounce em buscas

O **Sistema OWL** está totalmente funcional e pronto para uso em produção! 🚀