import React, { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import matter from 'gray-matter';
import { Buffer } from 'buffer';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BarLoader } from "react-spinners";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import blogs from "../blogsInfo";
import styles from "../styles/blog.module.css";

window.Buffer = Buffer;
const BlogPost = () => {
    const { slug } = useParams();
    const [content, setContent] = useState("");
    const [url, setUrl] = useState("");
    const [tags, setTags] = useState([]);

    // Set the URL to the current page's URL
    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    const copyToClipboardHandler = () => {
        navigator.clipboard.writeText(url)
            .then(() => {
                alert("URL copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy URL: ", err);
                alert("Failed to copy URL.");
            });
    };

    useEffect(() => {
        const post = blogs.find((p) => p.slug === slug);
        if (!post) return;

        setTags(post.domains);

        fetch(`/posts/${post.filename}`)
        .then((res) => res.text())
        .then((text) => {
            const { content: parsedContent, data: meta } = matter(text);
            setContent(parsedContent);

            // Optional: update metadata dynamically (e.g., document.title, meta tags)
            document.title = meta.title || "Blog Post";
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc && meta.description) {
                metaDesc.setAttribute("content", meta.description);
            }

            // Set tags from metadata if not using `blogsInfo`
            if (meta.tags) {
                setTags(meta.tags);
            }
        });
    }, [slug]);

    if (!content) {
        return <div className={styles["blog-loading"]}>
            <BarLoader/>
        </div>;
    }
    
    return (
        <div className={styles["blog-post-wrapper"]}>
            <Link to={'/'}>
                <ArrowBackIcon/>
            </Link>
            <div className={styles["blog-post-header"]}>
                <p>Share on:</p>
                <div className={styles["blog-post-share"]}>
                    <button onClick={copyToClipboardHandler} className={styles["copy-url-button"]}>
                        <ContentCopyIcon/>
                    </button>
                    <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
                        <WhatsAppIcon/>
                    </a>
                </div>
            </div>
            <div className={styles["blog-post-tags"]}>
                {tags.map((tag, index) => (
                    <span key={index} className={styles["blog-post-tag"]}>
                        {tag}
                    </span>
                ))} 
            </div>
            {/* <ReactMarkdown>
                {content}
            </ReactMarkdown> */}
            <ReactMarkdown
                children={content}
                rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                        <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                        >
                        {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    ) : (
                        <code className={className} {...props}>
                        {children}
                        </code>
                    );
                    },
                }}
            />
        </div>
    );
}   

export default BlogPost;