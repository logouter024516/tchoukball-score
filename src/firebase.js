import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // plz use .env to secure your personal data and block abusing
  // 선생님 이렇게 두시면 선생님 firebase로 아무나 데이터 올리고 주고받고할 수 있어서 나중에 필요할때 사용량 제한 걸릴 수도 있고 Blaze요금제 구독중이신경우 그 금액만큼 청구되실수 있어서 .env를 사용하시는것을 추천드리비다! :)
  // 그리고 지금 저희 동아리에서 멤버 전부 확정되어서 이제 개발 시작했습니다! 저희가 개발하고 있는 리포지토리는 https://github.com/backpropagation-jh/tchoukball_judger 입니다! 감사합니다 :)
  // 중흥중학교 2학년 2반 10번 올림
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
