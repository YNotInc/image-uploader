import { ChangeEvent, Component, useRef } from "react";
import {
  MDBNavbar,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBIcon,
} from "mdbreact";
import * as auth from "../../utils/authentication-store";
import Can from "../can";
import { navbarOptions } from "./btn-data/index";
import "./btn-data/style.css";
import { urlParser } from "../../utils/url-parser";
// import { string } from "prop-types";
// import { RefObject } from "react";
// import { createRef } from "react";
// import { isTemplateExpression } from "typescript";
import UserBtn from './buttons/user-btn';
import AdminBtn from "./buttons/admin-btn";
import LoginBtn from "./buttons/login-btn";
class NavbarPage extends Component<NavbarPagePropType> {
  state: NavbarPageStateType;
  loggedOut!: boolean;

  constructor(props: NavbarPagePropType) {
    super(props);
    const navItems: NavbarType = navbarOptions(this.props);
    this.state = {
      activeIndex: 0,
      activeName: '',
      isOpen: false,
      role: this.props.role,
      redirect: this.props.redirect,
      loggedOut: this.props.loggedOut,
      refreshPage: this.props.refreshPage,
      myNav: navItems,
      currentPage: '',
      homeLink: '',
    }; //state
    console.log("First STate ROLE:", this.props.role)
    console.log("myNavAll:", this.state.myNav);
    console.log("myNav userItems:", this.state.myNav.userItems);
    this.handleChangeActive = this.handleChangeActive.bind(this);
  } // constructor

  componentDidMount() {
  } //

  handleChangeActive(event: ChangeEvent<HTMLInputElement>, button: UserItemsType | AdminItemType | LoginItemType, activeIndex: number) {
    this.props.handlePageClick(event);
    // this.setState({ activeIndex: newActiveIndex });
    const curBtnName = event.target.name;
    const hmOrProdBtnSelected = curBtnName === 'home' || curBtnName === 'products';
    console.log("BUTTONEVENT:", event.target.name);
    console.log("ActiveIndex:", activeIndex);
    console.log("BUTTON:", button);
    console.log("BUTTONNAME", button.name);
    // const activeName = button.name;
    //urlParser is launching before page settled
    console.log("PageName:", urlParser());

    // SetState is asyc, so use a callback method
    // Set the active index to the current page
    if (hmOrProdBtnSelected) {
      this.setState({
        activeIndex,
        activeName: button.name
      }, () => {
        console.log("State BUTTONNAME:", this.state.activeName);
        console.log("State BUTTONIndex:", this.state.activeIndex);
      });
    }

    // Set LoggedOut to true when logout is clicked
    if (event.target.name === "logout") {
      this.props.setRole("visitor", true);
      auth.resetLocalStorage();
    }
  }

  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  componentDidUpdate() {

    /***********************
   * 05/25/2020
   * 1) Trigger refresh on login and logout
    /************************************** */
    console.log("Navbar/index.js just update");
    // console.log("CurrentPage:", this.props.currentPage);
    if (this.props.currentPage === "Logout") {
      // When credentials are cleared force password reset, since no new page is displayed
      // console.log("Navbar In LOGOUT1, currentPage:", this.props.currentPage)
      // console.log("NAVBAR: DIDMOUNT componentDidMount");
      // console.log("NAVBAR: DIDMOUNT state.Role:", this.state.role);
      // console.log("NAVBAR: DIDMOUNT props.Role:", this.props.role);
      // console.log("NAVBAR: DIDMOUNT state.loggedOut:", this.state.loggedOut);
      // console.log("Navbar: DIDMOUNT ComponentDIDMOUNT");

      /******************************************
       Authorization-Part1:
       ********************* 
       Clear Credentails on 
       Logout making state.role out of sync with 
       prop.role
       ******************************************/
      auth.resetLocalStorage();
      if (
        this.state.role !== "visitor" &&
        !this.loggedOut &&
        this.state.role === this.props.role
      ) {
        console.log("LOG USER OUT IN NAV");
        console.log(
          "Navbar1: userRole =",
          this.state.role,
          "LoggedOut:",
          this.state.loggedOut
        );
        this.props.setRole("visitor", true);
      } else if (
        /******************************************
       Authorization-Part2: 
       *******************
       Catch the out-of-sync props.role and 
       state.role, indicating a logout state
       ******************************************/
        this.state.role !== this.props.role &&
        this.state.role !== "visitor"
      ) {
        this.setState({ role: "visitor" });
        console.log(
          "Navbar2: userRole =",
          this.state.role,
          "LoggedOut:",
          this.state.loggedOut
        );
        this.props.redirectHome();
      }
    }
  } //componentDidUpdate

