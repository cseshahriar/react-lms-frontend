import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactPlayer from 'react-player'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import BaseHeader from '../partials/BaseHeader'
import BaseFooter from '../partials/BaseFooter'
import Sidebar from './Partials/Sidebar'
import Header from './Partials/Header'

import useAxios from "../../utils/useAxios";
import UserData from "../plugin/UserData";
import Toast from '../plugin/Toast';

function CourseDetail() {
  const params = useParams();
  const enrollmentId = params.enrollment_id;

  const [course, setCourse] = useState([]);

  // play lecture modal
  const [completionPercentage, setCompletionPercentage] = useState(1);
  const [markAsCompletedStatus, setMarkAsCompletedStatus] = useState([]);


  const [currentLecture, setCurrentLecture] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const handleShow = (lecture) => {
    setShow(true);
    setCurrentLecture(lecture);
  }


  const [createNote, setCreateNote] = useState({"title": "", "note": ""});
  const [selectedNote,  setSelectedNote] = useState(null);
  const [noteShow, setNoteShow] = useState(false);
  const handleNoteClose = () => setNoteShow(false);

  const handleNoteShow = (note) => {
    setNoteShow(true);
    setSelectedNote(note);
  }
  console.log('selectedNote', selectedNote);

  const [ConversationShow, setConversationShow] = useState(false);
  const handleConversationClose = () => setConversationShow(false);
  const handleConversationShow = () => { setConversationShow(true); }

  const [fetching, setFetching] = useState(true);

  const fetchData = () => {
      setFetching(true);
      try {
        useAxios.get(`student/course-detail/${UserData()?.user_id}/${enrollmentId}/`).then((response) => {
          console.log(response.data);
          setCourse(response.data);
          setFetching(false);

          const percentageCompleted = (response.data?.completed_lesson?.length / response.data?.lectures?.length) * 100;
          setCompletionPercentage(percentageCompleted?.toFixed(2));
        });
      } catch (error) {
        console.log(error);
        setFetching(false);
      }
  };

  useEffect(() => {
      fetchData();
  }, [])

  const handleMarkLessonAsCompleted = (variantItemId) => {
    const key = `lecture_${variantItemId}`;
    setMarkAsCompletedStatus({
      ...markAsCompletedStatus,
      [key]: "Updating"
    })

    const formData = new FormData();
    formData.append("user_id", UserData()?.user_id);
    formData.append("course_id", course?.course?.id);
    formData.append("variant_item_id", variantItemId);

    useAxios.post(`student/course-completed/`, formData).then((response) => {
      fetchData();
      setMarkAsCompletedStatus({
        ...markAsCompletedStatus,
        [key]: "Updated"
      })
    })
  }

  const handleChangeNote = (event) => {
    setCreateNote({
      ...createNote,
      [event.target.name]: event.target.value
    })
  }


  const handleSubmitCreateNote = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user_id", UserData()?.user_id);
    formData.append("enrollment_id", params.enrollment_id);
    formData.append("note", createNote.note);
    formData.append("title", createNote.title);

    try {
      await useAxios.post(`student/course-note/${UserData()?.user_id}/${params.enrollment_id}/`, formData)
        .then((response) => {
          fetchData();
            Toast().fire({
                title: response.data?.message || "Note created successfully",
                icon: "success",
            });
        })
        handleNoteClose();
    } catch (error) {
      console.log(error);
      Toast().fire({
          title: error.data?.message || "Something went wrong. Please try again",
          icon: "error",
      });
    }
  }


  const handleSubmitEditNote = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("note_id", selectedNote.id);
    formData.append("user_id", UserData()?.user_id);
    formData.append("enrollment_id", params.enrollment_id);
    formData.append("note", createNote.note);
    formData.append("title", createNote.title);

    try {
      await useAxios.patch(`student/course-note-detail/${UserData()?.user_id}/${params.enrollment_id}/${selectedNote.id}/`, formData)
        .then((response) => {
          fetchData();
            Toast().fire({
                title: response.data?.message || "Note updated successfully",
                icon: "success",
            });
        })
        handleNoteClose();
    } catch (error) {
      console.log(error);
      Toast().fire({
          title: error.data?.message || "Something went wrong. Please try again",
          icon: "error",
      });
    }
  }

  const handleSubmitDeleteNote = async(noteId) => {
    try {
      await useAxios.delete(`student/course-note-detail/${UserData()?.user_id}/${params.enrollment_id}/${noteId}/`)
        .then((response) => {
          fetchData();
            Toast().fire({
                title: response.data?.message || "Note deleted successfully",
                icon: "success",
            });
        })
        handleNoteClose();
    } catch (error) {
      console.log(error);
      Toast().fire({
          title: error.data?.message || "Something went wrong. Please try again",
          icon: "error",
      });
    }
  }

  return (
    <>
      <BaseHeader />

      <section className="pt-5 pb-5">
        <div className="container">
          {/* Header Here */}
          <Header />
          <div className="row mt-0 mt-md-4">
            {/* Sidebar Here */}
            <Sidebar />
            <div className="col-lg-9 col-md-8 col-12">
              {/* <section className="bg-blue py-7">
                <div className="container">
                  <ReactPlayer url='https://www.youtube.com/watch?v=LXb3EKWsInQ' width={"100%"} height={600} />
                </div>
              </section> */}
              <section className="mt-4">
                <div className="container">
                  <div className="row">
                    {/* Main content START */}
                    <div className="col-12">
                      <div className="card shadow rounded-2 p-0 mt-n5">
                        {/* Tabs START */}
                        <div className="card-header border-bottom px-4 pt-3 pb-0">
                          <ul
                            className="nav nav-bottom-line py-0"
                            id="course-pills-tab"
                            role="tablist"
                          >

                            {/* Tab item */}
                            <li className="nav-item me-2 me-sm-4" role="presentation">
                              <button className="nav-link mb-2 mb-md-0 active" id="course-pills-tab-1" data-bs-toggle="pill" data-bs-target="#course-pills-1" type="button" role="tab" aria-controls="course-pills-1" aria-selected="true">
                                Course Lectures
                              </button>
                            </li>

                            {/* Tab item */}
                            <li className="nav-item me-2 me-sm-4" role="presentation">
                              <button
                                className="nav-link mb-2 mb-md-0"
                                id="course-pills-tab-2"
                                data-bs-toggle="pill"
                                data-bs-target="#course-pills-2"
                                type="button"
                                role="tab"
                                aria-controls="course-pills-2"
                                aria-selected="false"
                              >
                                Notes
                              </button>
                            </li>

                            {/* Tab item */}
                            <li className="nav-item me-2 me-sm-4" role="presentation">
                              <button
                                className="nav-link mb-2 mb-md-0"
                                id="course-pills-tab-3"
                                data-bs-toggle="pill"
                                data-bs-target="#course-pills-3"
                                type="button"
                                role="tab"
                                aria-controls="course-pills-3"
                                aria-selected="false"
                              >
                                Discussion
                              </button>
                            </li>

                            <li className="nav-item me-2 me-sm-4" role="presentation">
                              <button
                                className="nav-link mb-2 mb-md-0"
                                id="course-pills-tab-4"
                                data-bs-toggle="pill"
                                data-bs-target="#course-pills-4"
                                type="button"
                                role="tab"
                                aria-controls="course-pills-4"
                                aria-selected="false"
                              >
                                Leave a Review
                              </button>
                            </li>
                          </ul>
                        </div>
                        {/* Tabs END */}

                        {/* Tab contents START */}
                        <div className="card-body p-sm-4">
                          <div className="tab-content" id="course-pills-tabContent">
                            {/* Content START */}
                            <div
                              className="tab-pane fade show active"
                              id="course-pills-1"
                              role="tabpanel"
                              aria-labelledby="course-pills-tab-1"
                            >
                              {/* Accordion START */}
                              <div
                                className="accordion accordion-icon accordion-border"
                                id="accordionExample2"
                              >

                                <div className="progress mb-3">
                                  <div
                                      className={`progress-bar
                                        ${completionPercentage < 50 ? 'bg-warning text-dark' :
                                          completionPercentage < 74 ? 'bg-primary' :
                                          completionPercentage > 75 ? 'bg-success' :
                                          ''}`
                                      }
                                      role="progressbar"
                                      style={{ width: `${completionPercentage}%` }}
                                      aria-valuenow={completionPercentage}
                                      aria-valuemin={0}
                                      aria-valuemax={100}
                                    >
                                      {completionPercentage} %
                                  </div>
                                </div>

                                {
                                  course?.curriculum?.map((section, index) => (
                                    <div className="accordion-item mb-3" key={index}>

                                      <h6 className="accordion-header font-base" id={`heading-${section.variant_id}`}>
                                        <button
                                          className="accordion-button fw-bold rounded d-sm-flex d-inline-block collapsed"
                                          type="button"
                                          data-bs-toggle="collapse"
                                          data-bs-target={`#collapse-${section.variant_id}`}
                                          aria-expanded="true"
                                          aria-controls={`collapse-${section.variant_id}`}
                                        >
                                          { section.title }
                                          <span className="small ms-0 ms-sm-2">
                                            (
                                              {section.variant_items.length} Lecture
                                              {section.variant_items.length > 1 && "s"}
                                            )
                                          </span>
                                        </button>
                                      </h6>

                                      <div
                                        id={`collapse-${section.variant_id}`}
                                        className="accordion-collapse collapse show"
                                        aria-labelledby={`heading-${section.variant_id}`}
                                        data-bs-parent="#accordionExample2"
                                      >

                                        {/* lecture */}
                                        <div className="accordion-body mt-3">
                                          { section?.variant_items?.map((lecture, index) => (
                                            <div key={index}>
                                              <div className="d-flex justify-content-between align-items-center" key={index}>
                                                <div className="position-relative d-flex align-items-center">


                                                  {/** video */}
                                                  <button
                                                    onClick={() => handleShow(lecture)}
                                                    className="btn btn-danger-soft btn-round btn-sm mb-0 stretched-link position-static"
                                                  >
                                                    <i className="fas fa-play me-0" />
                                                  </button>


                                                 <span className="d-inline-block text-wrap ms-2 mb-0 h6 fw-light w-100px w-sm-200px w-md-400px">
                                                  {lecture.title}
                                                </span>

                                                </div>
                                                <div className='d-flex gap-1'>
                                                  <p className="mb-0">{lecture.content_duration || "0m 0s"}</p>
                                                  <input
                                                    onChange={() => handleMarkLessonAsCompleted(lecture.variant_item_id)}
                                                    type="checkbox"
                                                    className='form-check-input'
                                                    name=""
                                                    id=""
                                                    checked={course.completed_lesson?.some((cl) => cl.variant_item.id === lecture.id)}
                                                  />
                                                </div>
                                              </div>
                                              <hr />
                                            </div>
                                          ))
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                }

                              </div>
                              {/* Accordion END */}
                            </div>

                            <div
                              className="tab-pane fade"
                              id="course-pills-2"
                              role="tabpanel"
                              aria-labelledby="course-pills-tab-2"
                            >
                              <div className="card">
                                <div className="card-header border-bottom p-0 pb-3">
                                  <div className="d-sm-flex justify-content-between align-items-center">
                                    <h4 className="mb-0 p-3">All Notes</h4>
                                    {/* Add Note Modal */}
                                    <button type="button" className="btn btn-primary me-3" data-bs-toggle="modal" data-bs-target="#exampleModal" >
                                      Add Note <i className='fas fa-pen'></i>
                                    </button>

                                    <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                                      <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">

                                          <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">
                                              Add New Note <i className='fas fa-pen'></i>
                                            </h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                          </div>

                                          <div className="modal-body">
                                            <form onSubmit={handleSubmitCreateNote}>
                                              <div className="mb-3">
                                                <label htmlFor="exampleInputEmail1" className="form-label">
                                                  Note Title
                                                </label>
                                                <input type="text" className="form-control" id='title' name='title' onChange={handleChangeNote} />
                                              </div>

                                              <div className="mb-3">
                                                <label htmlFor="exampleInputPassword1" className="form-label">
                                                  Note Content
                                                </label>
                                                <textarea className='form-control' name="note" id="note" cols="30" rows="10" onChange={handleChangeNote} ></textarea>
                                              </div>

                                              <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal" ><i className='fas fa-arrow-left'></i> Close</button>
                                              <button type="submit" className="btn btn-primary">Save Note <i className='fas fa-check-circle'></i></button>
                                            </form>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="card-body p-0 pt-3">
                                  {/* Note item start */}
                                  <div className="row g-4 p-3">
                                    {
                                      course?.note?.map((note, index) => (
                                        <div className="col-sm-11 col-xl-11 shadow p-3 m-3 rounded" key={index}>
                                          <h5>{note.title}</h5>
                                          <p> {note.note}</p>
                                          {/* Buttons */}
                                          <div className="hstack gap-3 flex-wrap">
                                            <a
                                              onClick={() => handleNoteShow(note)}
                                              className="btn btn-success mb-0"
                                            >
                                              <i className="bi bi-pencil-square me-2" /> Edit
                                            </a>

                                            <a onClick={() => handleSubmitDeleteNote(note.id)} className="btn btn-danger mb-0">
                                              <i className="bi bi-trash me-2" /> Delete
                                            </a>
                                          </div>
                                        </div>
                                      ))
                                    }

                                  </div>
                                  <hr />
                                </div>
                              </div>
                            </div>

                            <div
                              className="tab-pane fade"
                              id="course-pills-3"
                              role="tabpanel"
                              aria-labelledby="course-pills-tab-3"
                            >
                              <div className="card">
                                {/* Card header */}
                                <div className="card-header border-bottom p-0 pb-3">
                                  {/* Title */}
                                  <h4 className="mb-3 p-3">Discussion</h4>
                                  <form className="row g-4 p-3">
                                    {/* Search */}
                                    <div className="col-sm-6 col-lg-9">
                                      <div className="position-relative">
                                        <input className="form-control pe-5 bg-transparent" type="search" placeholder="Search" aria-label="Search" />
                                        <button className="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset" type="submit">
                                          <i className="fas fa-search fs-6 " />
                                        </button>
                                      </div>
                                    </div>
                                    <div className="col-sm-6 col-lg-3">
                                      <a
                                        href="#"
                                        className="btn btn-primary mb-0 w-100"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modalCreatePost"
                                      >
                                        Ask Question
                                      </a>
                                    </div>
                                  </form>
                                </div>
                                {/* Card body */}
                                <div className="card-body p-0 pt-3">
                                  <div className="vstack gap-3 p-3">
                                    {/* Question item START */}
                                    <div className="shadow rounded-3 p-3">
                                      <div className="d-sm-flex justify-content-sm-between mb-3">
                                        <div className="d-flex align-items-center">
                                          <div className="avatar avatar-sm flex-shrink-0">
                                            <img
                                              src="https://geeksui.codescandy.com/geeks/assets/images/avatar/avatar-3.jpg"
                                              className="avatar-img rounded-circle"
                                              alt="avatar"
                                              style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }}
                                            />
                                          </div>
                                          <div className="ms-2">
                                            <h6 className="mb-0">
                                              <a href="#" className='text-decoration-none text-dark'>Angelina Poi</a>
                                            </h6>
                                            <small>Asked 10 Hours ago</small>
                                          </div>
                                        </div>
                                      </div>
                                      <h5>How can i fix this bug?</h5>
                                      <button className='btn btn-primary btn-sm mb-3 mt-3' onClick={handleConversationShow}>Join Conversation <i className='fas fa-arrow-right'></i></button>
                                    </div>

                                  </div>
                                </div>
                              </div>
                            </div>

                            <div
                              className="tab-pane fade"
                              id="course-pills-4"
                              role="tabpanel"
                              aria-labelledby="course-pills-tab-4"
                            >
                              <div className="card">
                                {/* Card header */}
                                <div className="card-header border-bottom p-0 pb-3">
                                  {/* Title */}
                                  <h4 className="mb-3 p-3">Leave a Review</h4>
                                  <div className="mt-2">
                                    <form className="row g-3 p-3">

                                      {/* Rating */}
                                      <div className="col-12 bg-light-input">
                                        <select
                                          id="inputState2"
                                          className="form-select js-choice"
                                        >
                                          <option value={1}>★☆☆☆☆ (1/5)</option>
                                          <option value={2}>★★☆☆☆ (2/5)</option>
                                          <option value={3}>★★★☆☆ (3/5)</option>
                                          <option value={4}>★★★★☆ (4/5)</option>
                                          <option value={5}>★★★★★ (5/5)</option>
                                        </select>
                                      </div>
                                      {/* Message */}
                                      <div className="col-12 bg-light-input">
                                        <textarea
                                          className="form-control"
                                          id="exampleFormControlTextarea1"
                                          placeholder="Your review"
                                          rows={3}
                                          defaultValue={""}
                                        />
                                      </div>
                                      {/* Button */}
                                      <div className="col-12">
                                        <button type="submit" className="btn btn-primary mb-0">
                                          Post Review
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>


      {/* Lecture Modal */}
      <Modal show={show} size='xl' onHide={handleClose} className='className="video-container"'>
        <Modal.Header closeButton>
          <Modal.Title>Lesson: {currentLecture?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReactPlayer
            url={currentLecture?.file}
            volume="0"
            controls
            playing
            width={"100%"}
            height={"500px"}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>


      {/* Note Edit Modal */}
      <Modal show={noteShow} size='lg' onHide={handleNoteClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedNote?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmitEditNote}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">Note Title</label>
              <input defaultValue={selectedNote?.title} name='title' type="text" className="form-control" onChange={handleChangeNote} />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">Note Content</label>
              <textarea defaultValue={selectedNote?.note} name='note' className='form-control' cols="30" rows="10" onChange={handleChangeNote}></textarea>
            </div>
            <button type="button" className="btn btn-secondary me-2" onClick={null}><i className='fas fa-arrow-left'></i> Close</button>
            <button type="submit" className="btn btn-primary">Save Note <i className='fas fa-check-circle'></i></button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Note Edit Modal */}
      <Modal show={ConversationShow} size='lg' onHide={handleConversationClose}>
        <Modal.Header closeButton>
          <Modal.Title>Lesson: 123</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="border p-2 p-sm-4 rounded-3">
            <ul className="list-unstyled mb-0" style={{ overflowY: "scroll", height: "500px" }}>
              <li className="comment-item mb-3">
                <div className="d-flex">
                  <div className="avatar avatar-sm flex-shrink-0">
                    <a href="#">
                      <img className="avatar-img rounded-circle" src="https://geeksui.codescandy.com/geeks/assets/images/avatar/avatar-3.jpg" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} alt="womans image" />
                    </a>
                  </div>
                  <div className="ms-2">
                    {/* Comment by */}
                    <div className="bg-light p-3 rounded w-100">
                      <div className="d-flex w-100 justify-content-center">
                        <div className="me-2 ">
                          <h6 className="mb-1 lead fw-bold">
                            <a href="#!" className='text-decoration-none text-dark'> Louis Ferguson </a><br />
                            <span style={{ fontSize: "12px", color: "gray" }}>5hrs Ago</span>
                          </h6>
                          <p className="mb-0 mt-3  ">Removed demands expense account
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </li>

              <li className="comment-item mb-3">
                <div className="d-flex">
                  <div className="avatar avatar-sm flex-shrink-0">
                    <a href="#">
                      <img className="avatar-img rounded-circle" src="https://geeksui.codescandy.com/geeks/assets/images/avatar/avatar-3.jpg" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} alt="womans image" />
                    </a>
                  </div>
                  <div className="ms-2">
                    {/* Comment by */}
                    <div className="bg-light p-3 rounded w-100">
                      <div className="d-flex w-100 justify-content-center">
                        <div className="me-2 ">
                          <h6 className="mb-1 lead fw-bold">
                            <a href="#!" className='text-decoration-none text-dark'> Louis Ferguson </a><br />
                            <span style={{ fontSize: "12px", color: "gray" }}>5hrs Ago</span>
                          </h6>
                          <p className="mb-0 mt-3  ">Removed demands expense account from the debby building in a hall  town tak with
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </li>

              <li className="comment-item mb-3">
                <div className="d-flex">
                  <div className="avatar avatar-sm flex-shrink-0">
                    <a href="#">
                      <img className="avatar-img rounded-circle" src="https://geeksui.codescandy.com/geeks/assets/images/avatar/avatar-3.jpg" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} alt="womans image" />
                    </a>
                  </div>
                  <div className="ms-2">
                    {/* Comment by */}
                    <div className="bg-light p-3 rounded w-100">
                      <div className="d-flex w-100 justify-content-center">
                        <div className="me-2 ">
                          <h6 className="mb-1 lead fw-bold">
                            <a href="#!" className='text-decoration-none text-dark'> Louis Ferguson </a><br />
                            <span style={{ fontSize: "12px", color: "gray" }}>5hrs Ago</span>
                          </h6>
                          <p className="mb-0 mt-3  ">Removed demands expense account
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </li>

              <li className="comment-item mb-3">
                <div className="d-flex">
                  <div className="avatar avatar-sm flex-shrink-0">
                    <a href="#">
                      <img className="avatar-img rounded-circle" src="https://geeksui.codescandy.com/geeks/assets/images/avatar/avatar-3.jpg" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} alt="womans image" />
                    </a>
                  </div>
                  <div className="ms-2">
                    {/* Comment by */}
                    <div className="bg-light p-3 rounded w-100">
                      <div className="d-flex w-100 justify-content-center">
                        <div className="me-2 ">
                          <h6 className="mb-1 lead fw-bold">
                            <a href="#!" className='text-decoration-none text-dark'> Louis Ferguson </a><br />
                            <span style={{ fontSize: "12px", color: "gray" }}>5hrs Ago</span>
                          </h6>
                          <p className="mb-0 mt-3  ">Removed demands expense account
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </li>
            </ul>

            <form class="w-100 d-flex">
              <textarea name='message' class="one form-control pe-4 bg-light w-75" id="autoheighttextarea" rows="2" placeholder="What's your question?"></textarea>
              <button class="btn btn-primary ms-2 mb-0 w-25" type="button">Post <i className='fas fa-paper-plane'></i></button>
            </form>

            <form class="w-100">
              <input name='title' type="text" className="form-control mb-2" placeholder='Question Title' />
              <textarea name='message' class="one form-control pe-4 mb-2 bg-light" id="autoheighttextarea" rows="5" placeholder="What's your question?"></textarea>
              <button class="btn btn-primary mb-0 w-25" type="button">Post <i className='fas fa-paper-plane'></i></button>
            </form>

          </div>
        </Modal.Body>
      </Modal>

      <BaseFooter />
    </>
  )
}

export default CourseDetail
