import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImageUpload } from './Album';
import { Progress } from "@/components/ui/progress"
import { MdOutlineDeleteForever } from "react-icons/md";

interface ISortableItemProps {
    id: string,
    index: number,
    image: ImageUpload,
    removeImage: (id: string) => void
}
const SortableItem = ({
    id,
    index,
    image,
    removeImage
}: ISortableItemProps) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="cursor-pointer group relative"
        >
            <div className="h-[135px]">
                <img src={image.preview} alt="" className={`${!image.uploaded ? 'blur-sm' : ''} w-full h-full object-cover`} />
            </div>
            {!image.uploaded && (
                <Progress className="absolute left-[50%] top-[50%] w-[60%] translate-x-[-50%] translate-y-[-50%]" value={image.progress} />
            )}
            {image.uploaded && (
                <div
                    className="absolute bottom-0 left-0 w-full p-[2px] bg-black bg-opacity-50 opacity-0 group-hover:opacity-100
                                    transition-opacity duration-300 text-white text-center items-center"
                    onMouseDown={() => removeImage(id)}
                >
                    <MdOutlineDeleteForever className="inline-block text-[20px]" />
                </div>
            )}

        </div>
    )
}
export default SortableItem