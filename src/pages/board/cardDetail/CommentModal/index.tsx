import { CommentContent } from "@/pages/board/cardDetail/CommentModal/CommentContent";
import { CommentPostContent } from "./CommentPost";

import * as S from "@/pages/board/cardDetail/CommentModal/index.styles";

function CommentModal({
  onClose,
  selectedId
}: {
  onClose: () => void;
  selectedId: string;
}) {
  const handleModalBgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  return (
    <S.ModalBg onClick={handleModalBgClick}>
      <S.Container>
        <S.CommentContentWrap>
          <CommentContent boardId={selectedId} />
        </S.CommentContentWrap>
        <CommentPostContent boardId={selectedId} />
      </S.Container>
    </S.ModalBg>
  );
}

export default CommentModal;
