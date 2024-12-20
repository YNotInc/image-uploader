let setImageParagraphTag = (para: Text, color: string, imageName: string, imageSize: string, imageWidth: number, imageHeight: number, previewCanvas: HTMLCanvasElement) => {
  // Set Paragraph
  para = document.createTextNode('File Name: ' + imageName + ', File Size: ' + imageSize + ', Width: ' + imageWidth + ', Height: ' + imageHeight);

  let listItem = document.createElement('li');
  listItem.setAttribute('id', 'li-id');


  // listItem.appendChild(lnBreak);
  listItem.appendChild(para);

  let orderedList = document.createElement('ol');
  previewCanvas.appendChild(orderedList);

  orderedList.appendChild(listItem);

  listItem.style.color = color;
  // remove canvas if image added
  removeItem('canvas', previewCanvas);
};

let removeItem = (element: string, previewCanvas: HTMLCanvasElement) => {
  /************************/
  if (previewCanvas) {
    let item = previewCanvas.getElementsByTagName(`${element}`);
    const isItemCreated = item.length ? true : false;
    console.log("item Length", item.length);
    console.log("is item created", isItemCreated);
    console.log("no item", item);
    if (isItemCreated) {
      previewCanvas.removeChild(item[0]);
    }
    /************************/
  }

};

let removeCanvas = (previewCanvas: HTMLCanvasElement) => {
  if (previewCanvas) {
    var canvasElement = previewCanvas.getElementsByTagName('canvas');
    if (canvasElement.length >= 1) {
      removeItem('canvas', previewCanvas);
      removeItem('ol', previewCanvas);
    }
  }

};


let setFileMessage = (tag: string, message: string) => {
  const errorTag = document.getElementById(tag)!;
  if (errorTag) {
    errorTag.innerHTML = message;
  }
};

let getFormattedFileSize = (files: FileList): string => {
  let curFiles = files;
  return returnFileSize(curFiles[0].size)!;
};

/*Returns formatted version of file size*/
let returnFileSize = (number: number) => {
  if (number < 1024) {
    return number + 'bytes'
  } else if (number >= 1024 && number < 1048576) {
    return (number / 1024).toFixed(1) + 'KB'
  } else if (number >= 1048576) {
    return (number / 1048576).toFixed(1) + 'MB'
  }
};

let appendImage = (img: HTMLImageElement, canvas: HTMLCanvasElement, previewCanvas: HTMLCanvasElement) => {
  img.onload = () => {
    // Set canvas dimension to match image
    canvas.width = img.width
    canvas.height = img.height
    // canvas.width = previewCanvas.width;
    // canvas.height = previewCanvas.height;
    var context: CanvasRenderingContext2D = canvas.getContext('2d')!;

    // Draw image to canvas centered
    // https://stackoverflow.com/questions/16317971/draw-images-on-in-the-middle-of-a-canvas
    context.drawImage(img, canvas.width / 2 - img.width / 2,
      canvas.height / 2 - img.height / 2);
    // previewCanvas.appendChild(canvas);
    canvas.setAttribute("class", "img-fluid");
    previewCanvas.prepend(canvas);
  };
};

let checkImageDimensions = (imageWidth: number, imageMin: number, imageHeight: number, imageMax: number) => {
  let areDimensionsValid = false;
  // let para = document.createTextNode('');

  // if dimensions valid
  if (imageWidth >= imageMin && imageWidth <= imageMax && imageHeight >= imageMin && imageHeight <= imageMax) {
    areDimensionsValid = true;
  }
  // dimensions not valid
  else {
    areDimensionsValid = false;
  }
  return areDimensionsValid;
};

let setFileSize = (areDimensionsValid: boolean, errorTag: string, acceptedMsg: string, unacceptedMsg: string, imageName: string, imageSize: string, files: FileList, previewCanvas: HTMLCanvasElement, imageWidth: number, imageHeight: number) => {
  let para = document.createTextNode('');
  if (areDimensionsValid) {
    // Set file size with Units:
    imageSize = getFormattedFileSize(files);
    setImageParagraphTag(para, 'black', imageName, imageSize, imageWidth, imageHeight, previewCanvas);
    setFileMessage(errorTag, acceptedMsg);
    let submitBtn: HTMLButtonElement = document.getElementById('submit-image') as HTMLButtonElement;
    submitBtn.disabled = false;
  }
  else {
    console.log("****DIMENSIONS NOT VALID****");
    const submitImgBtn: HTMLButtonElement = document.getElementById('submit-image') as HTMLButtonElement;
    submitImgBtn.disabled = true;

    // Set file size with Units:
    imageSize = getFormattedFileSize(files);
    setImageParagraphTag(para, 'red', imageName, imageSize, imageWidth, imageHeight, previewCanvas);
    setFileMessage(errorTag, unacceptedMsg);
  }
  return imageSize;
};

