import { _decorator, Component, tween, Vec3, easing } from 'cc';
import { AudioManager } from './AudioManager';
const { ccclass } = _decorator;

@ccclass('CtaScreen')
export class CtaScreen extends Component {
    private readonly hiddenScale: Vec3 = new Vec3(0, 0, 0);
    private readonly normalScale: Vec3 = new Vec3(1, 1, 1);

    protected onLoad() {
        this.node.active = false;
    }

    public show() {
        this.node.active = true;
        this.node.setScale(this.hiddenScale);

        if (AudioManager.instance) {
            AudioManager.instance.playCtaSound();
        }

        tween(this.node).to(0.4, { scale: this.normalScale }, { easing: easing.backOut }).start();
    }
}
