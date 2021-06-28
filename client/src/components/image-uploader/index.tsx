import React from 'react';
import { MDBCol, MDBRow } from "mdbreact";
import { ImageSelector } from "../image-selector";
import './styles.css';

// export class Uploader extends Component {
export let ImageUploader = (props: ImageUploadPropType) => {
  let { image, uploaderBorder } = props;
  // create ref
  let imageSelectRef: ImageUploadRefObject<HTMLInputElement> = React.createRef();
  let previewCanvasRef: ImageUploadRefObject<HTMLInputElement> = React.createRef();

  return (
    <React.Fragment>
      <MDBCol size="1" className={uploaderBorder}>
        {/* BLANK */}
      </MDBCol>

      {/* BROWSE BUTTON */}
      <MDBCol size="4">
        {/* Display Image */}
        <div className="col-12 input-border">
          {/********IMAGE PREVIEW CANVAS*********/}
          <MDBRow>
            <div className="name-container name-container-border">
              <div
                className="preview"
                ref={previewCanvasRef}>
                {/* <h4>Image Preview</h4> */}
                <p id="file-msg"></p>
              </div>
            </div>
          </MDBRow>
          <MDBRow>
            <ImageSelector
              imageName={image.imageName}
              imageClassName={image.className}
              imageType={image.type}
              submitBtnId={image.submitBtnId}
              imageSelectRef={imageSelectRef}
              previewCanvasRef={previewCanvasRef}
              aria={"inputGroupFileAddon01"}
              fileTypes={".png, .jpeg, .jpg"}
              selectImage={props.selectImage}
            />
          </MDBRow>
        </div>
      </MDBCol>
    </React.Fragment >
  )
};