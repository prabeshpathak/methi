# Methi
`Methi` is basically a very light version of <a href="https://www.atlassian.com/software/jira">Jira</a>. You can create account then create a team or get added to other teams in order to assign issues to others or get assigned yourself. Project lead can create or modify issues and assign them to team members. There is backlog for all issues, sprint for creating a sprint with some issues and roadmap for tracking all the epics and sub-issues under them including the completion percentage.

<p align="center">
<img src="https://github.com/prabeshpathak/methi/blob/master/client/public/icon.png">
<h1 align="center">
   Methi
  </h1>
  
<p align="center"> A Project Management Tool For You</p>
</p>


## Features:

In homepage there are projects you work on and the issues you've been assigned. These things are under a project- 

- [x] Backlog: A place for all the issues related to this project, and to create and start sprints.
- [x] Boards: If there is an active sprint, the issues under that sprint will be shown here in different boards based on their status. 
- [x] Roadmap: It contains the epic issues of a project. All the other issues under those epics are listed below.
- [x] Issues can be epic, story, task or bug. These can be created and modified by only project lead and the issue status can be changed by assignee as well
- [x] Sprint can be started after providing a start and end date. Remaining days to the end date from current date is shown on sprints page (boards). 
- [x] A team has to be created to add assignees to issues. The assignee list for any project shows the users that are in a team where the team lead is also the project lead.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installing
Clone the repo
   ```sh
   git clone https://github.com/prabeshpathak/methi.git
   ```
### For Backend
Install Requirement Package to run Backend (Express Server)
   ```sh
   npm i
   ```
Change `.env-sample` as your need. Then
   ```sh
   npm run dev 
   ```


### For Frontend

`cd` into `client`

Install Requirement Package to run FrontEnd (React App). Then:
 
   ```sh
   npm i
   ```

Change `.env-sample` as your need. Then
   ```sh
   npm start
   ```

```Enjoy!!!!!!!!!!!```
