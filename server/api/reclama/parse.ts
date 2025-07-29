import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const { content, filename } = await readBody(event)

  const dateMatch =
    content.match(/^(\d{2}\.\d{2}\.\d{4})/) || filename.match(/(\d{4}-\d{2}-\d{2})/)
  if (!dateMatch) return { error: 'Дата не найдена' }

  const date = dateMatch[1].includes('.')
    ? dateMatch[1].split('.').reverse().join('-')
    : dateMatch[1]

  const blocks: Record<string, string[]> = {}

  for (let line of content.split(/\r?\n/)) {
    line = line.trim()
    if (!line) continue

    const [timestamp, rawPath] = line.split(/\s{2,}|\t+/)
    if (!timestamp || !rawPath) continue

    const time = timestamp.split(' ')[1]?.slice(0, 5)
    const cleanFilename = rawPath.replace(/"/g, '').split('\\').pop()?.trim()

    if (!time || !cleanFilename) continue

    if (!blocks[time]) blocks[time] = []
    blocks[time].push(cleanFilename)
  }

  const result = Object.entries(blocks).map(([time, files]) => ({
    datetime: `${date}T${time}:00`,
    roliki: files.map((filename) => ({ filename })),
  }))

  return {
    date,
    blocks: result,
  }
})
