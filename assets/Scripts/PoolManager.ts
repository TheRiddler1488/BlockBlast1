import { _decorator, Component, Node, Prefab, instantiate, NodePool } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PoolManager')
export class PoolManager extends Component {
    public static Instance: PoolManager = null;

    @property(Prefab)
    public shapeBlockPrefab: Prefab = null;

    @property(Prefab)
    public emptyCellPrefab: Prefab = null;

    private blockPool: NodePool = new NodePool();
    private cellPool: NodePool = new NodePool();

    protected onLoad() {
        PoolManager.Instance = this;

        for (let i = 0; i < 100; i++) {
            this.blockPool.put(instantiate(this.shapeBlockPrefab));
            this.cellPool.put(instantiate(this.emptyCellPrefab));
        }
    }

    public getShapeBlock(): Node {
        return this.blockPool.size() > 0 ? this.blockPool.get() : instantiate(this.shapeBlockPrefab);
    }

    public returnShapeBlock(node: Node) {
        node.removeFromParent();
        this.blockPool.put(node);
    }

    public getEmptyCell(): Node {
        return this.cellPool.size() > 0 ? this.cellPool.get() : instantiate(this.emptyCellPrefab);
    }
}
