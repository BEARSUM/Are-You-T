import tw from "twin.macro";

export const Container = tw.div`
  bg-black
  rounded-t-3xl 
  p-[20px] 
  text-white 
  fixed 
  bottom-0 
  left-1/2 -translate-x-1/2 
  w-[390px]
  h-[640px] 
  flex
  flex-col
  justify-between
`;

export const CommentContentWrap = tw.div`
overflow-scroll
h-[520px]
`;

export const ModalBg = tw.div`
  fixed
  flex
  items-center
  justify-center
  top-0
  left-0
  w-full
  h-full
  bg-black
  bg-black/[.3]
  backdrop-blur-sm
  z-[70]
`;
