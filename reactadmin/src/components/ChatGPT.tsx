import React, { useEffect, useState } from "react";

type Message = {
    role: string;
    content: string;
};

const ChatGPT = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // 🔥 Thay API KEY tại đây
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    ...messages,
                    userMsg,
                ],
                max_tokens: 500,
            }),
        });

        useEffect(() => {
            console.log(messages);
        }, [messages]);

        const data = await res.json();
        const botReply = data.choices[0].message;
        setMessages((prev) => [...prev, botReply]);
        setInput("");
    };

    return (
        <div>
            <h2>Chat GPT</h2>
            <div
                style={{
                    border: "1px solid #ccc",
                    padding: 10,
                    height: 300,
                    overflowY: "auto",
                }}
            >
                {messages.map((msg, idx) => (
                    <p key={idx}>
                        <b>{msg.role}:</b> {msg.content}
                    </p>
                ))}
            </div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Nhập câu hỏi..."
            />
            <button onClick={handleSend}>
                Gửi {import.meta.env.REACT_APP_OPENAI_API_KEY}
            </button>
        </div>
    );
};

export default ChatGPT;
