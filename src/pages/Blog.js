import React, { useState, useEffect } from "react";

// import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import ClearIcon from '@mui/icons-material/Clear';
import BlogComponent from "../components/BlogComponent";
import styles from "../styles/blog.module.css";

// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import logo from '../assests/my-logo.png';

import blogs from "../blogsInfo";

const Blog = () => {
    const [blogTags, setBlogTags] = useState([]);
    const [activeTags, setActiveTags] = useState([]);
    const [absoluteFilterOn, setAbsoluteFilterOn] = useState(false);
    // const [dateHeatMap, setDateHeatMap] = useState([]);
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

    // useEffect(() => {
    //     const dateCounts = blogs.reduce((acc, blog) => {
    //         acc[blog.date] = (acc[blog.date] || 0) + 1;
    //         return acc;
    //     }, {});
    
    //     const result = Object.entries(dateCounts).map(([date, count]) => ({ date, count }));

    //     setDateHeatMap(result);
    // }, []);

    useEffect(() => {
        if (selectedDate) {
            setCurrentBlogs(blogs.filter((blog) => blog.date === selectedDate));
        } else {
            setCurrentBlogs(blogs);
        }
    }, [selectedDate])


    useEffect(() => {
        // Initialize blogTags with all unique tags from blogs
        // const initialTags = Array.from(new Set(currentBlogs.flatMap(blog => blog.domains)));
        const initialTags = Array.from(new Set(currentBlogs.flatMap(blog => blog.domains)));
        setBlogTags(initialTags);
    }, [currentBlogs]);

    const handleTagClick = (tag) => {
        if (activeTags.includes(tag)) {
            setActiveTags(activeTags.filter((t) => t !== tag))
        } else {
            setActiveTags([tag, ...activeTags])
        }
    }

    return (
        <div className={styles["blog-wrapper"]}>
            <div className={styles["blog-main"]}>
                <button className={styles["home-btn"]} aria-label="navigate to home">
                    <img src={logo} alt="author"/>
                    <a href="https://sambasiva.vercel.app" target="_blank" rel="noreferrer" className={styles['portfolio-link']}>
                        Visit My Profile
                    </a>
                </button>
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
                    <input type="checkbox" aria-label="strict filter" onChange={() => {
                        setAbsoluteFilterOn(!absoluteFilterOn)
                    }}/>
                    Match All Tags
                </label>
                <div className={styles['blog-header']}>
                    <div className={blogWrapperClass}>
                        {blogTags.map((tag) => (
                            <button
                                key={tag}
                                className={`${styles["blog-tag"]} ${activeTags.includes(tag) ? styles["active"] : ""}`}
                                onClick={() => handleTagClick(tag)}
                                aria-label={`${tag} filter`}
                            >
                                {tag}
                            </button>
                        ))}
                        {(activeTags.length !== 0) && (
                            <button
                                className={styles["blog-tag_reset"]}
                                onClick={() => {
                                    setActiveTags([])
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
                        if (!absoluteFilterOn) {
                            if (activeTags.length !== 0) {
                                isTagActive = activeTags.some(tag => blog.domains.includes(tag));
                            } else {
                                isTagActive = blogTags.some(tag => blog.domains.includes(tag));
                            }
                        } else {
                            if (activeTags.length !== 0) {
                                isTagActive = activeTags.every(tag => blog.domains.includes(tag));
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
