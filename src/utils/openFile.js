
import { readFile } from './readFile'

async function openFileBrowser ({ filter, multiple }) {
  return new Promise((resolve, reject) => {
    let input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', filter.map((ext) => `.${ext}`).join(','))
    if (multiple)
      input.setAttribute('multiple', true)
    input.click()
    input.addEventListener('change', (evt) => {
      resolve(evt.path[0].files)
    }, {
      once: true
    })
    // cleanup
    setTimeout(() => resolve([]), 1000 * 60 * 2)
  })
}

// Read and parse files
// files: Target array where results are stored, options like multiple will be applied
// newFiles: Files that may be added to files after read/parse
// filter: Filter against requested files. TODO: Use mime type magic number detection
// multiple: If true you can add more than one file
export async function parseFiles ({ files, newFiles, filter, multiple }) {
  for (const file of newFiles) {
    if (!files.find((el) => el.name == file.name && el.size == file.size)) {
      for (const ext of filter) {
        // filter against allowed file types. TODO: Use MimeType detection based on magic numbers
        if (file.type.includes(ext)) {
          // create a preview image, if type is image
          let preview
          const data = await readFile(file)

          if (file.type.includes('image')) {
            preview = data
          }
          const obj = { name: file.name, type: file.type, size: file.size, preview, data }
          if (multiple)
            files.push(obj)
          else
            files.splice(0, 1, obj)
        }
      }
    }
  }
}

// open Browser file dialog/electron dialog and reads the file(s)
// NOTE: It's not possible to detect the close event of the browser dialog. We cleanup after 2mins
// filter: Array of possible extensions ['json','png']
// multiple: If true the user can select multiple files
export async function openFile ({ files, filter, multiple }) {
  if (window.electron) {
    return await window.electron.openFileDialog({ files, filter, multiple })
  } else {
    const newFiles = await openFileBrowser({ filter, multiple })
    return await parseFiles({ files, newFiles, filter, multiple })
  }
}


export default { openFile }