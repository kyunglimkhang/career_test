import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import { Form, FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap';

function Home() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [invalidMessage, setInvalidMessage] = useState("")

  console.log(userInfo.name);
  console.log(userInfo.gender);
  function handleNameChange(e) {
    console.log(e.target.value);
    const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|]+$/;
    if (regex.test(e.target.value)) {
      setUserInfo((prevState) => ({
        ...prevState,
        name: e.target.value
      }));
      setInvalidMessage("");
    } else if (e.target.value === '') {
      setUserInfo((prevState) => ({
        ...prevState,
        name: ""
      }));
      setInvalidMessage("이름은 필수값입니다. 이름을 입력해주세요.");
    } else {
      setUserInfo((prevState) => ({
        ...prevState,
        name: ""
      }));
      setInvalidMessage("이름은 한글과 영어만 가능합니다. 이름을 바르게 입력해주세요.")
    }
  }

  function handleGenderChange(e) {
    setUserInfo((prevState) => ({
      ...prevState,
      gender: e.target.value
    }));
  }

  return (
    <div className="containAll container">
      <h1 className="big-title">직업 가치관 검사</h1>
      <Form className="contain-name container" style={{ 'width': '200px', 'margin-bottom': '20px' }}>
        <FormGroup>
          <Label className="font-weight-bold">
            <h3>이름</h3>
          </Label>
          <Input
            className={invalidMessage ? "is-invalid " : userInfo.name ? "is-valid" : ""}
            type="text"
            name="name"
            onBlur={handleNameChange}
          ></Input>
          <FormFeedback>{invalidMessage}</FormFeedback>
        </FormGroup>
      </Form>

      <div style={{ 'margin-bottom': '30px' }}>
        <label>
          <h3>성별</h3>
        </label>

        <div className="d-flex justify-content-center">
          <label className={"pickFirst"}>
            <input
              type="radio"
              name="gender"
              id="male"
              value="100323"
              onChange={handleGenderChange}
              className={"radio"}
            />
                남성
              </label>

          <label className={"pickSecond"}>
            <input
              type="radio"
              name="gender"
              id="female"
              value="100324"
              onChange={handleGenderChange}
              className={"radio"}
            />
                여성
              </label>
        </div>
      </div>
      <Link to="/intro">
        <Button outline color="primary" size="lg" className="big-button" disabled={!userInfo.name || !userInfo.gender}>검사 시작</Button>
      </Link>
    </div>
  );
}

export default Home;