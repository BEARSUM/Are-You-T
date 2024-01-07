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
  const [count, setCount] = useState(10);
  const [skipCount, setSkipCount] = useState(0);

  // 무한스크롤 => 더 불러올 데이터가 없을 때 skipCount 상태의 증가를 막기 위한 state
  const [disableLoadData, setDisableLoadDate] = useState(false);
  // 임시 : isLoading 넣어서 true일때만 무한스크롤 호출
  const [isLoading, setIsLoading] = useState(false);

  async function getPostings() {
    if (isLoading) return;

    // console.log({ isLoading });
    try {
      setIsLoading(true);

      const response = await axiosRequest.requestAxios<ResData<Board[]>>(
        "get",
        mbti
          ? `/board/${mbti}?count=${count}&skipCount=${skipCount}`
          : `/board/?count=${count}&skipCount=${skipCount}`
      );

      // 더 불러올 데이터가 없어서 빈배열일 때
      if (!response.data.length) {
        setDisableLoadDate(true);
        return;
      }
      // 데이터 이전 값에 현재 값을 더함
      setPostings((prev) => [...prev, ...response.data]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  //mbti변경모달 관련
  const handleClickModal = useCallback(
    ({ currentTarget, target }: React.MouseEvent<HTMLDivElement>) => {
      if (currentTarget === target) {
        setOpenModalType("");
      }
    },
    [setOpenModalType]
  );
  const handleThisConfirm = (selectedMbti: string[]) => {
    setOpenModalType("");
    const mbti = selectedMbti.join("");
    goDetailPage(mbti);
  };

  const { mbti } = useParams() as { mbti: string };

  // 파라미터로 mbti가 전달되자마자 게시글 데이터 업데이트
  // skipCount 과 mbti 값이 변경될 때마다 데이터 호출
  useEffect(() => {
    getPostings();
    // console.log("임시");
  }, [mbti, skipCount]);

  // console.log(skipCount);

  // 무한 스크롤 훅
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadData = () => {
    if (disableLoadData || isLoading) return;
    setSkipCount((prev) => prev + 10);
    // console.log(skipCount, "skipCount");
  };

  const { setTargetRef } = useInfiniteScroll(loadData, [
    skipCount,
    mbti,
    isLoading
  ]);

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
              onCloseModal={handleClickModal}
              onSelectMbti={handleThisConfirm}
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
