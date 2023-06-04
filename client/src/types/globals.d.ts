// import { string } from "prop-types";

import { ChangeEvent} from "react";
// import { urlBtnUpdates } from "utils/url-btn-updates";

declare global {
  /**************************
   * LoginContainer
   **************************/
  interface DataType {
    email: string;
    password: string;
  }

  interface LoginStateType {
    email: string;
    password: string;
    message: string;
    access_token: string;
    refresh_token: string;
    expiration: string;
    hasAccessTokenExpired: boolean;
    isUserAuthorized: boolean;
    authToken: string;
    token: string;
  }
  interface LoginPropType {
    getRole: () => string;
    setRole: (role: string, loggedOut: boolean) => {};
    role: string;
    history: any;
  }
  /***************************/
  /**************************
   * HomeContainer
   **************************/
  interface HomePropType {}

  interface HomeStateType {
    [signature: string]: any;
  }
  /***************************/

  /**************************
   * ProductsListContainer
   **************************/
  interface ProductsPropType {
    role: string;
    loggedOut: boolean;
  }

  interface ProductListStateType {
    // productsList: ProductDataType[];
    productsListData: ProductDataType[];
    authToken: string;
    access_token: string;
    expiration: string;
    hasAccessTokenExpired: boolean;
    refresh_token: string;
    email: string;
    isUserAuthorized: boolean;
    loading: boolean;
    message: string;
    loggedOut: boolean;
    role: string;
  }

  interface ProductListDataType {
    name?: string;
    productImage?: string;
    request?: {
      type: string;
      url: string;
    };
    value?: string;
    _id?: string;
    length?: number;
  }

  interface FilteredListType {
    name: string;
    productImage: string;
    value: string;
    _id: string;
    key: string;
    event: ChangeEvent<HTMLInputElement>;
  }

  type ProductDataType = ProductListDataType | FilteredListType;
  /***************************/
  // ActionButton
  interface ActionBtnPropType {
    btnClickHandler: (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    id: string;
    buttonName: string;
  }
  /**************************
   * TransitionBtn
   **************************/
  interface TransitionBtnPropType {
    to: {
      pathname: string;
    };
    buttonName: string;
  }
  /**************************/
  /**************************
   * TransitionBtn
   **************************/
  interface TransitionImgPropType {
    to: {
      pathname: string;
      state: {
        [key: string]: string;
      };
    };
    productImage: string;
    id: string;
    state?: any;
    userRole: string;
    loggedOut: boolean;
  }
  /**************************/

  /**************************
   * ProductInsertForm
   **************************/
  interface ProductInsertFormPropType {
    changeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
    insertClickHandler: (event: FormEvent<HTMLFormElement>) => void;
    productImageName: string;
    productName: string;
    productValue: string;
    productImage: string;
    placeholderName: string;
    placeholderValue: string;
    message: string;
    image: ImageType;
    submitImageHandler: (
      event: FormEvent<HTMLFormElement>,
      img: Object
    ) => void;
    selectImage: (
      event: FormEvent<HTMLInputElement>,
      imageSelectRef: ImageUploadRefObject<HTMLInputElement>,
      previewCanvasRef: ImageUploadRefObject<HTMLDivElement>
    ) => void;
    setImageProp: Object;
  }
  /**************************/

  /**************************
   * ImageUploader
   **************************/
  interface ImageUploadRefObject<T> {
    // immutable
    readonly current: T | null;
  }

  interface ImageUploadPropType {
    uploaderBorder: string;

    image: {
      type: string;
      className: string;
      submitBtnId: string;
      name: string;
      imageName: string;
    };

    submitImageHandler: (
      event: FormEvent<HTMLFormElement>,
      img: Object
    ) => void;

    productImage: string;
    selectImage: (
      event: FormEvent<HTMLInputElement>,
      imageSelectRef: ImageUploadRefObject<HTMLInputElement>,
      previewCanvasRef: ImageUploadRefObject<HTMLDivElement>
    ) => void;
    setImageProp: Object;
  }
  /**************************/

  /**************************
   * ProductInsertContainer
   **************************/
  interface ProductInsertContainerPropType {
    location: {
      state: {
        name: string;
        value: string;
      };
    };
    loggedOut: boolean;
    role: string;
  }
  interface ProductInserContainerStateType {
    [signature: string]: any;
  }
  /*************************/

  /******************************
   * ProductInsertContainer Helper
   ******************************/
  interface Blob {
    name: string;
    size: number;
  }
  interface ImagePropsType {
    imageName: string;
    imageHeight: number;
    imageWidth: number;
    imageSize: number;
    imageSrc: string;
  }
  /*****************************/
  /**********ProductViewContainer */
  interface ProductViewPropType {
    location: any;
    role: string;
    loggedOut: boolean;
    history: any;
    areCredentialsValid: () => boolean;
    credentialsActive: boolean;
    setRole: (role: string, isLoggedOut: boolean) => void;
  }
  interface ProductViewStateType {
    productItemComponent: JSX.Element | null;
    baseUrl?: string;
    access_token: string;
    authToken: string;
    refresh_token: string;
    expiration: string;
    email: string;
    hasAccessTokenExpired: boolean;
    isUserAuthorized: boolean | undefined;
    loading?: boolean;
    message: string | undefined;
    expired?: boolean;
    // productsList?: ProductListDataType | undefined;
    placeholderName?: string;
    placeholderValue?: string;
  }

  /***********************/
  /****************ProductStore********************/
  interface ImageType {
    base64Str: string;
    cloudImageUrl: string;
    cloudImagePublicId: string;
    input: string;
    file: string;
    submitBtnId: string;
    fileTypes: ["image/jpeg", "image/jpg", "image/png"];
    imageName: string;
    imageWidth: number;
    imageHeight: number;
    imageSize: number;
    imageSrc: string;
    imageMin: number;
    imageMax: number;
    maxMB: number;
    errorTag: "file-msg";
    invalidMsg: "Not a valid file.";
    unacceptedMsg: "File not accepted.";
    acceptedMsg: "File accepted.";
    fileMsgElement: string;
    previewCanvasElement: string;
    submitImageElement: string;
    className: "custom-file-input";
    type: "file";
    name: string;
  }
  interface PerformDBActionType {
    message?: string;
    isUserAuthorized?: boolean;
    productsList?: ProductListDataType;
  }
  /*********************************************/
  /******************ProductViewItem***************/
  interface ProductItemPropType {
    name: string;
    value: string;
    id: string;
    image: string;
  }
  /************************** */
  /****************ProductionUpdateContaine**** */
  interface ProductUpdateContainerPropType {
    location: {};
    match: {};
  }
  /********************************** */
  /***********ProductUpdateContainer */
  interface ProductUpdatePropType {
    location: {
      state: {
        name: string;
        value: string;
        id: string;
      };
    };
    match: {
      params: {
        product_id: string;
      };
    };
    setRole: (role: string, loggedOut: boolean) => {};
    loggedOut: boolean;
    role: string;
  }
  interface ProductUpdateStateType {
    productItemComponent: JSX.Element | null;
    productId: string;
    productName: string;
    productValue: string;
    placeholderName: string;
    placeholderValue: string;
    authToken: string;
    refresh_token: string;
    email: string;
    hasAccessTokenExpired: boolean;
    isUserAuthorized: boolean;
    message: string;
  }

  interface EventTargetType {
    name: string;
    value: string;
  }

  interface DbActionResultType {
    message?: string;
    refresh_token?: string;
    isUserAuthorized?: boolean;
    hasAccessTokenExpired?: boolean;
    productsList?: {
      [key: string]: string;
    };
  }
  /*************************************/
  /******RegistrationContainerPropType******/
  interface RegContainerPropType {
    redirectLogin: () => void;
  }
  interface RegContainerStateType {
    email: string;
    password: string;
    message: string;
    existingUserError: string;
    existingUserMsg: string;
  }

  interface RegDataType {
    email: string;
    password: string;
  }
  /*************************************/
  /********Can.tsx*******/
  interface RulesType {
    [key: string]: {
      static?: string[];
      dynamic?: { [key: string]: Function };
    };
  }
  interface CanPropType {
    role: string;
    perform: string;
    data?: any;
    yes: () => JSX.Element;
    no: () => JSX.Element;
  }
  /**********************/
  /*************************************/
  /********CredentialStore.tsx*******/
  interface CatchErrorType {
    message: string;
    response: {
      status: number;
      data: {
        message: string;
      };
    };
  }
  interface CurrentCredentialType {
    access_token: string;
    refresh_token: string;
    expiration: string;
    email: string;
    message: string | undefined;
  }
  /**********************/
  /************LoginForm************/
  interface LoginFormPropType {
    getRole?: () => string;
  }
  /**********************/
  /**************UpdateForm ***************/
  interface UpdateFormPropType {
    placeholderName: string;
    productName: string;
    placeholderValue: string;
    productValue: string;
    message: string;
    updateClickHandler: (event: FormEvent<HTMLFormElement>) => void;
    changeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  }
  /****************************************/
  /************NavbarPage************/
  interface NavbarPagePropType {
    handlePageClick: (event: ChangeEvent<HTMLInputElement>) => void;
    navItems: any;
    currentPage: string;
    name: string;
    role: string;
    redirectHome: () => {};
    setRole: (role: string, loggedOut: boolean) => {};
    loggedOut: boolean;
    refreshPage: string;
    redirect: string;
    homeActRef: RefObject<unknown>;
  }
  interface NavbarPageStateType {
    isOpen: boolean;
    role: string;
    redirect: string;
    loggedOut: boolean;
    refreshPage: string;
    myNav: NavbarType;
    currentPage: string;
    homeLink: any;
    activeIndex: number;
    activeName: string;
  }

  interface NavbarType {
    userItems?: UserItemsType[];
    adminItem?: AdminItemType[];
    loginItem?: LoginItemType[];
  }
  interface UserItemsType {
    name: string;
    label: string;
    route: string;
    authorization: string;
    key: number;
  }

  interface AdminItemType {
    name: string;
    route: string;
    key: number;
  }

  interface LoginItemType {
    name: string;
    route: string;
    key: number;
  }
  interface NavbarOptionsPropType {
    handlePageClick: (event: ChangeEvent<HTMLInputElement>) => void;
    homeActRef: RefObject<unknown>;
  }
  /****************************/
  /************ImageInputGroup*****/
  interface ImageSelectorPropType {
    imageName: string;
    imageClassName: string;
    imageType: string;
    submitBtnId: string;
    imageSelectRef: ForwardedRef<ImageUploadRefObject>;
    previewCanvasRef: ForwardedRef<HTMLInputElement>;
    aria: string;
    fileTypes: string;
    selectImage: (
      event: FormEvent<HTMLInputElement>,
      imageSelectRef: ImageUploadRefObject<HTMLInputElement>,
      previewCanvasRef: ImageUploadRefObject<HTMLDivElement>
    ) => void;
  }
  /***********************/
  /****ProductUpdateItem******/
  interface ProdItemProps {
    name: string;
    value: string;
    path: string;
    id: string;
    btnName: string;
    btnClickHandler: (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  }
  interface ProdDeleteItemProps {
    id: string;
    btnName: string;
    btnClickHandler: (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  }
  interface ProdImgViewItemProps {
    id: string;
    viewPath: string;
    name: string;
    value: string;
    userRole: string;
    productImage: string;
    loggedOut: boolean;
  }

  interface ProdUpdateItemProps {
    path: string;
    id: string;
    value: string;
    btnName: string;
    name: string;
  }

  type UpdateBtnPropType = TransitionBtnPropType & ProdItemProps;
  /******************** */
  /*************TextPropType***********/
  interface TextPropType {
    htmlFor: string;
    className: string;
    label?: string;
    id: string;
    placeholder?: string;
    name: string;
    value: string;

    // Delete this
    changeHandler?: (event: ChangeEvent<HTMLInputElement>) => void;

    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;

    testId: string;
  }
  /*********************************/

  /*********************************/
  // UserBtnPropType
  interface UserBtnPropType {
    activeIndex: number;
    activeName: string;
    buttonIndex: number;
    activeClassName?: string;
    userRole: string;
    authorization: string;
    handleChangeActive?: (
      event: ChangeEvent<HTMLInputElement>,
      btnIdx: number
    ) => void;
    name: string;
    route: string;
    label: string;
    handlePageClick?: (event) => void;
    captureEvent: (event: ChangeEvent<HTMLInputElement>) => void;
  }
  interface AdminBtnPropType {
    name: string;
    route: string;
    handlePageClick?: (event) => void;
    handleChangeActive?: (
      event: SyntheticEvent<MouseEvent, Event>,
      btnIdx: number
    ) => void;
    captureEvent: (event: SyntheticEvent<MouseEvent, Event>) => void;
  }

  interface LoginBtnPropType {
    name: string;
    route: string;
    handlePageClick?: (event) => void;
    captureEvent: (event: SyntheticEvent<MouseEvent, Event>) => void;
    setRole: (role: string, loggedOut: boolean) => void;
    role: string;
  }
  /**************************/
  // product-image-view-Btn
  interface ProdImgViewBtnPropType {
    productImage: string;
    id: string;
    path: string;
  }
  /*************************/
}

// Adding this exports the declaration file which Typescript/CRA can now pickup:
export {};
