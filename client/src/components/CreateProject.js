import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import api from "../axios";
import './styles/_createProject.scss';

const CreateProject = () => {
	const [formdata, setFormdata] = useState({
		title: "",
		key: ""
	})
	const [newProject, setNewProject] = useState(null)
	const [formPosting, setFormPosting] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setFormPosting(true)
		try {
			const { data } = await api.post("/projects/create", formdata);
			setNewProject(data._id)
		} catch (error) {
			console.log(error.response);
		}
	}

	if (newProject) return <Redirect to={`/projects/boards/${newProject}`} />

	return (
		<div className="create-project container">
			<div className="create-project__main">
				<form onSubmit={handleSubmit}>
					<h2>Add project details</h2>
					<p>You can change these details anytime in your project settings.</p>
					<label className="text-secondary" htmlFor="projectName">Name<span className="text-danger">*</span></label>
					<input className="form-control mb-3" required value={formdata.title} onChange={e => setFormdata({ ...formdata, [e.target.name]: e.target.value })} type="text" name="title" id="projectName" />
					<label className="text-secondary" htmlFor="projectKey">Key<span className="text-danger">*</span></label>
					<input className="form-control mb-3" required value={formdata.key} onChange={e => setFormdata({ ...formdata, [e.target.name]: e.target.value })} type="text" name="key" id="projectKey" />
					<button disabled={formPosting} className="btn btn-primary" type="submit">Create project</button>
				</form>
				<div className="create-project__info">
					<h5>Template</h5>
					<div className="d-flex align-items-center">
						<img src={`${process.env.PUBLIC_URL}/nosprint.png`} alt="scrum" />
						<div className="ms-2">
							<p><strong>Scrum</strong></p>
							<p>Sprint toward your project goals with a board, backlog, and roadmap.</p>
						</div>
					</div>
					<h5 className="mt-4">Type</h5>
					<div className="d-flex align-items-center">
						<img src={`${process.env.PUBLIC_URL}/team.PNG`} alt="team" />
						<div className="ms-2">
							<p><strong>Team-managed</strong></p>
							<p>Control your own working processes and practices in a self-contained space.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default connect(null)(CreateProject);