import React from "react";

const Loader = ({className}) => {
    return (
        //I did not write this, From Uiverse.io by mobinkakei
        <div className={`wrapper ${className}`}>
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="shadow"></div>
            <div class="shadow"></div>
            <div class="shadow"></div>
        </div>
    );
};

export default Loader;