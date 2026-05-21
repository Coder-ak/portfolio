import type { ContactLink, OutputLine, Profile, Project, Skill } from './types';

export const profile: Profile = {
	handle: 'coder',
	host: 'portfolio',
	titleBar: 'coder@portfolio ~',
	role: {
		en: 'Senior Software Engineer',
		ua: 'Senior Software Engineer',
	},
	experience: {
		en: '20+ yrs exp.',
		ua: '20+ років досвіду',
	},
	location: {
		en: 'Odesa, UA',
		ua: 'Одеса, Україна',
	},
};

export const startupCommands = ['whoami', 'skills --list', 'projects --public', 'contact'] as const;

export const helpEntries = [
	{ cmd: 'whoami', desc: { en: 'profile snapshot', ua: 'короткий профіль' } },
	{ cmd: 'skills --list', desc: { en: 'core skills with experience bars', ua: 'ключові навички зі шкалами досвіду' } },
	{ cmd: 'projects', desc: { en: 'project command groups', ua: 'групи команд проєктів' } },
	{ cmd: 'projects --public', desc: { en: 'public work and drill-down commands', ua: 'публічні роботи та команди для деталей' } },
	{ cmd: 'projects --private', desc: { en: 'private work summary', ua: 'коротко про приватні роботи' } },
	{ cmd: 'contact', desc: { en: 'social and contact links', ua: 'соціальні та контактні посилання' } },
	{ cmd: 'clear', desc: { en: 'clear terminal output', ua: 'очистити вивід термінала' } },
];

