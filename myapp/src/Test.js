import React, { Component, useEffect, useState } from "react";
import axios from 'axios';

function Showquest(props) {
    const [check, setCheck] = useState(0);

    var quest = props.quest;
    var page = props.page;
    var str_q_num = props.str_q_num;
    var last_q_num = props.last_q_num;

    //<style>
    //  .visible {display: block;}
    //  .invisible {display: none;}
    //</style>

    // function visibility() {

    //     return (
    //         "display : none"  
    //     );
    // } 

    return (
        <div>
            {quest.map(quest =>
            <div id={quest.qitemNo} class="invisible">
                    <div>
                        <label>
                            <p>{quest.question}</p>
                        </label>
                    </div>
                    <div>
                        <label>
                            <p>{quest.answer01}</p>
                        </label>
                        <input
                            type="radio"
                            name={quest.qitemNo}
                            id={quest.answer01}
                            value={quest.answerScore01}
                            onChange={()=>{setCheck()}}
                        />

                        <label>
                            <p>{quest.answer02}</p>
                        </label>
                        <input
                            type="radio"
                            name={quest.qitemNo}
                            id={quest.answer02}
                            value={quest.answerScore02}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function Test() {
    const [quest, setQuest] = useState([]);
    const [page, setPage] = useState(1);

    useEffect (() => {
        axios.get('http://www.career.go.kr/inspct/openapi/test/questions?apikey=32a2c9717c399817549cbb5169b959b7&q=6')
            .then(response => {
                const result = response.data.RESULT;
                console.log(result);
                setQuest(result);
            });
    });

    var str_q_num = 1;
    var last_q_num = 1;
    
    // for (var i=2; i<8; i++) {
    //     if (page === i) {
    //         str_q_num = 
    //     }
    // }

    if (page === 1) {
        str_q_num = 1;
        last_q_num = 1;
    } else if (page === 2) {
        str_q_num = 1;
        last_q_num = 5;
    } else if  (page === 3) {
        str_q_num = 6;
        last_q_num = 10;
    } else if (page === 4) {
        str_q_num = 11;
        last_q_num = 15;
    } else if (page === 5) {
        str_q_num = 16;
        last_q_num = 20;
    } else if (page === 6) {
        str_q_num = 21;
        last_q_num = 25;
    } else if (page === 7) {
        str_q_num = 26;
        last_q_num = 28;
    } 

    return (
        <div>
            <Showquest quest={quest} page={page} str_q_num={str_q_num} last_q_num={last_q_num}/>
            <div>
                <button type="submit" id="prev_btn" onClick={setPage(page-1)}>이전</button>
                <button type="submit" id="next_btn" onClick={setPage(page+1)} disabled>다음</button>
            </div>
        </div>
    ); 
}

export default Test;