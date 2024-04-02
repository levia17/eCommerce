export type CreateUserParam = {
    username: string,
    password: string,
    email: string,
}

export type LoginUserParam = {
    username: string,
    password: string,
}

export type UpdateUserParam = {
    password?: string,
    email?: string,
}

export type DeleteUserParam = {
    username: string,
}