  render() {
    var userRole = this.state.role;
    console.log("NAVBAR CONTAINER: userRole =", userRole);
    const { activeIndex } = this.state;

    console.log("PropsCurrentPage: ", this.props.currentPage);
    console.log("PropsName: ", this.props.name);

    let loggedOut = this.props.loggedOut;
    // let role = this.props.role;
    return (
      <MDBNavbar
        color="default-color"
        expand="md"
        className="sticky-top z-depth-6"
        id="main-header"
      >
        {/* id="main-header" */}
        {/* <!-- Navbar brand --> */}
        <a
          className="navbar-brand"
          href="#!"
        >
          {"Brand"}
        </a>
        <MDBNavbarToggler
          onClick={this.toggleCollapse}
        >
          <i className="fas fa-bars"></i>
        </MDBNavbarToggler>
        <MDBCollapse
          id="navbarCollapse3"
          isOpen={this.state.isOpen}
          navbar
        >
          <MDBNavbarNav left>
            {this.state.myNav.userItems?.map((btn: UserItemsType, btnIdx: number) => {
              console.log("UserItems:", btn);
              return (<UserBtn
                activeIndex={activeIndex}
                activeName={btn.name}
                buttonIndex={btnIdx}
                userRole={userRole}
                authorization={btn.authorization}
                captureEvent={(e) => { this.handleChangeActive(e, btn, btnIdx) }}
                name={btn.name}
                route={btn.route}
                label={btn.label}
                key={btn.key}
              />)
            })}
            <Can
              role={userRole}
              perform="products:insert"
              yes={() => (
                <>
                  {!loggedOut ?<MDBNavItem>
                    <MDBDropdown>
                      <MDBDropdownToggle nav caret>
                        <span className="mr-2">Admin</span>
                      </MDBDropdownToggle>
                      <MDBDropdownMenu className="dropdown-default">
                        {
                          this.state.myNav.adminItem?.map((btn: AdminItemType, btnIdx: number) => {
                            console.log("AdminItems:", btn);
                            return (<AdminBtn
                              name={btn.name}
                              route={btn.route}
                              key={btn.key}
                              captureEvent={(event) => { this.handleChangeActive(event, btn, btnIdx) }}
                            />)
                          })
                        }
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </MDBNavItem>: ''}
                </>
              )}
              no={() => <></>}
            />
          </MDBNavbarNav>
          <MDBNavbarNav right>
            <MDBNavItem>
              <MDBNavLink
                activeClassName={"not-active"}
                className="waves-effect waves-light"
                to="#!"
              >
                <MDBIcon fab icon="twitter" />
              </MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink
                activeClassName={"not-active"}
                className="waves-effect waves-light"
                to="#!"
              >
                <MDBIcon
                  fab icon="google-plus-g" />
              </MDBNavLink>
            </MDBNavItem>

            <MDBNavItem>
              <MDBDropdown>
                <MDBDropdownToggle nav caret>
                  <MDBIcon icon="user" />
                </MDBDropdownToggle>
                <MDBDropdownMenu className="dropdown-default" right>
                  {
                    this.state.myNav.loginItem?.map((btn: LoginItemType, btnIdx: number) => {
                      console.log("LoginItems:", btn);
                      return (<LoginBtn
                        name={btn.name}
                        route={btn.route}
                        key={btn.key}
                        captureEvent={(event) => { this.handleChangeActive(event, btn, btnIdx) }}
                        setRole={this.props.setRole}
                        role={this.props.role}
                      />)
                    })
                  }
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBNavbar>
    );
  } //render
}

export default NavbarPage;