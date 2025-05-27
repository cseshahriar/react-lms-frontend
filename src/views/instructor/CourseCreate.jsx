import { useState, useEffect } from "react";

import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import { Link, useNavigate } from "react-router-dom";

import useAxios from "../../utils/useAxios";
import Swal from "sweetalert2";

function CourseCreate() {
    const [courseData, setCourseData] = useState(
        {
            title: "",
            description: "",
            image: "",
            file: "",
            level: "",
            language: "",
            price: "",
            category: ""
        });
    const [imagePreview, setImagePreview] = useState("");
    const [category, setCategory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        useAxios.get(`course/category/`).then((res) => {
            setCategory(res.data);
        });
    }, []);

    // file upload in a store not model
    const handleImageUpload = async (event) => {
        setImagePreview(null);
        setLoading(true);
        const file = event.target.files[0];
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await useAxios.post("/file-upload/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response?.data?.url) {
                setImagePreview(response?.data?.url);
                console.log(response?.data?.url);
                setLoading(false);
                setCourseData({
                    ...courseData,
                    image: response?.data?.url,
                });
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            setLoading(false);
        }
    };

    const handleCourseInputChange = (event) => {
        setCourseData({
            ...courseData,
            [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('title', courseData.title);
        formData.append('description', courseData.description);
        formData.append('level', courseData.level);
        formData.append('language', courseData.language);
        formData.append('price', courseData.price);
        formData.append('category', courseData.category);
        formData.append('file', courseData.file);

        // Append image only if it's a file (not a URL or null)
        if (courseData.image && courseData.image instanceof File) {
            formData.append('image', courseData.image);
        }

        // Append file only if it's a file (not a URL or null)
        if (courseData.file && courseData.file instanceof File) {
            formData.append('file', courseData.file);
        }

        try {
            const response = await useAxios.post(
                `teacher/course-create/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            navigate(`/instructor/edit-course/${response?.data?.course_id}/`);
            Swal.fire({
                icon: "success",
                title: "Course Created Successfully",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: error.data.message
            });
        }
    };


    return (
        <>
            <BaseHeader />

            <section className="pt-5 pb-5">
                <div className="container">
                    <Header />
                    <div className="row mt-0 mt-md-4">
                        <Sidebar />
                        <form className="col-lg-9 col-md-8 col-12" onSubmit={handleSubmit}>
                            <>
                                <section className="py-4 py-lg-6 bg-primary rounded-3">
                                    <div className="container">
                                        <div className="row">
                                            <div className="offset-lg-1 col-lg-10 col-md-12 col-12">
                                                <div className="d-lg-flex align-items-center justify-content-between">
                                                    {/* Content */}
                                                    <div className="mb-4 mb-lg-0">
                                                        <h1 className="text-white mb-1">Add New Course</h1>
                                                        <p className="mb-0 text-white lead">Just fill the form and create your courses.</p>
                                                    </div>
                                                    <div>
                                                        <Link to="/instructor/courses/" className="btn" style={{ backgroundColor: "white" }}>
                                                            {" "}
                                                            <i className="fas fa-arrow-left"></i> Back to Course
                                                        </Link>
                                                        <a href="instructor-courses.html" className="btn btn-dark ms-2">
                                                            Save <i className="fas fa-check-circle"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <section className="pb-8 mt-5">
                                    <div className="card mb-3">
                                        {/* Basic Info Section */}
                                        <div className="card-header border-bottom px-4 py-3">
                                            <h4 className="mb-0">Basic Information</h4>
                                        </div>
                                        <div className="card-body">
                                            <label htmlFor="courseTHumbnail" className="form-label">
                                                Thumbnail Preview
                                            </label>
                                            <img
                                                style={{
                                                    width: "100%",
                                                    height: "330px",
                                                    objectFit: "cover",
                                                    borderRadius: "10px",
                                                }}
                                                className="mb-4"
                                                src={imagePreview || "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"}
                                                alt=""
                                            />
                                            <div className="mb-3">
                                                <label htmlFor="courseTHumbnail" className="form-label">
                                                    Course Thumbnail
                                                </label>
                                                  <input
                                                    className="form-control"
                                                    name="image"
                                                    type="file"
                                                    onChange={(e) => {
                                                        if (e.target.files.length > 0) {
                                                        setCourseData((prev) => ({
                                                            ...prev,
                                                            image: e.target.files[0], // <-- File object here
                                                        }));
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="courseTitle" className="form-label">
                                                    Intro Video
                                                </label>
                                                 <input className="form-control" type="text" name="file" value={courseData.file || ""} placeholder="Video Url" onChange={handleCourseInputChange} />

                                                {courseData?.file && (
                                                    <p>
                                                        <a target="__blank" href={courseData?.file}>
                                                            Preview Video
                                                        </a>
                                                    </p>
                                                )}
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="courseTitle" className="form-label">
                                                    Title
                                                </label>
                                                <input id="courseTitle" className="form-control" type="text" placeholder="" name="title" onChange={handleCourseInputChange} />
                                                <small>Write a 60 character course title.</small>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Courses category</label>
                                                <select className="form-select" name="category" onChange={handleCourseInputChange}>
                                                    <option value="">-------------</option>
                                                    {category?.map((c, index) => (
                                                        <option key={index} value={c.id}>
                                                            {c.title}
                                                        </option>
                                                    ))}
                                                </select>
                                                <small>Help people find your courses by choosing categories that represent your course.</small>
                                            </div>
                                            <div className="mb-3">
                                                <select className="form-select" onChange={handleCourseInputChange} name="level">
                                                    <option value="">Select level</option>
                                                    <option value="Beginner">Beginner</option>
                                                    <option value="Intemediate">Intemediate</option>
                                                    <option value="Advanced">Advanced</option>
                                                </select>
                                            </div>

                                            <div className="mb-3">
                                                <select className="form-select" onChange={handleCourseInputChange} name="language">
                                                    <option value="">Select Language</option>
                                                    <option value="English">English</option>
                                                    <option value="Spanish">Spanish</option>
                                                    <option value="French">French</option>
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Course Description</label>
                                                  <Editor
                                                    apiKey='ih004k7xr0vx7bwpx6nhrdvg61efu7ovxfthcewmf8rjz1c6' // Leave empty for free use (self-hosted)
                                                    value={courseData?.description}
                                                    onEditorChange={(content) =>
                                                        setCourseData({ ...courseData, description: content })
                                                    }
                                                    init={{
                                                        height: 300,
                                                        menubar: false,
                                                        plugins: [
                                                        'advlist autolink lists link image charmap preview anchor',
                                                        'searchreplace visualblocks code fullscreen',
                                                        'insertdatetime media table paste code help wordcount'
                                                        ],
                                                        toolbar:
                                                        'undo redo | formatselect | bold italic backcolor | \
                                                        alignleft aligncenter alignright alignjustify | \
                                                        bullist numlist outdent indent | removeformat | help'
                                                    }}
                                                />
                                                <small>A brief summary of your courses.</small>
                                            </div>
                                            <label htmlFor="courseTitle" className="form-label">
                                                Price
                                            </label>
                                            <input id="courseTitle" className="form-control" type="number" onChange={handleCourseInputChange} name="price" placeholder="$20.99" />
                                        </div>
                                    </div>
                                    <button className="btn btn-lg btn-success w-100 mt-2" type="submit">
                                        Create Course <i className="fas fa-check-circle"></i>
                                    </button>
                                </section>
                            </>
                        </form>
                    </div>
                </div>
            </section>

            <BaseFooter />
        </>
    );
}

export default CourseCreate;
