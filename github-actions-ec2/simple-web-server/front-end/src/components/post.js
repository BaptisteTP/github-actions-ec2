'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useThemeLang } from '@/context/ThemeLangContext';

const Post = ({
                  _id: postId,
                  authorId,
                  username,
                  content,
                  image,
                  postImage,
    postVideo,
                  like,
                  comment,
                  liked = false,
                  onToggleLike,
              }) => {
    const { themeClasses } = useThemeLang();

    return (
        <div className={`max-w-md mx-auto p-4 mb-2 border-b ${themeClasses}`}>
            <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border">
                    <Link href={`/profile/${authorId}`} className="block w-10 h-10 rounded-full overflow-hidden border">
                        <Image
                            src={image || '/default-avatar.png'}
                            alt={`${username} profile`}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                        />
                    </Link>
                </div>
                <div>
                    <Link
                        href={`/profile/${authorId}`}
                        className="font-semibold hover:underline"
                    >
                        {username}
                    </Link>
                </div>
            </div>

            <p className="mb-3 ml-12 whitespace-pre-wrap">{content}</p>

            {/* Image du post si présente */}
            {postImage && (
                <div className="flex justify-center items-center mb-3">
                    <a href={postImage} target="_blank" rel="noopener noreferrer">
                        <img
                            src={postImage}
                            alt="Post"
                            className="w-[320px] h-[240px] object-contain rounded"
                        />
                    </a>
                </div>
            )}
            {postVideo && (
                <div className="flex justify-center items-center mb-3">
                    <video
                        src={postVideo}
                        className="w-[320px] h-[240px] object-contain rounded"
                        autoPlay
                        loop
                        muted
                        controls
                    />
                </div>
            )}


            <div className="ml-30 mr-30 flex justify-between text-sm">
                <button
                    onClick={onToggleLike}
                    style={liked ? { color: '#ec4899' } : undefined}
                    className="flex items-center gap-1 focus:outline-none"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        fill={liked ? 'currentColor' : 'none'}
                        strokeWidth="1.5"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5
               C14.377 3.75 12.715 4.876 12 6.483
               c-0.715-1.607-2.377-2.733-4.313-2.733
               C5.1 3.75 3 5.765 3 8.25
               c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                    </svg>
                    <span className="ml-1">{like}</span>
                </button>

                <Link
                    href={`/post/${postId}`}
                    className="flex items-center gap-1 hover:text-blue-600"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12
                 c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785
                 A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                        />
                    </svg>
                    {comment}
                </Link>
            </div>
        </div>
    );
};

export default Post;
