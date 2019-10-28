export interface Note {
    Title: string;
    Content: string;
    Priority: Priority;
}

export interface NoteFrame {
    Data: Note;
    X: number;
    Y: number;
    Draggable: boolean;
    ZIndex: number;
}

export enum Priority {
    Low = 0,
    Meddium = 1,
    High = 2,
    Done = 3
}
