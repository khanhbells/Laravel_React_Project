import { useLocation } from "react-router-dom";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../components/ui/accordion"
import { Link } from "react-router-dom";
import "../assets/scss/Accordion.scss"
import "../assets/scss/Aside.scss"
import { sidebarItem } from "../constant/sidebar";
import { Logo } from "./logo"
import { useEffect } from "react";

const Aside = () => {
    const location = useLocation()
    const segment = location.pathname.split('/')[1]
    const getOpenAccordionValue = () => {
        for (let groupIndex = 0; groupIndex < sidebarItem.length; groupIndex++) {
            const group = sidebarItem[groupIndex]
            for (let itemIndex = 0; itemIndex < group.items.length; itemIndex++) {
                const item = group.items[itemIndex]
                if (item.active.includes(segment)) {
                    return `item-${groupIndex}-${itemIndex}`
                }
            }
        }
    }
    const defaultValue = getOpenAccordionValue()
    return (
        <aside className="app-aside w-60 bg-[#111c43] h-full fixed top-0 z-20">
            <div className="main-sidebar-header w-60 p-3.5 fixed z-10 h-14 text-center border-solid border-b border-menu-border">
                <a href="" className="inline-block">
                    <Logo />
                </a>
            </div>
            <div className="main-sidebar mt-14">
                {
                    sidebarItem.map((group, index) => (
                        <div key={index}>
                            <div className="menu-category px-6 py-3 text-[#a3aed1] text-10px tracking-wider opacity-50">{group.label}</div>
                            <Accordion type="single" collapsible className="px-3 sidebar-accordion" defaultValue={defaultValue ?? ''}>
                                {group.items.map((item, itemIndex) => (
                                    <AccordionItem key={itemIndex} value={`item-${index}-${itemIndex}`}>
                                        <AccordionTrigger
                                            className={`rounded-lg ${item.active.includes(segment) ? 'text-[#a3aed1] bg-[rgba(255,255,255,.05)]' : ''}`}
                                        >
                                            <div className={`menu-label flex flex-1 items-center text-[#a3aed1] ${item.active.includes(segment) ? 'text-white' : ''}`}>
                                                {item.icon}
                                                {item.links ? <span>{item.label}</span> : <Link to={item.path}>{item.label}</Link>}

                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="border-0 mt-2">
                                            <ul>
                                                {item.links && item.links.map((link, linkIndex) => (
                                                    <li className="pl-6" key={linkIndex}>
                                                        <Link
                                                            className="
                                                            side-menu__item
                                                            block 
                                                            text-[#a3aed1] 
                                                            text-13px 
                                                            relative 
                                                            hover:bg-[rgba(255,255,255,.05)] 
                                                            rounded-lg
                                                            "
                                                            to={link.to}
                                                        >
                                                            {link.title}
                                                            <span
                                                                className="absolute
                                                                left-2 
                                                                top-1/2 
                                                                transform 
                                                                -translate-y-1/2 
                                                                w-1 
                                                                h-1 
                                                                border 
                                                                border-solid 
                                                                border-primary 
                                                                rounded-full 
                                                                border-white"
                                                            >
                                                            </span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}

                            </Accordion>
                        </div>
                    ))
                }

            </div>
        </aside >
    )
}
export default Aside