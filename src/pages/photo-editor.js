import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import usePanZoom from "use-pan-and-zoom";

import "../styles/photo-editor.scss";


const PhotoEditor = () => {

  const [minX, setMinX] = useState(0)
  const [minY, setMinY] = useState(0)
  const [maxX, setMaxX] = useState(0)
  const [maxY, setMaxY] = useState(0)

  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)

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

  let position = ''
  if (imageRef.current) {
    position = imageRef.current.getBoundingClientRect()
  }




  useEffect(() => {
    if (container) {
      console.log(container.offsetHeight);
      console.log(container.offsetHeight / 4);
    }
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
        setMaxX(15)
        setMinX(-15)
        // setZoom(2)
      }

      if (imageRef.current.getBoundingClientRect().height > containerRef.current.getBoundingClientRect().height) {
        console.log('height : img > container');
        // console.log(containerRef.current.getBoundingClientRect().height);
        // console.log(containerHeight);
        setMaxY(container.offsetHeight/6)
        // console.log(containerRef.current.getBoundingClientRect());
        setMinY(container.offsetHeight-(imageRef.current.getBoundingClientRect().height)-(container.offsetHeight/4))
        console.log(container.offsetHeight/4);
        // setZoom(2)
      }
      else if (containerRef.current.getBoundingClientRect().height >= imageRef.current.getBoundingClientRect().height) {
        console.log('height : container >= img');
        setMaxY(imageRef.current.getBoundingClientRect().height - containerRef.current.getBoundingClientRect().height)
        setMinY(containerRef.current.getBoundingClientRect().height / 4)
      }
    }
  }, [container, imageRef.current, maxX, maxY, containerRef.current])
  // useEffect(() => {
  //   if (container && imageRef.current) {
  //     console.log((containerRef.current.offsetWidth));
  //     console.log((imageRef.current.offsetWidth));
  //     if ((containerRef.current.offsetWidth) / (imageRef.current.offsetWidth) > 1)
  //       setMaxX((containerRef.current.offsetWidth) - (imageRef.current.offsetWidth))
  //   }


  // }, [container, position])
  // useEffect(() => {
  //   console.log(imageRef);
  // }, [imageRef])





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
