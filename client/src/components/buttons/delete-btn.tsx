import React from 'react';
// import './styles.css';
import ActionBtn from './action-btn';

let DeleteBtn = (props: ProdDeleteItemProps) => {
    return (
        <ActionBtn 
          buttonName={props.btnName}
          id={props.id}
          btnClickHandler={props.btnClickHandler}
          />
        );
};

export default DeleteBtn;