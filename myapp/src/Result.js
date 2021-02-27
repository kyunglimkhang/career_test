import { Link } from "react-router-dom";
import React, { useCallback, useEffect, useMemo, useState, useContext } from "react";
import {SeqContext} from "./UseContext";
import axios from 'axios';
import API_KEY from './config';

function Result() {
    const {sequence, setSequence} = useContext(SeqContext);
    const resultApiUrl = `https://inspct.career.go.kr/inspct/api/psycho/report?seq=` + sequence;
    
    
    const fetchResult = useCallback(async () => {
        console.log(resultApiUrl);
        const response = await axios.get(resultApiUrl, {headers: {'Content-Type': 'application/json'}});
        console.log(response);
        console.log(response.data.result);

        
    }, [resultApiUrl]);

    useEffect(() => {
        fetchResult();
    }, [fetchResult]);

    return (
        <div>
            <h1>직업가치관검사 검사표</h1>
        </div>
    );
}

export default Result;