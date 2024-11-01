import { Project, Task } from "@/types";
import { useRouter } from "next/router";

type Props = {
  project: Project;
};

const ProjectDetails: React.FC<Props> = ({ project }: Props) => {
  const router = useRouter();
  const { projectId } = router.query;
  return (
    <>
      {project && (
        <table>
          <tr>
            <td>ID:</td>
            <td>{project.id}</td>
          </tr>
          <tr>
            <td>Title:</td>
            <td>{project.title}</td>
          </tr>
          <tr>
            <td>Description:</td>
            <td>{project.description}</td>
          </tr>
          <tr>
            <td>Status:</td>
            <td>{project.done.toString()}</td>
          </tr>
          <tr>
            <td>Owner:</td>
            <td>{project.owner.firstName + " " + project.owner.lastName}</td>
          </tr>
          <tr>
            <td>Tasks</td>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Assignee</th>
                </tr>
              </thead>
              <tbody>
                {project.tasks.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() =>
                      router.push(`/projects/${projectId}/tasks/${task.id}`)
                    }
                  >
                    <td>{task.title}</td>
                    <td>{task.done.toString()}</td>
                    <td>{task.deadline.toString()}</td>
                    <td>{task.owner.firstName + " " + task.owner.lastName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </tr>
          <tr>
            <td>Members</td>
            <table>
              <thead>
                <tr>
                  <th>Firstname</th>
                  <th>Lastname</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {project.members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.firstName}</td>
                    <td>{member.lastName}</td>
                    <td>{member.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </tr>
        </table>
      )}
    </>
  );
};

export default ProjectDetails;
