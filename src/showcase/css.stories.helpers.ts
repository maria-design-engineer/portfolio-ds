// Разбор CSS-файлов библиотеки для страниц витрины «Переменные» и «Стили».
// В пакет не едет: имя файла закрыто тем же правилом, что и story.

export type Token = { name: string; value: string; mobile?: string }
export type Collection = { name: string; tokens: Token[] }
export type Resolved = { value: string } | { error: string }
export type TextStyle = { name: string; font: string; letterSpacing: string }

const MARK = '\u0000'

// Комментарии убираются: закомментированное объявление не действует и в счёт не идёт.
// Служебные пометки @collection, @mode, @forced из комментариев сохраняются как границы разделов.
function strip(css: string): string {
  return css.replace(/\/\*([\s\S]*?)\*\//g, (_, body: string) => {
    const mark = body.match(/@(collection|mode|forced)\s+([A-Za-z]+)/)
    return mark ? `${MARK}${mark[1]}:${mark[2]}${MARK}` : ''
  })
}

// Объявления переменных раздела. Объявленная дважды считается один раз, действует последнее значение.
function declarations(css: string): Map<string, string> {
  const found = new Map<string, string>()
  for (const [, name, value] of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;{}]+);/g)) found.set(name, value.trim())
  return found
}

function sections(css: string): { kind: string; name: string; body: string }[] {
  const parts = strip(css).split(MARK)
  const result = []
  for (let i = 1; i < parts.length; i += 2) {
    const [kind, name] = parts[i].split(':')
    result.push({ kind, name, body: parts[i + 1] ?? '' })
  }
  return result
}

export function readCollections(css: string): Collection[] {
  const all = sections(css)
  // Режим Mobile — только блок @media: блоки @forced повторяют значения для контейнера и в счёт не идут.
  const mobile = declarations(all.find((s) => s.kind === 'mode' && s.name === 'Mobile')?.body ?? '')
  return all
    .filter((s) => s.kind === 'collection')
    .map((s) => ({
      name: s.name,
      tokens: [...declarations(s.body)].map(([name, value]) => ({ name, value, mobile: mobile.get(name) })),
    }))
}

// Значение, на которое ссылается переменная: var(--ds-ink-900) → #15181f.
// Битая или круговая ссылка возвращается ошибкой — страница рисуется и показывает её строкой.
export function resolve(value: string, all: Map<string, string>, seen: string[] = []): Resolved {
  const ref = value.match(/^var\((--[a-z0-9-]+)\)$/)?.[1]
  if (!ref) return { value }
  if (seen.includes(ref)) return { error: `круговая ссылка: ${[...seen, ref].join(' → ')}` }
  const next = all.get(ref)
  if (next === undefined) return { error: `нет переменной ${ref}` }
  return resolve(next, all, [...seen, ref])
}

export function readTextStyles(css: string): TextStyle[] {
  const found = new Map<string, TextStyle>()
  for (const [, name, body] of strip(css).matchAll(/\.ds-text-([a-z0-9-]+)\s*\{([^}]*)\}/g)) {
    const prop = (key: string) => body.match(new RegExp(`${key}\\s*:\\s*([^;]+);`))?.[1].trim() ?? ''
    found.set(name, { name, font: prop('font'), letterSpacing: prop('letter-spacing') })
  }
  return [...found.values()]
}

export function readVariables(css: string): Map<string, string> {
  return declarations(strip(css))
}

// Подставить в значение стиля числа одного режима: var(--ds-font-size-h1) → 40px.
export function substitute(value: string, values: Map<string, string>): string {
  return value.replace(/var\((--[a-z0-9-]+)\)/g, (whole, name: string) => values.get(name) ?? whole)
}
