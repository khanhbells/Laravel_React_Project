import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { callGeminiAPI } from "@/service/GemeniService";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface IChatUI {
    className?: string;
}

const ChatUI = ({ className }: IChatUI) => {
    const [messages, setMessages] = useState([
        {
            text: "**Xin chào!** Tôi là trợ lý ảo của *Booking Bells*. Tôi có thể giúp gì cho bạn?",
            type: "bot",
        },
    ]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, type: "user" };
        setInput(""); // Xóa input sau khi gửi
        setMessages((prev) => [...prev, userMessage]);

        // 🎬 Hiệu ứng "Đang nhập..."
        let dotsCount = 0;
        const typingMessage = { text: "Đang nhập.", type: "bot" };
        setMessages((prev) => [...prev, typingMessage]);

        const typingInterval = setInterval(() => {
            dotsCount = (dotsCount + 1) % 4;
            const dots = ".".repeat(dotsCount);
            setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                    text: `Đang nhập${dots}`,
                    type: "bot",
                };
                return newMessages;
            });
        }, 500);

        try {
            // 📡 Gửi API với CHỈ câu hỏi của user
            const response = await callGeminiAPI(input);
            console.log(response);
            

            clearInterval(typingInterval); // ⏹️ Dừng hiệu ứng typing

            // Kiểm tra nếu `response` là object -> lấy text từ `candidates`
            const reply =typeof response === "string" ? response: response?.bot_response || "Không có phản hồi";

            // 📌 Hiệu ứng gõ chữ từ từ
            let currentText = "";
            const botReply = { text: "", type: "bot" };

            setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = botReply; // Xóa "Đang nhập..."
                return newMessages;
            });

            reply.split("").forEach((char, index) => {
                setTimeout(() => {
                    currentText += char;
                    setMessages((prev) => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1] = {
                            ...botReply,
                            text: currentText,
                        };
                        return newMessages;
                    });
                }, index * 30);
            });
        } catch (error) {
            console.error("Lỗi gọi API:", error);
            clearInterval(typingInterval);

            setMessages((prev) => [
                ...prev,
                { text: "❌ Lỗi kết nối API. Vui lòng thử lại!", type: "bot" },
            ]);
        }
    };

    return (
        <Card
            className={`rounded-md shadow-lg py-2 mb-[20px] ${className ?? ""}`}
        >
            <CardHeader className="border-b border-gray-200 p-4 bg-sky-400 text-white">
                <CardTitle className="text-center text-xl">
                    Hỏi đáp với Bells AI
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-[900px]">
                <div className="flex flex-col h-full bg-gray-100 border border-teal-400 rounded-md">
                    {/* Hiển thị tin nhắn */}
                    <div className="flex-grow p-4 overflow-auto text-[18px]">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex  ${
                                    msg.type === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`p-3 my-1  rounded-lg ${
                                        msg.type === "user"
                                            ? "bg-gray-300 text-black"
                                            : "bg-blue-200 text-blue-900"
                                    }`}
                                >
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef}></div> {/* Dùng để cuộn xuống */}
                    </div>

                    {/* Ô nhập tin nhắn */}
                    <div className="p-4 bg-white flex items-center border-t">
                        <input
                            type="text"
                            className="flex-grow p-2 border rounded-lg outline-none"
                            placeholder="Nhập câu hỏi..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && sendMessage()
                            }
                        />
                        <button
                            onClick={sendMessage}
                            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ChatUI;
