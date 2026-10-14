// Проверочный запуск компонентов — по скилу build-check-run: ожидание рядом с фактом, в конце итог числом.
// Проверяет собранный пакет dist/ds.js без браузера. Прогон: `node check-components.mjs` после `npm run build`.
import { createElement as h } from 'react'
import { renderToString } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { Form } from '@base-ui/react/form'

const { TextInput, TextArea, Button, Spin, WhyPoint, CaseCard, Checkbox } = await import(new URL('./dist/ds.js', import.meta.url).href)

let passed = 0
let failed = 0
function check(name, expected, actual) {
  // Факт можно дать функцией: исключение внутри неё — строка провала, запуск идёт дальше и печатает итог.
  if (typeof actual === 'function') {
    try { actual = actual() } catch (error) { actual = `исключение: ${error.message}` }
  }
  const ok = expected === actual
  ok ? passed++ : failed++
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}\n     ожидание: ${expected}\n     факт:     ${actual}`)
}
const has = (html, re) => (re.test(html) ? 'да' : 'нет')

for (const [name, Field] of [['TextInput', TextInput], ['TextArea', TextArea]]) {
  const base = { clearable: true, clearLabel: 'x', defaultValue: 'a' }
  check(`${name}: clearable — крестик есть`, 'да', has(renderToString(h(Field, base)), /ds-field__clear/))
  check(`${name}: clearable + readOnly — крестика нет`, 'нет', has(renderToString(h(Field, { ...base, readOnly: true })), /ds-field__clear/))
  check(`${name}: clearable + disabled — крестика нет`, 'нет', has(renderToString(h(Field, { ...base, disabled: true })), /ds-field__clear/))

  const field = h(Field, { name: 'message', defaultValue: 'a' })
  const withError = renderToString(h(Form, { errors: { message: 'Ошибка формы' } }, field))
  check(`${name}: имя дошло до поля`, 'да', has(withError, /name="message"/))
  check(`${name}: ошибка формы по имени — поле помечено неверным`, 'да', has(withError, /aria-invalid="true"/))
  check(`${name}: ошибка формы по имени — текст показан под полем`, 'да', has(withError, /Ошибка формы/))
  check(`${name}: форма без ошибок — поле не помечено`, 'нет', has(renderToString(h(Form, { errors: {} }, field)), /aria-invalid="true"/))
  check(`${name}: ошибка другого поля — это поле не помечено`, 'нет', has(renderToString(h(Form, { errors: { other: 'x' } }, field)), /aria-invalid="true"/))
}

// --- Button
const tag = (html) => html.match(/<button[^>]*>/)[0]
const button = (props, text = 'Content') => renderToString(h(Button, props, text))
check('Button: disabled — родной атрибут disabled', 'да', has(tag(button({ disabled: true })), / disabled=""/))
check('Button: loading — нажатие не принимает, в обходе клавиатурой остаётся', 'да', has(tag(button({ loading: true })), /aria-disabled="true"/))
check('Button: loading — родного disabled нет', 'нет', has(tag(button({ loading: true })), / disabled=""/))
check('Button: disabled + loading — помечена выключенной', 'да', has(tag(button({ disabled: true, loading: true })), /data-off=""/))
check('Button: selected + loading — спин есть', 'да', has(button({ selected: true, loading: true }), /ds-spin/))
check('Button: aria-pressed страницы старше своего', 'aria-pressed="false"', (tag(button({ selected: true, 'aria-pressed': false })).match(/aria-pressed="[a-z]+"/) || ['нет'])[0])
check('Button: aria-busy страницы старше своего', 'aria-busy="false"', (tag(button({ loading: true, 'aria-busy': false })).match(/aria-busy="[a-z]+"/) || ['нет'])[0])
check('Button: иконка без текста — пустого текста нет', 'нет', has(button({ startIcon: 'edit' }, null), /ds-button__text/))
check('Button: иконка без текста — та же ширина, что iconOnly', 'да', has(tag(button({ startIcon: 'edit' }, null)), /data-icon-only=""/))
check('Button: iconOnly с одним endIcon — иконка нарисована', 'да', has(button({ iconOnly: true, endIcon: 'chevron-down' }), /<svg/))
check('Button: текст без иконок — «только иконка» не включается', 'нет', has(tag(button({})), /data-icon-only/))
check('Button: с адресом — ссылка a с этим адресом', 'да', has(button({ href: 'https://example.com', view: 'flat-action' }), /^<a [^>]*href="https:\/\/example\.com"/))
check('Button: с адресом — вид и размер те же атрибуты', 'да', has(button({ href: '/x', view: 'flat-action', size: 'm' }), /class="ds-button[^"]*"[^>]*data-view="flat-action"[^>]*data-size="m"/))
check('Button: без адреса — по-прежнему button', 'да', has(button({}), /^<button /))
check('Button: с адресом — «текущая страница» дошла до ссылки', 'да', has(button({ href: '/x', 'aria-current': 'page' }), /^<a [^>]*aria-current="page"/))
check('Button: с адресом без aria-current — атрибута нет', 'нет', has(button({ href: '/x' }), /aria-current/))
check('Button: иконка arrow-left слева — нарисована, 16 в XL и 12 в M', '16 12', () => ['xl', 'm'].map((size) => (button({ startIcon: 'arrow-left', size }).match(/<span class="ds-icon" data-size="(\d+)"[^>]*><svg/) || [null, 'нет'])[1]).join(' '))

for (const icon of ['chevron-left', 'chevron-right', 'pause', 'play']) {
  check(`Button: только иконка ${icon} — нарисована, 16 в L и 12 в M`, '16 12', () => ['l', 'm'].map((size) => (button({ startIcon: icon, iconOnly: true, size, 'aria-label': 'x' }).match(/<span class="ds-icon" data-size="(\d+)"[^>]*><svg/) || [null, 'нет'])[1]).join(' '))
}
// Релиз 4 дизайн-системы: фон Chip neutral — neutral/tint-light. Чип — CSS библиотеки, смотрим собранные стили.
check('Chip neutral: фон — neutral/tint-light', 'да', () => has(readFileSync(new URL('./dist/ds.css', import.meta.url), 'utf8').replace(/\s+/g, ''), /\.ds-chip\[data-color=(?:'|")?neutral(?:'|")?\]\{background:var\(--ds-neutral-tint-light\)/))

// --- Checkbox
// Разметка без браузера. Отметку мышью и пробелом проверяет браузер: здесь её условия — роль, обход клавиатурой, скрытое поле.
// Помощники не бросают исключений: нет тега — пустая строка, нет атрибута — «нет». Смена разметки даёт строку провала.
const checkbox = (props, text = 'Content') => renderToString(h(Checkbox, props, text))
const first = (html, re) => (html.match(re) || [''])[0]
const root = (html) => first(html, /^<[a-z]+[^>]*>/)
const square = (html) => first(html, /<span[^>]*role="checkbox"[^>]*>/)
const hidden = (html) => first(html, /<input[^>]*type="checkbox"[^>]*>/)
const label = (html) => first(html, /<label[^>]*>/)
const attr = (tagHtml, name) => (tagHtml.match(new RegExp(` ${name}="([^"]*)"`)) || [null, 'нет'])[1]
check('Checkbox: квадрат — роль checkbox, в обходе клавиатурой', 'tabindex="0"', () => `tabindex="${attr(square(checkbox({})), 'tabindex')}"`)
check('Checkbox: не отмечена — aria-checked', 'false', () => attr(square(checkbox({})), 'aria-checked'))
check('Checkbox: не отмечена — галочки нет', 'нет', () => has(checkbox({}), /<svg/))
check('Checkbox: отмечена — aria-checked', 'true', () => attr(square(checkbox({ defaultChecked: true })), 'aria-checked'))
check('Checkbox: отмечена — галочка нарисована', 'да', () => has(checkbox({ defaultChecked: true }), /ds-checkbox__check[^>]*><span class="ds-icon"[^>]*><svg/))
check('Checkbox: отмечена — скрытое поле отмечено', 'да', () => has(hidden(checkbox({ defaultChecked: true })), / checked=""/))
check('Checkbox: размер по умолчанию', 'xl', () => attr(root(checkbox({})), 'data-size'))
check('Checkbox: иконка галочки в XL — 16, в L и M — 12', '16 12 12', () => ['xl', 'l', 'm'].map((size) => attr(first(checkbox({ size, defaultChecked: true }), /<span class="ds-icon"[^>]*>/), 'data-size')).join(' '))
// Корень — строчный элемент: галочка стоит внутри абзаца и рядом с текстом, браузер абзац раньше времени не закрывает.
check('Checkbox: корень — строчный элемент span', 'span', () => (root(checkbox({})).match(/^<([a-z]+)/) || [null, 'нет'])[1])
check('Checkbox: корень несёт класс компонента', 'да', () => has(root(checkbox({})), /class="ds-checkbox"/))
const blockTags = /<(div|p|ul|ol|li|section|article|form|fieldset|table|h[1-6])[\s>]/
check('Checkbox с подписью: блочных элементов внутри нет', 'нет', () => has(checkbox({ defaultChecked: true }), blockTags))
check('Checkbox без подписи: блочных элементов внутри нет', 'нет', () => has(checkbox({ defaultChecked: true, 'aria-label': 'x' }, null), blockTags))
check('Checkbox в абзаце рядом с текстом: стоит внутри абзаца', 'да', () => has(renderToString(h('p', null, 'Текст ', h(Checkbox, { 'aria-label': 'x' }), ' текст')), /^<p>Текст <span[^>]*class="ds-checkbox"[^>]*>.*<\/span> текст<\/p>$/))
check('Checkbox: disabled — нажатие не принимает', 'true', () => attr(square(checkbox({ disabled: true })), 'aria-disabled'))
check('Checkbox: disabled — из обхода клавиатурой выходит', '-1', () => attr(square(checkbox({ disabled: true })), 'tabindex'))
check('Checkbox: disabled — скрытое поле выключено, с формой не уходит', 'да', () => has(hidden(checkbox({ disabled: true, defaultChecked: true })), / disabled=""/))
check('Checkbox: disabled — корень помечен для стилей', 'да', () => has(root(checkbox({ disabled: true })), /data-disabled/))
check('Checkbox: error — квадрат помечен неверным', 'true', () => attr(square(checkbox({ error: true })), 'aria-invalid'))
check('Checkbox: error — корень помечен для стилей', 'да', () => has(root(checkbox({ error: true })), /data-invalid/))
check('Checkbox: без error — не помечена', 'нет', () => attr(square(checkbox({})), 'aria-invalid'))
check('Checkbox: error + disabled — неверной не объявляется', 'нет', () => attr(square(checkbox({ error: true, disabled: true })), 'aria-invalid'))
check('Checkbox: readOnly — объявляется, в обходе остаётся', 'true 0', () => `${attr(square(checkbox({ readOnly: true })), 'aria-readonly')} ${attr(square(checkbox({ readOnly: true })), 'tabindex')}`)
check('Checkbox: readOnly — корень помечен для стилей', 'да', () => has(root(checkbox({ readOnly: true })), / data-readonly=""/))
check('Checkbox: без readOnly — корень не помечен', 'нет', () => has(root(checkbox({})), /data-readonly/))
check('Checkbox: подпись — метка', 'да', () => has(checkbox({}), /<label[^>]*class="ds-checkbox__label ds-text-control-l"[^>]*>Content<\/label>/))
// Связь есть, только когда оба атрибута на месте и равны: «нет» у обоих — провал.
const linked = (html) => {
  const target = attr(label(html), 'for')
  const id = attr(hidden(html), 'id')
  return target !== 'нет' && id !== 'нет' && target === id ? 'да' : 'нет'
}
check('Checkbox: метка связана со скрытым полем галочки', 'да', () => linked(checkbox({})))
check('Проверка связи: у метки нет for и у поля нет id — провал', 'нет', () => linked('<label>Content</label><input type="checkbox"/>'))
check('Проверка связи: у метки нет for — провал', 'нет', () => linked('<label>Content</label><input type="checkbox" id="a"/>'))
check('Проверка связи: for и id разные — провал', 'нет', () => linked('<label for="b">Content</label><input type="checkbox" id="a"/>'))
check('Помощники проверок: сменившаяся разметка — строка провала, не исключение', 'нет нет', () => `${attr(square('<div></div>'), 'aria-checked')} ${attr(hidden('<div></div>'), 'id')}`)
check('Checkbox M: подпись стилем control/m', 'да', () => has(checkbox({ size: 'm' }), /class="ds-checkbox__label ds-text-control-m"/))
check('Checkbox без подписи — метки нет', 'нет', () => has(checkbox({}, null), /<label/))
check('Checkbox без подписи — имя страницы дошло до квадрата', 'Согласие', () => attr(square(checkbox({ 'aria-label': 'Согласие' }, null)), 'aria-label'))
check('Checkbox: имя и значение дошли до скрытого поля', 'consent yes', () => `${attr(hidden(checkbox({ name: 'consent', value: 'yes' })), 'name')} ${attr(hidden(checkbox({ name: 'consent', value: 'yes' })), 'value')}`)
check('Checkbox: ошибка формы по имени — помечена неверной', 'true', () => attr(square(renderToString(h(Form, { errors: { consent: 'x' } }, h(Checkbox, { name: 'consent' }, 'Content')))), 'aria-invalid'))
check('Checkbox: ошибка другого поля — не помечена', 'нет', () => attr(square(renderToString(h(Form, { errors: { other: 'x' } }, h(Checkbox, { name: 'consent' }, 'Content')))), 'aria-invalid'))

