import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import { Form, FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap';

function Home() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [name, setName] = useState("")
  const [gender, setGender] = useState("")
  const [invalidMessage, setInvalidMessage] = useState("")

  function handleNameChange(e) {
    console.log(e.target.value);
    const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|]+$/;
    if (regex.test(e.target.value)) {
      setName(e.target.value);
      setInvalidMessage("");
      setUserInfo((prevState) => ({
        ...prevState,
        name: e.target.value
      }));
    } else if (e.target.value === '') {
      setName("");
      setInvalidMessage("이름은 필수값입니다. 이름을 입력해주세요.");
    } else {
      setName("");
      setInvalidMessage("이름은 한글과 영어만 가능합니다. 이름을 바르게 입력해주세요.")
    }
  }

  function handleGenderChange(e) {
    const selected_val = e.target.value;
    setGender(selected_val);
    setUserInfo((prevState) => ({
      ...prevState,
      gender: e.target.value
    }));
  }

  return (
    <div className="container text-center">
      <h1>직업 가치관 검사</h1>
      <Form>
        <FormGroup>
          <Label>
            이름
          </Label>
          <Input
            className={invalidMessage ? "is-invalid " : name ? "is-valid" : ""}
            type="text"
            name="name"
            onBlur={handleNameChange}
            style={{width:'200px'}}
            ></Input>
          <FormFeedback>{invalidMessage}</FormFeedback>
        </FormGroup>
      </Form>

      <div>
        <label>
          <p>성별</p>
        </label>

            <div>
              <label>
                <input
                  type="radio"
                  name="gender"
                  id="male"
                  value="100323"
                  onChange={handleGenderChange}
                />
                남성
              </label>

              <label>
                <input
                  type="radio"
                  name="gender"
                  id="female"
                  value="100324"
                  onChange={handleGenderChange}
                />
                여성
              </label>
            </div>
      </div>

          <Link to="/intro">
            <Button outline color="primary" size="lg" disabled={!name || !gender}>검사 시작</Button>
          </Link>

    </div>
  );
}

export default Home;