export const skills: Skill[] = [
	{
		id: 'angular',
		name: 'Angular',
		fill: 0.95,
		color: 'green',
		note: {
			en: 'primary stack · Angular · AngularJS → Angular migrations',
			ua: 'основний стек · Angular · міграції AngularJS → Angular',
		},
		since: 2017,
		details: [
			{ t: 'text', color: 'green', v: 'Angular' },
			{ t: 'gap' },
			{ t: 'text', color: 'secondary', v: { en: '  primary stack since 2017', ua: '  основний стек з 2017 року' } },
			{ t: 'text', color: 'secondary', v: { en: '  production Angular work across large frontends and dashboards', ua: '  production Angular розробка для великих фронтендів і дашбордів' } },
			{ t: 'text', color: 'secondary', v: { en: '  AngularJS → Angular migrations, component architecture, forms, routing', ua: '  міграції AngularJS → Angular, компонентна архітектура, форми, роутинг' } },
			{ t: 'gap' },
			{ t: 'text', color: 'muted', v: { en: '  note: primary stack · Angular · AngularJS → Angular migrations', ua: '  примітка: основний стек · Angular · міграції AngularJS → Angular' } },
		],
	},
	{
		id: 'typescript',
		name: 'TypeScript',
		fill: 0.9,
		color: 'green',
		note: {
			en: 'daily driver',
			ua: 'основна робоча мова',
		},
		since: 2017,
		details: [
			{ t: 'text', color: 'green', v: 'TypeScript' },
			{ t: 'gap' },
			{ t: 'text', color: 'secondary', v: { en: '  daily driver since 2017', ua: '  основна робоча мова з 2017 року' } },
			{ t: 'text', color: 'secondary', v: { en: '  used across Angular apps, Node.js tooling, dashboards, and bots', ua: '  використовую в Angular застосунках, Node.js інструментах, дашбордах і ботах' } },
			{ t: 'text', color: 'secondary', v: { en: '  strong emphasis on strict typing, maintainability, and refactoring safety', ua: '  сильний акцент на strict typing, підтримуваності та безпечному рефакторингу' } },
			{ t: 'gap' },
			{ t: 'text', color: 'muted', v: { en: '  related from plan: CSS / LESS, D3.js, Highcharts, Keylines', ua: '  пов’язано з планом: CSS / LESS, D3.js, Highcharts, Keylines' } },
		],
	},
	{
		id: 'nodejs',
		name: 'Node.js',
		fill: 0.8,
		color: 'blue',
		note: {
			en: 'APIs, bots, tooling',
			ua: 'API, боти, інструменти',
		},
		since: 2018,
		details: [
			{ t: 'text', color: 'blue', v: 'Node.js' },
			{ t: 'gap' },
			{ t: 'text', color: 'secondary', v: { en: '  APIs, bots, tooling since 2018', ua: '  API, боти та інструменти з 2018 року' } },
			{ t: 'text', color: 'secondary', v: { en: '  backend work for stats, outage tracking, automation, and Telegram integrations', ua: '  бекенд для статистики, трекінгу відключень, автоматизації та Telegram інтеграцій' } },
			{ t: 'text', color: 'secondary', v: { en: '  comfortable building practical services that support frontend-heavy products', ua: '  комфортно будую практичні сервіси, які підтримують frontend-heavy продукти' } },
			{ t: 'gap' },
			{ t: 'text', color: 'muted', v: { en: '  note: APIs, bots, tooling', ua: '  примітка: API, боти, інструменти' } },
		],
	},
	{
		id: 'react',
		name: 'React',
		fill: 0.65,
		color: 'blue',
		note: {
			en: 'active · AI-assisted development',
			ua: 'активно · AI-assisted розробка',
		},
		since: 2023,
		details: [
			{ t: 'text', color: 'blue', v: 'React' },
			{ t: 'gap' },
			{ t: 'text', color: 'secondary', v: { en: '  active since 2023', ua: '  активно використовую з 2023 року' } },
			{ t: 'text', color: 'secondary', v: { en: '  used for newer work and AI-assisted delivery workflows', ua: '  використовую для новіших проєктів і AI-assisted delivery процесів' } },
			{ t: 'text', color: 'secondary', v: { en: '  adjacent experience includes Preact for the stats dashboard', ua: '  суміжний досвід включає Preact для статистичного дашборда' } },
			{ t: 'gap' },
			{ t: 'text', color: 'muted', v: { en: '  note: active · AI-assisted development', ua: '  примітка: активно · AI-assisted розробка' } },
		],
	},
	{
		id: 'linux-do',
		name: 'Linux / DO',
		fill: 0.85,
		color: 'yellow',
		note: {
			en: 'Debian desktop & servers · DigitalOcean / Hetzner / Oracle Cloud',
			ua: 'Debian desktop і сервери · DigitalOcean / Hetzner / Oracle Cloud',
		},
		since: 2000,
		details: [
			{ t: 'text', color: 'yellow', v: 'Linux / DO' },
			{ t: 'gap' },
			{ t: 'text', color: 'secondary', v: { en: '  VPS / cloud hosting work shown here since 2012', ua: '  VPS / cloud hosting досвід, показаний тут, з 2012 року' } },
			{ t: 'text', color: 'secondary', v: { en: '  Debian desktop and server experience goes back to the early 2000s', ua: '  досвід з Debian на десктопах і серверах тягнеться з початку 2000-х' } },
			{ t: 'text', color: 'secondary', v: { en: '  VPS work across DigitalOcean, Hetzner, and Oracle Cloud', ua: '  VPS робота з DigitalOcean, Hetzner та Oracle Cloud' } },
			{ t: 'text', color: 'secondary', v: { en: '  comfortable with deployment, hosting, and self-managed production environments', ua: '  впевнено працюю з деплоєм, хостингом і self-managed production середовищами' } },
			{ t: 'gap' },
			{ t: 'text', color: 'muted', v: { en: '  related from plan: Cloud VPS, WordPress, PrestaShop client work', ua: '  пов’язано з планом: Cloud VPS, WordPress, PrestaShop клієнтські проєкти' } },
		],
	},
];

