import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { LoadingSpinner } from '../ui/loading';
import { useQuery } from 'react-query';
import { chart } from '@/service/DashboardService';



interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

interface IChartOneProps {
}

const ChartOne: React.FC<IChartOneProps> = ({
}) => {
  const [selectedButton, setSelectedButton] = useState("1");
  const { data: dataChart, isLoading: isChartLoading, isError: isChartError } = useQuery(
    ['chart', selectedButton], // Thêm selectedButton vào dependency
    () => chart(selectedButton),
    {
      enabled: !!selectedButton, // Chỉ chạy khi selectedButton có giá trị
    }
  );
  // if (!dataChart)
  //   return (
  //     <>
  //       <div className="flex items-center justify-center w-full">
  //         <LoadingSpinner className="mr-[5px]" />
  //         Loading...
  //       </div>;
  //     </>
  //   )

  const optionSelectButton = [
    { value: '1', label: 'Cả năm' },
    { value: '30', label: 'Tháng hiện tại' },
    { value: '7', label: '7 ngày gần nhất' },
  ]

  const maxValue = Math.max(...(dataChart?.chart?.data.map((value: string) => parseInt(value, 10)) ?? [0]));

  const handleSelectButton = (value: string) => {
    setSelectedButton(value)
  }

  const options: ApexOptions = {
    legend: {
      show: false,
      position: 'top',
      horizontalAlign: 'left',
    },
    colors: ['#3C50E0', '#80CAEE'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 335,
      type: 'area',
      dropShadow: {
        enabled: true,
        color: '#623CEA14',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },

      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: 'straight',
    },
    // labels: {
    //   show: false,
    //   position: "top",
    // },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: '#fff',
      strokeColors: ['#3056D3', '#80CAEE'],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: 'category',
      categories: dataChart?.chart?.label ?? [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
      max: maxValue,
    },
  };

  const series = [
    {
      name: 'Doanh thu',
      data: dataChart?.chart?.data.map((value: string) => parseInt(value, 10)) ?? [],
    },
  ];

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      {
        !dataChart ? (
          <>
            <div className="flex items-center justify-center w-full">
              <LoadingSpinner className="mr-[5px]" />
              Loading...
            </div>;
          </>
        ) :
          (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
                <div className="flex w-full flex-wrap gap-3 sm:gap-5">
                  <div className="flex min-w-47.5">
                    <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
                      <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-[#3C50E0]"></span>
                    </span>
                    <div className="w-full">
                      <p className="font-semibold text-[#3C50E0]">Tổng doanh thu</p>
                      <p className="text-sm font-medium">Đơn vị là VNĐ</p>
                    </div>
                  </div>
                  {/* <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-sky-300">Total Sales</p>
              <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p>
            </div>
          </div> */}
                </div>
                <div className="flex w-full max-w-80 justify-end">
                  <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
                    {optionSelectButton.map((item, index) => (
                      <button
                        key={index}
                        className={`rounded py-1 px-3 text-xs font-medium shadow-card 
            ${selectedButton === item.value
                            ? "bg-sky-200 text-black" // Màu khi được chọn
                            : "hover:bg-sky-200 dark:hover:bg-boxdark" // Màu khi hover
                          }`}
                        onClick={() => handleSelectButton(item.value)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div id="chartOne" className="-ml-5">
                  <ReactApexChart
                    options={options}
                    series={series}
                    type="area"
                    height={350}
                  />
                </div>
              </div>
            </>
          )
      }
    </div>
  );
};

export default ChartOne;
