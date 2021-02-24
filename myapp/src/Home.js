import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const [name, setName] = useState("")
    const [gender, setGender] = useState("")

    function nameChange(e) {
        console.log(e.target.value);
        setName(e.target.value);
    }

    function genderSelect(e) {
        var selected_val = e.target.value;
        console.log(selected_val);
        setGender(selected_val);
    }

    return (
        <div>
          <h1>직업 가치관 검사</h1>
  
          <div>
            <label>
              <p>이름</p>
            </label>

            <input
              type="text"
              name="name"
              onChange={nameChange}
            />
          </div>
          
          {/* 성별 */}
          <div>
            <label>
              <p>성별</p>
            </label>

            <div>
              <input
                type="radio"
                name="gender"
                id="male"
                value="100323"
                onChange={genderSelect}
              />
              <label>남성</label>
            
              <input
                type="radio"
                name="gender"
                id="female"
                value="100324"
                onChange={genderSelect}
              />
              <label>여성</label>
            </div>
          </div>

          <Link to="/test">
            <button type="submit" id="start_btn" disabled={!name||!gender}>검사 시작</button>
          </Link>
        </div>
    );
}