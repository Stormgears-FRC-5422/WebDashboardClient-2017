import Inferno from "inferno";
import Component from "inferno-component"

import SyncedSlider from "../Game/SyncedSlider";

const THREE = require("three");

export default class AHRS3D extends Component {
	constructor(props) {
		super(props);

	}

	shouldComponentUpdate() {
		return false;
	}

	_onAnimate = () => {

	};

	handleRef = (node) => {
		this.root = node;
	};

	componentDidMount() {
		let scene = this.scene = new THREE.Scene();
		let camera = this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

		let renderer = this.renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
		renderer.setSize(300, 300);
		this.root.appendChild(renderer.domElement);

		let geometry = new THREE.BoxGeometry(2.25, 0.5, 3);
		let material = new THREE.MeshPhongMaterial({color: 0x00ff00, opacity: 0.8, transparent: true});
		let light = new THREE.PointLight( 0xffffff, 1, 100, 2 );
		light.position.set(4, 4, 4);
		scene.add(light);

		let cube = this.cube = new THREE.Mesh(geometry, material);
		cube.rotation.order = 'YXZ';
		scene.add(cube);

		// accel arrows
		let xArrow = this.xArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 3, 0xff0000);
		let yArrow = this.yArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 3, 0x00ff00);
		let zArrow = this.zArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 3, 0x0000ff);
		scene.add(xArrow);
		scene.add(yArrow);
		scene.add(zArrow);

		let downArrow = this.downArrow = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0, 0), 3);
		scene.add(downArrow);

		camera.position.z = 5;

		// this._render();
	}

	componentWillReceiveProps(props) {
		this._render(props);
	}

	_render = ({pitch, roll, yaw, rawAccelZ}) => {
		// requestAnimationFrame(this._render);
		const degToRad = THREE.Math.degToRad;
		let pitchR = degToRad(pitch);
		let rollR = degToRad(roll);
		let yawR = degToRad(yaw);

		let cubeRot = this.cube.rotation;
		cubeRot.y = yawR;
		cubeRot.x = rollR;
		cubeRot.z = pitchR;


		this.xArrow.setDirection((new THREE.Vector3(Math.sin(pitchR), -Math.sin(yawR) * Math.cos(pitchR), -Math.cos(pitchR) * Math.sin(yawR))).normalize());
		this.downArrow.setLength(rawAccelZ * 3 + 0.5);

		this.renderer.render(this.scene, this.camera);
	};

	render() {
		return <div ref={this.handleRef}>
			roll: <SyncedSlider path="ahrs.roll" min={-180} max={180} labelStepSize={30} />
			pitch: <SyncedSlider path="ahrs.pitch" min={-180} max={180} labelStepSize={30} />
			yaw: <SyncedSlider path="ahrs.yaw" min={-180} max={180} labelStepSize={30} />
		</div>
	}
}