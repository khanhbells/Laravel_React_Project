import { useEffect, useState } from "react"


const useCheckBoxState = (data: any, model: string, isLoading: boolean) => {

    const [checkedState, setCheckedState] = useState<{ [key: number]: boolean }>({})
    const [checkedAllState, setCheckedAllState] = useState<boolean>(false)

    //Checkbox row
    const handleCheckedChange = (id: number) => {
        const updateCheckedState = { ...checkedState, [id]: !checkedState[id] }
        const allChecked = Object.values(updateCheckedState).every(value => value)

        setCheckedState(updateCheckedState)
        setCheckedAllState(allChecked)

    }

    //CheckedAll
    const handleCheckedAllChange = () => {
        const newCheckedAllState = !checkedAllState
        const updateCheckedState = Object.keys(checkedState).reduce((acc: any, key: string) => {
            acc[key] = newCheckedAllState
            return acc
        }, {})
        setCheckedState(updateCheckedState)
        setCheckedAllState(newCheckedAllState)
    }

    const isAnyChecked = () => Object.values(checkedState).some(value => value)

    useEffect(() => {
        if (!isLoading && data[model]) {
            const initialCheckBoxState = data[model].reduce((acc: any, item: any) => {
                acc[item.id] = false
                return acc
            }, {})
            setCheckedState(initialCheckBoxState)
            setCheckedAllState(false)
        }
    }, [data])

    useEffect(() => {
        // console.log(allChecked);
    }, [checkedState])

    return { checkedState, checkedAllState, handleCheckedChange, handleCheckedAllChange, isAnyChecked }

}

export default useCheckBoxState