import { MDBRow, MDBCol } from 'mdbreact';
import React from 'react';

let Text = (props: TextPropType) => {
  return (
    <React.Fragment>
      <MDBRow><br /></MDBRow>
      <MDBRow>
        <MDBCol
          size="auto"
        >
          <label id={props.id} htmlFor={props.id}>
            {props.label}
          </label>
        </MDBCol>
        <MDBCol>
          <input
            aria-labelledby={props.id}
            type="text"
            className={props.className}
            id={props.id}
            data-testid={props.testId}
            placeholder={props.placeholder}
            name={props.name}
            value={props.value}
            onChange={props.changeHandler}
          />
        </MDBCol>
      </MDBRow>
    </React.Fragment>
  );
};

export default Text;