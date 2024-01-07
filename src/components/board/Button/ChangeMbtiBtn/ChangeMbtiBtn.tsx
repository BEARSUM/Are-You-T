import { ChangeMbti } from "./ChangeMbtiBtn.styles";
import { ReactComponent as ChangeMbtiBtnSvg } from "@/assets/img/change_mbti_button.svg";

interface ChangeMbtiBtnProps {
  openModal: (value: "" | "mbti") => void;
}
export default function ChangeMbtiBtn({ openModal }: ChangeMbtiBtnProps) {
  return (
    <ChangeMbti
      onClick={() => {
        openModal("mbti");
      }}
    >
      <ChangeMbtiBtnSvg />
    </ChangeMbti>
  );
}
