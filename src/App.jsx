import { useState, useCallback } from 'react'
import XmlParser from './components/xmlParser';
import Dropzone from 'react-dropzone';

function App() {
  const [file, setFile] = useState(0);

    //Read dropped file as Data URL
    const handleChange = useCallback((acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader()

        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = () => {
          const dataUrl = reader.result
          setFile(dataUrl);
        }
        reader.readAsDataURL(file);
      })
    });

  return (
    <>
      {/* todo: defo some sort of async thing so that we load the results page only after all stats are processed */}
      {file === 0 ?
        <div className="title-screen">
          <div className="title-screen-text-wrapper">
            <p className="title-screen-text-a">ITG</p>
            <p className="title-screen-text-b">Wrapped</p>
          </div>
          <Dropzone  onDrop={acceptedFiles => handleChange(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div className="title-screen-dropzone" {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p className="title-screen-text-info">Import a Stats.xml here!</p>
                </div>
              </section>
            )}
          </Dropzone>
        </div>
        :
        <div className="container">
          <XmlParser stats={file} />
        </div>
      }
    </>
  )
}

export default App
