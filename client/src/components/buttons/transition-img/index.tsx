import "./style.css";
import { Link } from 'react-router-dom';
import Can from "components/can";

function transitionImg(props: TransitionImgPropType) {
  console.log("IMG Props:", props);
  const { name } = props.to.state;
  let loggedOut = props.loggedOut;
  let role = props.userRole;
  const imgWithLink = (<Link
    to={props.to}
    className="view overlay zoom rounded">
    <img
      className="card-img-top image-rules img-fluid"
      src={props.productImage}
      alt={`product ${props.id}`} 
    />
  </Link>);

  const imgWithoutLink = (<a className="view overlay zoom rounded" href="#!"><img
    className="card-img-top image-rules img-fluid"
    src={props.productImage}
    alt={`product ${props.id}`}
  /></a>);
  return (
    <>
      <div className="card-wrapper inline-block">
        <div className="card card-rotating">
          <Can
            role={role}
            perform="products:view"
            yes={
              () => (
                <>
                  {!loggedOut ? imgWithLink : imgWithoutLink}
                </>
              )}
            no={() =>
              <>
                {imgWithoutLink}
              </>}
          />
          <a href="#!">
            <div className="mask rgba-white-slight"></div>
          </a>
          {/* Card Content */}
          <div className="card-body card-body-cascade text-center">

            {/* Title */}
            <h4 className="card-title"><strong>{name}</strong></h4>
          </div>
        </div>
      </div>
    </>
  );
}

export default transitionImg;