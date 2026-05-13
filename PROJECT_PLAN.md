# Path of Exile 2 — Build Guide Service
## Повний план проєкту: від ідеї до запуску

**Дата:** 13 травня 2026  
**Автор:** Максим (makskidexom)  
**Версія документу:** 1.0 (повна — з технічним дослідженням)

---

## Зміст
1. [Ідея та мета](#1-ідея-та-мета)
2. [Ринок та конкуренти](#2-ринок-та-конкуренти)
3. [Killer Feature — Прогрес-Трекер](#3-killer-feature--прогрес-трекер)
4. [Повний список фіч](#4-повний-список-фіч)
5. [Технічна архітектура](#5-технічна-архітектура)
6. [GGG API — статус та деталі](#6-ggg-api--статус-та-деталі)
7. [Формат .build файлів](#7-формат-build-файлів)
8. [Дані для пасивного дерева](#8-дані-для-пасивного-дерева)
9. [Дані для гемів та предметів](#9-дані-для-гемів-та-предметів)
10. [Структура бази даних](#10-структура-бази-даних)
11. [Стратегія наповнення контентом](#11-стратегія-наповнення-контентом)
12. [Монетизація](#12-монетизація)
13. [Roadmap по тижнях](#13-roadmap-по-тижнях)
14. [Ризики та вирішення](#14-ризики-та-вирішення)
15. [Список ресурсів](#15-список-ресурсів)

---

## 1. Ідея та Мета

### Що будуємо
Веб-сервіс для Path of Exile 2, де гравці можуть:
- Переглядати та зберігати гайди й білди
- Скачувати `.build` файли для прямого імпорту в in-game Build Planner
- Відстежувати прогрес свого персонажа відносно обраного гайду
- Отримувати персональні рекомендації "що робити далі"

### Ключовий UX
> «Завантажив `.build` → зайшов у гру → грав без постійного alt-tab'у»

### Цільова аудиторія
- Новачки та середній рівень гравців PoE2
- UA/RU спільнота (первинний фокус)
- Надалі — весь PoE2 ринок

### Чим відрізняємось від конкурентів
| Ознака | Ми | Maxroll | PoB2 | poe2.dev |
|---|---|---|---|---|
| Левелінг roadmap | ✅ Фокус | Частково | ✅ | ❌ |
| Прогрес-трекер | ✅ Killer | ❌ | ❌ | ❌ |
| `.build` скачування | ✅ | ❌ | ✅ Export | ❌ |
| UA/RU локалізація | ✅ | ❌ | ❌ | ❌ |
| Рекомендації апгрейдів | ✅ | ❌ | ❌ | ❌ |
| Зручно для новачків | ✅ | Середньо | Складно | ❌ |

---

## 2. Ринок та Конкуренти

### Конкуренти — що вони роблять

**Maxroll.gg/poe2** — найсильніший конкурент
- Повні гайди від топових гравців
- Власний planner (passive tree + gear)
- PoB2 інтеграція (import/export)
- Atlas progression tree
- **Немає:** прогрес-трекер, персонального roadmap, `.build` download

**Path of Building 2** (https://github.com/PathOfBuildingCommunity/PathOfBuilding-PoE2)
- Desktop + web build calculator (з 13 січня 2025)
- Повний розрахунок DPS/захисту
- Import/export кодів (XML base64)
- **Немає:** веб-гайди, прогрес-трекер, зручна для новачків

**poe2.dev**
- Equipment/item data explorer
- Базовий planner
- Trending builds з poe.ninja
- **Немає:** гайди, трекер, `.build` файли

**poe.ninja**
- Ціни на валюту та предмети
- Статистика ліг (популярні класи/білди)
- **Немає:** гайди, planner

### Незайнята ніша
Ніхто не поєднує в одному місці:
1. Зрозумілий гайд
2. `.build` для in-game planner
3. Відстеження реального персонажа vs гайд
4. Рекомендації "що апгрейдити зараз"

---

## 3. Killer Feature — Прогрес-Трекер

### Логіка роботи

```
Гравець обирає гайд → Авторизується через GGG OAuth → 
Імпортує персонажа → Бачить свій прогрес та рекомендації
```

### Що порівнюємо (технічно)

**1. Пасивне дерево**
- API повертає масив `hashes` (числових ID взятих нодів)
- Гайд зберігає `hashes` по рівнях (level checkpoints)
- Порівнюємо: які з "потрібних на цьому рівні" вже взяті
- Показуємо: наступні 3-5 нодів по пріоритету

**2. Геми та підтримки**
- API повертає `socketedItems` з усіма гемами
- Порівнюємо: назви гемів, рівень, якість
- Показуємо: яких не вистачає, які треба апгрейдити

**3. Екіпірування**
- API повертає items по `inventoryId` (слот): `BodyArmour`, `Helm`, `Gloves`, `Boots`, `Weapon`, `Offhand`, etc.
- Для кожного предмета: `base type`, `mods` (affix list)
- Порівнюємо з "рекомендованим" у гайді
- Показуємо: які ключові моди є/відсутні, "Missing: +1 to Level of Socketed Gems"

**4. Загальний прогрес**
- `current_level / guide_max_level * 100%`
- Weighted score по пасивкам + гемам + gear

### Рекомендації системи

```
Рівень 45 → "Наступні кроки":
├── 🔴 КРИТИЧНО: Немає Flammability у лінку
├── 🟡 ВАЖЛИВО: Возьми 3 пасивки до Elemental Overload (6/9)
└── 🟢 БАЖАНО: Апгрейди на чоботах — потрібен +Movement Speed
```

### UI компоненти трекера
- Прогрес-бар (0–100%)
- Passive tree з підсвічуванням (зелений = взято, жовтий = наступний, сірий = пізніше)
- Список "Next Steps" з пріоритетами
- Gear checklist по слотах
- Кнопка "Refresh character" (rate-limited: раз на 5 хв)

---

## 4. Повний Список Фіч

### MVP (фаза 1, тижні 1–6)
- [ ] Перегляд гайдів з левелінг path
- [ ] Генерація та скачування `.build` файлу
- [ ] Preview пасивного дерева (статичний)
- [ ] GGG OAuth авторизація
- [ ] Імпорт персонажа з API
- [ ] Базовий прогрес-трекер (пасивки + геми)

### Фаза 2 (тижні 7–12)
- [ ] Gear tracker (порівняння слотів)
- [ ] Budget → Mid → High progression (три версії білду)
- [ ] Рекомендації апгрейдів з цінами (poe.ninja інтеграція)
- [ ] Community upload білдів (з модерацією)
- [ ] Рейтинг білдів (лайки, views)
- [ ] SSF / HC режим для гайдів

### Фаза 3 (місяці 4–6)
- [ ] AI-помічник ("Чому в мене низький DPS?")
- [ ] Migration Helper (перехід між білдами)
- [ ] Atlas + Endgame planner
- [ ] Порівняння двох білдів
- [ ] Мобільний режим / PWA

### Бажане (пізніше)
- [ ] Death recap simulator
- [ ] Multi-weapon set planner
- [ ] Video/audio нотатки в гайдах
- [ ] Community "Build of the Day"
- [ ] Партнерські гайди від стрімерів

---

## 5. Технічна Архітектура

### Стек

```
Frontend: Next.js 14 (App Router) + TypeScript
UI: Tailwind CSS + shadcn/ui
State: Zustand / React Query
Tree Visualization: D3.js або react-flow

Backend: Node.js + Fastify (або Python FastAPI)
ORM: Prisma (з PostgreSQL)
Auth: NextAuth.js з GGG OAuth provider
Cache: Redis (rate limiting + session store)
Queue: BullMQ (background jobs: API sync, price updates)

Database: PostgreSQL (Supabase для швидкого старту)
File Storage: S3-compatible (Cloudflare R2 — дешевше)
CDN: Cloudflare

Deploy: Railway / Fly.io / Render (для початку)
```

### Діаграма сервісів

```
┌─────────────────────────────────────────────────┐
│                   Next.js App                   │
│  (SSR гайди, CSR tracker, API routes)           │
└────────────────────┬────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
┌────────▼────────┐   ┌──────────▼──────────┐
│   PostgreSQL    │   │       Redis          │
│  (builds, users,│   │  (sessions, cache,   │
│   guides, chars)│   │   rate limits)       │
└─────────────────┘   └─────────────────────┘
         │
┌────────▼────────────────────────────────────┐
│              External APIs                   │
│  GGG OAuth API    poe.ninja    poedb.tw     │
│  Character data   Prices       Item data    │
└─────────────────────────────────────────────┘
```

### Структура папок (Next.js)

```
poe2-builder/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── builds/
│   │   ├── [id]/          # Перегляд білду
│   │   └── create/        # Створення
│   ├── tracker/           # Прогрес-трекер
│   └── api/
│       ├── auth/          # NextAuth routes
│       ├── builds/        # CRUD для білдів
│       ├── character/     # GGG API proxy
│       └── export/        # .build генерація
├── components/
│   ├── passive-tree/      # D3 візуалізація
│   ├── tracker/           # Трекер компоненти
│   └── build/             # Форми, картки
├── lib/
│   ├── ggg-api.ts         # GGG API клієнт
│   ├── build-generator.ts # .build файл генерація
│   ├── passive-tree.ts    # Парсинг дерева
│   └── comparator.ts      # Логіка порівняння
└── data/
    ├── passive-tree.json  # Офіційні дані дерева
    └── gems.json          # Дані про геми
```

---

## 6. GGG API — Статус та Деталі

### КРИТИЧНО ВАЖЛИВО: Статус PoE2 API

> **Станом на травень 2026: офіційного окремого PoE2 API не існує.**  
> PoE1 OAuth endpoints *можуть* працювати для PoE2 акаунтів, але це не офіційно підтримується.  
> Форум-треди з грудня 2024 показують, що розробники чекають на відповідь GGG.

**Джерело:** https://www.pathofexile.com/forum/view-thread/3608197

### Доступні Endpoints (PoE1, можуть покривати PoE2)

```
GET /character-window/get-characters
  → Список персонажів акаунту

GET /character-window/get-items?accountName={}&character={}&realm=poe2
  → Екіпірування персонажа (з socketedItems — гемами)

GET /character-window/get-passive-skills?accountName={}&character={}&realm=poe2
  → { "hashes": [12345, 67890, ...], "jewel_data": {...} }

GET /character-window/get-characters?realm=poe2
  → Персонажі PoE2 (можливо!)
```

**Базовий URL:** `https://api.pathofexile.com`  
**Required Header:** `User-Agent: OAuth {clientId}/{version} (contact: {email})`

### Rate Limits

Rate limits динамічні — читати з response headers:
```
X-Rate-Limit-Policy: {policy_name}
X-Rate-Limit-{rule}: {max_hits}:{period_seconds}:{restriction_seconds}
Retry-After: {seconds}  ← з'являється при 429
```

**Стратегія:**
- Кешуй дані персонажа мінімум 5 хвилин
- Реалізуй exponential backoff на 429
- Ніколи не роби автоматичні запити частіше ніж раз на 5 хв на user

### OAuth 2.1 Flow (PKCE — обов'язково)

**Крок 1 — PKCE генерація:**
```typescript
const codeVerifier = crypto.randomBytes(32).toString('base64url');
const codeChallenge = crypto
  .createHash('sha256')
  .update(codeVerifier)
  .digest('base64url');
```

**Крок 2 — Redirect на GGG:**
```
https://www.pathofexile.com/oauth/authorize?
  client_id=YOUR_CLIENT_ID
  &scope=account:profile account:characters
  &state=RANDOM_STATE
  &redirect_uri=https://yourapp.com/auth/callback
  &response_type=code
  &code_challenge=CODE_CHALLENGE
  &code_challenge_method=S256
```

**Крок 3 — Token exchange (POST):**
```
POST https://www.pathofexile.com/oauth/token
Content-Type: application/x-www-form-urlencoded

client_id=YOUR_CLIENT_ID
&client_secret=YOUR_SECRET
&grant_type=authorization_code
&code=AUTH_CODE_FROM_CALLBACK
&code_verifier=YOUR_CODE_VERIFIER
&redirect_uri=https://yourapp.com/auth/callback
```

**Важливо:** Authorization code живе лише **30 секунд**!

### Доступні Scopes
- `account:profile` — базова інфо акаунту
- `account:characters` — дані персонажів (потрібно для трекера)
- `account:stashes` — вміст стешів (для Budget tracker пізніше)

### Реєстрація OAuth App
Надішли листа на `oauth@grindinggear.com` з:
- Назвою додатку
- Описом для чого використовуєш API
- redirect_uri
- Контактна email

> Можливий час розгляду: 1–4 тижні. Зроби це **першим кроком**.

### Структура відповіді Character API

```json
{
  "character": {
    "name": "MyChar",
    "class": "Witch",
    "level": 45,
    "ascendancy": { "id": "invoker" }
  },
  "items": [
    {
      "inventoryId": "BodyArmour",
      "name": "Vaal Regalia",
      "typeLine": "Vaal Regalia",
      "identified": true,
      "ilvl": 68,
      "explicitMods": ["+80 to maximum Life", "28% increased Energy Shield"],
      "implicitMods": [],
      "socketedItems": [
        {
          "typeLine": "Fireball",
          "support": false,
          "socket": 0
        }
      ]
    }
  ],
  "passives": {
    "hashes": [12345, 67890, 11111],
    "jewel_data": {}
  }
}
```

---

## 7. Формат .build Файлів

### Що таке .build

`.build` — це файл для **офіційного in-game Build Planner** PoE2.  
Зберігається в: `Documents\My Games\Path of Exile 2\BuildPlanner\`

### Структура (XML → Deflate → Base64)

GGG використовує той самий формат, що й Path of Building:
1. XML будується за схемою Build
2. Стискається Deflate
3. Кодується в Base64 URL-safe (`+` → `-`, `/` → `_`)

### XML структура (спрощено)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<PathOfBuilding>
  <Build level="45" targetVersion="2_0" class="Witch" ascendClassName="Invoker">
    <Notes>Leveling guide for Fireball Invoker. Act 1-2: focus on cast speed...</Notes>
  </Build>
  
  <Skills activeSkillSet="1">
    <SkillSet id="1">
      <Skill slot="BodyArmour" enabled="true" mainActiveSkillCalcs="1">
        <Gem nameSpec="Fireball" level="10" quality="0" enabled="true"/>
        <Gem nameSpec="Spell Echo" level="10" quality="0" enabled="true" skillId="SupportSpellEcho"/>
        <Gem nameSpec="Added Fire Damage" level="10" quality="0" enabled="true"/>
      </Skill>
    </SkillSet>
  </Skills>
  
  <Tree activeSpec="1">
    <Spec title="Level 45" ascendClassId="1" nodes="12345,67890,11111,22222">
      <!-- nodes = comma-separated passive node IDs (hashes) -->
    </Spec>
  </Tree>
  
  <Items>
    <Item id="1">
Vaal Regalia
Quality: 0
Energy Shield: 300
Explicits:
+80 to maximum Life
28% increased Energy Shield
    </Item>
    <ItemSet useSecondWeaponSet="false">
      <Item itemId="1" inventoryId="BodyArmour"/>
    </ItemSet>
  </Items>
</PathOfBuilding>
```

### Генерація в Node.js

```typescript
import { deflateSync } from 'zlib';

function generateBuildCode(build: BuildData): string {
  const xml = buildToXML(build); // твоя функція
  const compressed = deflateSync(Buffer.from(xml, 'utf-8'));
  const base64 = compressed.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return base64;
}

function saveBuildFile(code: string, filename: string): void {
  // На клієнті (браузер):
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.build`;
  a.click();
}
```

### Leveling Path у .build

`.build` підтримує **кілька Spec** — один на кожен checkpoint рівня:

```xml
<Tree activeSpec="1">
  <Spec title="Level 20" nodes="100,200,300"/>
  <Spec title="Level 40" nodes="100,200,300,400,500"/>
  <Spec title="Level 60" nodes="100,200,300,400,500,600,700"/>
</Tree>
```

Також підтримує **Notes** для кожного рівня через розширений формат.

---

## 8. Дані для Пасивного Дерева

### Офіційний репозиторій GGG (PoE1)
**URL:** https://github.com/grindinggear/skilltree-export

Структура `data.json`:
```json
{
  "nodes": {
    "-28194677": {
      "id": -28194677,
      "dn": "Block Recovery",
      "sd": ["8% increased Block Recovery"],
      "icon": "Art/2DArt/SkillIcons/passives/...",
      "ks": false,
      "not": false,
      "g": 1,
      "o": 1,
      "out": [-12345678]
    }
  },
  "groups": {
    "1": {
      "x": 1105.14,
      "y": -5295.31,
      "n": [-28194677, 769796679]
    }
  },
  "characterData": {
    "0": { "base_str": 23, "base_dex": 14, "base_int": 14 }
  }
}
```

### Community PoE2 Tree Data
**URL:** https://github.com/marcoaaguiar/poe2-tree

```json
{
  "N152": {
    "name": "Elemental Damage",
    "stats": [
      "10% increased Elemental Damage",
      "5% increased Cast Speed"
    ]
  }
}
```

### Passive Tree для відображення

**Для статичного відображення (MVP):**
```typescript
// lib/passive-tree.ts
import treeData from '../data/poe2-tree.json';

export function getNodeById(hash: number) {
  return treeData.nodes[hash.toString()];
}

export function getNodesForLevel(guide: Guide, level: number) {
  const checkpoint = guide.levels
    .filter(l => l.level <= level)
    .at(-1);
  return checkpoint?.passives ?? [];
}

export function comparePassives(
  characterHashes: number[],
  guideHashes: number[]
): { taken: number[], missing: number[], next: number[] } {
  const charSet = new Set(characterHashes);
  const taken = guideHashes.filter(h => charSet.has(h));
  const missing = guideHashes.filter(h => !charSet.has(h));
  return { taken, missing, next: missing.slice(0, 5) };
}
```

### Візуалізація дерева (D3.js)

```typescript
// Рендеринг нодів через SVG
// Колір: зелений = taken, жовтий = next (пріоритет), сірий = future
const colorMap = {
  taken: '#22c55e',
  next: '#eab308', 
  future: '#6b7280',
  keystone: '#f59e0b'
};
```

**Альтернатива:** https://github.com/poe-tool-dev/passive-skill-tree-json — має координати нодів для SVG рендерингу.

---

## 9. Дані для Гемів та Предметів

### Геми — джерела даних

**RePoE** (Python парсер PoE game files):
- https://github.com/brather1ng/RePoE
- Видає: `gems.json`, `gem_tooltips.json`, `stat_translations.json`
- Запуск: `python run_parser.py all`

**POEMCP** (готовий MCP сервер з даними):
- https://github.com/shalayiding/POEMCP
- Інструменти: `search_gem`, `get_gem_detail`, `search_item`, `get_item_detail`, `search_passive`
- Дані: poedb.tw + poewiki.net

**poe2-mcp** (PoE2-специфічні дані):
- https://github.com/HivemindOverlord/poe2-mcp
- 4,975+ PoE2 passive nodes, 335+ ascendancy nodes
- 14,269 item modifiers (2,252 prefixes, 2,037 suffixes, 8,930 implicits)

### Структура гему в гайді

```json
{
  "gem": {
    "id": "fireball",
    "name": "Fireball",
    "type": "active",
    "color": "red",
    "minLevel": 1
  },
  "supports": [
    { "id": "spell_echo", "name": "Spell Echo", "minLevel": 18 },
    { "id": "added_fire", "name": "Added Fire Damage", "minLevel": 8 }
  ],
  "slot": "BodyArmour",
  "priority": "critical"
}
```

### Ціни (poe.ninja API)

**Endpoint для Currency:**
```
GET https://poe.ninja/api/data/currencyoverview?league=Standard&type=Currency
```

**Endpoint для Items:**
```
GET https://poe.ninja/api/data/itemoverview?league=Standard&type=UniqueWeapon
```

Використовуй для показу "орієнтовна ціна апгрейду" в Budget рекомендаціях.  
**Кешуй на 15–30 хвилин** (дані не змінюються частіше).

### poedb.tw (неофіційне API)

Можна scrape або використовувати через POEMCP:
```
https://poe2db.tw/us/Fireball
https://poe2db.tw/us/items/weapons
```

---

## 10. Структура Бази Даних

### PostgreSQL схема (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  gggAccountName String?  @unique
  email         String?
  accessToken   String?   // encrypted
  refreshToken  String?   // encrypted
  createdAt     DateTime  @default(now())
  
  characters    Character[]
  savedBuilds   UserBuild[]
}

model Character {
  id          String    @id @default(cuid())
  userId      String
  name        String
  class       String
  ascendancy  String?
  level       Int
  realm       String    @default("poe2")
  
  // Snapshot з API (оновлюється при Refresh)
  passiveHashes Int[]
  equipment   Json      // raw items array
  gems        Json      // parsed gems
  
  lastSyncedAt DateTime
  createdAt    DateTime  @default(now())
  
  user        User      @relation(fields: [userId], references: [id])
  progress    BuildProgress[]
}

model Guide {
  id          String    @id @default(cuid())
  authorId    String?
  title       String
  class       String
  ascendancy  String?
  
  // Левелінг checkpoints (масив по рівнях)
  levelingPath Json     // LevelingCheckpoint[]
  
  tags        String[]  // ["ssf", "budget", "beginner"]
  isPublic    Boolean   @default(false)
  isVerified  Boolean   @default(false)
  
  viewCount   Int       @default(0)
  likes       Int       @default(0)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  buildFile   BuildFile?
  progress    BuildProgress[]
}

model BuildFile {
  id          String    @id @default(cuid())
  guideId     String    @unique
  content     String    // base64 encoded .build XML
  version     Int       @default(1)
  createdAt   DateTime  @default(now())
  
  guide       Guide     @relation(fields: [guideId], references: [id])
}

model BuildProgress {
  id            String    @id @default(cuid())
  characterId   String
  guideId       String
  
  // Кешований результат порівняння
  progressScore Float     // 0.0 - 1.0
  passivesScore Float
  gemsScore     Float
  gearScore     Float
  
  nextSteps     Json      // NextStep[] — рекомендації
  
  calculatedAt  DateTime  @default(now())
  
  character     Character @relation(fields: [characterId], references: [id])
  guide         Guide     @relation(fields: [guideId], references: [id])
}
```

### JSON типи

```typescript
// LevelingCheckpoint (зберігається в Guide.levelingPath)
interface LevelingCheckpoint {
  level: number;
  passives: number[];          // node hashes
  skills: SkillSetup[];
  gear: GearRecommendation[];
  notes?: string;
}

interface SkillSetup {
  gem: string;                 // gem id
  supports: string[];          // support gem ids
  slot: string;                // BodyArmour, Weapon, etc.
  priority: 'critical' | 'important' | 'optional';
}

interface GearRecommendation {
  slot: string;
  base?: string;               // "Vaal Regalia"
  keyMods: string[];           // ["+1 to Level of Socketed Gems"]
  budget: 'ssf' | 'low' | 'mid' | 'high';
  notes?: string;
}

// NextStep (зберігається в BuildProgress.nextSteps)
interface NextStep {
  type: 'passive' | 'gem' | 'gear';
  priority: 'critical' | 'important' | 'optional';
  description: string;
  details?: string;
}
```

---

## 11. Стратегія Наповнення Контентом

### Проблема
Без контенту — нема трафіку. Без трафіку — нема контенту.

### Рішення для Launch

**Тиждень 1–2: Seed контент**
- Зробити самому 5–10 базових leveling гайдів для топових класів:
  - Witch (Invoker) — Fireball
  - Monk — будь-який популярний
  - Ranger — популярний bow build
  - Warrior — tank/melee
  - Sorceress — caster
- Імпортувати з публічних джерел (Maxroll, poe-vault) з посиланнями на оригінал

**Тиждень 3+: Community upload**
- Форма завантаження гайду (+ PoB2 import)
- Мінімальна модерація (перевірка спаму)
- "Verified" badge для якісних гайдів

**Просування:**
- Discord PoE2 UA — найпряміший шлях
- Reddit r/pathofexile2 (з цінністю, не реклама)
- Telegram групи UA/RU PoE гравців
- Звернутися до 2–3 UA/RU стрімерів PoE2 з пропозицією partnerства

**Партнерство зі стрімерами:**
- Стрімер публікує гайди на нашій платформі
- Отримує "Verified Creator" badge
- Реферальне посилання для монетизації пізніше

---

## 12. Монетизація

### Фаза 1 (безкоштовно, ~перші 3 місяці)
- Весь базовий функціонал — безкоштовно
- Ціль: набір аудиторії

### Фаза 2 — Premium план
**~$5-8/місяць або $40/рік:**
- Без реклами
- Пріоритетний refresh персонажа (раз на 1 хв vs 5 хв)
- Розширена аналітика прогресу (графіки, порівняння)
- Необмежені збережені білди (free: 3)
- Ранній доступ до нових функцій

### Фаза 3 — Creator план
**~$15/місяць:**
- Все з Premium
- Аналітика гайдів (скільки людей використовує, прогрес-статистика)
- Власний профіль та domain (creator.poe2-tracker.com)
- Монетизація через tip/donation від гравців

### Інше
- Донати (Patreon / Buy Me a Coffee)
- Affiliate з trade сайтами (poe.trade, pathofexile.com/trade2)
- Потенційно: реклама (Google AdSense) — тільки якщо без premium

---

## 13. Roadmap По Тижнях

### Тиждень 0 (зараз)
- [ ] Надіслати лист на oauth@grindinggear.com — реєстрація OAuth app
- [ ] Зареєструвати домен (poe2guide.com / poe2tracker.io / poe2build.app)
- [ ] Налаштувати Supabase проект (PostgreSQL)
- [ ] Ініціалізувати Next.js проект

### Тиждень 1–2 — Фундамент
- [ ] Prisma схема + міграції
- [ ] GGG OAuth flow (NextAuth provider)
- [ ] Базовий UI (layout, навігація)
- [ ] Перші 5 гайдів (вручну, JSON)

### Тиждень 3–4 — .build Generator
- [ ] XML builder для .build формату
- [ ] Кнопка "Download .build"
- [ ] Preview пасивного дерева (SVG)
- [ ] Сторінка перегляду гайду

### Тиждень 5–6 — Character Import + Трекер MVP
- [ ] GGG Character API клієнт
- [ ] Збереження snapshot персонажа
- [ ] Базове порівняння пасивок
- [ ] Базовий трекер UI

### Тиждень 7–8 — Трекер повний
- [ ] Порівняння гемів
- [ ] Gear tracker
- [ ] "Next Steps" рекомендації
- [ ] Rate limiting + кешування

### Тиждень 9–10 — Community
- [ ] Upload форма для гайдів
- [ ] Базова модерація
- [ ] Рейтинг/лайки

### Тиждень 11–12 — Launch
- [ ] Публічний launch
- [ ] Просування в Discord/Reddit/Telegram
- [ ] Моніторинг (Sentry + analytics)
- [ ] Budget recommendations (poe.ninja ціни)

---

## 14. Ризики та Вирішення

| Ризик | Ймовірність | Вплив | Вирішення |
|---|---|---|---|
| PoE2 API не підтримується офіційно | Висока | Критичний | Fallback: PoB2 import code + ручний ввід |
| GGG заблокує OAuth app | Низька | Критичний | Дотримуватись ToS, не зловживати rate limits |
| Патч ламає passive tree hashes | Висока | Середній | Авто-оновлення з grindinggear/skilltree-export |
| Мало контенту на старті | Висока | Середній | Seed контент самостійно + партнери |
| Rate limits API | Висока | Низький | Redis кеш + exponential backoff |
| Конкурент копіює фічу | Середня | Низький | Рухатись швидко, фокус на UA/RU спільноті |

### Fallback: якщо PoE2 API недоступний
Замість OAuth character import → **PoB2 код import**:
1. Гравець копіює код з Path of Building 2
2. Ми парсимо XML (base64 decode → inflate → XML parse)
3. Отримуємо ті самі дані: пасивки, геми, предмети

```typescript
import { inflateSync } from 'zlib';

function parsePoBCode(code: string): BuildData {
  const base64 = code.replace(/-/g, '+').replace(/_/g, '/');
  const compressed = Buffer.from(base64, 'base64');
  const xml = inflateSync(compressed).toString('utf-8');
  // parse XML...
}
```

---

## 15. Список Ресурсів

### Офіційні
- GGG Developer Docs: https://www.pathofexile.com/developer/docs
- GGG OAuth реєстрація: oauth@grindinggear.com
- PoE2 Forum Developer Thread: https://www.pathofexile.com/forum/view-thread/3608197
- Skill Tree Export (офіційний): https://github.com/grindinggear/skilltree-export

### Дані та Парсери
- RePoE (gems, items): https://github.com/brather1ng/RePoE
- PoE2 Tree Community: https://github.com/marcoaaguiar/poe2-tree
- PoE2 MCP (4975 нодів, 14k модифікаторів): https://github.com/HivemindOverlord/poe2-mcp
- POEMCP (загальний): https://github.com/shalayiding/POEMCP
- Passive tree з координатами: https://github.com/poe-tool-dev/passive-skill-tree-json
- poe.dat parser: https://github.com/me1ting/poedat

### Конкуренти (для аналізу)
- Maxroll PoE2: https://maxroll.gg/poe2
- Path of Building 2: https://github.com/PathOfBuildingCommunity/PathOfBuilding-PoE2
- poe2.dev: https://www.poe2.dev/
- poe.ninja (ціни): https://poe.ninja
- poedb.tw (item data): https://poe2db.tw/us/

### npm пакети
- `poe-api-ts` — TypeScript обгортка для GGG API
- `@klayver/poe-api-wrappers` — typed API wrapper

### Інфраструктура
- Supabase (PostgreSQL): https://supabase.com
- Railway (deploy): https://railway.app
- Cloudflare R2 (storage): https://cloudflare.com/r2
- Upstash Redis (serverless): https://upstash.com

---

## Додаток A: Приклад повного Leveling Checkpoint JSON

```json
{
  "guideId": "invoker-fireball-guide",
  "title": "Fireball Invoker — Leveling Guide",
  "class": "Witch",
  "ascendancy": "Invoker",
  "levels": [
    {
      "level": 12,
      "notes": "Завершуємо Act 1. Берємо Flame Wall як другу скіл.",
      "passives": [100001, 100002, 100003, 100004, 100005],
      "skills": [
        {
          "gem": "fireball",
          "supports": ["added_fire_damage"],
          "slot": "BodyArmour",
          "priority": "critical"
        },
        {
          "gem": "flame_wall",
          "supports": [],
          "slot": "Helm",
          "priority": "important"
        }
      ],
      "gear": [
        {
          "slot": "Weapon",
          "base": "Driftwood Wand",
          "keyMods": ["+1 to Level of Socketed Spell Gems"],
          "budget": "ssf",
          "notes": "Магіч або рідкісний — +1 gems пріоритет"
        }
      ]
    },
    {
      "level": 28,
      "notes": "Act 2 boss done. Додаємо Spell Echo. Час шукати хорошу зброю.",
      "passives": [100001, 100002, 100003, 100004, 100005, 200001, 200002, 200003],
      "skills": [
        {
          "gem": "fireball",
          "supports": ["spell_echo", "added_fire_damage", "controlled_destruction"],
          "slot": "BodyArmour",
          "priority": "critical"
        }
      ],
      "gear": [
        {
          "slot": "Weapon",
          "base": "Imbued Wand",
          "keyMods": ["+1 to Level of Socketed Spell Gems", "% increased Spell Damage"],
          "budget": "low",
          "notes": "Ключово: +1 gems. Все інше вторинне."
        },
        {
          "slot": "BodyArmour",
          "base": "Simple Robe",
          "keyMods": ["+life", "+energy shield"],
          "budget": "ssf"
        }
      ]
    }
  ]
}
```

---

## Додаток B: Перший API Запит (тест)

Перевір чи працює API для PoE2 перед написанням коду:

```bash
# 1. Отримай access token через OAuth flow (або використай тестовий з GGG dev console)

# 2. Запит списку персонажів
curl -X GET "https://api.pathofexile.com/character?realm=poe2" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "User-Agent: OAuth your-app-id/1.0 (contact: your@email.com)"

# 3. Запит пасивок персонажа
curl -X GET "https://api.pathofexile.com/character/CHARACTER_NAME/passives?realm=poe2" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "User-Agent: OAuth your-app-id/1.0 (contact: your@email.com)"
```

---

*Документ оновлено: 13 травня 2026*  
*Наступне оновлення: після отримання OAuth доступу від GGG*
