import React, { useCallback, useEffect, useMemo, useState, useContext as useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { UserContext } from "./UserContext";
import API_KEY from './config';
import { Progress, Button } from 'reactstrap';

const Test = () => {
    const history = useHistory();

    const apiUrl = `http://www.career.go.kr/inspct/openapi/test/questions?apikey=` + API_KEY + `&q=6`;
    const postApiUrl = `http://www.career.go.kr/inspct/openapi/test/report`;

    const { userInfo, setUserInfo } = useContext(UserContext);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [page, setPage] = useState(1);
    const [questionResult, setQuestionResult] = useState([]);
    const [progress, setProgress] = useState(null);

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

    useEffect(() => {
        timeStamp();
        console.log(timeStamp());
    }, []);

    const postResult = useCallback(async () => {

        const answerForm = () => {
            let answerData = answers;
            for (var i = 0; i < answers.length; i++) {
                answerData[i] = "B" + (i + 1) + '=' + answers[i];
            }
            answerData = answerData.join(' ');
            return answerData;
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

        const response = await axios.post(postApiUrl, data, { headers: { 'Content-Type': 'application/json' } });
        const resultUrl = response.data.RESULT.url;
        const seq = resultUrl.split('?seq=')[1];
        history.push('/outro/' + seq);
    }, [postApiUrl, answers]);

    //페이지 전환
    const handlePageChange = (type) => {
        let newPage = 0
        if (type === 'previous') {
            newPage = page - 1;
            if (newPage === 0) {
                history.push('/intro');
            } else {
                setPage(page - 1);
            }
        } else {
            newPage = page + 1;
            if (newPage === parseInt(questions.length / 5) + 2) {
                postResult();
                history.push('/outro');
            } else {
                setPage(page + 1);
            }
        }
    }

    const buttonChange = () => {
        if (page === 6) {
            return "제출"
        }
        else {
            return "다음"
        }
    }

    //pagination
    const handlePagination = (e) => {
        setPage(parseInt(e.target.value));
    }

    const pagination = () => {
        const paginationGroup = [];
        const lastPage = parseInt(answers.filter((answer) => answer !== undefined).length/5) + 1;
        for (var i=0; i<lastPage; i++){
            var pageIndex = i+1;
            paginationGroup.push(
                <li><Button value={pageIndex} onClick={(e)=>{handlePagination(e)}}>{pageIndex}</Button></li>
            );
        }
        return paginationGroup;
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
    }, [answers, page, questions]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateProgress = () => {
        let progressValue = 0;
        let increaseValue = (1 / (answers.length)) * 100;

        answers.map(answer => {
            if (answer) {
                progressValue += increaseValue;
            }
        })

        setProgress(Math.ceil(progressValue));
    }

    useEffect(() => {
        updateProgress();
    }, [updateProgress]);

    const showQuestionResult = () => {
        const new_questionResult = [];
        for (var i = 0; i < questions.length; i++) {
            let question_Num = parseInt(questions[i].qitemNo)
            let question = questions[i].question
            let answer01 = questions[i].answer01
            let answer02 = questions[i].answer02
            let answerScore01 = questions[i].answerScore01
            let answerScore02 = questions[i].answerScore02

            let page_index = 1

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
                <div className={"row" + page_index +" containQuestion"} key={question_Num} style={{ display: (page_index === page) ? "block" : "none" }}>
                    <h3 className={"question"}>{question}</h3>
                    <div className={"pickAnswer"}>
                        <label className={"pickFirst"}>
                            <input
                                type="radio"
                                name={`answers${question_Num - 1}`}
                                value={answerScore01}
                                onChange={handleAnswerChange}
                                className={"radio"}
                            />
                            {answer01}
                        </label>

                        <label className={"pickSecond"}>
                            <input
                                type="radio"
                                name={`answers${question_Num - 1}`}
                                value={answerScore02}
                                onChange={handleAnswerChange}
                                className={"radio"}
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

    return (
        <div className="containAll container">
            <div className="testHeader">
                <h2>검사 진행</h2>
                <div className="text-right"><h2>{progress}%</h2></div>
            </div>
                <Progress value={progress} />
            <div className="questionDiv">
                {questionResult}
            </div>
            <div className="buttonDiv">
                <div className="directButton">
                    <Button outline color="primary" onClick={() => { handlePageChange('previous') }}>이전</Button>
                </div>
                <nav >
                    <ul className="pagination">
                        {pagination()}
                    </ul>
                </nav>
                <div className="directButton">
                    <Button outline color="primary" onClick={() => { handlePageChange('next') }} disabled={isButtonDisabled}>{buttonChange()}</Button>
                </div>
            </div>
        </div>
    );
};

export default Test;