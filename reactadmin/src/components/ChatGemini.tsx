import { useEffect, useState } from "react";
import { callGeminiAPI } from "@/service/GemeniService";
import { useQuery } from "react-query";
import { queryKey } from "@/constant/query";
import { pagination } from "@/service/BookingService";
import { callGeminiWithRanking } from "@/TrainDataAi/CallGeminiWithRankingData";

const ChatGemini = () => {
    const { data, isLoading, isError } = useQuery([queryKey.bookings], () =>
        pagination("")
    );

    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");

    const handleSend = async () => {
        const reply = await callGeminiWithRanking(message, data.bookings);
        console.log("Dữ liệu từ API:", reply);
        setResponse(reply);
    };

    return (
        <div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập câu hỏi..."
            />
            <button onClick={handleSend}>Gửi</button>
            <p>Phản hồi: {response}</p>
        </div>
    );
};

export default ChatGemini;
