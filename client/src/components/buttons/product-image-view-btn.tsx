import ProductViewImg from './transition-img';

let ProductImageViewBtn = (props: ProdImgViewItemProps) => {
  return (
    <ProductViewImg
      to={
        {
          pathname: `${props.viewPath}${props.id}`,
          state: {
            name: props.name,
            value: props.value,
            id: props.id,
            userRole: props.userRole
          }
        }
      }
      productImage={props.productImage}
      id={props.id}
      userRole={props.userRole}
      loggedOut={props.loggedOut}
      />
  );
};

export default ProductImageViewBtn;