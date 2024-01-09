import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import axiosRequest from "@/api/index";
import { ResData, Board, BoardPassword } from "@/@types/index";

import HeartBtn from "../HeartBtn";
import { ReactComponent as BackIcon } from "@/assets/img/left_line.svg";
import OptionBtn from "../OptionBtn";
import PwCheckModal from "@/components/common/PwCheckModal/PwCheckModal";
import BoardPost from "../BoardPost";
import CommentModal from "@/pages/board/cardDetail/CommentModal";
import CommentBtn from "../CommentBtn";

import * as S from "./index.styles";

export default function CardDetail() {
  const { selectedId } = useParams() as { selectedId: string };

  const [posting, setPosting] = useState<Board>({} as Board);
  const [showModal, setShowModal] = useState<string>("");
  const [openBoardEdit, setOpenBoardEdit] = useState<boolean>(false);

  async function getSelectedPosting() {
    try {
      const response: ResData<Board> = await axiosRequest.requestAxios<
        ResData<Board>
      >("get", `/board/post/${selectedId}`);
      // console.log("게시글get", response.data);
      setPosting(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function deletePosting() {
    try {
      const response: ResData<BoardPassword> = await axiosRequest.requestAxios<
        ResData<BoardPassword>
      >("delete", `/board/${selectedId}`);
      // console.log("게시글삭제", response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const twoStringFormat = (date: number): string => {
    return date < 10 ? "0" + date.toString() : date.toString();
  };
  const changeDateFormat = (date: Date): string => {
    if (date) {
      const localDate = new Date(date);
      const year = localDate.getFullYear().toString();
      const month = twoStringFormat(localDate.getMonth() + 1);
      const day = twoStringFormat(localDate.getDate());

      return `${year}.${month}.${day}`;
    }
    return "";
  };

  const handleBackBtnClick = () => {
    window.history.back();
  };

  const selectModal = (modal: string) => {
    setShowModal(modal);
  };

  const openCommentModal = () => {
    setShowModal("CommentModal");
  };

  const handleClose = () => {
    setOpenBoardEdit(false); //게시글 수정 모달 닫기
    setShowModal(""); //비밀번호 확인모달 닫기
  };

  //수정 또는 삭제 모드 관리
  const [activeMode, setActiveMode] = useState(false); //비밀번호가 일치했을 때 true
  const [mode, setMode] = useState<string>(""); //수정 또는 삭제
  const selectMode = (mode: string) => {
    // console.log("mode", mode);
    setMode(mode);
  };
  //비밀번호 일치여부 확인 -> 수정 또는 삭제모드 활성화
  const checkCorrectPw = (active: boolean) => {
    // console.log("active", active);
    setActiveMode(active);
  };

  //게시글 수정 모달 닫히면 새로 불러오기
  useEffect(() => {
    getSelectedPosting();
  }, [openBoardEdit]);

  //수정 또는 삭제 기능
  useEffect(() => {
    if (activeMode && mode === "edit") setOpenBoardEdit(true);
    else if (activeMode && mode === "delete") {
      deletePosting();
      window.history.back();
    }
  }, [activeMode]);

  return (
    <>
      {openBoardEdit ? (
        <BoardPost
          onThisClose={handleClose}
          onThisComplete={handleClose}
          thisMbti={posting.category}
          existingPost={posting}
        />
      ) : (
        <S.Container bgColor={posting.color}>
          {showModal === "pwCheckModal" && (
            <PwCheckModal
              selectModal={selectModal}
              selectedId={selectedId}
              checkCorrectPw={checkCorrectPw}
            />
          )}
          {showModal === "CommentModal" && (
            <CommentModal
              onClose={() => setShowModal("")}
              selectedId={selectedId}
            />
          )}
          <S.Header>
            <S.BackBtn onClick={handleBackBtnClick}>
              <BackIcon />
            </S.BackBtn>
            <S.Category>{posting.category}</S.Category>
            <OptionBtn selectModal={selectModal} selectMode={selectMode} />
          </S.Header>
          <S.Main>
            <S.Title>{posting.title}</S.Title>
            <S.Content>{posting.content}</S.Content>
          </S.Main>
          <S.FooterWrap>
            <S.Divider />
            <S.Footer>
              <S.FooterCol>
                <HeartBtn id={selectedId} like={posting.like} />
                <CommentBtn onClick={openCommentModal} id={selectedId} />
              </S.FooterCol>
              <S.CreateDate>{changeDateFormat(posting.createdAt)}</S.CreateDate>
            </S.Footer>
          </S.FooterWrap>
        </S.Container>
      )}
    </>
  );
}
