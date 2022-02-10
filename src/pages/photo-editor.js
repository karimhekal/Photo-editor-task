import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import usePanZoom from "use-pan-and-zoom";

import "../styles/photo-editor.scss";


const PhotoEditor = () => {

  const [minX, setMinX] = useState(0)
  const [minY, setMinY] = useState(0)
  const [maxX, setMaxX] = useState(0)
  const [maxY, setMaxY] = useState(0)

  const { transform, panZoomHandlers, setZoom, container, setContainer } = usePanZoom({
    minX: minX,
    maxX: maxX,
    maxY: maxY,
    minY: minY,
    enableZoom: false,
  });
  const imageRef = useRef(null)
  const containerRef = useRef(null)

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      maxFiles: 1,
      multiple: false,
      accept: "image/*",
    });

  const selectedImage = acceptedFiles.length > 0 && (
    <img
      ref={imageRef}
      alt={acceptedFiles[0].name}
      key={acceptedFiles[0].path}
      src={URL.createObjectURL(acceptedFiles[0])}
    />
  );


  useEffect(() => {
    if (imageRef.current && containerRef.current) {
      console.log(imageRef.current.getBoundingClientRect().width);
      console.log(containerRef.current.getBoundingClientRect().width);
      console.log(container.offsetWidth);
      if (imageRef.current.getBoundingClientRect().width > containerRef.current.getBoundingClientRect().width) {
        console.log('width : img > container');
        setMaxX((imageRef.current.getBoundingClientRect().width - containerRef.current.getBoundingClientRect().width))
        setMinX(-(imageRef.current.getBoundingClientRect().width - containerRef.current.getBoundingClientRect().width))
      }
      else if (containerRef.current.getBoundingClientRect().width >= imageRef.current.getBoundingClientRect().width) {
        console.log('width : containr >= img');
        setMaxX(15) // to give some space to move the image on the y axis
        setMinX(-15) 
      }

      if (imageRef.current.getBoundingClientRect().height > containerRef.current.getBoundingClientRect().height) {
        setMaxY(container.offsetHeight/6)
        setMinY(container.offsetHeight/8)
      }
      else if (containerRef.current.getBoundingClientRect().height >= imageRef.current.getBoundingClientRect().height) {
        setMaxY(imageRef.current.getBoundingClientRect().height - containerRef.current.getBoundingClientRect().height)
        setMinY(containerRef.current.getBoundingClientRect().height / 4)
      }
    }
  }, [container, imageRef.current, containerRef.current])


  return (
    <div className="App">
      <div className="photo-editor">
        <div
          className="photo-viewer">
          <div
            ref={containerRef}
            style={{ display: 'flex' }}
          >
            <div

              className="image-outer-container"
              ref={(el) => setContainer(el)}
              {...panZoomHandlers}
            >
              <div
                className="image-inner-container"
                style={{ transform }}>
                {selectedImage}
              </div>
            </div>
          </div>
        </div>
        <div className="drop-zone" {...getRootProps()}>
          <input {...getInputProps()} />
          <div className="text">
            {isDragActive ? (
              <p>Drop the images here</p>
            ) : (
              <div>
                <i className="n-icon n-icon-upload"></i>
                <p>Drag &amp; Drop or click to select an image</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditor;
