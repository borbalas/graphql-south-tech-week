import React from "react";

export default class Modal extends React.Component {
    render() {
        const { children, onClose, animation } = this.props;

        return (
            <div id="con" className="overlay-container">
                {
                    animation ? <div className="pokeball">
                        <div className="pokeball__button"></div>
                    </div> : null
                }
                <div className="card-container">
                    <button className="close-button" onClick={e => (onClose())}></button>
                    {children}
                </div>
            </div>
        );
    }
}

Modal.defaultProps = {
    animation: false
}