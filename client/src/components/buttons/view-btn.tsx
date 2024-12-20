// import './styles.css';
import ProductViewBtn from './transition-btn';

let ViewBtn = (props: ProdItemProps) => {
  return (
    <ProductViewBtn
      to={
        {
          pathname: `${props.path}${props.id}`,
        }
      }
      buttonName={props.btnName} />
  );
};

export default ViewBtn;