import { resolveText } from '../../data/i18n';
import { formatYearsSince } from '../../data/formatters';
import type { ContactLink, LineColor, Locale, OutputLine, Skill } from '../../data/types';
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

function renderContact(contact: ContactLink, locale: Locale): string {
	if (contact.href) {
		return [
			`<a class="${styles.contactLink}" href="${escapeHtml(contact.href)}" target="_blank" rel="noreferrer noopener">`,
			escapeHtml(resolveText(contact.value, locale)),
			'</a>',
		].join('');
	}

	return `<span class="${styles.contactText}">${escapeHtml(resolveText(contact.value, locale))}</span>`;
}

function toRepoHref(text: string): string {
	if (/^https?:\/\//.test(text)) {
		return text;
	}

	if (text.startsWith('github.com/')) {
		return `https://${text}`;
	}

	return text;
}

export function renderLines(lines: OutputLine[], locale: Locale): string {
	return lines
		.map((line) => {
			switch (line.t) {
				case 'gap':
					return `<div class="${styles.outGap}"></div>`;
				case 'text':
					return `<div class="${styles.outLine} ${COLOR_CLASS[line.color]}">${escapeHtml(resolveText(line.v, locale))}</div>`;
				case 'entry':
					return [
						`<div class="${styles.outLine} ${styles.outEntry}">`,
						`<span class="${styles.outLink}" data-cmd="${escapeHtml(line.cmd)}" tabindex="0" role="button">${escapeHtml(line.cmd)}</span>`,
						`<span class="${styles.outSecondary}">${escapeHtml(resolveText(line.desc, locale))}</span>`,
						'</div>',
					].join('');
				case 'repo':
					return [
						`<div class="${styles.outLine} ${COLOR_CLASS[line.color ?? 'secondary']}">`,
						line.label ? `${escapeHtml(resolveText(line.label, locale))} ` : '',
						`<a class="${styles.outLink}" href="${escapeHtml(toRepoHref(line.text))}" target="_blank" rel="noreferrer noopener">${escapeHtml(line.text)}</a>`,
						'</div>',
					].join('');
				case 'skill':
					return [
						`<div class="${styles.outLine} ${styles.outSkill}">`,
						`<span class="${styles.skillCommand}" data-cmd="${escapeHtml(line.skill.id)}" tabindex="0" role="button">${escapeHtml(resolveText(line.skill.name, locale))}</span>`,
						renderGauge(line.skill),
						`<span class="${styles.skillYears}">${escapeHtml(formatYearsSince(line.skill.since))}</span>`,
						'</div>',
					].join('');
				case 'project':
					{
						const titleText =
							resolveText(line.project.displayName, locale) === line.project.commandLabel
								? ` — ${escapeHtml(resolveText(line.project.tagline, locale))}`
								: ` — ${escapeHtml(resolveText(line.project.displayName, locale))} · ${escapeHtml(resolveText(line.project.tagline, locale))}`;

					return [
						`<div class="${styles.outLine} ${styles.outProject}">`,
						`<span class="${styles.outGreen} ${styles.projectArrow}">➜</span>`,
						`<span class="${styles.outLink}" data-cmd="${escapeHtml(line.project.id)}" tabindex="0" role="button">${escapeHtml(line.project.commandLabel)}</span>`,
						`<span class="${styles.outSecondary}">${titleText}</span>`,
						'</div>',
					].join('');
					}
				case 'contact':
					return renderContact(line.contact, locale);
				case 'contacts':
					return [
						`<div class="${styles.outLine} ${styles.contactRow}">`,
						line.contacts
							.map((contact, index) => {
								const separator = index === 0 ? '' : `<span class="${styles.outSecondary}"> / </span>`;
								return `${separator}${renderContact(contact, locale)}`;
							})
							.join(''),
						'</div>',
					].join('');
				case 'raw':
					return line.html;
				default:
					return '';
			}
		})
		.join('\n');
}
