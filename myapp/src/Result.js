import { Link, useParams } from "react-router-dom";
import React, { PureComponent, useCallback, useEffect, useMemo, useState, useContext, } from "react";
import axios from 'axios';
import API_KEY from './config';
import { Table } from 'reactstrap';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Result.css";

function Result() {
    const { seq } = useParams();
    const [userInfo, setUserInfo] = useState([]);
    const [testResult, setTestResult] = useState([]);
    const [firstHighScoreNum, setFirstHighScoreNum] = useState(null);
    const [secondHighScoreNum, setSecondHighScoreNum] = useState(null);
    const [jobByEducation, setJobByEducation] = useState([]);
    const [jobByMajor, setJobByMajor] = useState([]);

    const resultApiUrl = `https://inspct.career.go.kr/inspct/api/psycho/report?seq=` + seq;
    const jobByEducationApiUrl = `https://inspct.career.go.kr/inspct/api/psycho/value/jobs?no1=${firstHighScoreNum}&no2=${secondHighScoreNum}`;
    const jobByMajorApiUrl = `https://inspct.career.go.kr/inspct/api/psycho/value/majors?no1=${firstHighScoreNum}&no2=${secondHighScoreNum}`;

    const fetchJobByEdu = useCallback(async () => {
        console.log(jobByEducationApiUrl);
        const response = await axios.get(jobByEducationApiUrl);
        const jobByEducationData = {
            highschool: [],
            college: [],
            university: [],
            master: []
        };

        console.log(response.data);
        response.data.map((data) => {
            if (data[2] === 2) {
                jobByEducationData.highschool.push(data);
            } else if (data[2] === 3) {
                jobByEducationData.college.push(data);
            } else if (data[2] === 4) {
                jobByEducationData.university.push(data);
            } else if (data[2] === 5) {
                jobByEducationData.master.push(data);
            }
        })
        console.log(jobByEducationData);
        setJobByEducation(jobByEducationData);

    }, [jobByEducationApiUrl]);

    const fetchJobByMajor = useCallback(async () => {
        console.log(jobByMajorApiUrl);
        const response = await axios.get(jobByMajorApiUrl);
        console.log(response);
        const jobByMajorData = {
            irrelevent: [],
            liberal: [],
            social: [],
            education: [],
            engineering: [],
            natural: [],
            medical: [],
            artsandphysical: []
        };
        console.log(response.data);
        response.data.map((data) => {
            if (data[2] === 0) {
                jobByMajorData.irrelevent.push(data);
            } else if (data[2] === 1) {
                jobByMajorData.liberal.push(data);
            } else if (data[2] === 2) {
                jobByMajorData.social.push(data);
            } else if (data[2] === 3) {
                jobByMajorData.education.push(data);
            } else if (data[2] === 4) {
                jobByMajorData.engineering.push(data);
            } else if (data[2] === 5) {
                jobByMajorData.natural.push(data);
            } else if (data[2] === 6) {
                jobByMajorData.medical.push(data);
            } else if (data[2] === 7) {
                jobByMajorData.artsandphysical.push(data);
            }
        })
        console.log(jobByMajorData);
        setJobByMajor(jobByMajorData);

    }, [jobByMajorApiUrl]);


    const fetchResult = useCallback(async () => {
        const response = await axios.get(resultApiUrl);
        console.log(response);
        console.log(response.data.result);

        const userData = {};
        userData.name = response.data.inspct.nm;
        if (response.data.inspct.sexdstn === 100323) {
            userData.gender = "남성";
        } else {
            userData.gender = "여성";
        }
        userData.testDate = response.data.inspct.registDt.split('T')[0].replaceAll('-', '.');
        setUserInfo(userData);

        const testScore = response.data.result.wonScore.split(' ').map(score => score.split('=')[1]);
        testScore.pop();
        console.log(testScore);
        setTestResult(testScore);

    }, [resultApiUrl]);

    useEffect(() => {
        fetchResult();
    }, [fetchResult]);

    useEffect(() => {
        console.log(firstHighScoreNum);
        console.log(secondHighScoreNum);
        if (firstHighScoreNum !== null) {
            fetchJobByEdu();
            fetchJobByMajor();
        }
    }, [fetchJobByEdu, fetchJobByMajor]);


    useEffect(() => {
        if (testResult.length !== 0) {
            // 가장 점수가 높은 항목 구하기
            var scoreList = [...testResult];
            var firstHighScoreValue = scoreList.sort()[scoreList.length - 1].toString();
            var firstHighScoreIndex = testResult.indexOf(firstHighScoreValue);
            setFirstHighScoreNum(firstHighScoreIndex + 1);
            // 두번째로 점수가 높은 항목 구하기
            var secondHighScoreValue = scoreList.sort()[scoreList.length - 2].toString();
            console.log(secondHighScoreValue);
            if (firstHighScoreValue === secondHighScoreValue) {
                var secondHighScoreIndex = testResult.indexOf(firstHighScoreValue, firstHighScoreIndex + 1);
            } else {
                var secondHighScoreIndex = testResult.indexOf(secondHighScoreValue);
            }
            console.log(secondHighScoreIndex);
            setSecondHighScoreNum(secondHighScoreIndex + 1);
        }
    }, [testResult])

    const setData = () => {
        const data = [{
            항목: '능력발휘',
            항목점수: testResult[0]
        },
        {
            항목: '자율성',
            항목점수: testResult[1]
        },
        {
            항목: '보수',
            항목점수: testResult[2]
        },
        {
            항목: '안정성',
            항목점수: testResult[3]
        },
        {
            항목: '사회적 인정',
            항목점수: testResult[4]
        },
        {
            항목: '사회봉사',
            항목점수: testResult[5]
        },
        {
            항목: '자기계발',
            항목점수: testResult[6]
        },
        {
            항목: '창의성',
            항목점수: testResult[7]
        }];
        return data;
    };

    useEffect(() => {
        setData();
    }, [testResult]);

    return (
        <div class="result">
            <div>
                <div class="header">
                    <h1 class="title">직업가치관검사 검사표</h1>
                    <p>직업가치관이란 직업을 선택할 때 영향을 끼치는 자신만의 믿음과 신념입니다. 따라서 여러분의 직업생활과 관련하여 포기하지 않는 무게중심의 역할을 한다고 볼 수 있습니다. 직업가치관검사는 여러분이 직업을 선택할 때 상대적으로 어떠한 가치를 중요하게 생각하는지를 알려줍니다. 또한 본인이 가장 중요하게 생각하는 가치를 충족시켜줄 수 있는 직업에 대해 생각해 볼 기회를 제공합니다.</p>
                </div>
                <Table>
                    <thead>
                        <tr>
                            <th>이름</th>
                            <th>성별</th>
                            <th>검사일</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{userInfo.name}</td>
                            <td>{userInfo.gender}</td>
                            <td>{userInfo.testDate}</td>
                        </tr>
                    </tbody>
                </Table>

                <div>
                    <h2 class="category">직업가치관결과</h2>
                    <div class="charts">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={setData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="항목" />
                                <Tooltip />
                                <Bar dataKey="항목점수" stackId="a" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <div>
                <h2 class="category">가치관과 관련이 높은 직업</h2>
                <div>
                    <div class="job">종사자 평균 학력별</div>
                    <div class="table">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>분야</th>
                                    <td>직업</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>고졸</th>
                                    <td>
                                        {jobByEducation.highschool && jobByEducation.highschool.map((job) => {
                                            const jobLink = 'https://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=' + job[0];
                                            return (
                                                <a href={jobLink} target='_blank'>
                                                    {job[1]}
                                            &nbsp;
                                                </a>
                                            );
                                        })}
                                    </td>
                                </tr>
                                <tr>
                                    <th>전문대졸</th>
                                    <td>
                                        {jobByEducation.college && jobByEducation.college.map((job) => {
                                            const jobLink = 'https://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=' + job[0];
                                            return (
                                                <a href={jobLink} target='_blank'>
                                                    {job[1]}
                                            &nbsp;
                                                </a>
                                            );
                                        })}
                                    </td>
                                </tr>
                                <tr>
                                    <th>대졸</th>
                                    <td>
                                        {jobByEducation.university && jobByEducation.university.map((job) => {
                                            const jobLink = 'https://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=' + job[0];
                                            return (
                                                <a href={jobLink} target='_blank'>
                                                    {job[1]}
                                            &nbsp;
                                                </a>
                                            );
                                        })}
                                    </td>
                                </tr>
                                <tr>
                                    <th>대학원졸</th>
                                    <td>
                                        {jobByEducation.master && jobByEducation.master.map((job) => {
                                            const jobLink = 'https://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=' + job[0];
                                            return (
                                                <a href={jobLink} target='_blank'>
                                                    {job[1]}
                                            &nbsp;
                                                </a>
                                            );
                                        })}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div class="jobByMajor">
                    <div class="job">종사자 평균 전공별</div>
                    <Table hover>
                        <thead>
                            <tr>
                                <th>분야</th>
                                <th>직업</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>계열무관</th>
                                <td>
                                    {jobByMajor.irrelevent && jobByMajor.irrelevent.map((job) => {
                                        const jobLink = 'https://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=' + job[0];
                                        return (
                                            <a href={jobLink} target='_blank'>
                                                {job[1]}
                                            &nbsp;
                                            </a>
                                        );
                                    })}
                                </td>
                            </tr>
                            <tr>
                                <th>인문</th>
                                <td>
                                    {jobByMajor.liberal && jobByMajor.liberal.map((job) => {
                                        const jobLink = 'https://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=' + job[0];
                                        return (
                                            <a href={jobLink} target='_blank'>
                                                {job[1]}
                                            &nbsp;
                                            </a>
                                        );
                                    })}
                                </td>
                            </tr>
                            <tr>
                                <th>사회</th>
                                <td>
                                    {jobByMajor.social && jobByMajor.social.map((job) => {
                                        const jobLink = 'https://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=' + job[0];
                                        return (
                                            <a href={jobLink} target='_blank'>
                                                {job[1]}
                                            &nbsp;
                                            </a>
                                        );
                                    })}
                                </td>
                            </tr>
                            <tr>
                                <th>교육</th>
                                <td>
                                    {jobByMajor.education && jobByMajor.education.map((job) => {
                                        const jobLink = 'https://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=' + job[0];
                                        return (
                                            <a href={jobLink} target='_blank'>
                                                {job[1]}
                                            &nbsp;
                                            </a>
                                        );
                                    })}
                                </td>
                            </tr>
                            <tr>
                                <th>공학</th>
                                <td>
                                    {jobByMajor.engineering && jobByMajor.engineering.map((job) => {
                                        const jobLink = 'https://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=' + job[0];
                                        return (
                                            <a href={jobLink} target='_blank'>
                                                {job[1]}
                                            &nbsp;
                                            </a>
                                        );
                                    })}
                                </td>
                            </tr>
                            <tr>
                                <th>자연</th>
                                <td>
                                    {jobByMajor.natural && jobByMajor.natural.map((job) => {
                                        const jobLink = 'https://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=' + job[0];
                                        return (
                                            <a href={jobLink} target='_blank'>
                                                {job[1]}
                                            &nbsp;
                                            </a>
                                        );
                                    })}
                                </td>
                            </tr>
                            <tr>
                                <th>의학</th>
                                <td>
                                    {jobByMajor.medical && jobByMajor.medical.map((job) => {
                                        const jobLink = 'https://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=' + job[0];
                                        return (
                                            <a href={jobLink} target='_blank'>
                                                {job[1]}
                                            &nbsp;
                                            </a>
                                        );
                                    })}
                                </td>
                            </tr>
                            <tr>
                                <th>예체능</th>
                                <td>
                                    {jobByMajor.artsandphysical && jobByMajor.artsandphysical.map((job) => {
                                        const jobLink = 'https://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=' + job[0];
                                        return (
                                            <a href={jobLink} target='_blank'>
                                                {job[1]}
                                            &nbsp;
                                            </a>
                                        );
                                    })}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
            <div class="reset">
                <Link to="/">
                    <button type="submit">다시 검사하기</button>
                </Link>
            </div>
        </div>
    );
}

export default Result;



