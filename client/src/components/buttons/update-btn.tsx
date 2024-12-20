// import './styles.css';
import ProductUpdateBtn from './transition-btn';

let UpdateBtn = (props: ProdUpdateItemProps) => {
    return (
        <ProductUpdateBtn 
          to={
            {
              pathname: `${props.path}${props.id}`          
            }
          }
          buttonName={props.btnName}/>
        );
};

export default UpdateBtn;