import React, { Component, useState } from "react";

function Intro() {

    ComponentDidMount() {
        axios.get('www.career.go.kr/inspct/openapi/test/questions?apikey=32a2c9717c399817549cbb5169b959b7&q=6')
            .then(response => {
                console.log(response);
                var result = response.data;
            });
    };

    return (
        <div>
            <div>
                {result}
            </div>
            <h1>Hi!</h1>
        </div>
    ); 
}

export default Intro;