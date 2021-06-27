import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Footer from "./components/footer";
// Import Components
import Navbar from "./components/navbar/index";
import history from "./history";
// Import Pages
import HomeContainer from "./pages/HomeContainer";
import LoginContainer from "./pages/LoginContainer";
import ProductInsertContainer from "./pages/ProductInsertContainer";
import ProductsListContainer from "./pages/ProductsListContainer";
import ProductUpdateContainer from "./pages/ProductUpdateContainer";
import ProductViewContainer from "./pages/ProductViewContainer";
import RegistrationContainer from "./pages/RegistrationContainer";
import * as auth from "./utils/authentication-store";
import UploadSpinner from "./components/upload-spinner";
import * as authenticationStore from "./utils/authentication-store";

class App extends Component {
  constructor() {
    super();

    this.state = {
      currentPage: "",
      name: "",
      role: "",
      loading: false,
      redirect: false,
      loggedOut: false,
      credentialsValid: false,
      refresh_token: "",
      authToken: "",
    };

    this.handlePageClick = this.handlePageClick.bind(this);
    this.redirectHome = this.redirectHome.bind(this);
    this.redirectLogin = this.redirectLogin.bind(this);
    this.getRole = this.getRole.bind(this);
    this.setRole = this.setRole.bind(this);
    this.areCredentialsValid = this.areCredentialsValid.bind(this);
  } //constructor

  componentDidMount() {
    this.getRole();
    this.areCredentialsValid();
  }

  setRole(role, loggedOut) {
    this.setState({
      role: role,
      loggedOut: loggedOut,
    });
  }

  async areCredentialsValid() {
    const hasAccessTokenExpired = await authenticationStore.hasAccessTokenExpired();
    const credentialsValid = !hasAccessTokenExpired;
    this.setState({ credentialsValid: credentialsValid });
    return credentialsValid;
  }

  // Taken from productionListContainer
  async getRole() {
    const localStateObj = await auth.getLocalStorage();
    console.log("APPJS. LOCALSTATEOBJ:", localStateObj);

    let authToken = "Bearer " + localStateObj.access_token;
    console.log(`APP.js authToken: ${authToken}`);
    let refresh_token = localStateObj.refresh_token;
    console.log(`APP.js refresh_Token: ${refresh_token}`);

    // this.setState(localStateObj);
    console.log("EMAIL:", localStateObj.email);
    const email = localStateObj.email;
    console.log("Navbar Mount3 Email:", email);

    /* Set user role on state, by using call back
    function instead of async await */
    this.setState({ 
      refresh_token,
      authToken,
      loading: true,
    });

    const role = await auth
      .setUserRole(email, this.state.authToken, this.state.refresh_token)
      .then((data) => {
        console.log("setUserRole:", data.role);
        this.setState({ role: data.role });
        this.setState({ loading: false });
        console.log("AFTER WILLMOUNT LOAD user:", this.state.role);
        /**************************/
        console.log("APPJS ROLE B4 Set:", this.state.role);
        this.setState({ role: data.role });
        console.log("APPJS STATE ROLE After Set:", this.state.role);
        return data.role;
      });
    console.log("APP.JS ROLE:", role);
    this.setState({
      role: role,
      loggedOut: false,
    });
    return role;
    /***************************/
  }

  redirectHome() {
    //IMPORTANT: Redirect to the selected organization's page.
    console.log("Called REDIRECT HOME redirect b4", this.state.redirect);
    this.setState({
      redirect: true,
      role: "visitor",
      loggedOut: true,
    });
    console.log("Called REDIRECT HOME redirect after", this.state.redirect);
    history.push({
      pathname: "/",
    });
  }
  redirectLogin() {
    history.push({
      pathname: "/user/login",
    });
  }

  async handlePageClick(event) {
    // IMPORTANT: No preventDefault Here:  It will not allow page to transition to insert form, with a dropdownitem
    // event.preventDefault();
    // event.persist();

    // Sets the name and currentlyActivePage
    this.setState({
      currentPage: event.target.name,
      name: event.target.name,
    });

    //01/04/2020:
    if (event.target.name === "Logout") {
      this.redirectHome();
    }
  }

  componentDidUpdate() {
    console.log("APPJS JUST UPDATED!");
  }
  render() {
    if (this.state.loading === true) {
      // console.log('loading...');
      return <UploadSpinner />;
    }
    return (
      <Router history={history}>
        {/* <Router> */}
        {/* Refresh={toggle} */}
        <Navbar
          handlePageClick={this.handlePageClick}
          navItems={this.state.navItems}
          currentPage={this.state.currentPage}
          name={this.state.name}
          role={this.state.role}
          redirectHome={this.redirectHome}
          setRole={this.setRole}
          loggedOut={this.state.loggedOut}
          redirect={this.state.redirect}
        />
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => <HomeContainer {...props} />}
          />
          <Route
            exact
            path="/user/registration"
            // component={RegistrationContainer}
            render={(props) => <RegistrationContainer 
              {...props}
              redirectLogin={this.redirectLogin} />}
          />
          <Route
            exact
            path="/user/login"
            render={(props) => (
              <LoginContainer
                {...props}
                getRole={this.getRole}
                role={this.state.role}
              />
            )}
          />
          <Route
            exact
            path="/products/product/update/:product_id"
            render={(props) => (
              <ProductUpdateContainer
                {...props}
                role={this.state.role}
                loggedOut={this.state.loggedOut}
                setRole={this.setRole}
              />
            )}
          />
          <Route
            exact
            path="/product/insert"
            render={(props) => (
              <ProductInsertContainer
                {...props}
                role={this.state.role}
                loggedOut={this.state.loggedOut}
                setRole={this.setRole}
              />
            )}
          />
          <Route
            exact
            path="/products/product/:product_id"
            render={(props) => (
              <ProductViewContainer
                {...props}
                role={this.state.role}
                loggedOut={this.state.loggedOut}
                areCredentialsValid={this.areCredentialsValid}
                credentialsActive={this.state.credentialsActive}
                setRole={this.setRole}
              />
            )}
          />
          <Route
            exact
            path="/products/"
            render={(props) => (
              <ProductsListContainer
                {...props}
                role={this.state.role}
                loggedOut={this.state.loggedOut}
              />
            )}
          />
        </Switch>
        <Footer />
      </Router>
    );
  } // render
}

export default App;
