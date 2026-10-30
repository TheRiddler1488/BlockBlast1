import { Color } from 'cc';

export const GameConfig = {
    GridWidth: 7,
    GridHeight: 11,
    CellSize: 60,
    CellSpacing: 3,

    Colors: {
        Empty: new Color(255, 255, 255, 255),
        Red: new Color(220, 50, 50, 255),
        Blue: new Color(50, 150, 220, 255),
        Green: new Color(50, 200, 50, 255),
        Yellow: new Color(220, 200, 50, 255),
        White: new Color(255, 255, 255, 255)
    },

    Shapes: [
        {
            id: 1,
            color: 'Red',
            blocks: [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 }
            ]
        },
        {
            id: 2,
            color: 'Blue',
            blocks: [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 0, y: 1 }
            ]
        },
        {
            id: 3,
            color: 'Green',
            blocks: [
                { x: 0, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 }
            ]
        },
        {
            id: 4,
            color: 'Yellow',
            blocks: [
                { x: 0, y: 0 },
                { x: 0, y: 1 },
                { x: 0, y: 2 },
                { x: 1, y: 2 }
            ]
        },
        {
            id: 5,
            color: 'Red',
            blocks: [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 2, y: 0 },
                { x: 0, y: 1 },
                { x: 0, y: 2 }
            ]
        },
        {
            id: 6,
            color: 'Blue',
            blocks: [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 2, y: 0 }
            ]
        },
        {
            id: 7,
            color: 'Green',
            blocks: [
                { x: 0, y: 0 },
                { x: 0, y: 1 },
                { x: 0, y: 2 }
            ]
        },
        { id: 8, color: 'Yellow', blocks: [{ x: 0, y: 0 }] },
        {
            id: 9,
            color: 'Red',
            blocks: [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 1 }
            ]
        },
        {
            id: 10,
            color: 'Green',
            blocks: [
                { x: 1, y: 0 },
                { x: 2, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 }
            ]
        },

        {
            id: 11,
            color: 'Blue',
            blocks: [
                { x: 0, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 1, y: 2 }
            ]
        }
    ]
} as const;
