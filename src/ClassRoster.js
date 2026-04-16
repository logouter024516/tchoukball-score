import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import * as XLSX from "xlsx";

export default function ClassRoster() {
  const [classes, setClasses] = useState([]);
  const [addInputs, setAddInputs] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "classes"), (snap) => {
      setClasses(snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsub();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      let dataRows = rows;
      if (
        rows[0][0]?.includes("학급") &&
        rows[0][1]?.includes("번호") &&
        rows[0][2]?.includes("이름")
      ) {
        dataRows = rows.slice(1);
      }
      let classMap = {};
      dataRows.forEach(([className, stuNum, stuName]) => {
        if (!className || !stuNum || !stuName) return;
        if (!classMap[className]) classMap[className] = [];
        classMap[className].push({
          id: Date.now() + Math.random(),
          name: stuName,
          num: stuNum,
        });
      });
      for (let className of Object.keys(classMap)) {
        let exists = classes.find((cls) => cls.name === className);
        if (exists) {
          let merged = [...exists.students, ...classMap[className]];
          await updateDoc(doc(db, "classes", exists.id), { students: merged });
        } else {
          await addDoc(collection(db, "classes"), {
            name: className,
            students: classMap[className],
          });
        }
      }
      alert("명단을 파일에서 불러왔습니다!");
    };
    reader.readAsArrayBuffer(file);
  };

  const handleInputChange = (classId, field, value) => {
    setAddInputs((prev) => ({
      ...prev,
      [classId]: { ...prev[classId], [field]: value }
    }));
  };

  const addStudent = async (classId) => {
    const input = addInputs[classId] || {};
    if (!input.num || !input.name) return;
    const cls = classes.find((c) => c.id === classId);
    let newList = [
      ...(cls.students || []),
      { id: Date.now() + Math.random(), num: input.num, name: input.name },
    ];
    await updateDoc(doc(db, "classes", classId), { students: newList });
    setAddInputs((prev) => ({ ...prev, [classId]: { num: "", name: "" } }));
  };

  const removeStudent = async (classId, studentId) => {
    const cls = classes.find((c) => c.id === classId);
    if (!cls) return;
    let newList = (cls.students || []).filter((stu) => stu.id !== studentId);
    await updateDoc(doc(db, "classes", classId), { students: newList });
  };

  // 모바일용 스타일
  const styles = {
    wrap: {
      maxWidth: 500,
      margin: "24px auto",
      padding: "4vw 2vw",
      background: "#fff",
      borderRadius: "18px",
      boxShadow: "0 3px 12px #eee",
      fontSize: "max(16px, 3vw)",
      lineHeight: 1.5,
    },
    input: {
      fontSize: "max(16px, 3vw)",
      padding: "10px 8px",
      border: "1px solid #bbb",
      borderRadius: 8,
      margin: "0 4px 4px 0",
    },
    button: {
      fontSize: "max(16px,2.5vw)",
      padding: "10px 16px",
      borderRadius: 8,
      border: "none",
      background: "#3182f6",
      color: "#fff",
      fontWeight: "bold",
      margin: "0 4px 4px 0",
      cursor: "pointer",
      minWidth: 60,
    },
    removeBtn: {
      fontSize: "max(15px,2vw)",
      padding: "7px 14px",
      borderRadius: 7,
      marginLeft: 10,
      background: "#ff5252",
      color: "#fff",
      border: "none",
      cursor: "pointer"
    },
    classBlock: {
      background: "#f9fafe",
      borderRadius: 12,
      padding: "8px 8px 18px 8px",
      marginBottom: 24,
    }
  };

  return (
    <div style={styles.wrap}>
      <h2 style={{ textAlign: "center", marginBottom: 24, fontWeight: 800 }}>학생 명단 관리</h2>
      <div style={{ marginBottom: 20 }}>
        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileUpload}
          style={styles.input}
        />
        <span style={{ fontSize: "13px" }}>
          엑셀·한셀 파일(학급,번호,이름) 업로드 가능
        </span>
      </div>

      <div>
        {classes.map(cls => (
          <div key={cls.id} style={styles.classBlock}>
            <div style={{ fontWeight:"bold", fontSize:"1.1em", marginBottom: 6 }}>{cls.name}</div>
            <div style={{ display:"flex", gap:6, marginBottom:10 }}>
              <input
                type="text"
                placeholder="번호"
                style={{ ...styles.input, width: 60 }}
                value={addInputs[cls.id]?.num || ""}
                onChange={e => handleInputChange(cls.id, "num", e.target.value)}
                maxLength={3}
                inputMode="numeric"
              />
              <input
                type="text"
                placeholder="이름"
                style={{ ...styles.input, width: 90 }}
                value={addInputs[cls.id]?.name || ""}
                onChange={e => handleInputChange(cls.id, "name", e.target.value)}
                maxLength={8}
                inputMode="text"
              />
              <button
                style={styles.button}
                onClick={() => addStudent(cls.id)}
              >학생 추가</button>
            </div>
            <ul style={{ margin: 0, paddingLeft: "2vw" }}>
              {(cls.students || []).map(stu => (
                <li key={stu.id}
                  style={{
                    marginBottom:4,
                    fontSize:"1.05em",
                    display:"flex", alignItems:"center", minHeight:36
                  }}>
                  {stu.num && <span style={{fontWeight:600, color:"#2944bd"}}>[{stu.num}]</span>} <span style={{marginLeft:6}}>{stu.name}</span>
                  <button style={styles.removeBtn}
                    onClick={() => removeStudent(cls.id, stu.id)}
                  >삭제</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}