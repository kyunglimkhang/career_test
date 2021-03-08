import { Link, useParams } from "react-router-dom";
import React, { useCallback, useEffect, useMemo, useState, useContext } from "react";
import { UserContext } from "./UserContext";
import axios from 'axios';
import API_KEY from './config';
import { Table, Button } from 'reactstrap';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "./Result.css";
import { CopyToClipboard } from 'react-copy-to-clipboard'

function Result() {
    const { seq } = useParams();
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [testResult, setTestResult] = useState([]);
    const [firstHighScoreNum, setFirstHighScoreNum] = useState(null);
    const [secondHighScoreNum, setSecondHighScoreNum] = useState(null);
    const [jobByEducation, setJobByEducation] = useState([]);
    const [jobByMajor, setJobByMajor] = useState([]);
    const [filter, setFilter] = useState({
        salary: "",
        prospect: "",
        improvement: "",
        equality: ""
    });

    const filterTitle = ['평균 연봉', '일자리 전망', '발전 가능성', '고용 평등'];
    const salaryGrade = ['2000 만원 미만', '2000 만원 이상', '3000 만원 이상', '4000 만원 이상'];
    const filterName = ['salary', 'prospect', 'improvement', 'equality']
    const filterGrade = ['보통미만', '보통이상', '좋음이상', '매우좋음'];

    const resultApiUrl = `https://inspct.career.go.kr/inspct/api/psycho/report?seq=` + seq;
    const jobByEducationApiUrl = `https://inspct.career.go.kr/inspct/api/psycho/value/jobs?no1=${firstHighScoreNum}&no2=${secondHighScoreNum}`;
    const jobByMajorApiUrl = `https://inspct.career.go.kr/inspct/api/psycho/value/majors?no1=${firstHighScoreNum}&no2=${secondHighScoreNum}`;
    const jobInfoApiUrl = `https://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=32a2c9717c399817549cbb5169b959b7&svcType=api&svcCode=JOB&contentType=json&gubun=job_dic_list&searchJobNm=`;
    const currentUrl = window.location.href;
    console.log(currentUrl);

    const fetchJobByEdu = useCallback(async () => {
        console.log("fetchJobByEdu!!!");
        const response = await axios.get(jobByEducationApiUrl);
        setJobByEducation(response.data);
    }, [jobByEducationApiUrl]);

    const fetchJobByMajor = useCallback(async () => {
        console.log("fetchJobByMajor!!");
        const response = await axios.get(jobByMajorApiUrl);
        setJobByMajor(response.data);
    }, [jobByMajorApiUrl]);

    const fetchResult = useCallback(async () => {
        console.log("fetchResult!!!");
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
        console.log("fetchJobInfo!!");
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
            if (jobByEducation[0].length < 7) {
                fetchJobInfo("jobByEducation");
                fetchJobInfo("jobByMajor");
            }
        }
    }, [fetchJobInfo, jobByEducation, jobByMajor]);

    useEffect(() => {
        console.log("findNums!!!");
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

    const showJobList = (jobList) => {
        const jobListResult = [];
        jobList.map(([jobNum, jobName, jobcategoryNum, jobsalary, jobprospect, jobimprovement, jobequality]) => {
            console.log([jobNum, jobName, jobcategoryNum, jobsalary, jobprospect, jobimprovement, jobequality]);
            const jobsalaryIndex = parseInt(salaryGrade.indexOf(jobsalary));
            const jobprospectIndex = parseInt(filterGrade.indexOf(jobprospect));
            const jobimprovementIndex = parseInt(filterGrade.indexOf(jobimprovement));
            const jobequalityIndex = parseInt(filterGrade.indexOf(jobequality));

            if (filter.salary && parseInt(filter.salary) === 0) {
                if (jobsalaryIndex !== parseInt(filter.salary)) {
                    return false
                }
            }
            if (filter.salary && parseInt(filter.salary) > 0) {
                if (jobsalaryIndex < parseInt(filter.salary)) {
                    return false
                }
            }

            if (filter.prospect && parseInt(filter.prospect) === 0) {
                if (jobprospectIndex !== parseInt(filter.prospect)) {
                    return false
                }
            }
            if (filter.prospect && parseInt(filter.prospect) > 0) {
                if (jobprospectIndex < parseInt(filter.prospect)) {
                    return false
                }
            }

            if (filter.improvement && parseInt(filter.improvement) === 0) {
                if (jobimprovementIndex !== parseInt(filter.improvement)) {
                    return false
                }
            }
            if (filter.improvement && parseInt(filter.improvement) > 0) {
                if (jobimprovementIndex < parseInt(filter.improvement)) {
                    return false
                }
            }

            if (filter.equality && parseInt(filter.equality) === 0) {
                if (jobequalityIndex !== parseInt(filter.equality)) {
                    return false
                }
            }
            if (filter.equality && parseInt(filter.equality) > 0) {
                if (jobequalityIndex < parseInt(filter.equality)) {
                    return false
                }
            }

            const jobLink = 'https://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=' + jobNum;
            jobListResult.push(
                <a href={jobLink} target='_blank'>
                    {jobName}
                                &nbsp;
                </a>
            );
        })
        return jobListResult
    }

    const showJobByEducation = () => {
        if (jobByEducation.length === 0) {
            return false
        }
        console.log("showJobByEducation!!");
        console.log(jobByEducation);
        const jobByEducationList = [];
        const educationCategory = ["계열무관", "인문", "사회", "교육", "공학", "자연", "의학", "예체능"];
        educationCategory.map((educationName, educationNum) => {
            educationNum += 1;
            const jobList = jobByEducation.filter(([, , categoryNum]) => categoryNum === educationNum);
            console.log(jobList);
            console.log(filter);
            if (jobList.length !== 0) {
                jobByEducationList.push(
                    <tr>
                        <th>{educationName}</th>
                        <td>
                            {showJobList(jobList)}
                        </td>
                    </tr>
                );
            }
        })
        return jobByEducationList
    }

    const showJobByMajor = () => {
        if (jobByMajor.length === 0) {
            return false
        }
        console.log("showJobByMajor!!");
        console.log(jobByMajor);
        const jobByMajorList = [];
        const majorCategory = ["계열무관", "인문", "사회", "교육", "공학", "자연", "의학", "예체능"];
        majorCategory.map((majorName, majorNum) => {
            majorNum += 1;
            const jobList = jobByMajor.filter(([, , categoryNum]) => categoryNum === majorNum);
            console.log(jobList);
            console.log(filter);
            if (jobList.length !== 0) {
                jobByMajorList.push(
                    <tr>
                        <th>{majorName}</th>
                        <td>
                            {showJobList(jobList)}
                        </td>
                    </tr>
                );
            }
        })
        return jobByMajorList
    }

    const handleFilter = (e) => {
        Object.entries(filter).map(([key, value]) => {
            if (key === e.target.name) {
                filter[key] = e.target.value;
            }
        });
        console.log(typeof (filter.salary));
        setFilter((prevState) => ({
            ...prevState,
            salary: filter.salary,
            prospect: filter.prospect,
            improvement: filter.improvement,
            equality: filter.equality
        }));
    }

    const filterButtonGroup = () => {
        const filterGroup = [];
        const fileterNow = [];

        filterTitle.map((name, index) => {
            var gradeList = [];
            if (name === '평균 연봉') {
                salaryGrade.map((grade, gradeIndex) => {
                    gradeList.push(
                        <li><button className="filter-value-btn btn btn-outline-success" value={gradeIndex} name={filterName[index]} onClick={(e) => { handleFilter(e) }}>{grade}</button></li>
                    );
                });
            } else {
                filterGrade.map((grade, gradeIndex) => {
                    gradeList.push(
                        <li><button className="filter-value-btn btn btn-outline-success" value={gradeIndex} name={filterName[index]} onClick={(e) => { handleFilter(e) }}>{grade}</button></li>
                    );
                });
            }

            filterGroup.push(
                <div className="btn-group">
                    <div type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                        {name} <span className="caret"></span>
                    </div>
                    <ul className="dropdown-menu" role="menu">
                        {gradeList}
                        <li><button className="filter-value-btn btn btn-outline-success" value="" name={filterName[index]} onClick={(e) => { handleFilter(e) }}>전체 보기</button></li>
                    </ul>
                </div>
            );
        });

        return filterGroup

    }

    const filterNowGroup = () => {
        const fileterNow = [];
        Object.entries(filter).map(([filterName, gradeIndex], index) => {
            if (filterName === "salary") {
                fileterNow.push(
                    <div className="filter-now"><h6 style={{ 'fontWeight': 'bold' }}>{filterTitle[index]}:</h6>&nbsp;<h6>{salaryGrade[gradeIndex]}</h6></div>
                );
            } else {
                fileterNow.push(
                    <div className="filter-now"><h6 style={{ 'fontWeight': 'bold' }}>{filterTitle[index]}:</h6>&nbsp;<h6>{filterGrade[gradeIndex]}</h6></div>
                );
            }
        });
        return (
            <div className="div-filter-now">
                {fileterNow}
            </div>
        );
    }

    return (
        <div className="result containAll container">
            <div>
                <div className="header">
                    <h1 className="big-title">직업가치관검사 검사표</h1>
                    <p className="description">직업가치관이란 직업을 선택할 때 영향을 끼치는 자신만의 믿음과 신념입니다. 따라서 여러분의 직업생활과 관련하여 포기하지 않는 무게중심의 역할을 한다고 볼 수 있습니다. 직업가치관검사는 여러분이 직업을 선택할 때 상대적으로 어떠한 가치를 중요하게 생각하는지를 알려줍니다. 또한 본인이 가장 중요하게 생각하는 가치를 충족시켜줄 수 있는 직업에 대해 생각해 볼 기회를 제공합니다.</p>
                </div>
                <Table className="contain-userinfo container">
                    <thead>
                        <tr>
                            <th>이름</th>
                            <th>성별</th>
                            <th>검사일</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="userinfo">
                            <td>{userInfo.name}</td>
                            <td>{userInfo.gender}</td>
                            <td>{userInfo.testDate}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            <div div className="category-div">
                <div className="contain-chart container">
                    <h2 className="result-medium-title">직업가치관결과</h2>
                    <div className="charts">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={setData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="항목" />
                                <Tooltip />
                                <Bar dataKey="항목점수" stackId="a" fill="#007bff" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <div className="category-div container">
                <h2 className="result-medium-title">가치관과 관련이 높은 직업</h2>
                <div className="contain-filter container">
                    {filterButtonGroup()}
                </div>
                <div className="container">
                    <h4 style={{ "margin-bottom": "20px" }}>적용된 필터</h4>
                    {filterNowGroup()}
                </div>
                <div className="contain-job-table container">
                    <h3 className="job-category">종사자 평균 학력별</h3>
                    <div className="table">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>분야</th>
                                    <th className="table-job-col">직업</th>
                                </tr>
                            </thead>
                            <tbody>
                                {showJobByEducation()}
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className="contain-job-table container">
                    <h3 className="job-category">종사자 평균 전공별</h3>
                    <div className="table">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>분야</th>
                                    <th className="table-job-col">직업</th>
                                </tr>
                            </thead>
                            <tbody>
                                {showJobByMajor()}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
            <div className="contain-reset container">
                <Link to="/">
                    <Button outline color="primary" className="big-button" onClick={() => setUserInfo({ name: '', gender: '' })}>다시 검사하기</Button>
                </Link>
                <CopyToClipboard text={currentUrl}>
                    <Button outline color="primary" className="big-button" onClick={()=>{alert("copied!!")}}>URL 복사</Button>
                </CopyToClipboard>
            </div>
        </div>
    );
}

export default Result;



