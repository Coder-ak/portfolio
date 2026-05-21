import { contacts, helpEntries, profile, projects, skills, startupCommands } from '../../data/portfolio';
import { formatYearsSince } from '../../data/formatters';
import { DEFAULT_LOCALE, resolveText } from '../../data/i18n';
import type { Locale, OutputLine } from '../../data/types';
import { renderLines } from './renderer';
import styles from './terminal.module.less';

type CommandFn = () => OutputLine[];
type SessionEntry =
	| { kind: 'prompt'; label: string; command: string }
	| { kind: 'output'; lines: OutputLine[] };

const skillDetailCommands = Object.fromEntries(
	skills.map((skill) => [
		skill.id,
		() =>
			skill.details ?? [
				{ t: 'text', color: skill.color, v: skill.name },
				{ t: 'gap' },
				{ t: 'text', color: 'secondary', v: { en: `  years shown: ${formatYearsSince(skill.since)}`, ua: `  показано років: ${formatYearsSince(skill.since)}` } },
				...(skill.note ? [{ t: 'text', color: 'muted', v: { en: `  note: ${resolveText(skill.note, 'en')}`, ua: `  примітка: ${resolveText(skill.note, 'ua')}` } } as const] : []),
				{ t: 'text', color: 'muted', v: { en: `  since: ${skill.since}`, ua: `  з: ${skill.since}` } },
			],
	]),
) satisfies Record<string, CommandFn>;

const projectDetailCommands = Object.fromEntries(
	projects.map((project) => [project.id, () => [...project.details]]),
) satisfies Record<string, CommandFn>;

const commands: Record<string, CommandFn> = {
	help: () => helpEntries.map((entry) => ({ t: 'entry', cmd: entry.cmd, desc: entry.desc }) as const),
	whoami: () => [
		{
			t: 'text',
			color: 'primary',
			v: {
				en: `${resolveText(profile.role, 'en')} · ${resolveText(profile.experience, 'en')} · ${resolveText(profile.location, 'en')}`,
				ua: `${resolveText(profile.role, 'ua')} · ${resolveText(profile.experience, 'ua')} · ${resolveText(profile.location, 'ua')}`,
			},
		},
	],
	projects: () => [
		{ t: 'entry', cmd: 'projects --public', desc: { en: 'public case studies and drill-down commands', ua: 'публічні кейси та команди для деталей' } },
		{ t: 'entry', cmd: 'projects --private', desc: { en: 'private / NDA work summary', ua: 'приватні / NDA проєкти коротко' } },
	],
	'skills --list': () => skills.map((skill) => ({ t: 'skill', skill }) as const),
	'projects --public': () => projects.map((project) => ({ t: 'project', project }) as const),
	'projects --private': () => [
		{ t: 'text', color: 'yellow', v: { en: 'private projects', ua: 'приватні проєкти' } },
		{ t: 'gap' },
		{ t: 'text', color: 'muted', v: { en: '  multiple commercial projects are under NDA', ua: '  кілька комерційних проєктів знаходяться під NDA' } },
		{ t: 'text', color: 'muted', v: { en: '  can discuss architecture, responsibility, and outcomes in a real conversation', ua: '  можу обговорити архітектуру, відповідальність і результати в реальній розмові' } },
	],
	ls: () => [
		{ t: 'text', color: 'blue', v: 'projects  skills  contact  README.md  deploy.log  secrets.txt' },
		{ t: 'text', color: 'muted', v: { en: 'secrets.txt is a lie', ua: 'secrets.txt бреше' } },
	],
	pwd: () => [{ t: 'text', color: 'secondary', v: '/home/coder/portfolio' }],
	contact: () => [{ t: 'contacts', contacts }],
	...skillDetailCommands,
	...projectDetailCommands,
};

const allCommands = Object.keys(commands).sort();
const promptLabel = `${profile.handle}@${profile.host}:~$`;
const sudoPromptLabel = `[sudo] password for ${profile.handle}:`;
const suPromptLabel = 'Password:';
const defaultPlaceholder = 'type help';
const localeStorageKey = 'portfolio-locale';

