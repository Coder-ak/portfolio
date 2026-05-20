import type { ContactLink, LineColor, OutputLine, Skill } from '../../data/types';
import { formatYearsSince } from '../../data/formatters';
import styles from './terminal.module.less';

const COLOR_CLASS: Record<LineColor, string> = {
	primary: styles.outPrimary,
	secondary: styles.outSecondary,
	muted: styles.outMuted,
	green: styles.outGreen,
	blue: styles.outBlue,
	yellow: styles.outYellow,
	red: styles.outRed,
	cyan: styles.outCyan,
};

function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

function renderGauge(skill: Skill): string {
	const colorMap: Record<Skill['color'], string> = {
		green: styles.gaugeFillGreen,
		blue: styles.gaugeFillBlue,
		yellow: styles.gaugeFillYellow,
	};

	return [
		`<span class="${styles.gauge}" aria-hidden="true">`,
		`<span class="${styles.gaugeFill} ${colorMap[skill.color]}" style="width:${Math.round(skill.fill * 100)}%"></span>`,
		'</span>',
	].join('');
}

function renderContact(contact: ContactLink): string {
	if (contact.href) {
		return [
			`<a class="${styles.contactLink}" href="${escapeHtml(contact.href)}" target="_blank" rel="noreferrer noopener">`,
			escapeHtml(contact.value),
			'</a>',
		].join('');
	}

	return `<span class="${styles.contactText}">${escapeHtml(contact.value)}</span>`;
}

export function renderLines(lines: OutputLine[]): string {
	return lines
		.map((line) => {
			switch (line.t) {
				case 'gap':
					return `<div class="${styles.outGap}"></div>`;
				case 'text':
					return `<div class="${styles.outLine} ${COLOR_CLASS[line.color]}">${escapeHtml(line.v)}</div>`;
				case 'entry':
					return [
						`<div class="${styles.outLine} ${styles.outEntry}">`,
						`<span class="${styles.outLink}" data-cmd="${escapeHtml(line.cmd)}" tabindex="0" role="button">${escapeHtml(line.cmd)}</span>`,
						`<span class="${styles.outSecondary}">${escapeHtml(line.desc)}</span>`,
						'</div>',
					].join('');
				case 'skill':
					return [
						`<div class="${styles.outLine} ${styles.outSkill}">`,
						`<span class="${styles.skillCommand}" data-cmd="${escapeHtml(line.skill.id)}" tabindex="0" role="button">${escapeHtml(line.skill.name)}</span>`,
						renderGauge(line.skill),
						`<span class="${styles.skillYears}">${escapeHtml(formatYearsSince(line.skill.since))}</span>`,
						'</div>',
					].join('');
				case 'project':
					{
						const titleText =
							line.project.displayName === line.project.commandLabel
								? ` — ${escapeHtml(line.project.tagline)}`
								: ` — ${escapeHtml(line.project.displayName)} · ${escapeHtml(line.project.tagline)}`;

					return [
						`<div class="${styles.outLine} ${styles.outProject}">`,
						`<span class="${styles.outGreen} ${styles.projectArrow}">➜</span>`,
						`<span class="${styles.outLink}" data-cmd="${escapeHtml(line.project.id)}" tabindex="0" role="button">${escapeHtml(line.project.commandLabel)}</span>`,
						`<span class="${styles.outSecondary}">${titleText}</span>`,
						'</div>',
					].join('');
					}
				case 'contact':
					return renderContact(line.contact);
				case 'raw':
					return line.html;
				default:
					return '';
			}
		})
		.join('\n');
}
