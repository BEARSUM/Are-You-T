import tw, { styled } from "twin.macro";

export const Container = tw.main`
h-full
text-white
`;

export const PostWrap = tw.div`
bg-[#000000]
w-[390px]
h-full
m-auto
p-8
flex
flex-col
justify-between
gap-8
`;

export const PostTitle = tw.div`
flex
justify-between
text-lg
`;

export const MbtiType = tw.h3`
text-5xl font-black
`;

export const ButtonColor = styled.button<{ bg: string }>`
    background-color: ${({ bg }) => bg};
`;
export const SpanColor = styled.span<{ bg: string }>`
    background-color: ${({ bg }) => bg};
`;

export const CircleButton = tw(ButtonColor)`
w-14 h-14 rounded-full
text-black
`;

export const ModalWrap = tw.div`
bg-white rounded-t-3xl p-8 text-black fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] m-auto
`;

export const ModalWrapCenter = tw.div`
bg-white rounded-3xl p-8 text-black fixed left-1/2 top-1/2 -translate-x-1/2 w-[370px] m-auto
`;

export const SelectColors = tw(SpanColor)`
w-12 h-12 rounded-full border-black border-4 inline-block
`;