// --- Spin
const labelled = renderToString(h(Spin, { 'aria-label': 'Идёт отправка' }))
check('Spin с подписью: роль', 'role="status"', (labelled.match(/role="[a-z]+"/) || ['нет'])[0])
check('Spin с подписью: имя лежит текстом внутри области', 'да', has(labelled, /<span class="ds-spin__label">Идёт отправка<\/span>/))
check('Spin с подписью: область не скрыта от скринридера', 'нет', has(labelled.match(/<span[^>]*>/)[0], /aria-hidden/))
check('Spin без подписи: скрыт от скринридера', 'да', has(renderToString(h(Spin, {})).match(/<span[^>]*>/)[0], /aria-hidden="true"/))

// --- Подпись поля читается скринридером
const withLabel = renderToString(h(TextInput, { label: 'Email:' }))
const labelFor = (withLabel.match(/<label[^>]*for="([^"]+)"[^>]*>Email:<\/label>/) || [])[1]
const inputId = (withLabel.match(/<input[^>]*id="([^"]+)"/) || [])[1]
check('TextInput с label: подпись — метка поля', 'да', labelFor ? 'да' : 'нет')
check('TextInput с label: метка связана с этим полем', 'да', labelFor && labelFor === inputId ? 'да' : 'нет')

// --- WhyPoint: разметку выбора задаёт страница
const point = (props) => renderToString(h(WhyPoint, props, 'текст')).match(/<button[^>]*>/)[0]
check('WhyPoint: сам по себе — нажатая кнопка', 'aria-pressed="true"', (point({ selected: true }).match(/aria-pressed="[a-z]+"/) || ['нет'])[0])
check('WhyPoint с role="tab" от страницы — aria-pressed нет', 'нет', has(point({ selected: true, role: 'tab', 'aria-selected': true }), /aria-pressed/))
check('WhyPoint с role="tab" от страницы — aria-selected дошёл', 'да', has(point({ selected: true, role: 'tab', 'aria-selected': true }), /role="tab"[^>]*aria-selected="true"|aria-selected="true"[^>]*role="tab"/))
check('WhyPoint: aria-pressed страницы старше своего', 'aria-pressed="false"', (point({ selected: true, 'aria-pressed': false }).match(/aria-pressed="[a-z]+"/) || ['нет'])[0])

