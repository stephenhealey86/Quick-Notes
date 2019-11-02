export class Note {
    constructor() {
        this.Title = '';
        this.Content = '';
        this.Priority = Priority.Low;
    }
    Title: string;
    Content: string;
    Priority: Priority;
}

export class NoteFrame {
    constructor() {
        this.Data = new Note();
        this.X = 0;
        this.Y = 0;
        this.Draggable = false;
        this.ZIndex = 0;
    }
    Data: Note;
    X: number;
    Y: number;
    Draggable: boolean;
    ZIndex: number;
}

export class NotePage {
    constructor() {
        this.Name = 'Rename Me!',
        this.Data = [
            new NoteFrame()
        ];
    }
    Name: string;
    Data: NoteFrame[];
}

export enum Priority {
    Low = 0,
    Meddium = 1,
    High = 2,
    Done = 3
}
