import React, { useState, useEffect, useContext } from "react";

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import ClearIcon from '@mui/icons-material/Clear';
import BlogComponent from "../components/BlogComponent";
import styles from "../styles/blog.module.css";

import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

import TagsContext from "../store/tagsContext";

import blogs from "../blogsInfo";

const Blog = () => {
    const { selectedTags, matchAllTags, setSelectedTags, removeSelectedTag, toggleMatchAllTags } = useContext(TagsContext);

    const [blogTags, setBlogTags] = useState([]);
    const [dateHeatMap, setDateHeatMap] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentBlogs, setCurrentBlogs] = useState(blogs);
    const [showMoreStatus, setShowMoreStatus] = useState(false);
    const [blogWrapperClass, setBlogWrapperClass] = useState(styles['blog-tags']);

    useEffect(() => {
        if (!showMoreStatus) {
            setBlogWrapperClass(styles['blog-tags']);
        } else {
            setBlogWrapperClass(styles['blog-tags_more'])
        }
    }, [showMoreStatus]);

    useEffect(() => {
        const dateCounts = blogs.reduce((acc, blog) => {
            acc[blog.date] = (acc[blog.date] || 0) + 1;
            return acc;
        }, {});
    
        const result = Object.entries(dateCounts).map(([date, count]) => ({ date, count }));

        setDateHeatMap(result);
    }, []);

    useEffect(() => {
        if (selectedDate) {
            setCurrentBlogs(blogs.filter((blog) => blog.date === selectedDate));
        } else {
            setCurrentBlogs(blogs);
        }
    }, [selectedDate])


    useEffect(() => {
        // Initialize blogTags with all unique tags from blogs
        const initialTags = Array.from(new Set(currentBlogs.flatMap(blog => blog.domains)));
        setBlogTags(initialTags);
    }, [currentBlogs]);

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
                {/* <div className={styles['heatmap']}>
                    <CalendarHeatmap
                        startDate={new Date('2025-01-01')}
                        endDate={new Date('2025-12-31')}
                        values={dateHeatMap}
                        showMonthLabels={false}
                        gutterSize={2}
                        onClick={(value) => {
                            setSelectedDate(value['date'])
                        }}
                        classForValue={(value) => {
                            if (!value) {
                            return styles['color-empty'];
                            }
                            return styles[`color-scale-${value.count}`];
                        }}
                    />
                </div> */}
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
                                onClick={() => handleTagClick(tag)}
                                aria-label={`${tag} filter`}
                            >
                                {tag}
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
                <button
                    className={styles["show-more_tag_btn"]}
                    onClick={() => {
                        setShowMoreStatus(!showMoreStatus);
                    }}
                    aria-label={`show more tags`}
                >
                    {!showMoreStatus ? "More Tags" : "Less Tags"}
                </button>
                <div className={styles["blogs"]}>
                    {currentBlogs.map((blog) => {
                        let isTagActive = false;
                        if (!matchAllTags) {
                            if (selectedTags.length !== 0) {
                                isTagActive = selectedTags.some(tag => blog.domains.includes(tag));
                            } else {
                                isTagActive = blogTags.some(tag => blog.domains.includes(tag));
                            }
                        } else {
                            if (selectedTags.length !== 0) {
                                isTagActive = selectedTags.every(tag => blog.domains.includes(tag));
                            } else {
                                isTagActive = blogTags.some(tag => blog.domains.includes(tag));
                            }
                        }

                        return (
                            isTagActive && (
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
                    })}
                </div>
            </div>
        </div>
    );
};

export default Blog;
