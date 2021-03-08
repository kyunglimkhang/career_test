import { Link } from "react-router-dom";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from 'axios';
import { Progress, Button } from 'reactstrap';

function Intro() {
    const apiUrl = `http://www.career.go.kr/inspct/openapi/test/questions?apikey=32a2c9717c399817549cbb5169b959b7&q=6`;
    const [sample_question, setSample_question] = useState([]);
    const [sample_answer, setSample_answer] = useState('');

    const fetchQuestions = useCallback(async () => {
        const response = await axios.get(apiUrl);
        setSample_question(response.data.RESULT[0]);
    }, [apiUrl]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    console.log(sample_question);

    return (
        <div className="containAll container">
            <div className="testHeader">
                <h2>검사 예시</h2>
                <div className="text-right"><h2>0%</h2></div>
            </div>
            <Progress value={0} />
            <div style={{'margin-top':'15px', 'textAlign':'start'}}>
                <h2>직업과 관련된 두개의 가치 중에서 자기에게 더 중요한 가치에 표시하세요.</h2>
            </div>
            <div className="questionDiv">
                <div className="contain-question container" >
                    <h3 className={"question"}>{sample_question.question}</h3>
                    <div className={"pickAnswer"}>
                        <label className={"pickFirst"}>
                            <input
                                type="radio"
                                name="sample_question"
                                onChange={() => {
                                    setSample_answer("answer01")
                                }}
                                className={"radio"}
                            />
                            {sample_question.answer01}
                        </label>

                        <label className={"pickSecond"}>
                            <input
                                type="radio"
                                name="sample_question"
                                onChange={() => { setSample_answer("answer02") }}
                                className={"radio"}
                            />
                            {sample_question.answer02}
                        </label>
                    </div>
                </div>
            </div>
            <div className="buttonDiv">
                <Link to="/">
                    <Button outline className="directButton" color="primary" >이전</Button>
                </Link>
                <Link to="/test">
                    <Button outline color="primary" disabled={!sample_answer}>검사 시작</Button>
                </Link>
            </div>
        </div>
    );
}

export default Intro;