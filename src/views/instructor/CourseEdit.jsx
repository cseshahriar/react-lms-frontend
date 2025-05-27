import { useState, useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import Toast from "../plugin/Toast";

import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import useAxios from "../../utils/useAxios";
import { teacherId } from "../../utils/constants";

function CourseEdit() {
    const [courseData, setCourseData] = useState({
        title: "",
        description: "",
        image: "",
        file: "",
        level: "",
        language: "",
        price: "",
        category: "",
    });
    const [imagePreview, setImagePreview] = useState("");
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fileLoading, setFileLoading] = useState(false);

    const navigate = useNavigate();
    const param = useParams();

    useEffect(() => {
        useAxios.get(`course/category/`).then((res) => {
            setCategory(res.data);
        });

        useAxios.get(`teacher/course-detail/${param.course_id}/`).then((res) => {
            setCourseData({
                ...res.data,
                category: res.data.category?.id || "",
            });
            setImagePreview(res.data.image);
        });
    }, [param.course_id]);

    const handleImageUpload = async (event) => {
        setLoading(true);
        const file = event.target.files[0];

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await useAxios.post("/file-upload/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response?.data?.url) {
                setImagePreview(response.data.url);
                setCourseData((prev) => ({ ...prev, image: response.data.url }));
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
        setLoading(false);
    };

    const handleCourseInputChange = (event) => {
        const { name, type, value, checked } = event.target;
        setCourseData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
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
            const response = await useAxios.patch(
                `teacher/course-update/${teacherId}/${param.course_id}/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            navigate(`/instructor/edit-course/${response?.data?.course_id}/`);
            Swal.fire({ icon: "success", title: "Course updated Successfully" });
        } catch (error) {
            console.error("Course update failed:", error);

            Toast().fire({
                icon: "error",
                title: error.response?.data?.message || "Something went wrong",
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
                            <section className="pb-8 mt-5">
                                <div className="card mb-3">
                                    <div className="card-header border-bottom px-4 py-3">
                                        <h4 className="mb-0">Basic Information</h4>
                                    </div>
                                    <div className="card-body">
                                        <label className="form-label">Thumbnail Preview</label>
                                        <img
                                            style={{
                                                width: "100%",
                                                height: "330px",
                                                objectFit: "cover",
                                                borderRadius: "10px",
                                            }}
                                            className="mb-4"
                                            src={imagePreview || "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"}
                                            alt="Thumbnail"
                                        />
                                        <div className="mb-3">
                                            <label className="form-label">Course Thumbnail</label>
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
                                            <label className="form-label">Intro Video</label>
                                            <input className="form-control" type="text" name="file" value={courseData.file || ""} placeholder="Video Url" onChange={handleCourseInputChange} />
                                            {courseData?.file && (
                                                <p>
                                                    <a target="_blank" rel="noopener noreferrer" href={courseData.file}>
                                                        Preview Video
                                                    </a>
                                                </p>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Title</label>
                                            <input className="form-control" type="text" name="title" value={courseData.title || ""} onChange={handleCourseInputChange} />
                                            <small>Write a 60 character course title.</small>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Course Category</label>
                                            <select className="form-select" name="category" value={courseData.category || ""} onChange={handleCourseInputChange}>
                                                <option value="">-- Select Category --</option>
                                                {category.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Level</label>
                                            <select className="form-select" name="level" value={courseData.level || ""} onChange={handleCourseInputChange}>
                                                <option value="">Select level</option>
                                                <option value="Beginner">Beginner</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Advanced">Advanced</option>
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Language</label>
                                            <select className="form-select" name="language" value={courseData.language || ""} onChange={handleCourseInputChange}>
                                                <option value="">Select Language</option>
                                                <option value="English">English</option>
                                                <option value="Spanish">Spanish</option>
                                                <option value="French">French</option>
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Course Description</label>
                                            <Editor
                                                apiKey="ih004k7xr0vx7bwpx6nhrdvg61efu7ovxfthcewmf8rjz1c6"
                                                value={courseData.description || ""}
                                                onEditorChange={(content) => setCourseData((prev) => ({ ...prev, description: content }))}
                                                init={{
                                                    height: 300,
                                                    menubar: false,
                                                    plugins: [
                                                        "advlist autolink lists link image charmap preview anchor",
                                                        "searchreplace visualblocks code fullscreen",
                                                        "insertdatetime media table paste code help wordcount",
                                                    ],
                                                    toolbar:
                                                        "undo redo | formatselect | bold italic backcolor | " +
                                                        "alignleft aligncenter alignright alignjustify | " +
                                                        "bullist numlist outdent indent | removeformat | help",
                                                }}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Price</label>
                                            <input className="form-control" type="number" name="price" value={courseData.price || ""} onChange={handleCourseInputChange} placeholder="$20.99" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <Link to={`/instructor/edit-course/${param?.course_id}/curriculum/`} className="btn btn-primary">
                                        Manage Curriculum <i className="fas fa-arrow-right ms-2"></i>
                                    </Link>
                                    <button className="btn btn-lg btn-success w-100 mt-2" type="submit">
                                        Update Course <i className="fas fa-check-circle"></i>
                                    </button>
                                </div>
                            </section>
                        </form>
                    </div>
                </div>
            </section>

            <BaseFooter />
        </>
    );
}

export default CourseEdit;
