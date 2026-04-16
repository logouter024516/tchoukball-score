import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

// 경기 ID (원하면 아무 문자열로 변경 가능, 경기별로 다르게!)
const MATCH_ID = "test-match-001";

export default function Scoreboard() {
  const [score, setScore] = useState({ teamA: 0, teamB: 0 });

  // 실시간 Firestore 점수 구독 (자동 동기화)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "matches", MATCH_ID), (docSnap) => {
      if (docSnap.exists()) setScore(docSnap.data().score ?? { teamA: 0, teamB: 0 });
      else setScore({ teamA: 0, teamB: 0 });
    });
    return () => unsub();
  }, []);

  // 점수 +1 함수
  const addScore = async (team) => {
    const ref = doc(db, "matches", MATCH_ID);
    await setDoc(
      ref,
      {
        score: {
          teamA: score.teamA + (team === "A" ? 1 : 0),
          teamB: score.teamB + (team === "B" ? 1 : 0),
        },
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  };

  // 점수 리셋 함수
  const resetScore = async () => {
    await updateDoc(doc(db, "matches", MATCH_ID), {
      score: { teamA: 0, teamB: 0 },
      updatedAt: Date.now(),
    });
  };

  return (
    <div style={{ textAlign: "center", margin: "40px" }}>
      <h1>스코어보드</h1>
      <div style={{ fontSize: 48, margin: 24 }}>
        팀 A : {score.teamA} &nbsp; : &nbsp; {score.teamB} : 팀 B
      </div>
      <div style={{ margin: 24 }}>
        <button onClick={() => addScore("A")}>팀A 득점 +1</button>
        <button onClick={() => addScore("B")}>팀B 득점 +1</button>
        <button onClick={resetScore}>리셋</button>
      </div>
      <p>(여러 기기에서 이 화면을 열면, 실시간으로 동기화됩니다!)</p>
    </div>
  );
}