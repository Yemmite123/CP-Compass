import React from "react";
import { closeOffCanvas } from "#/utils";
import "./style.scss";

const OffCanvas = (props) => {
  return (
    <div
      className={`offcanvas offcanvas-${props.position} ${props.id}`}
      tabIndex={-1}
      id={props.id}
    >
      <div className="offcanvas-header">
        {props.title ? (
          <h5 className="offcanvas-title">{props.title}</h5>
        ) : (
          <div className="media-body"></div>
        )}
        <button
          type="button"
          className="btn-close"
          data-cp-dissmiss="offcanvas"
          onClick={() => {
            if (props.onClose) {
              props.onClose();
            }
            closeOffCanvas(props.id);
          }}
        />
      </div>
      <div className="offcanvas-body">{props.children}</div>
    </div>
  );
};

export default OffCanvas;
