// Проверочный запуск окружения ds — по скилу build-check-run.
// Проходит цепочку: Node → точные версии → замок → установленное → сборка пакета → витрина.
// Печатает ожидание рядом с фактом, в конце итог числом. Прогон: `npm run check`.
// Флаг --no-build пропускает сборку и проверяет уже собранный dist/.
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'

const PACKAGE_DEPS = ['react', 'react-dom', '@base-ui/react']
const SKIP_BUILD = process.argv.includes('--no-build')

let passed = 0
let failed = 0
function check(name, expected, actual, ok = expected === actual) {
  ok ? passed++ : failed++
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}\n     ожидание: ${expected}\n     факт:     ${actual}`)
}

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))

// 1. Node
const major = Number(process.versions.node.split('.')[0])
check('Node — мажорная версия не ниже 22 (требование Vite 8)', '>= 22', process.versions.node, major >= 22)

// 2. Точные версии
const allDeps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies }
const ranged = Object.entries(allDeps).filter(([, v]) => /^[\^~]/.test(v)).map(([k]) => k)
check('package.json — версии точные, без ^ и ~', 'ни одной', ranged.length ? ranged.join(', ') : 'ни одной')

// 3. Замок
check('package-lock.json — лежит', 'есть', existsSync('package-lock.json') ? 'есть' : 'нет')

// 4. Установленное совпадает с package.json
for (const [name, want] of Object.entries(allDeps)) {
  let got = 'не установлен'
  try { got = JSON.parse(readFileSync(`node_modules/${name}/package.json`, 'utf8')).version } catch {}
  check(`node_modules — ${name}`, want, got)
}

// 5. React и Base UI не едут внутрь пакета
check('React — внешняя зависимость (peerDependencies)', 'есть', pkg.peerDependencies?.react ? 'есть' : 'нет')

// 6. Сборка пакета
if (!SKIP_BUILD) {
  let out = 'упала'
  try { execSync('npm run build', { stdio: 'pipe' }); out = 'прошла' } catch (e) { out = `упала: ${String(e.stdout || e.message).trim().split('\n').pop()}` }
  check('npm run build — проходит', 'прошла', out)
}
const dist = existsSync('dist') ? readdirSync('dist') : []
check('dist/ds.js — пакет собран', 'есть', dist.includes('ds.js') ? 'есть' : 'нет')
check('dist/ds.css — один файл стилей', 'есть', dist.includes('ds.css') ? 'есть' : 'нет')
check('dist/index.d.ts — типы собраны', 'есть', dist.includes('index.d.ts') ? 'есть' : 'нет')
check('dist/index.html — сайта в пакете нет', 'нет', dist.includes('index.html') ? 'есть' : 'нет')
if (dist.includes('ds.js')) {
  const js = readFileSync('dist/ds.js', 'utf8')
  const external = PACKAGE_DEPS.every((d) => !new RegExp(`//#region node_modules/${d}`).test(js))
  check('dist/ds.js — React и Base UI не вшиты', 'снаружи', external && js.length < 50_000 ? 'снаружи' : 'вшиты или пакет раздут')
}

// 7. Витрина
check('.storybook/main.ts — витрина настроена', 'есть', existsSync('.storybook/main.ts') ? 'есть' : 'нет')
check('scripts.storybook — команда витрины', 'есть', pkg.scripts?.storybook ? 'есть' : 'нет')

console.log(`\nИтог: пройдено ${passed}, провалено ${failed}`)
process.exit(failed ? 1 : 0)
