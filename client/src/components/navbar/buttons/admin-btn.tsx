import {
    MDBDropdownItem, MDBNavLink
    } from "mdbreact";

let AdminBtn = (props: AdminBtnPropType) => {
  return(
      <MDBNavLink
        to={props.route}
      >
        <MDBDropdownItem
          name={props.name}
          onClick={props.captureEvent}
        >{props.name}</MDBDropdownItem>
      </MDBNavLink>
  )
};

export default AdminBtn;