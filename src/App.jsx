import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import XmlParser from './components/xmlParser';

function App() {
  const [file, setFile] = useState(0)

  function handleChange(event) {
    setFile(event.target.files[0])
  }

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
  }

  return (
    <>
      { file === 0 ?
        <div className="card">
          <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleChange} />
          <button type="submit">Upload</button>
          </form>
        </div>
      :
        <div className="container">
          <XmlParser stats={URL.createObjectURL(file)} />
        </div>
      }
    </>
  )
}

export default App
