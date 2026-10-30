import { _decorator, Component, Node, Vec3, UITransform, Sprite } from 'cc';
import { GameConfig } from './GameConfig';
import { PoolManager } from './PoolManager';
import { GridModel } from './GridModel';
const { ccclass, property } = _decorator;

@ccclass('BoardView')
export class BoardView extends Component {
    private gridNodes: Node[] = [];
    private tempVec3: Vec3 = new Vec3();

    public initBoard() {
        const totalWidth = GameConfig.GridWidth * (GameConfig.CellSize + GameConfig.CellSpacing);
        const totalHeight = GameConfig.GridHeight * (GameConfig.CellSize + GameConfig.CellSpacing);

        const startX = -totalWidth / 2 + GameConfig.CellSize / 2;
        const startY = totalHeight / 2 - GameConfig.CellSize / 2;

        for (let y = 0; y < GameConfig.GridHeight; y++) {
            for (let x = 0; x < GameConfig.GridWidth; x++) {
                const cell = PoolManager.Instance.getEmptyCell();

                this.tempVec3.set(startX + x * (GameConfig.CellSize + GameConfig.CellSpacing), startY - y * (GameConfig.CellSize + GameConfig.CellSpacing), 0);
                cell.setPosition(this.tempVec3);

                cell.getComponent(Sprite).color = GameConfig.Colors.Empty;

                this.node.addChild(cell);
                this.gridNodes.push(cell);
            }
        }
    }

    public updateBoard(model: GridModel) {
        for (let i = 0; i < GameConfig.GridWidth * GameConfig.GridHeight; i++) {
            const cellId = model.getCell(i % GameConfig.GridWidth, Math.floor(i / GameConfig.GridWidth));
            const sprite = this.gridNodes[i].getComponent(Sprite);

            if (cellId === 0) {
                sprite.spriteFrame = PoolManager.Instance.emptyCellPrefab.data.getComponent(Sprite).spriteFrame;
                sprite.color = GameConfig.Colors.Empty;
            } else {
                const shapeDef = GameConfig.Shapes.find((s) => s.id === cellId);
                sprite.spriteFrame = PoolManager.Instance.shapeBlockPrefab.data.getComponent(Sprite).spriteFrame;
                sprite.color = GameConfig.Colors[shapeDef.color];
            }
        }
    }
}
