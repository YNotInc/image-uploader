import React from 'react';
import "./styles.css";

// export class Uploader extends Component {
export let ImageSelector = (
    props: ImageSelectorPropType) => {

    return (
        <React.Fragment>
            <div className={"input-group img-select-btn"}>
                <label 
                className="image-label  visually-hidden" htmlFor={props.submitBtnId}>Select Image:</label>
                <input
                    type={props.imageType}
                    className={`${props.imageClassName} border`}
                    id={props.submitBtnId}
                    ref={props.imageSelectRef}
                    aria-describedby="inputGroupFileAddon01"
                    name={props.imageName}
                    accept={props.fileTypes}
                    onChange={
                        (event) => {
                            props.selectImage(event, props.imageSelectRef, props.previewCanvasRef);
                        }
                    }
                />
                </div>
        </React.Fragment >
    )
};