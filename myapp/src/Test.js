import React, { useCallback, useEffect, useMemo, useState, useContext} from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import {UserContext, SeqContext} from "./UseContext";
import API_KEY from './config';

const Test = () => {
    var history = useHistory();
    
    const apiUrl = `http://www.career.go.kr/inspct/openapi/test/questions?apikey=`+API_KEY+`&q=6`;
    const postApiUrl = `http://www.career.go.kr/inspct/openapi/test/report`;
    
    const {userInfo, setUserInfo} = useContext(UserContext);
    const {sequence, setSequence} = useContext(SeqContext);
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

    const timeStamp = () => {
        const date = new Date();
        const dateToTimestamp = date.getTime();
        console.log(dateToTimestamp);
        return dateToTimestamp;
    }

    useEffect(()=>{
        timeStamp();
        console.log(timeStamp());
    },[]);

    const postResult = useCallback(async() => {
        
        const answerForm = () => {
            var answerdata = answers;
            for (var i=0; i<answers.length; i++){
                answerdata[i] = i+1 + '=' + answers[i];
            }
            answerdata = answerdata.join(' ');
            return answerdata;
        }

        const data = {
            "apikey": API_KEY,
            "qestrnSeq": "6",
            "trgetSe": "100209",
            "name": userInfo.name,
            "gender": userInfo.gender,
            "startDtm": timeStamp(),
            "answers": answerForm()
        }

        const response = await axios.post(postApiUrl, data, {headers: {'Content-Type': 'application/json'}});
        console.log(response);
        const resultUrl = response.data.RESULT.url;
        const seqFromUrl = resultUrl.split('?seq=')[1];
        console.log(resultUrl);
        console.log(seqFromUrl);
        setSequence(seqFromUrl);
    }, [postApiUrl, answers]);

    //페이지 전환
    const handlePageChange = (type) => {
        var new_page = 0
        if (type == 'previous') {
            new_page = page - 1;
            if (new_page === 0) {
                history.push('/intro');
            } else {
                setPage(page - 1);
            }
        } else {
            new_page = page + 1;
            if (new_page === parseInt(questions.length / 5) + 2) {
                postResult();
                history.push('/outro');
            } else {
                setPage(page + 1);
            }
        }
    }

    const isButtonDisabled = useMemo(() => {
        let isDisabled = false;
        questions.forEach((question) => {
            const question_Num = parseInt(question.qitemNo, 10);
            if (Math.ceil(question_Num / 5) === page) {
                if (!answers[question_Num - 1]) {
                    isDisabled = true;
                }
            }
        });
        return isDisabled;
    }, [answers, page]);

    const showQuestionResult = () => {
        const new_questionResult = [];
        for (var i = 0; i < questions.length; i++) {
            var question_Num = parseInt(questions[i].qitemNo)
            var question = questions[i].question
            var answer01 = questions[i].answer01
            var answer02 = questions[i].answer02
            var answerScore01 = questions[i].answerScore01
            var answerScore02 = questions[i].answerScore02

            var page_index = 1

            if (question_Num % 5 === 0) {
                page_index = parseInt(question_Num / 5)
            } else {
                page_index = parseInt(question_Num / 5) + 1
            }

            const handleAnswerChange = (e) => {
                setAnswers((current) => {
                    const question_index = e.target.name.split('answers')[1];
                    const newAnswers = [...current];
                    newAnswers[question_index] = e.target.value;
                    return newAnswers;
                });
            }

            new_questionResult.push(
                <div className={page_index + " question"} key={question_Num} style={{ display: (page_index === page) ? "block" : "none" }}>
                    <h3>{question}</h3>
                    <div>
                        <label>
                            <input
                                type="radio"
                                name={`answers${question_Num - 1}`}
                                value={answerScore01}
                                onChange={handleAnswerChange}
                            />
                            {answer01}
                        </label>

                        <label>
                            <input
                                type="radio"
                                name={`answers${question_Num - 1}`}
                                value={answerScore02}
                                onChange={handleAnswerChange}
                            />
                            {answer02}
                        </label>
                    </div>
                </div>
            )
        }
        setQuestionResult(new_questionResult);
    }

    useEffect(() => {
        showQuestionResult();
    }, [questions, answers, page]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    useEffect(() => {
        console.log("here!!");
        console.log(sequence);
    }, [sequence]);

    return (
        <div>
            <div>
                {questionResult}
            </div>
            <div>
                <button type="submit" id="previous_btn" onClick={() => { handlePageChange('previous') }}>이전</button>
                <button type="submit" id="next_btn" onClick={() => { handlePageChange('next') }} disabled={isButtonDisabled}>다음</button>
            </div>
        </div>
    );
};

export default Test;