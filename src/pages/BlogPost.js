import React, { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BarLoader } from "react-spinners";

import blogs from "../blogsInfo";
import styles from "../styles/blog.module.css";

const BlogPost = () => {
    const { slug } = useParams();
    const [content, setContent] = useState("");

    useEffect(() => {
        const post = blogs.find((p) => p.slug === slug);
        if (!post) return;

        fetch(`/posts/${post.filename}`)
        .then((res) => res.text())
        .then((text) => {
            setContent(text);
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
            <ReactMarkdown>
                {content}
            </ReactMarkdown>
        </div>
    );
}   

export default BlogPost;