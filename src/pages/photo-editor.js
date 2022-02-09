import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import usePanZoom from "use-pan-and-zoom";

import "../styles/photo-editor.scss";

const PhotoEditor = () => {
  const [minX, setMinX] = useState(0)
  const [minY, setMinY] = useState(0)
  const [maxX, setMaxX] = useState(0)
  const [maxY, setMaxY] = useState(0)
  const { transform, panZoomHandlers, container, setContainer, center, pan } = usePanZoom({
    initialZoom: 2,
    // minX: -320 / 3,
    // maxX: 320 / 3,
    // minY: -160,
    // maxY: (160),
    minY: minY,
    maxY: maxY,
    minX: minX,
    maxX: maxX,

    enableZoom: false,
    onPan: (touches, transform) => {
      console.log('X : ' + transform.x);
      console.log('Y : ' + transform.y);
    }
  });


  
  const imageRef = useRef(null)
  const uploadedImgRef = useRef(null)
  let position = ''
  if (imageRef.current) {
    position = imageRef.current.getBoundingClientRect()
  }
  let positionOfUploadedImg
  if (uploadedImgRef.current) {
    positionOfUploadedImg = uploadedImgRef.current.getBoundingClientRect()
  }

  useEffect(() => {
    if (container) {
      console.log('height : ' + container.offsetHeight);
      console.log('width : ' + container.offsetWidth);
      setMinY(-(container.offsetHeight) / 2)
      setMaxY((container.offsetHeight) / 2)
      setMinX((-container.offsetWidth / 2) / 3)
      setMaxX((container.offsetWidth / 2) / 3)
    }
    // console.log(container);
    // console.log(center.y);
    // setMaxX(center.y+position.x)
    // setMaxX(position.x - position.width)
    // setMaxY(position.y + position.height)
    // if (position.top) {
    //   console.log('------- position of splash --------');
    //   console.log('position');
    //   console.log('top : ' + position.top);
    //   console.log('bottom : ' + position.bottom);
    //   console.log('height : ' + position.height);
    //   console.log('------- positionOfUploadedImg ------');
    //   console.log('top : ' + positionOfUploadedImg.top);
    //   console.log('bottom : ' + positionOfUploadedImg.bottom);
    //   console.log('height : ' + positionOfUploadedImg.height);
    // }
  }, [container,position, positionOfUploadedImg])


  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      maxFiles: 1,
      multiple: false,
      accept: "image/*",
    });

  const selectedImage = acceptedFiles.length > 0 && (
    <img
      alt={acceptedFiles[0].name}
      key={acceptedFiles[0].path}
      src={URL.createObjectURL(acceptedFiles[0])}
    />
  );

  return (
    <div className="App">
      <div className="photo-editor">
        <div
          className="photo-viewer">
          <div
            ref={imageRef}

          >
            <div

              className="image-outer-container"
              ref={(el) => setContainer(el)}
              {...panZoomHandlers}
            >
              <div ref={uploadedImgRef} className="image-inner-container" style={{ transform }}>
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
