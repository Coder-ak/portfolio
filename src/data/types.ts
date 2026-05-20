export type AccentColor = 'green' | 'blue' | 'yellow';
export type LineColor = 'primary' | 'secondary' | 'muted' | 'green' | 'blue' | 'yellow' | 'red' | 'cyan';

export interface Profile {
	handle: string;
	host: string;
	titleBar: string;
	role: string;
	experience: string;
	location: string;
}

export interface Skill {
	id: string;
	name: string;
	fill: number;
	color: AccentColor;
	note?: string;
	since: number;
	details?: OutputLine[];
}

export interface Project {
	id: string;
	commandLabel: string;
	displayName: string;
	tagline: string;
	details: OutputLine[];
	repo?: string;
}

export interface ContactLink {
	label: string;
	value: string;
	href?: string;
}

export type OutputLine =
	| { t: 'text'; color: LineColor; v: string }
	| { t: 'gap' }
	| { t: 'entry'; cmd: string; desc: string }
	| { t: 'skill'; skill: Skill }
	| { t: 'project'; project: Project }
	| { t: 'contact'; contact: ContactLink }
	| { t: 'raw'; html: string };
