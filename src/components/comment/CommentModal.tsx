import { CommentContent } from "@/components/comment/CommentContent";
import { CommentPostContent } from "@/components/comment/CommentPost";

import * as S from "@/components/comment/CommentModal.styles";

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
