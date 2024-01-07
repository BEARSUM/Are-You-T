import HeartBtn from "@/components/board/Button/HeartBtn/HeartBtn";
import CommentBtn from "../Button/CommentBtn/CommentBtn";

import * as S from "./BulletinCard.styles";

interface BulletinCardProps {
  id: string;
  handleCardClick: (id: string) => void;
  title: string;
  content: string;
  category: string;
  color: string;
  like: number;
  createdAt: number;
}
export default function BulletinCard({
  id,
  handleCardClick,
  title,
  content,
  category,
  color,
  like,
  createdAt
}: BulletinCardProps) {
  //내용 글자수 제한
  const toggleEllipsis = (str: string, limit: number) => {
    const strToArr = Array.from(str);
    if (strToArr.length > limit) {
      return strToArr.slice(0, limit).join("") + "...";
    } else {
      return str;
    }
  };

  //날짜 계산
  const calculateDate = (createdAt: number): string => {
    if (createdAt === 0) {
      return "오늘";
    } else {
      return `${createdAt}일 전`;
    }
  };

  return (
    <S.Card
      id={id}
      style={{ backgroundColor: color }}
      onClick={(e) => {
        if (e.currentTarget === e.target) handleCardClick(id); // 이벤트 버블링을 막음
      }}
    >
      <div>
        <S.Header>
          <S.Title>{toggleEllipsis(title, 7)}</S.Title>
        </S.Header>

        <S.Main>
          <S.Content>{toggleEllipsis(content, 26)}</S.Content>
        </S.Main>
      </div>

      <S.Footer>
        <div>
          <S.Date>{calculateDate(createdAt)}</S.Date>
          <S.Divider />
        </div>
        <S.FooterCol>
          <S.Category>{category}</S.Category>
          <S.Buttons>
            <HeartBtn id={id} like={like} />
            <CommentBtn
              onClick={() => {
                handleCardClick(id);
              }}
              id={id}
            />
          </S.Buttons>
        </S.FooterCol>
      </S.Footer>
    </S.Card>
  );
}
