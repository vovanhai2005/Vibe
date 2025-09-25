import React, { useState, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { Mic, Image, Smile, Send, X, Gift, Loader } from 'lucide-react';

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage, isSendingMessage } = useChatStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if ((!text.trim() && !imagePreview) || !sendMessage) return;
        
        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview
            });
            
            setText('');
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <div className="border-t border-gray-800 bg-gray-900 p-2 sticky bottom-0 w-full">
            {/* Image Preview */}
            {imagePreview && (
                <div className="relative inline-block mx-2 mb-2">
                    <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-20 w-20 object-cover rounded-lg border border-gray-700" 
                    />
                    <button 
                        onClick={removeImage} 
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}
            
            <div className="flex items-center space-x-2 px-1">                
                {/* Input field */}
                <form onSubmit={handleSendMessage} className="flex-grow flex items-center gap-2">
                    <div className="flex-1">
                        <input 
                            type="text" 
                            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                            placeholder="Type a message..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        />
                    </div>
                </form>

                {/* Photo button */}
                <label className="text-pink-500 p-2 rounded-full hover:bg-gray-800 cursor-pointer">
                    <Image size={20} />
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleImageChange} 
                        accept="image/*" 
                        className="hidden" 
                    />
                </label>

                {/* Send button */}
                <button 
                    disabled={isSendingMessage} 
                    onClick={handleSendMessage} 
                    className={`text-pink-500 p-2 rounded-full hover:bg-gray-800 ${isSendingMessage ? "cursor-not-allowed" : ""}`}
                >
                    {isSendingMessage ? (
                        <Loader className="animate-spin" size={20} />
                    ) : (
                        <Send size={20} />
                    )}
                </button>
            </div>
        </div>
    );
};

export default MessageInput;