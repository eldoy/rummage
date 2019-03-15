const glob = require('glob')
const path = require('path')
const fs = require('fs')
const cmd = require('xecutor')
const Sirloin = require('sirloin')

const DESTREGEXP = /\[download\]\s+Destination:\sfiles\/(.+)/
const DONEREGEXP = /\[download\]\s+([1-9][0-9.]+)%/
const YTREGEXP = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/

const app = new Sirloin({ files: 'files' })

app.get('/status', async (req, res) => {
  const { id } = req.query
  console.log('STATUS FOR ID:', id)
  // Find log file, read it, parse it, return status data
  const log = fs.readFileSync(`files/${id}.log`, 'utf8').split('\r').reverse().join('')
  console.log(log)
  const m1 = log.match(DESTREGEXP)
  let name = m1 ? m1[1] : null
  if (name) {
    const file = path.parse(name)
    name = file.name
    if (id.includes('music')) {
      name += '.mp3'
    } else {
      name += file.ext
    }
  }
  const m2 = log.match(DONEREGEXP)
  console.log(m2)
  const done = m2 ? m2[1] : null
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
  console.log(files)
  return files
})

app.post('/download', async (req, res) => {
  const { format, address } = req.params
  const gen = (Math.random() * 10000000000).toFixed(0)
  const m1 = address.match(YTREGEXP)
  const yt = m1 ? m1[1] : null
  if (!yt) {
    return { error: 'Video ID not found' }
  }
  const id = `${yt}-${gen}-${format}`
  console.log('ID:', id)
  console.log('FORMAT:', format)
  console.log('ADDRESS:', address)

  const options = format === 'music'
    ? `--extract-audio --audio-format mp3`
    : ``
  const command = `youtube-dl ${options} -f best -o "files/${id}/%(title)s.%(ext)s" ${address}`
  console.log('COMMAND:', command)
  cmd.run(`${command} > files/${id}.log &`)

  // const files = fs.readdirSync(`files/${id}`)
  // console.log(files)
  // return { name: `${id}/${files[0]}` }
  return { id }
})

// MP3: youtube-dl --extract-audio --audio-format mp3 -f best -o "%(title)s.%(ext)s" https://www.youtube.com/watch\?v\=mTglmk6y65U
// VIDEO: youtube-dl -f best -o "%(title)s.%(ext)s" https://www.youtube.com/watch\?v\=mTglmk6y65U
// -f best
