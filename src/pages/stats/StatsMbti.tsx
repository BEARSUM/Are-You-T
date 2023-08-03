import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import tw from 'tailwind-styled-components';
import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import { styled } from 'styled-components';
import axiosReq from '@/api';

/* Chart Options */
const chartOptions: ApexOptions = {
    chart: {
        type: 'bar',
        height: "100px",
        stacked: true,
        stackType: '100%',
        toolbar: { show: false }
    },
    plotOptions: {
        bar: { horizontal: true },
    },
    stroke: {
        width: 1,
        colors: ['#fff']
    },
    tooltip: {
        x: {
            show: false
        },
        // @ts-ignore
        y: {
            formatter: (_, { seriesIndex, w }) => {
                const percentage = Math.round(w.globals.seriesPercent[seriesIndex]);
                return `${percentage}%`;
            },
            title: {
                // @ts-ignore
                formatter: (val) => `${val} : `,
            }
        }
    },
    xaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false }
    },
    yaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false }
    },
    fill: { opacity: 1 },
    grid: { show: false },
    legend: { show: false }
};

// error: string | null,
interface QuestionItem {
    idx: number;
    subject: string;
    answer: {
        [key: string]: string;
    };
    selection: {
        [key: string]: number;
    }
}

interface MbtiStatsByType {
    mbtiType: string;
    parent: string;
    totalResponse: number;
    mbtiData: QuestionItem[];
}

interface ResponseMbtiStats {
    error: string | null;
    data: MbtiStatsByType | null;
}

interface IProps {
    data: QuestionItem;
}

const Container = tw.main`
    container
    bg-black
    text-white
    p-[20px]
    min-h-[calc(100vh_-_170px)]
`;

const FooterBtn = tw(Link)`
    bg-[#FFDF3F]
    border-solid
    border-1
    mt-[20px]
    px-[20px]
    py-[20px]
    rounded-[100px]
    text-center
`;

const ChartList = styled.ol`
    & div[type="bar"] {
        color: black;
    }
`;

function ChartItem({ data }: IProps) {
    const { idx, subject, selection } = data;

    const [leftType, rightType] = Object.keys(selection);
    const [leftValue, rightValue] = Object.values(selection);

    const displaySeries: ApexAxisChartSeries = [
        {
            name: leftType,
            data: [leftValue]
        },
        {
            name: rightType,
            data: [rightValue]
        }
    ];

    return (
        <li>
            <p>{idx}. {subject}</p>
            <Chart type='bar' options={chartOptions} series={displaySeries} height={100} />
        </li>
    );
}

function StatsMbti() {
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState<MbtiStatsByType | null>(null);

    const fetchStats = async () => {
        setIsLoading(true);

        try {
            const { data } = await axiosReq.requestAxios<ResponseMbtiStats>(
                'get', 
                `/stats/basic/ISFJ`
            );

            setStats(data);
        } catch (error) {
            alert("데이터를 받아오던 중 에러가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <Container className="flex justify-center items-center">
                <span className='text-2xl'>정보를 불러오고 있습니다.</span>
            </Container>
        );
    }

    return (
        <Container>
            {stats && 
                <>
                    <div className="flex place-content-between items-center">
                        <h3 className="text-5xl font-bold">{stats.mbtiType}</h3>
                        {/* MBTI 변경 버튼 */}
                        <button>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="48"
                                height="47"
                                fill="none"
                            >
                                <ellipse
                                    cx="23.536"
                                    cy="23.204"
                                    fill="#00B26E"
                                    rx="23.536"
                                    ry="23.204"
                                />
                                <path
                                    fill="#000"
                                    d="M19.024 18.303a6.762 6.762 0 0 1 9.523-.042l-1.741 1.737a1.016 1.016 0 0 0 .718 1.733H32.935c.562 0 1.014-.452 1.014-1.014v-5.41a1.016 1.016 0 0 0-1.733-.719l-1.758 1.758c-3.703-3.656-9.667-3.643-13.348.043a9.414 9.414 0 0 0-2.232 3.542 1.352 1.352 0 0 0 2.549.9 6.694 6.694 0 0 1 1.598-2.528Zm-5.363 7.148v5.41a1.016 1.016 0 0 0 1.733.718l1.758-1.758c3.703 3.656 9.667 3.644 13.348-.042a9.443 9.443 0 0 0 2.236-3.538 1.352 1.352 0 0 0-2.549-.9 6.693 6.693 0 0 1-1.597 2.527 6.762 6.762 0 0 1-9.523.043l1.737-1.742a1.016 1.016 0 0 0-.719-1.733h-5.41c-.562 0-1.014.453-1.014 1.015Z"
                                />
                            </svg>
                        </button>
                    </div>
                    <section>
                        <ChartList className='mt-[40px]'>
                            {stats.mbtiData.map((data) => 
                                <ChartItem key={data.idx} data={data} />
                            )}
                        </ChartList>
                    </section>
                    <div className="btns flex flex-col text-3xl text-black font-bold w-full m-auto">
                        <FooterBtn to="/stats">MBTI 통계</FooterBtn>
                        <FooterBtn to="/board">담벼락 바로가기</FooterBtn>
                    </div>
                </>
            }
        </Container>
    );
};

export default StatsMbti;