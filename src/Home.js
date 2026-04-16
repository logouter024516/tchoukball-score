import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>모드 선택</h1>
      <div style={{ display: "flex", gap: "40px", justifyContent: "center", marginTop: "40px" }}>
        <button onClick={() => navigate('/competition')} style={btnStyle}>
          학급 대항전
        </button>
        <button onClick={() => navigate('/match')} style={btnStyle}>
          학급 경기
        </button>
        <button onClick={() => navigate('/roster')} style={btnStyle}>
          학생 명단
        </button>
      </div>
    </div>
  );
}

const btnStyle = {
  fontSize: "1.5rem",
  padding: "40px 60px",
  borderRadius: "16px",
  cursor: "pointer"
};

export default Home;