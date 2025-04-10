import { useMenuContext } from "@/contexts/MenuContext";
import { writeUrl } from "@/helper/myHelper";
import useSearchState from "@/hook/useSearchState";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import Slider from "react-slick";

interface IBannerHeader {
    settings: any;
}

const BannerHeader = ({ settings }: IBannerHeader) => {
    const placeholderText = "Tìm chuyên khoa khám bệnh";

    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [index, setIndex] = useState(0);
    const [keyword, setKeyword] = useState<string>("");
    const { isDataSearch } = useSearchState({ keyword: keyword });
    const { isDataMenus } = useMenuContext();

    useEffect(() => {
        const typingSpeed = isDeleting ? 50 : 100; // Tốc độ gõ và xóa
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Gõ chữ
                if (index < placeholderText.length) {
                    setDisplayText((prev) => prev + placeholderText[index]);
                    setIndex(index + 1);
                } else {
                    setIsDeleting(true);
                }
            } else {
                // Xóa chữ
                if (index > 0) {
                    setDisplayText((prev) => prev.slice(0, -1));
                    setIndex(index - 1);
                } else {
                    setIsDeleting(false);
                }
            }
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [index, isDeleting]);

    return (
        <>
            <div className="home-header-banner">
                <div className="content-up">
                    <div className="text-shadow-sm font-montserrat  text-[40px] text-center font-semibold my-[10px]">
                        Nền tảng y tế
                    </div>
                    <div className="text-shadow-sm font-montserrat  text-[40px] text-center font-semibold my-[20px]">
                        Chăm sóc sức khỏe toàn diện
                    </div>
                    <div className="w-fit bg-white rounded-lg  items-center mx-auto p-[10px] relative">
                        <div className="flex">
                            <CiSearch className=" mr-[10px] text-[20px]" />
                            <input
                                type="text"
                                className="w-[360px] col-span-3 focus-visible:ring-0 focus:outline-none focus:border-sky-500 focus:ring-2"
                                placeholder={displayText}
                                onChange={(e) => setKeyword(e.target.value)}
                                value={keyword}
                            ></input>
                        </div>
                        <div className="absolute mt-[20px] w-full rounded-lg z-99">
                            <AnimatePresence>
                                {isDataSearch &&
                                    isDataSearch.length > 0 &&
                                    isDataSearch.map(
                                        (value: any, index: number) => {
                                            const isFirst = index === 0;
                                            const isLast =
                                                index ===
                                                isDataSearch.length - 1;
                                            const isOnly =
                                                isDataSearch.length === 1;
                                            return (
                                                <motion.div
                                                    className={`flex flex-col gap-4 bg-white ${
                                                        isOnly
                                                            ? "rounded-lg"
                                                            : isFirst
                                                            ? "rounded-t-lg"
                                                            : isLast
                                                            ? "rounded-b-lg"
                                                            : ""
                                                    }`}
                                                    initial={{
                                                        opacity: 0,
                                                        y: -10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}
                                                    key={value.id}
                                                >
                                                    <Link
                                                        to={
                                                            value.canonical_catalogue
                                                                ? writeUrl(
                                                                      value.canonical_catalogue,
                                                                      value.model,
                                                                      value[
                                                                          `${value.model}_catalogue_id`
                                                                      ],
                                                                      [
                                                                          value.canonical,
                                                                      ],
                                                                      [value.id]
                                                                  )
                                                                : value.doctors ? 
                                                                writeUrl(
                                                                    value.doctors[0].specialty_catalogues[0].specialty_catalogue_canonical,
                                                                    'specialty',
                                                                    value.doctors[0].specialty_catalogues[0].specialty_catalogue_id,
                                                                    [
                                                                        value.doctors[0].specialty_canonical,
                                                                        value.doctor_canonical
                                                                    ],
                                                                    [
                                                                        value.doctors[0].specialty_id,
                                                                        value.doctor_id
                                                                    ],

                                                                )
                                                                :
                                                                writeUrl(
                                                                    value.canonical,
                                                                    value.model,
                                                                    value.id
                                                                )
                                                        }
                                                        className="flex items-center hover:bg-sky-200 hover:rounded-lg p-[10px]"
                                                    >
                                                        <div className="block mr-[10px]">
                                                            <img
                                                                className=" object-cover h-[50px] w-[80px] rounded cursor-pointer"
                                                                src={
                                                                    value.image
                                                                }
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="name">
                                                                <span className="text-[#003553] font-roboto font-normal text-[17px]">
                                                                    {value.name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            );
                                        }
                                    )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
                <div className="content-down">
                    <div className="options pb-[5%]">
                        {isDataMenus &&
                            isDataMenus.specialty_catalogues.length > 0 &&
                            isDataMenus.specialty_catalogues.map(
                                (value: any, index: number) => (
                                    <Link
                                        to={writeUrl(
                                            value.canonical,
                                            "specialty",
                                            value.id
                                        )}
                                        key={value.id}
                                        className="drop-shadow-xl option-child bg-white border border-sky-200 hover:border-sky-400 w-[220px] max-h-[300px] rounded-lg p-[10px]"
                                    >
                                        <div className="icon-child items-center justify-center flex flex-col ">
                                            <span className="">
                                                <img
                                                    className=""
                                                    src={value.image}
                                                    alt=""
                                                />
                                            </span>
                                        </div>
                                        <div className="text-child text-[17px] text-[#003553] font-roboto font-normal">
                                            {value.name}
                                        </div>
                                    </Link>
                                )
                            )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default memo(BannerHeader);
