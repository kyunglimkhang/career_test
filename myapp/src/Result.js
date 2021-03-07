import { Link, useParams } from "react-router-dom";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from 'axios';
import API_KEY from './config';
import { Table, Button } from 'reactstrap';
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
    const [filter, setFilter] = useState([]);

    const resultApiUrl = `https://inspct.career.go.kr/inspct/api/psycho/report?seq=` + seq;
    const jobByEducationApiUrl = `https://inspct.career.go.kr/inspct/api/psycho/value/jobs?no1=${firstHighScoreNum}&no2=${secondHighScoreNum}`;
    const jobByMajorApiUrl = `https://inspct.career.go.kr/inspct/api/psycho/value/majors?no1=${firstHighScoreNum}&no2=${secondHighScoreNum}`;
    const jobInfoApiUrl = `https://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=32a2c9717c399817549cbb5169b959b7&svcType=api&svcCode=JOB&contentType=json&gubun=job_dic_list&searchJobNm=`;

    const fetchJobByEdu = useCallback(async () => {
        const response = await axios.get(jobByEducationApiUrl);
        setJobByEducation(response.data, () => {

        });
    }, [jobByEducationApiUrl]);

    const fetchJobByMajor = useCallback(async () => {
        const response = await axios.get(jobByMajorApiUrl);
        setJobByMajor(response.data);
    }, [jobByMajorApiUrl]);

    const fetchResult = useCallback(async () => {
        const response = await axios.get(resultApiUrl);

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
        setTestResult(testScore);

    }, [resultApiUrl]);

    const fetchJobInfo = useCallback(async (JobType) => {
        console.log('fetchinfo');
        console.log(JobType);
        if (JobType === "jobByEducation") {
            var jobList = jobByEducation;
        } else {
            var jobList = jobByMajor;
        }
        var jobListWithInfo = [];
        await Promise.all(jobList.map(async (job) => {
            var searchWord = job[1];
            if (job[1].search(/\s/)) {
                searchWord = job[1].split(' ')[0];
            }

            const jobSearchApiUrl = jobInfoApiUrl + searchWord;
            const response = await axios.get(jobSearchApiUrl);
            const searchResult = response.data.dataSearch.content;

            const jobInfo = [];
            searchResult.map((result) => {
                if (result.jobdicSeq === job[0].toString()) {
                    jobInfo.push(result.salery);
                    jobInfo.push(result.prospect);
                    jobInfo.push(result.possibility);
                    jobInfo.push(result.equalemployment);
                }
            });

            const jobWithInfo = job.concat(jobInfo);
            jobListWithInfo.push(jobWithInfo);
        }))

        if (jobListWithInfo.length !== 0) {
            if (JobType === "jobByEducation") {
                console.log("education!");
                setJobByEducation(jobListWithInfo);
            } else {
                console.log("major!");
                setJobByMajor(jobListWithInfo);
            }
        }

    }, [jobByEducation, jobByMajor, jobInfoApiUrl])

    useEffect(() => {
        fetchResult();
    }, [fetchResult]);

    useEffect(() => {
        if (firstHighScoreNum !== null) {
            fetchJobByEdu();
            fetchJobByMajor();
        }
    }, [fetchJobByEdu, fetchJobByMajor, firstHighScoreNum]);

    useEffect(() => {
        if (jobByEducation.length !== 0) {
            console.log(jobByEducation[0].length);
            if (jobByEducation[0].length !== 7) {
                fetchJobInfo("jobByEducation");
                fetchJobInfo("jobByMajor");
            }
        }
    }, [jobByEducation, jobByMajor]);

    useEffect(() => {
        if (testResult.length !== 0) {
            // 가장 점수가 높은 항목 구하기
            const scoreList = [...testResult];
            const firstHighScoreValue = scoreList.sort()[scoreList.length - 1].toString();
            const firstHighScoreIndex = testResult.indexOf(firstHighScoreValue);
            setFirstHighScoreNum(firstHighScoreIndex + 1);
            // 두번째로 점수가 높은 항목 구하기
            const secondHighScoreValue = scoreList.sort()[scoreList.length - 2].toString();

            if (firstHighScoreValue === secondHighScoreValue) {
                var secondHighScoreIndex = testResult.indexOf(firstHighScoreValue, firstHighScoreIndex + 1);
            } else {
                var secondHighScoreIndex = testResult.indexOf(secondHighScoreValue);
            }

            setSecondHighScoreNum(secondHighScoreIndex + 1);
        }
    }, [testResult])

    const setData = () => {
        const categoryName = ["능력발휘", "자율성", "보수", "안정성", "사회적 인정", "사회봉사", "자기계발", "창의성"];
        const data = [{ 항목: '능력발휘', 항목점수: testResult[0] }];
        for (var i = 1; i < categoryName.length; i++) {
            data.push({ 항목: categoryName[i], 항목점수: testResult[i] });
        }
        return data;
    };

    useEffect(() => {
        setData();
    }, [testResult]);

    const showJobByEducation = () => {
        console.log(jobByEducation);
        const educationCategory = ["중졸이하", "고졸", "전문대졸", "대졸", "대학원졸"];
        const jobByEducationList = [];

        educationCategory.map((educationName, educationNum) => {
            educationNum += 1;
            const jobList = jobByEducation.filter(([, , categoryNum]) => categoryNum === educationNum);
            if (jobList.length !== 0) {
                jobByEducationList.push(
                    <tr>
                        <th>{educationName}</th>
                        <td>
                            {jobList.map(([jobNum, jobName]) => {
                                const jobLink = 'https://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=' + jobNum;
                                return (
                                    <a href={jobLink} target='_blank'>
                                        {jobName}
                                                &nbsp;
                                    </a>
                                );
                            })}
                        </td>
                    </tr>
                );
            }
        })
        return jobByEducationList;
    }

    const showJobByMajor = () => {
        console.log(jobByMajor);
        const jobByMajorList = [];
        const majorCategory = ["계열무관", "인문", "사회", "교육", "공학", "자연", "의학", "예체능"];

        majorCategory.map((majorName, majorNum) => {
            majorNum += 1;
            const jobList = jobByMajor.filter(([, , categoryNum]) => categoryNum === majorNum);
            if (filter.length === 0 && jobList.length !== 0) {
                jobByMajorList.push(
                    <tr>
                        <th>{majorName}</th>
                        <td>
                            {jobList.map(([jobNum, jobName]) => {
                                const jobLink = 'https://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=' + jobNum;
                                return (
                                    <a href={jobLink} target='_blank'>
                                        {jobName}
                                                &nbsp;
                                    </a>
                                );
                            })}
                        </td>
                    </tr>
                );
            } else if (filter.length !== 0) {
                // const filterCategory = ["보통미만", "보통이상", "좋음", "매우좋음"];
                console.log("filter!!!start!!");
                console.log(filter);
                const filterList = jobList.filter(([jobNum, jobName, jobcategoryNum, jobsalary, jobprospect, jobpossibility, jobequality]) => jobprospect === filter);
                jobByMajorList.push(
                    <tr>
                        <th>{majorName}</th>
                        <td>
                            {filterList.map(([jobNum, jobName]) => {
                                const jobLink = 'https://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=' + jobNum;
                                return (
                                    <a href={jobLink} target='_blank'>
                                        {jobName}
                                                &nbsp;
                                    </a>
                                );
                            })}
                        </td>
                    </tr>
                );
            }
        })
        return jobByMajorList;
    }

    const handleFilter = (e) => {
        console.log(e.target.value);

        // setFilter((current) => {
        //     console.log(current);
        //     current[2] = "보통미만";
        //     console.log(current);
        //     const newFilter = [...current];
        //     console.log(newFilter);
        //     return newFilter;
        // });
    }

    const filterButtonGroup = () => {
        const filterName = ['평균 연봉', '일자리 전망', '발전 가능성', '고용 평등'];
        const salaryGrade = ['2000만원 미만', '2000만원 이상', '3000만원 이상', '4000만원 이상'];
        const filterGrade = ['보통미만', '보통이상', '좋음', '매우좋음'];
        const filterGroup = [];
        filterName.map((name) => {
            var gradeList = [];
            if (name === '평균 연봉') {
                salaryGrade.map((grade) => {
                    gradeList.push(
                        <li><a value={grade} onClick={(e)=>{handleFilter(e)}}>{grade}</a></li>
                    );
                });
            } else {
                filterGrade.map((grade) => {
                    gradeList.push(
                        <li><a value={grade} onClick={(e)=>{handleFilter(e)}}>{grade}</a></li>
                    );
                });
            }

            filterGroup.push(
                <div class="btn-group">
                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                        {name} <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu" role="menu">
                        {gradeList}
                        <li class="divider"></li>
                        <li><a value="all" onClick={(e)=>{handleFilter(e)}}>전체 보기</a></li>
                    </ul>
                </div>
            );
        });
        return filterGroup
    }

    return (
        <div className="result containAll container">
            <div>
                <div className="header">
                    <h1 className="title">직업가치관검사 검사표</h1>
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
                    <h2 className="category">직업가치관결과</h2>
                    <div className="charts">
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
                <h2 className="category">가치관과 관련이 높은 직업</h2>
                <div>
                    {filterButtonGroup()}
                </div>
                <div>
                    <div className="job">종사자 평균 학력별</div>
                    <div className="table">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>분야</th>
                                    <th>직업</th>
                                </tr>
                            </thead>
                            <tbody>
                                {showJobByEducation()}
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className="jobByMajor">
                    <div className="job">종사자 평균 전공별</div>
                    <div className="table">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>분야</th>
                                    <th>직업</th>
                                </tr>
                            </thead>
                            <tbody>
                                {showJobByMajor()}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
            <div className="reset">
                <Link to="/">
                    <Button outline color="primary">다시 검사하기</Button>
                </Link>
            </div>
        </div>
    );
}

export default Result;



