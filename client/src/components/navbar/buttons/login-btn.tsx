import {
  MDBDropdownItem, MDBNavLink
} from "mdbreact"; 

let LoginBtn = (props: LoginBtnPropType) => {
  return (
    <MDBNavLink to={props.route}>
      <MDBDropdownItem
        name={props.name}
        onClick={props.captureEvent}
      >
        {props.name}
      </MDBDropdownItem>
    </MDBNavLink>
  )
};

export default LoginBtn;