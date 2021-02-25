import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from 'axios';

const Test = () => {
    const apiUrl = `http://www.career.go.kr/inspct/openapi/test/questions?apikey=0ae61054823ff25204fc658195732555&q=6`;
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [page, setPage] = useState(1);
    const [question_result, setQuestion_result] = useState([]);
    
    const fetchQuestions = useCallback(async () => {
        const response = await axios.get(apiUrl);
        setQuestions(response.data.RESULT);
        setAnswers(() => {
          return new Array(response.data.RESULT.length);
        });
      }, [apiUrl]);
    
    useEffect(() => {
        fetchQuestions();
      }, [fetchQuestions]);
    
    
    //html 코드 만들기
    setQuestion_result(
        (current) => {
            const new_question_result = current;
            for (var i=0; i<questions.length; i++) {
                var question_Num = questions[i].qitemNo
                var question = questions[i].question
                var answer01 = questions[i].answer01
                var answer02 = questions[i].answer02
                var answerScore01 = questions[i].answerScore01
                var answerScore02 = questions[i].answerScore02
        
                var page_index = 0
        
                if (question_Num % 5 === 0) {
                    page_index = parseInt(question_Num/5) - 1
                } else {
                    page_index = parseInt(question_Num/5)
                }
                
                new_question_result.push(
                    <div key={question_Num}>
                    <h3>{question}</h3>
                    <div>
                        <label>
                        <input
                            type="radio"
                            name={`answers[${question_Num - 1}]`}
                            onChange={() => {
                            setAnswers((current) => {
                                const newAnswers = [...current];
                                newAnswers[question_Num - 1] = answerScore01;
                                return newAnswers;
                            });
                            }}
                        />
                        {answer01}
                        </label>
        
                        <label>
                        <input
                            type="radio"
                            name={`answers[${question_Num - 1}]`}
                            onChange={() => {
                            setAnswers((current) => {
                                const newAnswers = [...current];
                                newAnswers[question_Num - 1] = answerScore02;
                                return newAnswers;
                            });
                            }}
                        />
                        {answer02}
                        </label>
                    </div>
                    </div>
                )
            }

        return new_question_result;
    });

    return (
        <div>
            <div>
                {question_result}
            </div>
            <div>
                <button type="submit" id="prev_btn" onClick={setPage(page-1)}>이전</button>
                <button type="submit" id="next_btn" onClick={setPage(page+1)} disabled>다음</button>
            </div>
        </div>
    ); 
};

export default Test;