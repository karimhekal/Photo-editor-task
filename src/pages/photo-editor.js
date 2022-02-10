import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import usePanZoom from "use-pan-and-zoom";
import "../styles/photo-editor.scss";

const PhotoEditor = () => {
  const [minX, setMinX] = useState()
  const [minY, setMinY] = useState()
  const [maxX, setMaxX] = useState()
  const [maxY, setMaxY] = useState()
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [rotateDegree, setRotate] = useState(0);
  const imageRef = useRef(null)
  const containerRef = useRef(null)

  const { transform, panZoomHandlers, container, setContainer } = usePanZoom({
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
      style={{ transform: `scaleX(${scaleX}) scaleY(${scaleY}) rotate(${rotateDegree}deg)` }}
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
      setMinX(containerWidth - imageWidth - (containerWidth - imageWidth) * 0.5 - imageWidth * 0.2)
      setMaxX(containerWidth - imageWidth - (containerWidth - imageWidth) * 0.5 + imageWidth * 0.05)
      const containerHeight = container.offsetHeight;
      const imageHeight = imageRef.current.getBoundingClientRect().height;
      setMinY(containerHeight - imageHeight - (containerHeight - imageHeight) * 0.5 - imageHeight * 0.2)
      setMaxY(containerHeight - imageHeight - (containerHeight - imageHeight) * 0.5 + imageHeight * 0.2)
    }
  }, [container, scaleX, scaleY, rotateDegree, imageRef, transform, imageRef.current, containerRef.current])

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
      <div className="actions">
        <button onClick={() => setScaleX(-scaleX)}>Flip Horizontaly</button>
        <button onClick={() => setScaleY(-scaleY)}>Flip Verticaly</button>
        <button onClick={() => setRotate(rotateDegree + 90)}>Rotate 90 degrees</button>
      </div>
    </div>
  );
};

export default PhotoEditor;
