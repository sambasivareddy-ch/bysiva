import React, { useState, useEffect, useContext } from "react";

// import CalendarHeatmap from 'react-calendar-heatmap';
// import 'react-calendar-heatmap/dist/styles.css';
import ClearIcon from '@mui/icons-material/Clear';
import BlogComponent from "../components/BlogComponent";
import styles from "../styles/blog.module.css";

import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import TagsContext from "../store/tagsContext";

import blogs from "../blogsInfo";

const Blog = () => {
    const { selectedTags, matchAllTags, setSelectedTags, removeSelectedTag, toggleMatchAllTags } = useContext(TagsContext);

    const [blogTags, setBlogTags] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentBlogs, setCurrentBlogs] = useState(blogs);
    const [showMoreStatus, setShowMoreStatus] = useState(false);
    const [blogWrapperClass, setBlogWrapperClass] = useState(styles['blog-tags']);
    const [tagsCount, setTagsCount] = useState({});
    const [presentPageIndex, setPresentPageIndex] = useState(0);

    useEffect(() => {
        if (selectedTags) {
            setCurrentBlogs(
                blogs
                .filter((blog) => {
                    if (!matchAllTags) {
                        if (selectedTags.length !== 0) {
                            return selectedTags.some(tag => blog.domains.includes(tag));
                        } else {
                            return blogTags.some(tag => blog.domains.includes(tag));
                        }
                    } else {
                        if (selectedTags.length !== 0) {
                            return selectedTags.every(tag => blog.domains.includes(tag));
                        } else {
                            return blogTags.some(tag => blog.domains.includes(tag));
                        }
                    }
                })
            )
        } else {
            setCurrentBlogs(blogs);
        }
    }, [selectedTags, matchAllTags, blogTags]);

    useEffect(() => {
        if (!showMoreStatus) {
            setBlogWrapperClass(styles['blog-tags']);
        } else {
            setBlogWrapperClass(styles['blog-tags_more'])
        }
    }, [showMoreStatus]);

    useEffect(() => {
        if (selectedDate) {
            setCurrentBlogs(blogs.filter((blog) => blog.date === selectedDate));
        } else {
            setCurrentBlogs(blogs);
        }
    }, [selectedDate])


    useEffect(() => {
        document.title = "Blogs";
        
        // Initialize blogTags with all unique tags from blogs
        const initialTags = Array.from(new Set(blogs.flatMap(blog => blog.domains)));
        initialTags.sort((a, b) => a.localeCompare(b)); // Sort tags alphabetically
        setBlogTags(initialTags);

        // Initialize tagsCount with the count of each tag
        const initialTagsCount = {};
        initialTags.forEach(tag => {
            initialTagsCount[tag] = currentBlogs.filter(blog => blog.domains.includes(tag)).length;
        });
        setTagsCount(initialTagsCount);
    }, []);

    const handleTagClick = (tag) => {
        if (selectedTags.includes(tag)) {
            removeSelectedTag(tag);
        } else {
            setSelectedTags((prevTags) => [...prevTags, tag]);
        }
    }

    return (
        <div className={styles["blog-wrapper"]}>
            <div className={styles["blog-main"]}>
                <div className={styles["blog-header"]}>
                    <div className={styles["social-links"]}>
                        <a href="https://sambasiva.vercel.app" target="_blank" rel="noreferrer" aria-label="Portfolio profile">
                            <PersonOutlineIcon fontSize="medium" />
                        </a>
                        <a href="https://www.instagram.com/samsr.ch/" target="_blank" rel="noreferrer" aria-label="Instagram profile">
                            <InstagramIcon fontSize="medium" />
                        </a>
                        <a href="https://www.linkedin.com/in/v-n-g-samba-siva-reddy-chinta-78a9651b2/" target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
                            <LinkedInIcon fontSize="medium" />
                        </a>
                        <a href="https://www.github.com/sambasivareddy-ch" target="_blank" rel="noreferrer" aria-label="GitHub profile">
                            <GitHubIcon fontSize="medium" />
                        </a>
                    </div>
                </div>
                <label className={styles['filtering-option']}>
                    <input type="checkbox" aria-label="strict filter" checked={matchAllTags} onChange={() => {
                        toggleMatchAllTags();
                    }}/>
                    Match All Tags
                </label>
                <div className={styles['blog-header']}>
                    <div className={blogWrapperClass}>
                        {blogTags.map((tag) => (
                            <button
                                key={tag}
                                className={`${styles["blog-tag"]} ${selectedTags.includes(tag) ? styles["active"] : ""}`}
                                onClick={() => {
                                    handleTagClick(tag);
                                    setPresentPageIndex(0);
                                }}
                                aria-label={`${tag} filter`}
                            >
                                <span>{tag}</span> 
                                <span className={styles["blog-tag_count"]}>{tagsCount[tag] || 0}</span>
                            </button>
                        ))}
                        {(selectedTags.length !== 0) && (
                            <button
                                className={styles["blog-tag_reset"]}
                                onClick={() => {
                                    setSelectedTags([])
                                }}
                                aria-label={`reset applied filter`}
                            >
                                reset <ClearIcon fontSize="small" />
                            </button>
                        )}
                        {(selectedDate) && (
                            <button
                                className={styles["blog-tag_reset"]}
                                onClick={() => {
                                    setSelectedDate(null)
                                }}
                                aria-label={`reset date applied filter`}
                            >
                                reset date <ClearIcon fontSize="small" />
                            </button>
                        )}
                    </div>
                </div>
                <div className={styles["blog-controls"]}>
                    <button
                        className={styles["show-more_tag_btn"]}
                        onClick={() => {
                            setShowMoreStatus(!showMoreStatus);
                        }}
                        aria-label={`show more tags`}
                    >
                        {!showMoreStatus ? "More Tags" : "Less Tags"}
                    </button>
                    <div className={styles["blog-pagination"]}>
                        <button
                            className={styles["blog-pagination-btn"]}
                            onClick={() => {
                                if (presentPageIndex > 0) {
                                    setPresentPageIndex(presentPageIndex - 1);
                                }
                            }}
                            disabled={presentPageIndex === 0}
                            aria-label={`previous page`}
                        >
                            <ArrowBackIosIcon fontSize="small" />
                        </button>
                        <span className={styles["blog-pagination-index"]}>
                            {presentPageIndex + 1} / {Math.floor(currentBlogs.length / 10) + (currentBlogs.length % 10 !== 0)}
                        </span>
                        <button
                            className={styles["blog-pagination-btn"]}
                            onClick={() => {
                                if (presentPageIndex < Math.ceil(currentBlogs.length / 10) - 1) {
                                    setPresentPageIndex(presentPageIndex + 1);
                                }
                            }}
                            disabled={presentPageIndex*10 + 10 >= currentBlogs.length}
                            aria-label={`next page`}
                        >
                            <ArrowForwardIosIcon fontSize="small" />
                        </button>
                    </div>
                </div>
                <div className={styles["blogs"]}>
                    {
                        currentBlogs
                        .slice(presentPageIndex*10, presentPageIndex*10 + 10)
                        .map((blog) => { 
                            return (
                                (
                                    <BlogComponent
                                        key={blog.id}
                                        title={blog.title}
                                        description={blog.description}
                                        domains={blog.domains}
                                        slug={blog.slug}
                                        date={blog.date}
                                    />
                                )
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default Blog;
