import Inferno from "inferno";

import {Menu} from "@blueprintjs/core/dist/components/menu/menu";
import {MenuItem} from "@blueprintjs/core/dist/components/menu/menuItem";

export default function(props) {
	return <div className="autocompleter-inner" style={{ left: props.left }}>
		<Menu className="pt-elevation-1 autocompleter">
			{props.entries.map((entry, i) => <MenuItem text={entry.name} className={props.activeEntry === i ? "pt-active" : null} onClick={props.handleItemClick} />)}
		</Menu>
	</div>;
}
