import { _decorator, Component, Node, Vec3, UITransform, Sprite, Label, tween } from 'cc';
import { GridModel } from './GridModel';
import { BoardView } from './BoardView';
import { DraggableShape } from './DraggableShape';
import { GameConfig } from './GameConfig';
import { PoolManager } from './PoolManager';
import { CtaScreen } from './CtaScreen';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    public static Instance: GameManager = null;

    @property(BoardView) boardView: BoardView = null;
    @property(Node) shapesContainer: Node = null;
    @property(CtaScreen) ctaScreen: CtaScreen = null;
    @property(Label) scoreLabel: Label = null;

    private model: GridModel = new GridModel();
    private lineClearBuffer: number[] = [];
    private activeShapesCount: number = 0;
    private currentScore: number = 0;
    private isGameOver: boolean = false;

    private readonly scaleUp: Vec3 = new Vec3(1.2, 1.2, 1);
    private readonly scaleDown: Vec3 = new Vec3(0, 0, 1);
    private readonly scaleNormal: Vec3 = new Vec3(1, 1, 1);

    protected onLoad() {
        GameManager.Instance = this;
    }

    protected start() {
        this.boardView.initBoard();
        this.spawnShapes();
        this.updateScore(0);
    }

    private spawnShapes() {
        this.activeShapesCount = 3;
        for (let i = 0; i < 3; i++) {
            const shapeNode = new Node(`Shape_${i}`);
            shapeNode.addComponent(UITransform).setContentSize(200, 200);
            const draggable = shapeNode.addComponent(DraggableShape);

            this.shapesContainer.addChild(shapeNode);
            const randomShape = GameConfig.Shapes[Math.floor(Math.random() * GameConfig.Shapes.length)];
            const posX = (i - 1) * 150;
            draggable.init(randomShape, new Vec3(posX, 0, 0));

            randomShape.blocks.forEach((blockOffset) => {
                const blockNode = PoolManager.Instance.getShapeBlock();
                blockNode.setPosition(blockOffset.x * (GameConfig.CellSize + GameConfig.CellSpacing), -blockOffset.y * (GameConfig.CellSize + GameConfig.CellSpacing));
                blockNode.getComponent(Sprite).color = GameConfig.Colors[randomShape.color];
                shapeNode.addChild(blockNode);
            });
        }

        this.checkGameOver();
    }

    public onShapeDragStart(shape: DraggableShape) {
        if (this.isGameOver) return;
        shape.node.setSiblingIndex(999);
    }

    public onShapeDropped(shape: DraggableShape, worldX: number, worldY: number) {
        if (this.isGameOver) {
            shape.snapBack();
            return;
        }

        const uiTrans = this.boardView.node.getComponent(UITransform);
        const localPos = uiTrans.convertToNodeSpaceAR(new Vec3(worldX, worldY, 0));

        const totalWidth = GameConfig.GridWidth * (GameConfig.CellSize + GameConfig.CellSpacing);
        const totalHeight = GameConfig.GridHeight * (GameConfig.CellSize + GameConfig.CellSpacing);
        const startX = -totalWidth / 2 + GameConfig.CellSize / 2;
        const startY = totalHeight / 2 - GameConfig.CellSize / 2;

        const gridX = Math.round((localPos.x - startX) / (GameConfig.CellSize + GameConfig.CellSpacing));
        const gridY = Math.round((startY - localPos.y) / (GameConfig.CellSize + GameConfig.CellSpacing));

        if (this.model.canPlace(shape.shapeData.blocks, gridX, gridY)) {
            this.model.place(shape.shapeData.blocks, gridX, gridY, shape.shapeData.id);

            if (AudioManager.instance) {
                AudioManager.instance.playPutSound();
            }

            if (this.model.processLines(this.lineClearBuffer)) {
                const linesCleared = Math.floor(this.lineClearBuffer.length / GameConfig.GridWidth);
                const lineScore = linesCleared * 100 * linesCleared;
                this.addScore(lineScore);
                this.playClearAnimation(this.lineClearBuffer);

                if (AudioManager.instance) {
                    AudioManager.instance.playPopSound();
                }
            }

            this.boardView.updateBoard(this.model);

            [...shape.node.children].forEach((child) => {
                child.setScale(this.scaleNormal);
                PoolManager.Instance.returnShapeBlock(child);
            });

            shape.node.removeFromParent();
            shape.node.destroy();

            this.activeShapesCount--;

            if (this.activeShapesCount <= 0) {
                this.spawnShapes();
            } else {
                this.checkGameOver();
            }
        } else {
            shape.snapBack();
        }
    }

    private checkGameOver() {
        if (this.isGameOver) return;

        if (this.currentScore >= 400) {
            this.isGameOver = true;
            if (this.ctaScreen) this.ctaScreen.show();
            return;
        }

        const activeNodes = this.shapesContainer.children;
        let canPlaceAtLeastOne = false;

        for (let i = 0; i < activeNodes.length; i++) {
            const node = activeNodes[i];
            if (!node.isValid) continue;

            const draggable = node.getComponent(DraggableShape);
            if (draggable && draggable.shapeData) {
                if (this.model.canPlaceAnywhere(draggable.shapeData.blocks)) {
                    canPlaceAtLeastOne = true;
                    break;
                }
            }
        }

        if (!canPlaceAtLeastOne) {
            this.isGameOver = true;
            if (this.ctaScreen) this.ctaScreen.show();
        }
    }

    private playClearAnimation(clearedIndices: number[]) {
        const totalWidth = GameConfig.GridWidth * (GameConfig.CellSize + GameConfig.CellSpacing);
        const totalHeight = GameConfig.GridHeight * (GameConfig.CellSize + GameConfig.CellSpacing);
        const startX = -totalWidth / 2 + GameConfig.CellSize / 2;
        const startY = totalHeight / 2 - GameConfig.CellSize / 2;

        for (let i = 0; i < clearedIndices.length; i++) {
            const idx = clearedIndices[i];
            const x = idx % GameConfig.GridWidth;
            const y = Math.floor(idx / GameConfig.GridWidth);

            const effectBlock = PoolManager.Instance.getShapeBlock();
            effectBlock.setPosition(startX + x * (GameConfig.CellSize + GameConfig.CellSpacing), startY - y * (GameConfig.CellSize + GameConfig.CellSpacing));

            effectBlock.getComponent(Sprite).color = GameConfig.Colors.White;
            effectBlock.setScale(this.scaleNormal);
            this.boardView.node.addChild(effectBlock);

            tween(effectBlock)
                .to(0.1, { scale: this.scaleUp })
                .to(0.2, { scale: this.scaleDown })
                .call(() => {
                    effectBlock.setScale(this.scaleNormal);
                    PoolManager.Instance.returnShapeBlock(effectBlock);
                })
                .start();
        }
    }

    private addScore(points: number) {
        this.currentScore += points;
        this.updateScore(this.currentScore);
    }

    private updateScore(score: number) {
        if (this.scoreLabel) {
            this.scoreLabel.string = `${score}`;
            tween(this.scoreLabel.node).stop().to(0.1, { scale: this.scaleUp }).to(0.1, { scale: this.scaleNormal }).start();
        }
    }
}
