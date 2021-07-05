import { MDBRow, MDBCol } from 'mdbreact';
import React from 'react';

let Text = (props: TextPropType) => {
  return (
    <React.Fragment>
      <label htmlFor={props.label} />
      <MDBRow>
        <MDBCol
          size="auto"
        >
          {props.label}
      </MDBCol>
        <MDBCol>
          <input
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