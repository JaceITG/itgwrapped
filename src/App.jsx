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
      {/* todo: defo some sort of async thing so that we load the results page only after all stats are processed */}
      {file === 0 ?
        <div className="title-screen">
          <div className="title-screen-text-wrapper">
            <p className="title-screen-text-a">ITG</p>
            <p className="title-screen-text-b">Wrapped</p>
            <p className="title-screen-text-info">Import a Stats.xml here!</p>
          </div>
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
