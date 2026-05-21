export type AccentColor = 'green' | 'blue' | 'yellow';
export type LineColor = 'primary' | 'secondary' | 'muted' | 'green' | 'blue' | 'yellow' | 'red' | 'cyan';
export type Locale = 'en' | 'ua';
export type LocalizedText = string | Record<Locale, string>;

export interface Profile {
	handle: string;
	host: string;
	titleBar: string;
	role: LocalizedText;
	experience: LocalizedText;
	location: LocalizedText;
}

export interface Skill {
	id: string;
	name: LocalizedText;
	fill: number;
	color: AccentColor;
	note?: LocalizedText;
	since: number;
	details?: OutputLine[];
}

export interface Project {
	id: string;
	commandLabel: string;
	displayName: LocalizedText;
	tagline: LocalizedText;
	details: OutputLine[];
	repo?: string;
}

export interface ContactLink {
	label: LocalizedText;
	value: LocalizedText;
	href?: string;
}

export type OutputLine =
	| { t: 'text'; color: LineColor; v: LocalizedText }
	| { t: 'gap' }
	| { t: 'entry'; cmd: string; desc: LocalizedText }
	| { t: 'repo'; label?: LocalizedText; text: string; color?: LineColor }
	| { t: 'skill'; skill: Skill }
	| { t: 'project'; project: Project }
	| { t: 'contact'; contact: ContactLink }
	| { t: 'contacts'; contacts: ContactLink[] }
	| { t: 'raw'; html: string };
