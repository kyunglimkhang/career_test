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
        <div>
            <h1>검사 예시</h1>
            <div>
                <div className="text-right">0%</div>
                <Progress value={0} />
            </div>
            <div>
                <h1>직업과 관련된 두개의 가치 중에서 자기에게 더 중요한 가치에 표시하세요.</h1>
            </div>

            <div>
                <h3>{sample_question.question}</h3>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="sample_question"
                            onChange={() => {
                                setSample_answer("answer01")
                            }}
                        />
                        {sample_question.answer01}
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="sample_question"
                            onChange={() => { setSample_answer("answer02") }}
                        />
                        {sample_question.answer02}
                    </label>
                </div>
            </div>

            <div>
                <Link to="/">
                    <Button outline color="primary">이전</Button>
                </Link>
                <Link to="/test">
                    <Button outline color="primary" disabled={!sample_answer}>검사 시작</Button>
                </Link>
            </div>
        </div>
    );
}

export default Intro;