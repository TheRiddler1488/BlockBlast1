import { _decorator, Component, EventTouch, Vec3, UITransform, Node, tween, math } from 'cc';
import { GameConfig } from './GameConfig';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('DraggableShape')
export class DraggableShape extends Component {
    public shapeData: any = null;

    private startPos: Vec3 = new Vec3();
    private tempPos: Vec3 = new Vec3();

    private touchOffset: Vec3 = new Vec3(0, 150, 0);

    protected onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    public init(data: (typeof GameConfig.Shapes)[0], startPosition: Vec3) {
        this.shapeData = data;
        this.startPos.set(startPosition);
        this.node.setPosition(this.startPos);
        this.node.setScale(0.6, 0.6, 1);
    }

    private onTouchStart(event: EventTouch) {
        this.updatePositionFromTouch(event.getUILocation());
        this.node.setScale(1, 1, 1);
        GameManager.Instance.onShapeDragStart(this);
    }

    private onTouchMove(event: EventTouch) {
        this.updatePositionFromTouch(event.getUILocation());
    }

    private onTouchEnd(event: EventTouch) {
        const worldPos = this.node.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(0, 0, 0));

        GameManager.Instance.onShapeDropped(this, worldPos.x, worldPos.y);
    }

    private updatePositionFromTouch(touchLocation: math.Vec2) {
        const parentUITrans = this.node.parent.getComponent(UITransform);

        const localPos = parentUITrans.convertToNodeSpaceAR(new Vec3(touchLocation.x, touchLocation.y, 0));

        this.tempPos.set(localPos).add(this.touchOffset);
        this.node.setPosition(this.tempPos);
    }

    public snapBack() {
        tween(this.node)
            .to(0.2, { position: this.startPos, scale: new Vec3(0.6, 0.6, 1) })
            .start();
    }
}