let history: string[] = [];
let historyIndex = -1;
let isBusy = false;
let pendingSudoCommand: string | null = null;
let pendingSuUser: string | null = null;
let currentLocale: Locale = DEFAULT_LOCALE;
let sessionEntries: SessionEntry[] = [];

function getOutput(): HTMLElement {
	return document.getElementById('terminal-output') as HTMLElement;
}

function getScrollContainer(): HTMLElement {
	return document.getElementById('terminal-scroll') as HTMLElement;
}

function getInput(): HTMLInputElement {
	return document.getElementById('terminal-input') as HTMLInputElement;
}

function getPromptLabel(): HTMLElement {
	return document.getElementById('terminal-prompt-label') as HTMLElement;
}

function getInputRow(): HTMLElement {
	return document.getElementById('terminal-input-row') as HTMLElement;
}

function getLocaleToggle(): HTMLButtonElement | null {
	return document.getElementById('locale-toggle') as HTMLButtonElement | null;
}

function getLocaleRoot(): HTMLElement | null {
	return document.getElementById('locale-toggle-root');
}

function renderPromptEntry(entry: Extract<SessionEntry, { kind: 'prompt' }>): string {
	return [
		`<div class="${styles.outLine} ${styles.promptLine}">`,
		`<span class="${styles.promptLabelText}">${entry.label}</span>`,
		`<span class="${styles.promptCommand}">${entry.command}</span>`,
		'</div>',
	].join('');
}

function renderSession(): void {
	const output = getOutput();
	output.innerHTML = sessionEntries
		.map((entry) => (entry.kind === 'prompt' ? renderPromptEntry(entry) : `<div class="${styles.cmdOutput}">${renderLines(entry.lines, currentLocale)}</div>`))
		.join('');
}

function syncLocaleUI(): void {
	document.documentElement.lang = currentLocale === 'ua' ? 'uk' : 'en';
	const toggle = getLocaleToggle();
	const root = getLocaleRoot();

	if (toggle) {
		toggle.setAttribute('aria-pressed', String(currentLocale === 'ua'));
		toggle.setAttribute('aria-label', currentLocale === 'ua' ? 'Switch language to English' : 'Перемкнути мову на українську');
	}

	if (root) {
		root.dataset.locale = currentLocale;
	}
}

function setLocale(locale: Locale): void {
	currentLocale = locale;
	window.localStorage.setItem(localeStorageKey, locale);
	syncLocaleUI();
	renderSession();
	scrollToBottom();
}

function setInteractivePromptVisible(isVisible: boolean): void {
	getInputRow().classList.toggle(styles.terminalInputRowHidden, !isVisible);
}

function setActivePrompt(options?: { isSudo?: boolean; isSu?: boolean }): void {
	const input = getInput();
	const prompt = getPromptLabel();
	const isSudo = options?.isSudo ?? false;
	const isSu = options?.isSu ?? false;

	prompt.textContent = isSudo ? sudoPromptLabel : isSu ? suPromptLabel : promptLabel;
	input.type = isSudo || isSu ? 'password' : 'text';
	input.placeholder = isSudo || isSu ? '' : defaultPlaceholder;
}

function scrollToBottom(): void {
	const container = getScrollContainer();
	container.scrollTop = container.scrollHeight;
}

function appendOutput(lines: OutputLine[]): void {
	sessionEntries.push({ kind: 'output', lines });
	renderSession();
	scrollToBottom();
}

function appendPromptLine(command: string, label = promptLabel): void {
	sessionEntries.push({ kind: 'prompt', label, command });
	renderSession();
	scrollToBottom();
}

function appendTemporaryPromptLine(): HTMLElement {
	const output = getOutput();
	const line = document.createElement('div');
	line.className = `${styles.outLine} ${styles.promptLine}`;
	line.innerHTML = [
		`<span class="${styles.promptLabelText}">${promptLabel}</span>`,
		`<span class="${styles.promptCommand}"></span>`,
	].join('');
	output.append(line);
	scrollToBottom();
	return line;
}

