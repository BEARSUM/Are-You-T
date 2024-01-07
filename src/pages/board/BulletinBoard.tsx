import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useInfiniteScroll from "@/hooks/useInfinitiScroll";

import axiosRequest from "@/api/index";
import { ResData, Board } from "@/@types/index";

import BulletinCard from "@/components/board/BulletinCard/BulletinCard";
import PostBtn from "@/components/board/Button/PostBtn/PostBtn";
import ChangeMbtiBtn from "@/components/board/Button/ChangeMbtiBtn/ChangeMbtiBtn";
import BoardPost from "@/components/board/BoardPost/BoardPost";
import MbtiTypesModal from "@/components/common/MbtiTypesModal/MbtiTypesModal";
import MbtiColorChip from "@/components/board/MbtiColorChip/MbtiColorChip";

import * as S from "./BulletinBoard.styles";

export default function BulletinBoard() {
  const [openModalType, setOpenModalType] = useState<"mbti" | "post" | "">("");

  const [postings, setPostings] = useState<Board[]>([]);

  const nav = useNavigate();

  const goDetailPage = (mbti: string): void => {
    nav(`/board/${mbti}`);
  };
  const goCardDetailPage = (selectedId: string): void => {
    nav(`/board/cardDetail/${selectedId}`);
  };

  //게시글 작성 날짜 양식-> *일 전으로 변경
  const calculateDaysDiff = (date: Date): number => {
    const pastDate: Date = new Date(date); //local(한국표준시)
    const currentDate: Date = new Date(); //local(한국표준시)
    const diffTime: number = currentDate.getTime() - pastDate.getTime();

    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // 무한스크롤 => count : 불러오는 데이터 갯수 , skipCount : 생략하는 데이터 갯수
  const count = useRef(10);
  const [skipCount, setSkipCount] = useState(0);

  // 무한스크롤 => 더 불러올 데이터가 없을 때 loadData를 막기 위한 state
  const [disableLoadData, setDisableLoadDate] = useState(false);

  async function getPostings() {
    try {
      const response = await axiosRequest.requestAxios<ResData<Board[]>>(
        "get",
        mbti
          ? `/board/${mbti}?count=${count.current}&skipCount=${skipCount}`
          : `/board/?count=${count.current}&skipCount=${skipCount}`
      );

      if (!response.data.length) {
        setDisableLoadDate(true);
        return;
      }

      if (!skipCount) setPostings(response.data);
      else setPostings((prev) => [...prev, ...response.data]);

      setSkipCount((prev) => prev + 10);
    } catch (error) {
      console.error(error);
    }
  }

  const closeMbtiModal = ({
    currentTarget,
    target
  }: React.MouseEvent<HTMLDivElement>) => {
    if (currentTarget === target) {
      setOpenModalType("");
    }
  };

  const selectMbti = (selectedMbti: string[]) => {
    setOpenModalType("");
    const mbti = selectedMbti.join("");
    goDetailPage(mbti);
  };

  const { mbti } = useParams() as { mbti: string };

  useEffect(() => {
    getPostings();
    // console.log("mbti", mbti);
  }, [mbti]);

  // 무한 스크롤 훅
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadData = () => {
    if (disableLoadData) return;
    getPostings();
    // console.log(skipCount, "skipCount");
  };

  const { setTargetRef } = useInfiniteScroll(loadData, [skipCount]);

  useEffect(() => {
    if (observerRef.current) {
      setTargetRef(observerRef);
    }
  }, [observerRef, setTargetRef]);

  //유형별 게시글
  const boardDetail = postings
    .filter((posting) => posting.category === mbti)
    .map((posting) => {
      return (
        <BulletinCard
          key={posting._id}
          id={posting._id}
          handleCardClick={goCardDetailPage}
          title={posting.title}
          content={posting.content}
          category={posting.category}
          color={posting.color}
          like={posting.like}
          createdAt={calculateDaysDiff(posting.createdAt)}
        />
      );
    });

  return (
    <>
      {openModalType !== "" ? (
        <S.ModalWrap>
          {openModalType === "mbti" && (
            <MbtiTypesModal
              isButton
              defaultMbti={["I", "N", "F", "P"]}
              onCloseModal={closeMbtiModal}
              onSelectMbti={selectMbti}
            />
          )}
          {openModalType === "post" && (
            <BoardPost
              onThisClose={() => setOpenModalType("")}
              onThisComplete={(mbti) => {
                getPostings();
                setOpenModalType("");
                setSkipCount(0); // skipCount를 0으로 초기화시킴으로써 새로 재조회
                goDetailPage(mbti);
              }}
              thisMbti={mbti ? mbti : "INFP"}
            />
          )}
        </S.ModalWrap>
      ) : (
        <S.Container>
          <S.Header>
            {mbti ? (
              <S.MbtiTitle>
                <S.Title>{mbti}</S.Title>
                <MbtiColorChip selectedMbti={mbti} />
              </S.MbtiTitle>
            ) : (
              <S.Title>MBTI 담벼락</S.Title>
            )}
            <S.HeaderBtns>
              <PostBtn openModal={setOpenModalType} />
              <ChangeMbtiBtn openModal={setOpenModalType} />
            </S.HeaderBtns>
          </S.Header>
          <S.Main>
            <S.CardsWrap>
              {mbti
                ? boardDetail
                : postings.map((posting, index) => (
                    <BulletinCard
                      key={posting._id + index}
                      id={posting._id}
                      handleCardClick={goCardDetailPage}
                      title={posting.title}
                      content={posting.content}
                      category={posting.category}
                      color={posting.color}
                      like={posting.like}
                      createdAt={calculateDaysDiff(posting.createdAt)}
                    />
                  ))}
              <div
                ref={observerRef}
                style={{
                  height: "5px",
                  width: "100%",
                  border: "none"
                }}
              />
            </S.CardsWrap>
          </S.Main>
        </S.Container>
      )}
    </>
  );
}
