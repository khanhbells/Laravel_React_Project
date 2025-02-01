import { BRAND } from '@/interfaces/types/BrandType';
import BrandOne from '../../images/brand/brand-01.svg';
import BrandTwo from '../../images/brand/brand-02.svg';
import BrandThree from '../../images/brand/brand-03.svg';
import BrandFour from '../../images/brand/brand-04.svg';
import BrandFive from '../../images/brand/brand-05.svg';
import { useQuery } from 'react-query';
import { topDoctors } from '@/service/DashboardService';
import { useEffect } from 'react';
import { LoadingSpinner } from '../ui/loading';



interface TableOneProps {
  tableColumn: Array<{ name: string; render: (item: any) => JSX.Element }>,
}

const TableOne = ({
  tableColumn
}: TableOneProps) => {
  const { data, isLoading, isError, refetch } = useQuery(['topDoctors'], () => topDoctors())

  useEffect(() => {
    console.log(data);

  }, [data])

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5 mb-[20px]">
      {
        !data ? (
          <>
            <div className="flex items-center justify-center w-full">
              <LoadingSpinner className="mr-[5px]" />
              Loading...
            </div>;
          </>
        ) :
          (
            <>
              <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                Top 5 bác sĩ nổi bật nhất
              </h4>

              <div className="flex flex-col">
                <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
                  <div className="p-2.5 text-center xl:p-5" >
                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                      TOP
                    </h5>
                  </div>
                  {
                    tableColumn && tableColumn.map((column, index) => (
                      <div className="p-2.5 text-center xl:p-5" key={index}>
                        <h5 className="text-sm font-medium uppercase xsm:text-base ">
                          {column.name}
                        </h5>
                      </div>
                    ))
                  }
                </div>

                {data && data.topDoctors?.length > 0 && data.topDoctors?.map((row: any, key: number) => (
                  <div
                    className={`grid grid-cols-3 sm:grid-cols-4 `}
                    key={key}
                  >
                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                      <p className="text-meta-8 font-semibold text-[25px]">{key + 1}</p>
                    </div>
                    {
                      tableColumn && tableColumn.map((column, index) => (
                        <div key={index}>
                          {column.render(row)}
                        </div>
                      ))
                    }
                  </div>
                ))}
              </div>
            </>
          )
      }
    </div>
  );
};

export default TableOne;
