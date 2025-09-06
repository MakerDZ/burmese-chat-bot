'use client';

import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import { Image as ImageIcon, Plus, Send, X } from 'lucide-react';
import { useState, useRef } from 'react';
import Image from 'next/image';

interface ChatInputProps {
    onSendMessage?: (message: string, files?: File[]) => void;
    replyTo?: {
        id: string;
        text: string;
        type: 'text' | 'image';
    };
    onCancelReply?: () => void;
}

export function ChatInput({
    onSendMessage,
    replyTo,
    onCancelReply,
}: ChatInputProps) {
    const { isDark, textColor } = useTelegramTheme();
    const [message, setMessage] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setSelectedFiles((prev) => [...prev, ...files]);

            // Create previews for images
            files.forEach((file) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setPreviews((prev) => [
                            ...prev,
                            reader.result as string,
                        ]);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSend = () => {
        if (message.trim() || selectedFiles.length > 0) {
            onSendMessage?.(message, selectedFiles);
            setMessage('');
            setSelectedFiles([]);
            setPreviews([]);
        }
    };

    return (
        <div
            className="sticky bottom-0 border-t backdrop-blur-md"
            style={{
                backgroundColor: isDark
                    ? 'rgba(0,0,0,0.75)'
                    : 'rgba(255,255,255,0.75)',
                borderColor: isDark
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.1)',
            }}
        >
            {/* Reply Preview */}
            {replyTo && (
                <div
                    className="px-3 py-2 flex items-center gap-2 border-b"
                    style={{
                        borderColor: isDark
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(0,0,0,0.1)',
                    }}
                >
                    <div
                        className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded text-sm"
                        style={{
                            backgroundColor: isDark
                                ? 'rgba(255,255,255,0.1)'
                                : 'rgba(0,0,0,0.05)',
                        }}
                    >
                        {replyTo.type === 'image' && <ImageIcon size={16} />}
                        <span
                            className="line-clamp-1"
                            style={{ color: textColor }}
                        >
                            {replyTo.text}
                        </span>
                    </div>
                    <button
                        onClick={onCancelReply}
                        className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                    >
                        <X size={16} style={{ color: textColor }} />
                    </button>
                </div>
            )}

            {/* File Previews */}
            {previews.length > 0 && (
                <div
                    className="px-3 py-2 flex gap-2 overflow-x-auto border-b"
                    style={{
                        borderColor: isDark
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(0,0,0,0.1)',
                    }}
                >
                    {previews.map((preview, index) => (
                        <div key={index} className="relative">
                            <Image
                                src={preview}
                                alt="Preview"
                                width={60}
                                height={60}
                                className="rounded-lg object-cover"
                            />
                            <button
                                onClick={() => removeFile(index)}
                                className="absolute -top-1 -right-1 p-0.5 rounded-full bg-black/50"
                            >
                                <X size={12} className="text-white" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <div className="flex items-center gap-2 px-3 py-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*"
                    multiple
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ color: textColor }}
                >
                    <Plus size={24} />
                </button>
                <div className="flex-1">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (
                                    message.trim() ||
                                    selectedFiles.length > 0
                                ) {
                                    handleSend();
                                }
                            }
                        }}
                        placeholder="Message..."
                        className="w-full rounded-full px-4 py-2.5 outline-none"
                        style={{
                            backgroundColor: isDark
                                ? 'rgba(255,255,255,0.1)'
                                : 'rgba(0,0,0,0.05)',
                            color: textColor,
                        }}
                    />
                </div>
                <button
                    onClick={handleSend}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-500 text-white disabled:opacity-50"
                    disabled={!message.trim() && selectedFiles.length === 0}
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
