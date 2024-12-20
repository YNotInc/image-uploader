import "./style.css";
import {Link} from 'react-router-dom';

function transitionBtn(props: TransitionBtnPropType) {
  return (
    <Link 
      to= {props.to}>
      <button 
        type="button" 
        className="btn custom-btn" 
        tabIndex={0}>
         {props.buttonName}
      </button>
    </Link>
  );
}

export default transitionBtn;