import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface CardDataStatsProps {
    title: string;
    total: string | ReactNode;
    rate?: string | ReactNode;
    levelUp?: boolean;
    levelDown?: boolean;
    children: ReactNode;
    previousMonth?: string;
    classColorName?: string;
    route?: string
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
    title,
    total,
    rate,
    levelUp,
    levelDown,
    children,
    previousMonth,
    classColorName,
    route
}) => {
    return (
        <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark font-satoshi h-[100%]'>
            <div className={`flex justify-between border-b-2 pb-[10px] ${classColorName ? `border-${classColorName}` : ''} mx-[10px] pt-[10px]`}>
                <div className='font-normal uppercase mb-[10px] m-[5px] text-[15px]'>{title}</div>
                <div className={`m-[5px] p-[5px] ${classColorName ? `bg-${classColorName}` : ''} text-white rounded-sm text-[10px]`}><span>{title}</span></div>
            </div>
            <div className="py-6 px-7.5" >

                <div className='flex items-center'>
                    <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                        {children}
                    </div>
                    {
                        route ? (
                            <Link to={route} className='ml-[15px] text-[25px] font-sans text-black dark:text-white cursor-pointer'>{total}</Link>
                        ) : (
                            <div className='ml-[15px] text-[25px] font-sans text-black dark:text-white'>{total}</div>
                        )
                    }
                </div>

                {
                    rate &&
                    <div className="mt-4 flex items-end justify-between">
                        <span
                            className={`flex items-center gap-1 text-sm font-medium ${levelUp && 'text-meta-3'
                                } ${levelDown && 'text-meta-5'} `}
                        >
                            {rate}
                            {levelUp && (
                                <>
                                    <svg
                                        className="fill-meta-3"
                                        width="10"
                                        height="11"
                                        viewBox="0 0 10 11"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                                            fill=""
                                        />
                                    </svg>
                                    {previousMonth && <div> {previousMonth}</div>}
                                </>
                            )}
                            {levelDown && (
                                <>
                                    <svg
                                        className="fill-meta-5"
                                        width="10"
                                        height="11"
                                        viewBox="0 0 10 11"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z"
                                            fill=""
                                        />
                                    </svg>
                                    {previousMonth && <div> {previousMonth}</div>}
                                </>
                            )}
                        </span>
                    </div>
                }
            </div>
        </div>
    );
};

export default CardDataStats;
