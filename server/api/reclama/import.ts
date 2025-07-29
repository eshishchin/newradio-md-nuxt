import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { date, blocks } = body

  const api = 'http://10.0.1.51:8055'

  const report = []

  // Получаем или создаём плейлист
  let playlistId: number

  try {
    const res = await $fetch(`${api}/items/reclama_playlists`, {
      method: 'GET',
      query: { filter: { date: { _eq: date } }, limit: 1 },
    })

    if (res.data.length > 0) {
      playlistId = res.data[0].id
    } else {
      const created = await $fetch(`${api}/items/reclama_playlists`, {
        method: 'POST',
        body: { date },
      })
      playlistId = created.data.id
    }
  } catch (err) {
    console.error('[PLAYLIST ERROR]', err)
    return { error: 'Не удалось получить/создать плейлист', details: err }
  }

// 2. Обрабатываем блоки
for (const block of blocks) {
  const { datetime, roliki } = block

  for (const rolika of roliki) {
    const filename = rolika.filename

    try {
      await $fetch('http://10.0.1.51:8055/items/reclama_blocks', {
        method: 'POST',
        body: {
          datetime,
          playlist: date,
          roliki: filename, // поле M2O связывается по filename
        },
      })

      report.push({
        datetime,
        filename,
        status: 'ok',
      })
    } catch (err) {
      report.push({
        datetime,
        filename,
        error: true,
        reason: err,
      })
    }
  }
}
  return { imported: report.length, report }
})
