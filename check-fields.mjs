// Проверочный запуск полей — по скилу build-check-run: ожидание рядом с фактом, в конце итог числом.
// Проверяет собранный пакет dist/ds.js. Прогон: `node check-fields.mjs` после `npm run build`.
import { createElement as h } from 'react'
import { renderToString } from 'react-dom/server'
import { Form } from '@base-ui/react/form'

const { TextInput, TextArea } = await import(new URL('./dist/ds.js', import.meta.url).href)

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

console.log(`\nИтог: пройдено ${passed}, провалено ${failed}`)
process.exit(failed ? 1 : 0)
