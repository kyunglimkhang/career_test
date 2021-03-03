import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext"

function Home() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [name, setName] = useState("")
  const [gender, setGender] = useState("")

  function nameChange(e) {
    setName(e.target.value);
    setUserInfo((prevState) => ({
      ...prevState,
      name: e.target.value
    }));
  }

  function genderSelect(e) {
    var selected_val = e.target.value;
    setGender(selected_val);
    setUserInfo((prevState) => ({
      ...prevState,
      gender: e.target.value
    }));
  }

  return (
    <div>
      <h1>직업 가치관 검사</h1>

      <div>
        <label>
          <p>이름</p>
          <input
            type="text"
            name="name"
            onChange={nameChange}
          />
        </label>
      </div>

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
              onChange={genderSelect}
            />
                남성
              </label>

          <label>
            <input
              type="radio"
              name="gender"
              id="female"
              value="100324"
              onChange={genderSelect}
            />
                여성
              </label>
        </div>
      </div>

      <Link to="/intro">
        <button type="submit" id="start_btn" disabled={!name || !gender}>검사 시작</button>
      </Link>
      
    </div>
  );
}

export default Home;