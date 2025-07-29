export interface Rolik {
  id: number
  filename: string
  fullpath: string
  duration: number
}

export interface ReclamaPlaylist {
  id: number
  date: string
}

export interface ReclamaBlock {
  id: number
  datetime: string
  playlist: number
  roliki: number[]
}

export interface Schema {
  roliki: Rolik
  reclama_playlists: ReclamaPlaylist
  reclama_blocks: ReclamaBlock
}
