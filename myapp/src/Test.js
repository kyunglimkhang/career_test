import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from 'axios';
import $ from 'jquery';

const Test = () => {
    const apiUrl = `http://www.career.go.kr/inspct/openapi/test/questions?apikey=32a2c9717c399817549cbb5169b959b7&q=6`;
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
    
    
    //페이지 전환
    const pagechange = (type) => {
        var new_page = 0
        if (type == 'previous'){
            new_page = page - 1;
            $('.question').hide();
            $('.'+new_page).show();
            setPage(page-1);
        } else {
            new_page = page + 1;
            $('.question').hide();
            $('.'+new_page).show();
            setPage(page+1);
        }
    }

    const show_by_page = () => {
        $('.question').hide();
        $('.'+page).show();
    }
    
    useEffect(() => {
        show_by_page();
      }, [show_by_page]);

    const show_Question_result = () => {
            const new_question_result = [];
            for (var i=0; i<questions.length; i++) {
                var question_Num = questions[i].qitemNo
                var question = questions[i].question
                var answer01 = questions[i].answer01
                var answer02 = questions[i].answer02
                var answerScore01 = questions[i].answerScore01
                var answerScore02 = questions[i].answerScore02
        
                var page_index = 1
        
                if (question_Num % 5 === 0) {
                    page_index = parseInt(question_Num/5)
                } else {
                    page_index = parseInt(question_Num/5) + 1
                }
                
                new_question_result.push(
                    <div class={page_index+" question"} key={question_Num}>
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

            setQuestion_result(new_question_result);
    }
    
    useEffect(() => {
        show_Question_result();
      }, [show_Question_result]);

    return (
        <div>
            <div>
                {question_result}
            </div>
            <div>
                <button type="submit" id="previous_btn" onClick={()=>{pagechange('previous')}}>이전</button>
                <button type="submit" id="next_btn" onClick={()=>{pagechange('next')}}>다음</button>
            </div>
        </div>
    ); 
};

export default Test;