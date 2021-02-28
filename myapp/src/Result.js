import { Link, useParams } from "react-router-dom";
import React, { useCallback, useEffect, useMemo, useState, useContext } from "react";
import axios from 'axios';
import API_KEY from './config';

function Result() {
    const { seq } = useParams();
    const resultApiUrl = `https://inspct.career.go.kr/inspct/api/psycho/report?seq=` + seq;
    
    const [userInfo, setUserInfo] = useState([]);
    const [testResult, setTestResult] = useState([]);
    const [firstHighScore, setFirstHighScore] = useState([]);
    const [secondHighScore, setSecondHighScore] = useState([]);

    const fetchResult = useCallback(async () => {
        const response = await axios.get(resultApiUrl);
        console.log(response.data.result);

        const userData = {};
        userData.name = response.data.inspct.nm;
        if (response.data.inspct.sexdstn === 100323) {
            userData.gender = "남성";
        } else {
            userData.gender = "여성";
        }
        userData.testDate = response.data.inspct.registDt.split('T')[0].replaceAll('-','.');
        setUserInfo(userData);
        
        const testScore = response.data.result.wonScore.split(' ').map(score => score.split('=')[1]);
        testScore.pop();
        console.log(testScore);
        setTestResult(testScore);
    }, [resultApiUrl]);

    useEffect(() => {
        fetchResult();
    }, [fetchResult]);
    
    useEffect(()=>{
        setFirstHighScore(testResult.indexOf(Math.max(...testResult)));
    }, [testResult])
    
        return (
        <div>
            <h1>직업가치관검사 검사표</h1>
            <p>직업가치관이란 직업을 선택할 때 영향을 끼치는 자신만의 믿음과 신념입니다. 따라서 여러분의 직업생활과 관련하여 포기하지 않는 무게중심의 역할을 한다고 볼 수 있습니다. 직업가치관검사는 여러분이 직업을 선택할 때 상대적으로 어떠한 가치를 중요하게 생각하는지를 알려줍니다. 또한 본인이 가장 중요하게 생각하는 가치를 충족시켜줄 수 있는 직업에 대해 생각해 볼 기회를 제공합니다.</p>
            <div>
                이름: {userInfo.name}
                <br></br>
                성별: {userInfo.gender}
                <br></br>
                검사일: {userInfo.testDate}
            </div>
            <div>
                <h2>직업가치관결과</h2>
                {testResult}
                <br></br>
                {firstHighScore}
                <br></br>
                {secondHighScore}
            </div>
            <div>
                <h2>가치관과 관련이 높은 직업</h2>
                
            </div>

        </div>
    );
}

export default Result;