import { Project } from '../model/project';
import database from './database';

const getAllProjects = async (): Promise<Project[]> => {
    try {
        const projectsPrisma = await database.project.findMany({
            include: {
                tasks: {
                    include: {
                        owner: true,
                        tags: true,
                    },
                },
                members: true,
                owner: true,
            },
        });

        return projectsPrisma.map((projectPrisma) => {
            try {
                return Project.from(projectPrisma);
            } catch (error) {
                console.error('Error mapping project:', error);
                throw new Error('Failed to transform project data.');
            }
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getAllProjectsByMember = async ({
    memberEmail,
}: {
    memberEmail: string;
}): Promise<Project[]> => {
    try {
        const projectsPrisma = await database.project.findMany({
            where: { members: { some: { email: memberEmail } } },
            include: {
                tasks: {
                    include: {
                        owner: true,
                        tags: true,
                    },
                },
                members: true,
                owner: true,
            },
        });
        return projectsPrisma.map((projectPrisma) => Project.from(projectPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const createProject = async ({ project }: { project: Project }): Promise<Project> => {
    try {
        const projectPrisma = await database.project.create({
            data: {
                title: project.getTitle(),
                description: project.getDescription(),
                done: project.getDone(),
                owner: {
                    connect: {
                        id: project.getOwner().getId(),
                    },
                },
                members: {
                    connect: project.getMembers().map((member) => ({
                        id: member.getId(),
                    })),
                },
            },
            include: {
                tasks: {
                    include: {
                        owner: true,
                        tags: true,
                    },
                },
                members: true,
                owner: true,
            },
        });
        return Project.from(projectPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const updateProject = async (projectToChange: Project): Promise<Project> => {
    try {
        const projectPrisma = await database.project.update({
            where: { id: projectToChange.getId() },
            data: {
                title: projectToChange.getTitle(),
                description: projectToChange.getDescription(),
                done: projectToChange.getDone(),
                owner: {
                    connect: {
                        id: projectToChange.getOwner().getId(),
                    },
                },
                members: {
                    connect: projectToChange.getMembers().map((member) => ({
                        id: member.getId(),
                    })),
                },
            },
            include: {
                tasks: {
                    include: {
                        owner: true,
                        tags: true,
                    },
                },
                members: true,
                owner: true,
            },
        });
        return Project.from(projectPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getProjectById = async ({ id }: { id: number }): Promise<Project | null> => {
    try {
        const projectPrisma = await database.project.findUnique({
            where: { id },
            include: {
                tasks: {
                    include: {
                        owner: true,
                        tags: true,
                    },
                },
                members: true,
                owner: true,
            },
        });
        if (projectPrisma) {
            return Project.from(projectPrisma);
        }
        return null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getAllProjects,
    updateProject,
    createProject,
    getProjectById,
    getAllProjectsByMember,
};
