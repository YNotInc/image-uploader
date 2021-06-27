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

    _productsListData: ProductDataType[];
    state: ProductListStateType;
    constructor(props: ProductsPropType) {
        super(props);

        /******************************************
                 STEP2a: SET Base URLs
        ******************************************/
        this._productsListData = [];
        this.state = {
            productsList: [],
            productListData: [],
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
        return this._productsListData;
    }
    /******************************
     * 1/8/19: setUser HERE
     ******************************/
    set productsListData(data) {
        auth.getLocalStorage().then((curCredentials: any) => { this.setState(curCredentials) });

        console.log("----Data", data);
        this._productsListData = data;

        this.setState({ productsListData: this._productsListData });

    } // setProductList

    
    /**
     * Loop though each productItem 
     * list and save each to the  
     * productList array
     * @returns  productList
     */
    get products() {
        return this.productsListData?.map((product: ProductDataType) => {
            console.log("ProductListContainer: Product:", product);
            return (
                <ProductsListItem
                    role={this.state.role}
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    value={product.value}
                    productImage={product.productImage}
                    loggedOut={this.props.loggedOut}
                />
            )
        });
    }

    // /**
    //  * Filters click handler - Filters out the item clicked
    //  * @param event 
    //  */
    // filterClickHandler(event: React.MouseEvent<HTMLButtonElement>) {
    //     event.preventDefault();
    //     const event_id = (event.target as HTMLButtonElement).id;
    //     console.log('IN Delete PRODUCT CALL', event_id);

    //     let filteredList: ProductDataType[] = this.productsListData.filter((product: ProductDataType) => {
    //         return (product._id.toString() !== event_id.toString());
    //     })
    //         .map((product: ProductDataType) => {
    //             let data = {
    //                 name: product.name,
    //                 value: product.value,
    //                 productImage: product.productImage,
    //                 _id: product._id,
    //                 key: product._id,
    //                 event: event
    //             };
    //             return data;
    //         });

    //     this.productsListData = filteredList;

    // }

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