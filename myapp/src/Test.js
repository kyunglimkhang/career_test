import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import $ from 'jquery';

const Test = () => {
    var history = useHistory();
    const apiUrl = `http://www.career.go.kr/inspct/openapi/test/questions?apikey=32a2c9717c399817549cbb5169b959b7&q=6`;
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [page, setPage] = useState(1);
    const [questionResult, setQuestionResult] = useState([]);
    
    const fetchQuestions = useCallback(async () => {
        const response = await axios.get(apiUrl);
        setQuestions(response.data.RESULT);
        setAnswers(() => {
          return new Array(response.data.RESULT.length);
        });
      }, [apiUrl]);
    
    
    //페이지 전환
    const pagechange = (type) => {
        var new_page = 0
        if (type == 'previous'){
            new_page = page - 1;
                if (new_page === 0) {
                    history.push('/intro');
                } else {
                    $('.question').hide();
                    $('.'+new_page).show();
                    setPage(page-1);
                }
        } else {
            new_page = page + 1;
                if (new_page === parseInt(questions.length/5)+2) {
                    history.push('/outro');
                } else {
                    $('.question').hide();
                    $('.'+new_page).show();
                    setPage(page+1);
                }
        }
    }

    const isButtonDisabled = useMemo(()=>{
        let isDisabled = false;
        questions.forEach((question) => {
            const question_Num = parseInt(question.qitemNo, 10);
            if (Math.ceil(question_Num/5) === page) {
                console.log(question_Num);
                if(!answers[question_Num-1]){
                    console.log(answers[question_Num-1]);
                    console.log(isDisabled);
                    isDisabled = true;
                }
            }
        });
        return isDisabled;
    }, [answers, page]);

    const show_by_page = () => {
        console.log(page);
        $('.question').hide();
        $('.'+page).show();
    }

    const show_questionResult = () => {
            console.log("show_start");
            console.log(questions);
            console.log(answers);
            const new_questionResult = [];
            for (var i=0; i<questions.length; i++) {
                var question_Num = parseInt(questions[i].qitemNo)
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
                new_questionResult.push(
                    <div class={page_index+" question"} key={question_Num} sytle={{display: (page_index === page) ? "block" : "none"}}>
                        <h3>{question}</h3>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name={`answers[${question_Num - 1}]`}
                                    onChange={(e) => {
                                        setAnswers((current) => {
                                            console.log(e.target.name);
                                            const newAnswers = [...current];
                                            newAnswers[question_Num - 1] = answerScore01;
                                            console.log(newAnswers);
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
            setQuestionResult(new_questionResult);
    }

    useEffect(()=>{
        show_questionResult();
    }, [questions, answers]);

    useEffect(() => {
        console.log("fetchQuestions");
        fetchQuestions();
      }, [fetchQuestions]);
    
    useEffect(() => {
        console.log("show_by_page!!");
        show_by_page();
    }, [show_by_page]);

    return (
        <div>
            <div>
                {questionResult}
            </div>
            <div>
                <button type="submit" id="previous_btn" onClick={()=>{pagechange('previous')}}>이전</button>
                <button type="submit" id="next_btn" onClick={()=>{pagechange('next')}} disabled={isButtonDisabled}>다음</button>
            </div>
        </div>
    ); 
};

export default Test;