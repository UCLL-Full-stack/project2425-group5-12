type Role = 'admin' | 'user';

type UserInput = {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
};

type TaskInput = {
    id?: number;
    title: string;
    description: string;
    done?: boolean;
    deadline: Date;
    owner: UserInput;
    tags: TagInput[];
};

type ProjectInput = {
    id?: number;
    title: string;
    description: string;
    done?: boolean;
    tasks?: TaskInput[];
    member?: UserInput[];
    owner: UserInput;
};

type TagInput = {
    id?: number;
    title: string;
};

export { Role, UserInput, TaskInput, ProjectInput, TagInput };
