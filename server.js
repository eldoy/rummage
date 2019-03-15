const glob = require('glob')
const path = require('path')
const fs = require('fs')
const cmd = require('xecutor')
const Sirloin = require('sirloin')

const DESTRGX = /\[download\]\s+Destination:\sfiles\/(.+)/
const DONERGX = /\[download\]\s+([1-9][0-9.]+)%/
const YTRGX = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/

const app = new Sirloin({ files: 'files' })

const getLog = (id) => {
  return fs.readFileSync(`files/${id}.log`, 'utf8').split('\r').reverse().join('')
}

const getName = (log, id) => {
  const match = log.match(DESTRGX)
  let name = match ? match[1] : null
  if (name) {
    const file = path.parse(name)
    name = file.name
    name += id.includes('music') ? '.mp3' : file.ext
  }
  return name
}

const getDone = (log) => {
  const match = log.match(DONERGX)
  return match ? match[1] : null
}

const getId = (format, address) => {
  const gen = (Math.random() * 10000000000).toFixed(0)
  const match = address.match(YTRGX)
  const yt = match ? match[1] : null
  if (!yt) {
    return { error: 'Video ID not found' }
  }
  return `${yt}-${gen}-${format}`
}

const getCommand = (id, format, address) => {
  const options = format === 'music'
    ? '--extract-audio --audio-format mp3'
    : ''
  return `youtube-dl ${options} -f best -o "files/${id}/%(title)s.%(ext)s" ${address} > files/${id}.log &`
}

app.get('/status', async (req, res) => {
  const { id } = req.query
  const log = getLog(id)
  const name = getName(log, id)
  const done = getDone(log)
  console.log({ id, name, done })
  return { id, name, done }
})

app.get('/files', async (req, res) => {
  const files = (await new Promise((resolve, reject) => {
    glob('files/*/*', (err, files) => {
      err ? reject(err) : resolve(files)
    })
  }))
  .map(f => {
    const [ id, name ] = f.replace('files/', '').split('/')
    return { id, name, done: '100' }
  })
  return files
})

app.post('/download', async (req, res) => {
  const { format, address } = req.params
  const id = getId(format, address)
  const command = getCommand(id, format, address)
  console.log('COMMAND:', command)
  cmd.run(command)
  return { id }
})

/**
  Commands
  --------
  MP3: youtube-dl --extract-audio --audio-format mp3 -f best -o "%(title)s.%(ext)s" https://www.youtube.com/watch\?v\=mTglmk6y65U
  VIDEO: youtube-dl -f best -o "%(title)s.%(ext)s" https://www.youtube.com/watch\?v\=mTglmk6y65U
*/