let isFileSelected = (input: HTMLInputElement) => {
  let curFiles = input ? input.files : null;
  return curFiles;
};

let imgOnError = (previewCanvas: HTMLCanvasElement, imageWidth: number, imageMax: number, imageHeight: number, errorTag: string, invalidMsg: string) => {
  if (imageWidth <= imageMax && imageHeight <= imageMax) {
    console.log('NOT A Valid File: ');
    setFileMessage(errorTag, invalidMsg);
    const submitImgBtn: HTMLButtonElement = document.getElementById('submit-image') as HTMLButtonElement;
    submitImgBtn.disabled = true;
    console.log("IMAGE ERROR ONLOAD");
  }
  // Remove Canvas and Paragraph for wrong dimensions or no file.
  removeCanvas(previewCanvas);
  console.log("in imgONERROR");
}; // oneerror


let displayImage = (img: HTMLImageElement, areDimensionsValid: boolean, previewCanvas: HTMLCanvasElement) => {
  var canvasElement = previewCanvas.getElementsByTagName('canvas');
  var canvas = document.createElement('canvas');
  console.log("DISPLAYIMAGE CANVASELEMENT:", canvasElement);
  if (!areDimensionsValid) {

  }
  // No Image added to canvas
  else if (canvasElement.length === 0) {
    appendImage(img, canvas, previewCanvas)
  }
  // Image added to canvas
  else {
    removeItem('canvas', previewCanvas);
    appendImage(img, canvas, previewCanvas);
  }
};

let loadImage = (img: HTMLImageElement, blob: Blob): Promise<ImagePropsType> => {
  console.log("IMG", img, "BLOB", blob);
  return new Promise(function (resolve, reject) {
    // define source
    img.src = URL.createObjectURL(blob);
    // resolve promise onLoad
    img.onload = () => {

      const imageProps: ImagePropsType = {
        imageName: blob.name,
        imageHeight: img.height,
        imageWidth: img.width,
        imageSize: blob.size,
        imageSrc: img.src
      };
      resolve(imageProps);
    };
    // reject promise onError
    img.onerror = () => {
      reject("rejected");
    };
  });
};

/* Base64 Decoder: Remove the metadata
https://www.base64decode.net/base64-image-decoder */
let convertImageFromUrlToBase64String = async (url: string): Promise<string> => {
  console.log("In convertImageStart");
  var img = new Image();
  img.crossOrigin = 'Anonymous'
  var dataUrl;
  return new Promise(function (resolve, reject) {
    // Setting the img.src will call img.onload when the src is loaded
    console.log("URL1: ", url);
    // Pull Width/Height from URL and store in img objec
    img.src = url;// url is the img src
    console.log("URL2: ", url);

    img.onload = () => {
      var canvas = document.createElement('canvas');
      console.log(`canvas width: ${canvas.width}`);
      canvas.width = img.width;
      canvas.height = img.height;
      console.log("IMGWIDTH:", img.width, "IMGHEIGHT:", img.height);

      // Get a canvas reference to draw to the canvas
      var context: CanvasRenderingContext2D = canvas.getContext('2d')!;
      console.log(`canvas width: ${canvas.width}`);
      // Draw image to the canvas centered
      // https://stackoverflow.com/questions/16317971/draw-images-on-in-the-middle-of-a-canvas
      context.drawImage(img, canvas.width / 2 - img.width / 2,
        canvas.height / 2 - img.height / 2);
      // Return a data URI containing a representation of the image in jpg format
      dataUrl = canvas.toDataURL('image/jpg');
      console.log("Images loaded helper.js resolved", typeof dataUrl);
      resolve(dataUrl);
    };

    // reject promis onError
    img.onerror = (err) => {
      reject("image rejected in BASE64 Conversion:"+ err);
    };
  }); // promise
};// convertImage

// Check whether the file type of the input file is valid
let isFileTypeValid = (file: File, fileTypes: string[]) => {
  if (file) {
    console.log("FILEType :", file.type);
    for (var i = 0; i < fileTypes.length; i++) {
      if (file.type === fileTypes[i]) {
        return true;
      }
    }
  }
  else
    return false;
};

export {
  setImageParagraphTag, removeItem, removeCanvas, setFileMessage, getFormattedFileSize, appendImage, checkImageDimensions, setFileSize, isFileSelected, imgOnError, displayImage,
  loadImage, convertImageFromUrlToBase64String, isFileTypeValid, returnFileSize
};