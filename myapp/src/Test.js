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
        return dateToTimestamp;
    }

    useEffect(() => {
        timeStamp();
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

    //????????? ??????
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
            return "??????"
        }
        else {
            return "??????"
        }
    }

    //pagination
    const handlePagination = (e) => {
        setPage(parseInt(e.target.value));
    }

    const pagination = () => {
        const paginationGroup = [];
        const lastPage = parseInt(answers.filter((answer) => answer !== undefined).length / 5) + 1;
        for (var i = 0; i < lastPage; i++) {
            var pageIndex = i + 1;
            paginationGroup.push(
                <li><Button outline color="primary" value={pageIndex} onClick={(e) => { handlePagination(e) }}>{pageIndex}</Button></li>
            );
        }
        return paginationGroup;
    }

    const isButtonDisabled = useMemo(() => {
        let isDisabled = false;
        questions.forEach((question) => {
            const questionNum = parseInt(question.qitemNo, 10);
            if (Math.ceil(questionNum / 5) === page) {
                if (!answers[questionNum - 1]) {
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
        const newQuestionResult = [];
        console.log(questions);
        questions.map((item) => {
            let questionNum = parseInt(item.qitemNo)
            let question = item.question
            let answer01 = item.answer01
            let answer02 = item.answer02
            let answerScore01 = item.answerScore01
            let answerScore02 = item.answerScore02

            let pageIndex = 1

            if (questionNum % 5 === 0) {
                pageIndex = parseInt(questionNum / 5)
            } else {
                pageIndex = parseInt(questionNum / 5) + 1
            }

            const handleAnswerChange = (e) => {
                setAnswers((current) => {
                    const questionIndex = e.target.name.split('answers')[1];
                    const newAnswers = [...current];
                    newAnswers[questionIndex] = e.target.value;
                    return newAnswers;
                });
            }

            newQuestionResult.push(
                <div className={"row" + pageIndex + " contain-question"} key={questionNum} style={{ display: (pageIndex === page) ? "block" : "none" }}>
                    <h3 className={"question"}>{question}</h3>
                    <div className={"pickAnswer"}>
                        <label className={"pickFirst"}>
                            <input
                                type="radio"
                                name={`answers${questionNum - 1}`}
                                value={answerScore01}
                                onChange={handleAnswerChange}
                                className={"radio"}
                            />
                            {answer01}
                        </label>

                        <label className={"pickSecond"}>
                            <input
                                type="radio"
                                name={`answers${questionNum - 1}`}
                                value={answerScore02}
                                onChange={handleAnswerChange}
                                className={"radio"}
                            />
                            {answer02}
                        </label>
                    </div>
                </div>
            )
        });
        setQuestionResult(newQuestionResult);
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
                <h2>?????? ??????</h2>
                <div className="text-right"><h2>{progress}%</h2></div>
            </div>
            <Progress value={progress} />
            <div className="questionDiv">
                {questionResult}
            </div>
            <div className="buttonDiv">
                <div className="directButton">
                    <Button outline color="primary" onClick={() => { handlePageChange('previous') }}>??????</Button>
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