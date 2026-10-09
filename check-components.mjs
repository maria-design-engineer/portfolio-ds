// Проверочный запуск компонентов — по скилу build-check-run: ожидание рядом с фактом, в конце итог числом.
// Проверяет собранный пакет dist/ds.js без браузера. Прогон: `node check-components.mjs` после `npm run build`.
import { createElement as h } from 'react'
import { renderToString } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { Form } from '@base-ui/react/form'

const { TextInput, TextArea, Button, Spin } = await import(new URL('./dist/ds.js', import.meta.url).href)

let passed = 0
let failed = 0
function check(name, expected, actual) {
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

// --- Spin
const labelled = renderToString(h(Spin, { 'aria-label': 'Идёт отправка' }))
check('Spin с подписью: роль', 'role="status"', (labelled.match(/role="[a-z]+"/) || ['нет'])[0])
check('Spin с подписью: имя лежит текстом внутри области', 'да', has(labelled, /<span class="ds-spin__label">Идёт отправка<\/span>/))
check('Spin с подписью: область не скрыта от скринридера', 'нет', has(labelled.match(/<span[^>]*>/)[0], /aria-hidden/))
check('Spin без подписи: скрыт от скринридера', 'да', has(renderToString(h(Spin, {})).match(/<span[^>]*>/)[0], /aria-hidden="true"/))

// --- Пакет
const js = readFileSync(new URL('./dist/ds.js', import.meta.url), 'utf8')
const css = readFileSync(new URL('./dist/ds.css', import.meta.url), 'utf8')
const types = readFileSync(new URL('./dist/index.d.ts', import.meta.url), 'utf8')
check('Пакет: пометка use client первой строкой', 'да', js.startsWith('"use client"') ? 'да' : 'нет')
check('Пакет: стили в слое ds', 'да', has(css, /@layer ds\{/))
check('Пакет: пробного компонента Probe нет', 'нет', has(types + js, /Probe/))
check('Пакет: нажатие клавишей не анимируется', 'да', has(css, /\.ds-button:active:not\(:focus-visible/))

console.log(`\nИтог: пройдено ${passed}, провалено ${failed}`)
process.exit(failed ? 1 : 0)