// --- CaseCard: корень подставляет страница
const card = (props) => renderToString(h(CaseCard, { title: 'T', teaser: 'D', ...props })).match(/^<[a-z]+[^>]*>/)[0]
check('CaseCard без href — корень article', 'article', card({}).match(/^<([a-z]+)/)[1])
check('CaseCard с href — корень a', 'a', card({ href: '/x' }).match(/^<([a-z]+)/)[1])
const site = card({ render: h('a', { 'data-site-link': 'yes', href: '/cases/x' }), target: '_blank', rel: 'noreferrer', 'aria-label': 'Кейс' })
check('CaseCard с render — корень — элемент страницы', 'да', has(site, /data-site-link="yes"/))
check('CaseCard с render — target страницы дошёл до корня', 'да', has(site, /target="_blank"/))
check('CaseCard с render — rel и aria-label дошли', 'да', has(site, /rel="noreferrer"/) === 'да' && has(site, /aria-label="Кейс"/) === 'да' ? 'да' : 'нет')
check('CaseCard с render — класс карточки на месте', 'да', has(site, /class="[^"]*ds-case-card/))

// --- Витрина: неразрывные пробелы и подключённые иконки
const { nbsp } = await import(new URL('./src/showcase/text.stories.helpers.ts', import.meta.url).href)
check('nbsp: после каждого короткого слова', 'Скажу и⍽в⍽двух словах, а⍽не⍽в⍽трёх', nbsp('Скажу и в двух словах, а не в трёх').replaceAll(String.fromCharCode(160), '⍽'))
const table = readFileSync(new URL('./src/icons/Icon.tsx', import.meta.url), 'utf8').match(/const icons = \{([\s\S]*?)\n\} satisfies/)[1]
check('Иконок в таблице библиотеки', '19', String((table.match(/^  ['a-z-]+: \{/gm) || []).length))

// --- Пакет
const js = readFileSync(new URL('./dist/ds.js', import.meta.url), 'utf8')
const css = readFileSync(new URL('./dist/ds.css', import.meta.url), 'utf8')
const types = readFileSync(new URL('./dist/index.d.ts', import.meta.url), 'utf8')
check('Пакет: пометка use client первой строкой', 'да', js.startsWith('"use client"') ? 'да' : 'нет')
check('Пакет: стили в слое ds', 'да', has(css, /@layer ds\{/))
check('Пакет: пробного компонента Probe нет', 'нет', has(types + js, /Probe/))
check('Пакет: стили Checkbox в собранном файле', 'да', has(css, /\.ds-checkbox__box\{/))
// Старшинство состояний галочки: Disabled → Error → Hover. Наведение исключено у обоих видов квадрата — отмеченного и нет.
const hoverRules = [...css.matchAll(/\.ds-checkbox:hover(:not\([^)]*\))? \.ds-checkbox__box\[data-(?:un)?checked\]/g)].map((m) => m[1] || '')
check('Checkbox: правил наведения мышью — два, у отмеченного и неотмеченного квадрата', '2', String(hoverRules.length))
check('Checkbox: наведения нет в Disabled, Error и у readOnly — в обоих правилах', '2', String(hoverRules.filter((not) => ['data-disabled', 'data-invalid', 'data-readonly'].every((name) => not.includes(name))).length))
check('Checkbox: у readOnly указателя нет', 'да', has(css, /\.ds-checkbox\[data-readonly\] \.ds-checkbox__box,\.ds-checkbox\[data-readonly\] \.ds-checkbox__label\{cursor:default\}/))
check('Пакет: нажатие клавишей не анимируется', 'да', has(css, /\.ds-button:active:not\(:focus-visible/))
// «Уменьшить движение»: правило нажатия стоит только внутри no-preference — при reduce его нет, перебивать нечего.
const pressRules = [...css.matchAll(/transform:scale\([^)]*\)/g)].map((m) => m.index)
// Границы блоков @media с данным условием: от открывающей скобки до парной закрывающей.
const blocks = (condition) =>
  [...css.matchAll(new RegExp(`@media \\(prefers-reduced-motion:${condition}\\)\\{`, 'g'))].map((m) => {
    let depth = 0, i = m.index + m[0].length - 1
    for (; i < css.length; i++) { if (css[i] === '{') depth++; if (css[i] === '}' && --depth === 0) break }
    return [m.index, i]
  })
const calm = blocks('no-preference')
const outside = pressRules.filter((at) => !calm.some(([from, to]) => at > from && at < to))
check('Button: правил уменьшения при нажатии всего', '1', String(pressRules.length))
check('Button: правил уменьшения вне «движение не уменьшено»', '0', String(outside.length))
check('Button: при «уменьшить движение» правил с transform нет', 'нет', has(blocks('reduce').map(([from, to]) => css.slice(from, to)).join(''), /transform/))

console.log(`\nИтог: пройдено ${passed}, провалено ${failed}`)
process.exit(failed ? 1 : 0)
