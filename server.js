const fs = require('fs')
const cmd = require('xecutor')
const Sirloin = require('sirloin')

const app = new Sirloin({ files: 'files' })
app.post('/convert', async (req, res) => {
  const { format, address } = req.params
  const id = (Math.random() * 10000000000).toFixed(0)
  console.log('FORMAT:', format)
  console.log('ADDRESS:', address)

  const options = format === 'music'
    ? `--extract-audio --audio-format mp3`
    : ``
  const command = `youtube-dl ${options} -f best -o "files/${id}/%(title)s.%(ext)s" ${address}`
  console.log('COMMAND:', command)
  cmd.run(`${command} > files/${id}.log`)

  const files = fs.readdirSync(`files/${id}`)
  console.log(files)
  return { name: `${id}/${files[0]}` }
  // return { id }
})

// MP3: youtube-dl --extract-audio --audio-format mp3 -f best -o "%(title)s.%(ext)s" https://www.youtube.com/watch\?v\=mTglmk6y65U
// VIDEO: youtube-dl -f best -o "%(title)s.%(ext)s" https://www.youtube.com/watch\?v\=mTglmk6y65U
// -f best
