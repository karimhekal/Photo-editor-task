import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import usePanZoom from "use-pan-and-zoom";
import { exportAsImage } from "../functions/exportAsImage";
import "../styles/photo-editor.scss";


let swtch = false;
const PhotoEditor = () => {
  const [minX, setMinX] = useState()
  const [minY, setMinY] = useState()
  const [maxX, setMaxX] = useState()
  const [maxY, setMaxY] = useState()

  const [scalePercentageWidth, setScalePercentageWidth] = useState(100);
  const [scalePercentageHeight, setScalePercentageHeight] = useState(200);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const imageRef = useRef(null)

  const { transform, setZoom, panZoomHandlers, container, setContainer } = usePanZoom({
    minX: minX,
    maxX: maxX,
    maxY: maxY,
    minY: minY,
    enableZoom: false,
  });

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      maxFiles: 1,
      multiple: false,
      accept: "image/*",
    });

  const selectedImage = acceptedFiles.length > 0 && (
    <img
      style={{ maxWidth: `${scalePercentageWidth}%`, maxHeight: `${scalePercentageHeight}%`, transform: `scaleX(${scaleX}) scaleY(${scaleY})` }}
      ref={imageRef}
      alt={acceptedFiles[0].name}
      key={acceptedFiles[0].path}
      src={URL.createObjectURL(acceptedFiles[0])}
    />
  );
  useEffect(() => {
    if (imageRef.current && container) { //preventing null exception error

      const containerWidth = container.offsetWidth;
      const imageWidth = imageRef.current.getBoundingClientRect().width;

      const containerHeight = container.offsetHeight;
      const imageHeight = imageRef.current.getBoundingClientRect().height;


      if (containerHeight < imageHeight) {
        console.log('container < image   height');
        console.log(imageHeight);
        console.log(containerHeight);
        setMinX(-(imageWidth - containerWidth) - containerWidth * 0.1)
        setMaxX(-(imageWidth - containerWidth) + (imageWidth - containerWidth) + containerWidth * 0.1)
        setMinY(-(imageHeight - containerHeight) - containerHeight * 0.1)
        setMaxY(-(imageHeight - containerHeight) + (imageHeight - containerHeight) + containerHeight * 0.1)
      }
      else if (containerHeight > imageHeight) {
        console.log('image < container   height');
        setMinX(containerWidth - imageWidth - (containerWidth - imageWidth) * 0.5 - imageWidth * 0.05)
        setMaxX(containerWidth - imageWidth - (containerWidth - imageWidth) * 0.5 + imageWidth * 0.05)
        setMinY(containerHeight - imageHeight - (containerHeight - imageHeight) * 0.5 - imageHeight * 0.1)
        setMaxY(containerHeight - imageHeight - (containerHeight - imageHeight) * 0.5 + imageHeight * 0.1)

      }
      console.log(imageWidth)
      console.log(containerWidth);
      console.log(minX);
    }
  }, [container, scaleX, scaleY, imageRef, transform, imageRef.current])


  function setZoomPercentage() {
    if (scalePercentageWidth === 100) {
      setScalePercentageWidth(200)
    }
    else if (scalePercentageWidth === 200) {
      setScalePercentageWidth(100)
    }
    if (scalePercentageHeight === 200 && (imageRef.current.getBoundingClientRect().width / container.width) > 0.8) {
      setScalePercentageHeight(100)
    }
    else if (scalePercentageHeight === 100) {
      setScalePercentageHeight(200)
    }

  }
  const captureRef = useRef();
  return (
    <div className="App" ref={captureRef} >
      <div className="photo-editor">
        <div
          className="photo-viewer">
          <div
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
      <div className="actions">
        <button onClick={() => setScaleX(-scaleX)}>Flip Horizontaly</button>
        <button onClick={() => setScaleY(-scaleY)}>Flip Verticaly</button>
        <button onClick={() => setZoomPercentage()}>Zoom in / out</button>
        {/* <button onClick={() => setRotate(rotateDegree + 90)}>Rotate 90 degrees</button> */}
      </div>
    </div>
  );
};

export default PhotoEditor;
