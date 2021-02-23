import React, { useState } from "react";

export default function Home() {
    const [name, setName] = useState("")
    const [gender, setGender] = useState("")
    const start_btn = document.querySelector('#start_btn')
    // const [disabled, setDisabled] = useState(true)

    function nameChange(e) {
        console.log(e.target.value);
        setName(e.target.value);
    }

    function genderSelect(e) {
        var selected_val = e.target.value;
        console.log(selected_val);
        
        //check_only_one
        var chkbox = document.getElementsByName("chkbox");
        for(var i=0; i<chkbox.length; i++){
        if(chkbox[i].value === selected_val){
            chkbox[i].checked = true;
        } else {
            chkbox[i].checked = false;
        }
        }

        setGender(selected_val);
    }

    if (name && gender) {
        console.log(name);
        console.log(gender);
        document.querySelector('#start_btn').disabled = false;
    }
    return (
        <div>
          <h1>직업 가치관 검사</h1>
          <div>
            <lable>
              <p>이름</p>
            </lable>
            <input
              type="text"
              name="name"
              onChange={nameChange}
            />
          </div>
          <div>
            <lable>
              <p>성별</p>
            </lable>
            <lable>
              <input
                type="checkbox"
                name="chkbox"
                id="man"
                value="man"
                onChange={genderSelect}
              />
              남성
              <input
                type="checkbox"
                name="chkbox"
                id="woman"
                value="woman"
                onChange={genderSelect}
              />
              여성
            </lable>
          </div>
        </div>
    );
}