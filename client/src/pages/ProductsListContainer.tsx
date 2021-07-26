import React, { Component } from "react";
import { urlBtnUpdates } from "utils/url-btn-updates";
// Import Components
import ProductsListItem from "../components/products/list/index";
import UploadSpinner from '../components/upload-spinner';
// Import Server-Side Utilities:
import { api as API } from '../utils/API';
//import utils
import * as auth from '../utils/authentication-store';

class ProductsListContainer extends Component<ProductsPropType>{

    baseURL = '/api/products';
    state: ProductListStateType;
    constructor(props: ProductsPropType) {
        super(props);

        /******************************************
                 STEP2a: SET Base URLs
        ******************************************/
        this.state = {
            productsListData: [],
            access_token: '',
            authToken: '',
            refresh_token: '',
            expiration: '',
            email: '',
            hasAccessTokenExpired: false,
            isUserAuthorized: true,
            loading: false,
            message: '',
            role: this.props.role,
            loggedOut: this.props.loggedOut,
        };
    } // constructor

    resetStateVariables() {
        this.setState({ authToken: '' });
        this.setState({ access_token: '' });
        this.setState({ refresh_token: '' });
        this.setState({ email: '' });
        this.setState({ hasAccessTokenExpired: false });
    }

    componentDidMount() {
        // Execute getProducts
        this.returnProducts(this.baseURL);
        this.setState({ refreshed: false });
        urlBtnUpdates();
    } //componentdidmount


    /**
     * Returns products, or set status to loading
     * @param baseURL 
     */
    async returnProducts(baseURL: string) {
        /**********************************/
        // 05/24/2020 Start Loading Spinner
        /**********************************/
        this.setState({ loading: true });
        /**********************************/
        try {
            let res = await API.getProducts(baseURL);
            console.log("**RES: 1rst", res);
            if (res) {
                this.productsListData = res.data.products;
                this.setState({ loading: false });
            }

        }
        catch (err) {
            console.log(err);
        }
    }

    get productsListData(): ProductDataType[] {
        return this.state.productsListData;
    }
    /******************************
     * 1/8/19: setUser HERE
     ******************************/
    set productsListData(data) {
        auth.getLocalStorage().then((curCredentials: any) => { this.setState(curCredentials) });
        console.log("----Data", data);

        this.setState({ productsListData: data });

    } // setProductList

    
    /**
     * Loop though each productItem 
     * list and save each to the  
     * productList array
     * @returns  productList
     */
    get products() {
        return this.productsListData?.map((productData: ProductDataType) => {
            console.log("ProductListContainer: Product:", productData);
            return (
                <ProductsListItem
                    role={this.state.role}
                    key={productData._id}
                    id={productData._id}
                    name={productData.name}
                    value={productData.value}
                    productImage={productData.productImage}
                    loggedOut={this.props.loggedOut}
                />
            )
        });
    }

    /**
     * Renders products list container
     * @returns  
     */
    render() {
        /* In order to stop the component from
            rendering before the user's role has been loaded
            a loading state property was added.  When the loading state changes, the page will be rerendered with the correct usr role. */
        if (this.state.loading === true) {
            console.log('loading...');
            return <UploadSpinner />
        } 
            var userRole = this.state.role;
            console.log("ProductListContainer: userRole =", userRole, "LoggedOut:", this.state.loggedOut);
            console.log("****Setting productListData in ProductsListContainer: Render-285:");

            return (
                <React.Fragment>
                    <div className="container-fluid text-center">
                        <div className="row">
                            <div className="col">
                                <br></br>
                                {this.productsListData ? this.products : ''}
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )
    }
} // class

export default ProductsListContainer;