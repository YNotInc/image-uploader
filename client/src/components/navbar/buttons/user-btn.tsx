import {
  MDBNavItem, MDBNavLink
} from "mdbreact"; 
import Can from "../../can";
import "./styles.css";

function UserBtn(props: UserBtnPropType) {
  console.log("USERBUTTON PROPS:", props);
  const curBtnSelected = props.activeIndex===props.buttonIndex && props.activeName===props.name;
  return (<Can
    role={props.userRole}
    perform={props.authorization}
    yes={() => (
      <>
        <MDBNavItem
          onClick={props.captureEvent}
        >
          <MDBNavLink
            activeClassName={curBtnSelected? "activate": "de-activate"}
            active={false}
            name={props.name}
            to={props.route}
          >
            {props.label}
          </MDBNavLink>
        </MDBNavItem>
      </>
      // </span>
    )}
    no={() => <></>}
  />)
};

export default UserBtn;