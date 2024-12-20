import React from 'react';
// import './styles.css';
import ActionBtn from './action-btn';

let DeleteBtn = (props: ProdItemProps) => {
  return (
    <ActionBtn
      buttonName={props.btnName}
      id={props.id}
      btnClickHandler={props.btnClickHandler}
    />
  );
};

export default DeleteBtn;