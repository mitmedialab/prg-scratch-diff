export type DiffResult = {
    type: 'only' | 'differ',
    path1: string,
    path2?: string
}