function normalizeCommand(value: string): string {
	return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function storeHistory(command: string): void {
	if (!command) {
		return;
	}

	if (history.at(-1) !== command) {
		history.push(command);
	}

	if (history.length > 50) {
		history = history.slice(-50);
	}

	historyIndex = -1;
}

function executeCommand(rawCommand: string, options: { addToHistory?: boolean } = {}): void {
	const command = normalizeCommand(rawCommand);
	if (!command) {
		return;
	}

	if (options.addToHistory) {
		storeHistory(command);
	}

	if (command === 'clear') {
		sessionEntries = [];
		renderSession();
		return;
	}

	if (command.startsWith('sudo ')) {
		pendingSudoCommand = command.slice(5).trim() || '';
		setActivePrompt({ isSudo: true });
		return;
	}

	if (command.startsWith('su ')) {
		pendingSuUser = command.slice(3).trim() || 'root';
		setActivePrompt({ isSu: true });
		return;
	}

	if (command === 'cd' || command.startsWith('cd ')) {
		const target = command.slice(2).trim() || '~';
		appendOutput([
			{ t: 'text', color: 'yellow', v: `cd: ${target}` },
			{ t: 'text', color: 'muted', v: { en: '  nice try. this terminal is immutable by design.', ua: '  гарна спроба. цей термінал навмисно незмінний.' } },
		]);
		return;
	}

	if (command === 'rm' || command.startsWith('rm ')) {
		const target = command.slice(2).trim();
		appendOutput([
			{ t: 'text', color: 'red', v: `rm: ${target}` },
			{ t: 'text', color: 'muted', v: { en: '  cannot delete: permissions not granted. try with sudo.', ua: '  не можу видалити: прав недостатньо. спробуй через sudo.' } },
		]);
		return;
	}

	const fn = commands[command];
	if (fn) {
		appendOutput(fn());
		return;
	}

	appendOutput([
		{
			t: 'raw',
			html: [
				`<div class="${styles.outLine} ${styles.outRed}">`,
				`command not found: ${command}   `,
				`<span class="${styles.outLink}" data-cmd="help" tabindex="0" role="button">try help</span>`,
				'</div>',
			].join(''),
		},
	]);
}

function handleEnter(input: HTMLInputElement): void {
	const value = input.value;
	const command = value.trim();
	if (!command && !pendingSudoCommand && !pendingSuUser) {
		return;
	}

	input.value = '';

	if (pendingSudoCommand) {
		appendPromptLine('', sudoPromptLabel);
		appendOutput([
			{ t: 'text', color: 'red', v: { en: 'Sorry, try again.', ua: 'Вибач, спробуй ще раз.' } },
			{ t: 'text', color: 'muted', v: { en: 'sudo: 1 incorrect password attempt', ua: 'sudo: 1 невдала спроба пароля' } },
			{ t: 'text', color: 'muted', v: { en: 'This incident will be reported.', ua: 'Про цей інцидент буде повідомлено.' } },
		]);
		pendingSudoCommand = null;
		setActivePrompt();
		return;
	}

	if (pendingSuUser) {
		appendPromptLine('', suPromptLabel);
		appendOutput([
			{ t: 'text', color: 'red', v: { en: 'su: Authentication failure', ua: 'su: помилка автентифікації' } },
			{ t: 'text', color: 'muted', v: { en: `su: incorrect password for ${pendingSuUser}`, ua: `su: неправильний пароль для ${pendingSuUser}` } },
		]);
		pendingSuUser = null;
		setActivePrompt();
		return;
	}

	appendPromptLine(command);
	executeCommand(command, { addToHistory: true });
}

function handleTab(input: HTMLInputElement, event: KeyboardEvent): void {
	event.preventDefault();
	const value = normalizeCommand(input.value);
	if (!value) {
		return;
	}

	const matches = allCommands.filter((command) => command.startsWith(value));
	if (matches.length === 1) {
		input.value = matches[0];
		return;
	}

	if (matches.length > 1) {
		appendOutput([{ t: 'text', color: 'secondary', v: matches.join('   ') }]);
	}
}

function handleArrowUp(input: HTMLInputElement, event: KeyboardEvent): void {
	event.preventDefault();
	if (history.length === 0) {
		return;
	}

	if (historyIndex < 0) {
		historyIndex = history.length - 1;
	} else if (historyIndex > 0) {
		historyIndex -= 1;
	}

	input.value = history[historyIndex] ?? '';
	queueMicrotask(() => {
		input.setSelectionRange(input.value.length, input.value.length);
	});
}

function handleArrowDown(input: HTMLInputElement, event: KeyboardEvent): void {
	event.preventDefault();
	if (historyIndex < 0) {
		input.value = '';
		return;
	}

	if (historyIndex < history.length - 1) {
		historyIndex += 1;
		input.value = history[historyIndex] ?? '';
		return;
	}

	historyIndex = -1;
	input.value = '';
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function typeAndRun(command: string): Promise<void> {
	if (isBusy) {
		return;
	}

	isBusy = true;
	const input = getInput();
	input.disabled = true;
	setInteractivePromptVisible(false);

	const promptLine = appendTemporaryPromptLine();
	const promptCommand = promptLine.querySelector(`.${styles.promptCommand}`);
	if (!(promptCommand instanceof HTMLElement)) {
		isBusy = false;
		input.disabled = false;
		setInteractivePromptVisible(true);
		return;
	}

	for (const character of command) {
		promptCommand.textContent += character;
		scrollToBottom();
		await sleep(42);
	}

	await sleep(180);
	promptLine.remove();
	appendPromptLine(command);
	executeCommand(command);
	input.disabled = false;
	setInteractivePromptVisible(true);
	setActivePrompt();
	input.focus();
	isBusy = false;
}

async function boot(): Promise<void> {
	isBusy = true;
	const input = getInput();
	input.disabled = true;
	setInteractivePromptVisible(false);
	setActivePrompt();

	for (const command of startupCommands) {
		appendPromptLine(command);
		executeCommand(command);
		await sleep(70);
	}

	input.disabled = false;
	setInteractivePromptVisible(true);
	setActivePrompt();
	input.focus();
	isBusy = false;
}

function initLocale(): void {
	const storedLocale = window.localStorage.getItem(localeStorageKey);
	currentLocale = storedLocale === 'ua' ? 'ua' : DEFAULT_LOCALE;
	syncLocaleUI();

	getLocaleToggle()?.addEventListener('click', () => {
		if (isBusy) {
			return;
		}

		setLocale(currentLocale === 'en' ? 'ua' : 'en');
	});
}

export function initTerminal(): void {
	const input = getInput();
	const output = getOutput();

	initLocale();
	setActivePrompt();

	input.addEventListener('keydown', (event) => {
		if (isBusy && event.key !== 'Tab') {
			event.preventDefault();
			return;
		}

		switch (event.key) {
			case 'Enter':
				event.preventDefault();
				handleEnter(input);
				break;
			case 'Tab':
				handleTab(input, event);
				break;
			case 'ArrowUp':
				handleArrowUp(input, event);
				break;
			case 'ArrowDown':
				handleArrowDown(input, event);
				break;
			default:
				break;
		}
	});

	output.addEventListener('click', (event) => {
		const target = (event.target as Element).closest('[data-cmd]');
		if (!(target instanceof HTMLElement) || !target.dataset.cmd) {
			return;
		}

		event.preventDefault();
		void typeAndRun(target.dataset.cmd);
	});

	output.addEventListener('keydown', (event) => {
		const target = (event.target as Element).closest('[data-cmd]');
		if (!(target instanceof HTMLElement) || !target.dataset.cmd) {
			return;
		}

		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			void typeAndRun(target.dataset.cmd);
		}
	});

	document.querySelector(`.${styles.terminalBody}`)?.addEventListener('click', (event) => {
		const target = event.target as Element;
		if (!target.closest('[data-cmd]') && !target.closest('a') && !target.closest('[data-locale-toggle]')) {
			input.focus();
		}
	});

	void boot();
}