export const projects: Project[] = [
	{
		id: 'svitlo-e-bot',
		commandLabel: 'svitlo-e-bot',
		displayName: {
			en: '⚡ Svitlo-E Bot',
			ua: '⚡ Svitlo-E Бот',
		},
		tagline: {
			en: 'Telegram bot · Outage alerts · 3K TG subscribers',
			ua: 'Telegram бот · сповіщення про відключення · 3K підписників у TG',
		},
		details: [
			{ t: 'text', color: 'cyan', v: { en: '⚡ Svitlo-E Bot — Telegram outage assistant', ua: '⚡ Svitlo-E Бот — Telegram помічник по відключеннях' } },
			{ t: 'gap' },
			{ t: 'text', color: 'secondary', v: { en: '  stack: Node.js · Express · node-telegram-bot-api · MongoDB', ua: '  стек: Node.js · Express · node-telegram-bot-api · MongoDB' } },
			{ t: 'text', color: 'secondary', v: { en: '  hosting: self-hosted VPS — Debian', ua: '  хостинг: self-hosted VPS — Debian' } },
			{ t: 'repo', color: 'secondary', label: { en: '  repo:', ua: '  репозиторій:' }, text: 'github.com/Coder-ak/svitlo-e-bot' },
			{ t: 'gap' },
			{ t: 'text', color: 'muted', v: { en: '  features:', ua: '  можливості:' } },
			{ t: 'text', color: 'primary', v: { en: '  → /schedule and subscription flow for outage updates', ua: '  → /schedule і сценарій підписки на оновлення відключень' } },
			{ t: 'text', color: 'primary', v: { en: '  → scheduled broadcasts and direct notifications to subscribers', ua: '  → заплановані розсилки та прямі сповіщення підписникам' } },
			{ t: 'text', color: 'primary', v: { en: '  → generated schedule images with sunrise / sunset data', ua: '  → генерація зображень графіків із даними про схід / захід сонця' } },
			{ t: 'text', color: 'primary', v: { en: '  → local AI model for general Q&A in the bot', ua: '  → локальна AI модель для довільних запитань у боті' } },
			{ t: 'repo', color: 'secondary', label: { en: '  repo:', ua: '  репозиторій:' }, text: 'github.com/Coder-ak/info-bot' },
			{ t: 'gap' },
			{ t: 'text', color: 'muted', v: { en: '  bot is active in popular Telegram chats in the district', ua: '  бот активний у популярних Telegram чатах району' } },
			{ t: 'text', color: 'muted', v: { en: '  also exposes APIs and schedule processing used by the public website', ua: '  також віддає API і обробку графіків, які використовує публічний сайт' } },
		],
	},
	{
		id: 'svitlo-e-site',
		commandLabel: 'svitlo-e-site',
		displayName: {
			en: '⚡ Svitlo-E Site',
			ua: '⚡ Svitlo-E Сайт',
		},
		tagline: {
			en: 'Public outage status site · Preact frontend',
			ua: 'Публічний сайт статусу відключень · Preact фронтенд',
		},
		details: [
			{ t: 'text', color: 'cyan', v: { en: '⚡ Svitlo-E Site — public web frontend', ua: '⚡ Svitlo-E Сайт — публічний вебфронтенд' } },
			{ t: 'gap' },
			{ t: 'text', color: 'secondary', v: { en: '  stack: Preact status UI · consumes API from svitlo-e-bot backend', ua: '  стек: Preact status UI · споживає API від бекенду svitlo-e-bot' } },
			{ t: 'text', color: 'secondary', v: { en: '  hosting: self-hosted VPS — Debian', ua: '  хостинг: self-hosted VPS — Debian' } },
			{ t: 'repo', color: 'secondary', label: { en: '  repo:', ua: '  репозиторій:' }, text: 'github.com/Coder-ak/svitlo-e-site' },
			{ t: 'gap' },
			{ t: 'text', color: 'muted', v: { en: '  website-related backend from svitlo-e-bot:', ua: '  сайтова частина бекенду з svitlo-e-bot:' } },
			{ t: 'text', color: 'primary', v: { en: '  → GET /api/v1/light-bot for current state, recent points, and day ranges', ua: '  → GET /api/v1/light-bot для поточного стану, недавніх точок і денних діапазонів' } },
			{ t: 'text', color: 'primary', v: { en: '  → GET /api/v1/light-bot/stats/access and /stats/total for chart aggregation', ua: '  → GET /api/v1/light-bot/stats/access і /stats/total для агрегації графіків' } },
			{ t: 'text', color: 'primary', v: { en: '  → POST /api/v1/light-bot with JWT auth for protected light updates', ua: '  → POST /api/v1/light-bot з JWT авторизацією для захищених оновлень світла' } },
			{ t: 'text', color: 'primary', v: { en: '  → CORS locked to the public host plus request rate limiting on API routes', ua: '  → CORS обмежений публічним хостом плюс rate limiting на API маршрутах' } },
			{ t: 'gap' },
			{ t: 'text', color: 'muted', v: { en: '  data pipeline:', ua: '  пайплайн даних:' } },
			{ t: 'text', color: 'secondary', v: { en: '  DTEK schedule is fetched from the source site through a Puppeteer Docker service', ua: '  графік ДТЕК тягнеться із сайту-джерела через Puppeteer Docker сервіс' } },
			{ t: 'text', color: 'secondary', v: { en: '  backend parses, caches, and transforms outage intervals for the website and related tooling', ua: '  бекенд парсить, кешує і трансформує інтервали відключень для сайту та супутніх інструментів' } },
			{ t: 'text', color: 'secondary', v: { en: '  the stats dashboard and site status pages are part of the same Svitlo-E product surface', ua: '  статистичний дашборд і статусні сторінки сайту є частиною того самого продукту Svitlo-E' } },
			{ t: 'gap' },
			{ t: 'repo', color: 'muted', label: { en: '  related backend repo:', ua: '  пов’язаний бекенд репозиторій:' }, text: 'github.com/Coder-ak/svitlo-e-bot' },
		],
	},
	{
		id: 'info-bot',
		commandLabel: 'info-bot',
		displayName: {
			en: '🤖 Info-Bot API',
			ua: '🤖 Info-Bot API',
		},
		tagline: {
			en: 'AI Q&A service · Integrated into svitlo-e-bot',
			ua: 'AI сервіс питань-відповідей · інтегрований у svitlo-e-bot',
		},
		details: [
			{ t: 'text', color: 'cyan', v: { en: '🤖 Info-Bot API — question answering service', ua: '🤖 Info-Bot API — сервіс відповідей на запитання' } },
			{ t: 'gap' },
			{ t: 'text', color: 'secondary', v: { en: '  role: local API that answers free-form user questions from Svitlo-E bot chats', ua: '  роль: локальний API, що відповідає на довільні запитання користувачів із чатів Svitlo-E бота' } },
			{ t: 'text', color: 'secondary', v: { en: '  stack: Node.js · Express · document classification / retrieval pipeline', ua: '  стек: Node.js · Express · pipeline класифікації документів / retrieval' } },
			{ t: 'repo', color: 'secondary', label: { en: '  repo:', ua: '  репозиторій:' }, text: 'github.com/Coder-ak/info-bot' },
			{ t: 'gap' },
			{ t: 'text', color: 'muted', v: { en: '  integration model:', ua: '  модель інтеграції:' } },
			{ t: 'text', color: 'primary', v: { en: '  → svitlo-e-bot forwards selected user questions to the API over HTTP', ua: '  → svitlo-e-bot пересилає вибрані запитання користувача в API по HTTP' } },
			{ t: 'text', color: 'primary', v: { en: '  → service classifies the query and picks the most relevant local knowledge', ua: '  → сервіс класифікує запит і підбирає найбільш релевантні локальні знання' } },
			{ t: 'text', color: 'primary', v: { en: '  → response is returned in bot-friendly text instead of raw model output', ua: '  → відповідь повертається у форматі, зручному для бота, а не як сирий вивід моделі' } },
			{ t: 'gap' },
			{ t: 'text', color: 'muted', v: { en: '  why it exists:', ua: '  навіщо це існує:' } },
			{ t: 'text', color: 'secondary', v: { en: '  keeps the Telegram bot focused on delivery while AI / retrieval logic lives behind a clean API boundary', ua: '  дозволяє Telegram боту зосередитись на доставці, поки AI / retrieval логіка живе за чистою API межею' } },
			{ t: 'text', color: 'secondary', v: { en: '  makes it easier to tune prompts, sources, and failure handling without rewriting the main outage bot', ua: '  спрощує налаштування промптів, джерел і обробки збоїв без переписування основного бота відключень' } },
			{ t: 'gap' },
			{ t: 'text', color: 'muted', v: { en: "  style: pragmatic, local-first, built for useful answers rather than chat-for-chat's-sake", ua: '  стиль: прагматичний, local-first, створений для корисних відповідей, а не просто чату заради чату' } },
		],
	},
	{
		id: 'imdb-rating',
		commandLabel: 'imdb-rating',
		displayName: {
			en: '🎬 IMDb Rating API',
			ua: '🎬 IMDb Rating API',
		},
		tagline: {
			en: 'TypeScript API · Daily updates · SQLite storage',
			ua: 'TypeScript API · щоденні оновлення · SQLite сховище',
		},
		details: [
			{ t: 'text', color: 'cyan', v: '🎬 IMDb Rating API' },
			{ t: 'gap' },
			{ t: 'text', color: 'secondary', v: { en: '  role: compact service for looking up IMDb ratings through a single API endpoint', ua: '  роль: компактний сервіс для отримання IMDb рейтингів через один API endpoint' } },
			{ t: 'text', color: 'secondary', v: { en: '  stack: TypeScript · Node.js · SQLite · cron-driven refresh job', ua: '  стек: TypeScript · Node.js · SQLite · cron-задача для оновлень' } },
			{ t: 'repo', color: 'secondary', label: { en: '  repo:', ua: '  репозиторій:' }, text: 'github.com/Coder-ak/imdb-rating' },
			{ t: 'gap' },
			{ t: 'text', color: 'muted', v: { en: '  features:', ua: '  можливості:' } },
			{ t: 'text', color: 'primary', v: { en: '  → GET /api/v1/rating/:id for direct rating lookup by IMDb id', ua: '  → GET /api/v1/rating/:id для прямого lookup рейтингу за IMDb id' } },
			{ t: 'text', color: 'primary', v: { en: '  → automatic daily data updates to keep the local rating store fresh', ua: '  → автоматичні щоденні оновлення даних, щоб локальне сховище рейтингів було актуальним' } },
			{ t: 'text', color: 'primary', v: { en: '  → rate limiting for API protection and predictable public access', ua: '  → rate limiting для захисту API і передбачуваного публічного доступу' } },
			{ t: 'text', color: 'primary', v: { en: '  → manual import path for forced refreshes when needed', ua: '  → ручний шлях імпорту для примусових оновлень за потреби' } },
			{ t: 'gap' },
			{ t: 'text', color: 'muted', v: { en: '  built as a focused utility API: one job, small surface area, easy to deploy', ua: '  побудований як вузький utility API: одна задача, маленька поверхня, простий деплой' } },
		],
	},
	{
		id: 'stats-dashboard',
		commandLabel: 'stats-dashboard',
		displayName: {
			en: 'Stats dashboard',
			ua: 'Статистичний дашборд',
		},
		tagline: {
			en: 'React frontend · Charts · NodeJS backend',
			ua: 'React фронтенд · графіки · NodeJS бекенд',
		},
		details: [
			{ t: 'text', color: 'cyan', v: { en: 'stats dashboard — analytics module', ua: 'статистичний дашборд — аналітичний модуль' } },
			{ t: 'gap' },
			{ t: 'repo', color: 'secondary', label: { en: '  repo:', ua: '  репозиторій:' }, text: 'github.com/Coder-ak/svitlo-e-stats' },
			{ t: 'text', color: 'secondary', v: { en: '  historical power statistics dashboard with custom charting', ua: '  дашборд історичної статистики електропостачання з кастомним charting' } },
			{ t: 'text', color: 'secondary', v: { en: '  built in React with charts and a Node.js backend for aggregation', ua: '  побудований на React з графіками та Node.js бекендом для агрегації' } },
			{ t: 'text', color: 'secondary', v: { en: '  part of the broader outage-tracking product around local electricity data', ua: '  частина ширшого продукту для трекінгу відключень на локальних даних по електриці' } },
			{ t: 'text', color: 'muted', v: { en: '  related skills: React, dataviz, dashboards, backend APIs', ua: '  пов’язані навички: React, dataviz, dashboards, backend API' } },
		],
	},
];

export const contacts: ContactLink[] = [
	{ label: { en: 'github', ua: 'github' }, value: { en: 'github', ua: 'github' }, href: 'https://github.com/Coder-ak/' },
	{ label: { en: 'linkedin', ua: 'linkedin' }, value: { en: 'linkedin', ua: 'linkedin' } },
	{ label: { en: 'email', ua: 'email' }, value: { en: 'email', ua: 'email' } },
	{ label: { en: 'pigeon mail', ua: 'голубина пошта' }, value: { en: 'pigeon mail', ua: 'голубина пошта' } },
];
