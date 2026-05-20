import { contacts, helpEntries, profile, projects, skills, startupCommands } from '../../data/portfolio';
import { formatYearsSince } from '../../data/formatters';
import type { OutputLine } from '../../data/types';
import { renderLines } from './renderer';
import styles from './terminal.module.less';

type CommandFn = () => OutputLine[];

const skillDetailCommands = Object.fromEntries(
	skills.map((skill) => [
		skill.id,
		() =>
			skill.details ?? [
				{ t: 'text', color: skill.color, v: skill.name },
				{ t: 'gap' },
				{ t: 'text', color: 'secondary', v: `  years shown: ${formatYearsSince(skill.since)}` },
				...(skill.note ? [{ t: 'text', color: 'muted', v: `  note: ${skill.note}` } as const] : []),
				{ t: 'text', color: 'muted', v: `  since: ${skill.since}` },
			],
	]),
) satisfies Record<string, CommandFn>;

const projectDetailCommands = Object.fromEntries(
	projects.map((project) => {
		const detailLines: OutputLine[] = [...project.details];

		return [project.id, () => detailLines];
	}),
) satisfies Record<string, CommandFn>;

const commands: Record<string, CommandFn> = {
	help: () => [
		...helpEntries.map((entry) => ({ t: 'entry', cmd: entry.cmd, desc: entry.desc }) as const),
	],
	whoami: () => [
		{
			t: 'text',
			color: 'primary',
			v: `${profile.role} · ${profile.experience} · ${profile.location}`,
		},
	],
	projects: () => [
		{ t: 'entry', cmd: 'projects --public', desc: 'public case studies and drill-down commands' },
		{ t: 'entry', cmd: 'projects --private', desc: 'private / NDA work summary' },
	],
	'skills --list': () => skills.map((skill) => ({ t: 'skill', skill }) as const),
	'projects --public': () => projects.map((project) => ({ t: 'project', project }) as const),
	'projects --private': () => [
		{ t: 'text', color: 'yellow', v: 'private projects' },
		{ t: 'gap' },
		{ t: 'text', color: 'muted', v: '  multiple commercial projects are under NDA' },
		{ t: 'text', color: 'muted', v: '  can discuss architecture, responsibility, and outcomes in a real conversation' },
	],
	ls: () => [
		{ t: 'text', color: 'blue', v: 'projects  skills  contact  README.md  deploy.log  secrets.txt' },
		{ t: 'text', color: 'muted', v: 'secrets.txt is a lie' },
	],
	pwd: () => [
		{ t: 'text', color: 'secondary', v: '/home/coder/portfolio' },
	],
	contact: () => [
		{
			t: 'raw',
			html: [
				`<div class="${styles.outLine} ${styles.contactRow}">`,
				contacts
					.map((contact, index) => {
						const separator = index === 0 ? '' : `<span class="${styles.outSecondary}"> / </span>`;
						const content = contact.href
							? `<a class="${styles.contactLink}" href="${contact.href}" target="_blank" rel="noreferrer noopener">${contact.value}</a>`
							: `<span class="${styles.contactText}">${contact.value}</span>`;
						return `${separator}${content}`;
					})
					.join(''),
				'</div>',
			].join(''),
		},
	],
	...skillDetailCommands,
	...projectDetailCommands,
};

const allCommands = Object.keys(commands).sort();
const promptLabel = `${profile.handle}@${profile.host}:~$`;
const sudoPromptLabel = `[sudo] password for ${profile.handle}:`;
const suPromptLabel = 'Password:';
const defaultPlaceholder = 'type help';

let history: string[] = [];
let historyIndex = -1;
let isBusy = false;
let pendingSudoCommand: string | null = null;
let pendingSuUser: string | null = null;

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

function setInteractivePromptVisible(isVisible: boolean): void {
	const inputRow = getInputRow();
	inputRow.classList.toggle(styles.terminalInputRowHidden, !isVisible);
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
	const output = getOutput();
	const wrapper = document.createElement('div');
	wrapper.className = styles.cmdOutput;
	wrapper.innerHTML = renderLines(lines);
	output.append(wrapper);
	scrollToBottom();
}

function appendPromptLine(command: string): HTMLElement {
	const output = getOutput();
	const line = document.createElement('div');
	line.className = `${styles.outLine} ${styles.promptLine}`;
	line.innerHTML = [
		`<span class="${styles.promptLabelText}">${promptLabel}</span>`,
		`<span class="${styles.promptCommand}">${command}</span>`,
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
		getOutput().innerHTML = '';
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
			{ t: 'text', color: 'muted', v: '  nice try. this terminal is immutable by design.' },
		]);
		return;
	}

	if (command === 'rm' || command.startsWith('rm ')) {
		const target = command.slice(2).trim();
		appendOutput([
			{ t: 'text', color: 'red', v: `rm: ${target}` },
			{ t: 'text', color: 'muted', v: '  cannot delete: permissions not granted. try with sudo.' },
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
	if (!command && !pendingSudoCommand) {
		return;
	}

	input.value = '';

	if (pendingSudoCommand) {
		appendPromptLine(sudoPromptLabel);
		appendOutput([
			{ t: 'text', color: 'red', v: 'Sorry, try again.' },
			{ t: 'text', color: 'muted', v: 'sudo: 1 incorrect password attempt' },
			{ t: 'text', color: 'muted', v: 'This incident will be reported.' },
		]);
		pendingSudoCommand = null;
		setActivePrompt();
		return;
	}

	if (pendingSuUser) {
		appendPromptLine(suPromptLabel);
		appendOutput([
			{ t: 'text', color: 'red', v: 'su: Authentication failure' },
			{ t: 'text', color: 'muted', v: `su: incorrect password for ${pendingSuUser}` },
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

	const promptLine = appendPromptLine('');
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

export function initTerminal(): void {
	const input = getInput();
	const output = getOutput();
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
		if (!target.closest('[data-cmd]') && !target.closest('a')) {
			input.focus();
		}
	});

	void boot();
}
