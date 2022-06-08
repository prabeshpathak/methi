import React, { useEffect, useRef, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import api from "../axios";
import Sidebar from "./Sidebar";
import Icon from "./svg/Icon";
import Comment from "./Comment";
import IssueLoader from "./IssueLoader";
import { setNotification } from "../state/actions";

const Issue = ({ match, user, setNotification }) => {
	const [loading, setLoading] = useState(true);
	const [issue, setIssue] = useState(null);
	const [issueTypeContext, setIssueTypeContext] = useState(false);
	const [sprints, setSprints] = useState([]);
	const [assignees, setAssignees] = useState([]);
	const [descriptionEditing, setDescriptionEditing] = useState(false)
	const [editedDescription, setEditedDescription] = useState("")
	const [isLead, setIsLead] = useState(false)
	const [expanded, setExpanded] = useState(false)
	const [confirmDelete, setConfirmDelete] = useState(false)
	const [issueDeleted, setIssueDeleted] = useState(false)


	useEffect(() => {
		setLoading(true)
		async function fetchData() {
			const { data } = await api.get(`/issues/${match.params.id}`);
			setIssue(data.issue);
			setEpics(data.epics);
			setSprints(data.sprints)
			setAssignees(data.assignees)
			if (data.issue.project.lead === user._id)
				setIsLead(true);
			setEditedDescription(data.issue.description)
			setLoading(false)
		}
		if (user)
			fetchData();
	}, [match.params.id, user]);

    const updateIssueType = async (e) => {
		try {
			const issueType = e.target.getAttribute("selectedval");
			await api.patch(`/issues/${issue._id}`, {
				issueType,
				project: issue.project._id,
			});
			setIssue({ ...issue, issueType });
			setNotification("Issue updated", "info text-info");
		} catch (error) {
			console.log(error.response);
		}
	};

    const updateEpic = async (e) => {
		try {
			await api.patch(`/issues/${issue._id}`, {
				epic: e.target.getAttribute("selectedid"),
				project: issue.project._id,
			});

			setIssue({
				...issue,
				epic:
					e.target.getAttribute("selectedid") === ""
						? null
						: {
							_id: e.target.getAttribute("selectedid"),
							summary: e.target.getAttribute("selectedval"),
						},
			});
			setNotification("Issue updated", "info text-info");
		} catch (error) {
			console.log(error.response);
		}
	};


	const updateSummary = async (e) => {
		e.preventDefault();
		if (issue.summary !== "")
			try {
				await api.patch(`/issues/${issue._id}`, {
					summary: issue.summary,
					project: issue.project._id,
				});
				setNotification("Issue updated", "info text-info");
			} catch (error) {
				console.log(error.response);
			}
	};

    const updateDescription = async (e) => {
		e.preventDefault();
		try {
			await api.patch(`/issues/${issue._id}`, {
				description: editedDescription,
				project: issue.project._id,
			});
			setIssue({ ...issue, description: editedDescription })
			setDescriptionEditing(false)
			setNotification("Issue updated", "info text-info");
		} catch (error) {
			console.log(error.response);
		}
	};

    const updateIssueStatus = async (e) => {
		try {
			const issueStatus = e.target.value
			await api.patch(`/issues/status/${issue._id}`, {
				issueStatus,
				project: issue.project._id,
			});
			setIssue({ ...issue, issueStatus });
			setNotification("Issue updated", "info text-info");
		} catch (error) {
			console.log(error.response);
		}
	};



	const updateAssignee = async (e) => {
		try {
			const { options, value } = e.target;
			await api.patch(`/issues/${issue._id}`, {
				assignee: value,
				project: issue.project._id,
			});
			setIssue({
				...issue,
				assignee:
					value === ""
						? null
						: {
							_id: value,
							fullName: options[e.target.selectedIndex].text,
						},
			});
			setNotification("Issue updated", "info text-info");
		} catch (error) {
			console.log(error.response);
		}
	};

	const updateLabels = async (e) => {
		e.preventDefault();
		try {
			await api.patch(`/issues/${issue._id}`, {
				labels: issue.labels,
				project: issue.project._id,
			});
			setNotification("Issue updated", "info text-info");
		} catch (error) {
			console.log(error.response);
		}
	};

	const updateSprint = async (e) => {
		try {
			const { options, value } = e.target;
			await api.patch(`/issues/${issue._id}`, {
				sprint: value,
				project: issue.project._id,
			});
			setIssue({
				...issue,
				sprint:
					value === ""
						? null
						: {
							_id: value,
							summary: options[e.target.selectedIndex].text,
						},
			});
			setNotification("Issue updated", "info text-info");
		} catch (error) {
			console.log(error.response);
		}
	};


	const toggleContext = (e, context) => {
		e.stopPropagation();
		setEpicContext(context === "epic" ? !epicContext : false);
		setIssueTypeContext(context === "issue" ? !issueTypeContext : false);
	};

	const closeContextMenus = () => {
		setIssueTypeContext(false);
		setEpicContext(false);
		setActiveComment(null)
		setCommentDeleteModal(null)
	};

	const cancelEdit = (e) => {
		e && e.target.blur()
		setEditedDescription(issue.description)
		setDescriptionEditing(false)
	}

	const getSelectClass = () => {
		switch (issue.issueStatus) {
			case "in progress":
				return "select--inprogress"
			case "done":
				return "select--done"
			default:
				return "select--todo"
		}
	}



	const formatDate = date => new Date(date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })

	if (issueDeleted) return <Redirect to={`/projects/backlog/${issue.project._id}`} />

	return (
		<div onClick={closeContextMenus} tabIndex="1" onKeyDown={e => e.key.toUpperCase() === "M" && setCommentEditing(true)} className="outer-container">
			<Sidebar project={issue?.project} />
			{
				!loading ? <div className="issue container">
					<div className="issue__nav">
						<Link to="/projects">Projects</Link>
						<span>/</span>
						<Link to={`/projects/boards/${issue.project._id}`}>
							{issue.project.title}
						</Link>
						{navInnerContent()}
					</div>
					<div className="issue__hero">
						<div>
							<form onSubmit={updateSummary} onKeyUp={e => {
								if (e.key === "Enter" || e.key === "Escape") e.target.blur()
							}} className="issue__summary"><input disabled={!isLead ? true : false} value={issue.summary} onChange={e => setIssue({ ...issue, summary: e.target.value })} type="text" /></form>
							<div className="issue__desc">
								<h6>Description</h6>
								<form onSubmit={updateDescription}>
									<textarea onKeyDown={e => e.key === "Escape" && cancelEdit(e)} onClick={() => setDescriptionEditing(true)} value={editedDescription} onChange={e => isLead && setEditedDescription(e.target.value)} className={!descriptionEditing ? "textarea-inactive" : ""} placeholder={descriptionEditing ? "Words not enough? Try sentences *_*" : "Add a description"}></textarea>
									{
										descriptionEditing && (<div className="text-start mt-2">{isLead && <button className="btn btn-primary me-2" type="submit">Save</button>}
											<button className="btn btn-light" onClick={cancelEdit} type="button">Cancel</button></div>)
									}
								</form>
							</div>
							
						</div>
						<div className="ms-4">
							<div className="issue__status">
								<select disabled={issue.assignee?._id !== user._id && !isLead} className={getSelectClass()} value={issue.issueStatus} onChange={updateIssueStatus}>
									<option value="to do">to do</option>
									<option value="in progress">in progress</option>
									<option value="done">done</option>
								</select>
							</div>
							<div className="issue__details">
								<div onClick={() => setExpanded(!expanded)} className="expandBtn">
									<h6>Details</h6>
									<i className={`fa fa-angle-${expanded ? "up" : "down"}`} aria-hidden="true"></i>
								</div>
								<div className={`expandable ${expanded ? "" : "expandable--hidden"}`}>
									<form>
										<label htmlFor="issueAssignee">Assignee</label>
										<select disabled={!isLead ? true : false} value={issue.assignee ? issue.assignee._id : ""} onChange={updateAssignee} id="issueAssignee">
											<option value="">Unassigned</option>
											{assignees.map(s => <option key={s._id} value={s._id}>{s.fullName}</option>)}
										</select>
									</form>
									<form onSubmit={updateLabels}>
										<label htmlFor="issueLabels">Labels</label>
										<input disabled={!isLead ? true : false} onKeyUp={e => e.key === "Enter" && e.target.blur()} value={issue.labels.join(" ")} onChange={e => setIssue({ ...issue, labels: e.target.value.split(" ") })} type="text" placeholder="None" id="issueLabels" />
									</form>
									<form>
										<label htmlFor="issueSprint">Sprint</label>
										<select disabled={!isLead ? true : false} onChange={updateSprint} value={issue.sprint ? issue.sprint._id : ""} id="issueSprint">
											<option value="">None</option>
											{sprints.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
										</select>
									</form>
								</div>
							</div>
							<div className="issue__timestamps mt-2">
								<p>Created {formatDate(issue.createdAt)}</p>
								<p>Updated {formatDate(issue.updatedAt)}</p>
							</div>
						</div>
						<div className="issue__deleteBtn">
							{isLead && <button onClick={handleDelete} className="btn btn-danger ms-3">{confirmDelete ? "Click again" : "Delete issue"}</button>}
						</div>
					</div>
				</div> : <IssueLoader />
			}

		</div>
	);
};

const mapStateToProps = (state) => ({
	user: state.reducer.user,
});

export default connect(mapStateToProps, { setNotification })(Issue);